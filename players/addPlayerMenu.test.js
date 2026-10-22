import test from "ava";
import PlayersService from "./playersService.js";
import ChoiceSources from "./choiceSources.js";
import sinon from "sinon";
import inquirer from "inquirer";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import AddPlayerMenu from "./addPlayerMenu.js";
import {setRosterTournament} from "./rosterContext.js";

const db = provideDb();
let toPrevMenu, prompt, service, sources, menu;

test.beforeEach(() => {
    service = new PlayersService(db, {});
    sources = new ChoiceSources(db);
    menu = new AddPlayerMenu(service, sources);
    sinon.spy(menu, 'open');
    toPrevMenu = sinon.fake(() => {
        throw new Error('toPrevMenu');
    });
    prompt = sinon.stub(inquirer, "prompt");
    sinon.replace(service, 'editPlayer', sinon.fake.resolves());
    sinon.replace(service, 'createPlayer', sinon.fake.resolves({}));
    sinon.replace(service, 'addOutcome', sinon.fake.resolves());
    sinon.replace(sources, 'update', sinon.fake.resolves());
});

test.afterEach.always(() => {
    sinon.restore();
    setRosterTournament(null);
});

test.serial('меню Добавления игрока: выход', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({addPlayer: 'quit'});

    t.is(await menu.open({}, toPrevMenu).catch(err => err), 'quit');

    t.true(menu.open.calledOnce);
});

test.serial('меню Добавления игрока: назад', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({addPlayer: 'back'});

    await t.throwsAsync(() => menu.open({}, toPrevMenu));

    t.true(menu.open.calledOnce);
    t.true(toPrevMenu.calledOnce);
});

test.serial('меню Добавления игрока: Введен новый игрок', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: undefined,
        addPlayer: 'playerName',
        newPlayer: {tournaments: [], instagram: 'instagram'},
    });

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(service.editPlayer.notCalled);
    t.true(service.createPlayer.calledOnce);
    t.deepEqual(service.createPlayer.firstCall.args[0], {
        name: 'playerName',
        tournaments: [],
        instagram: 'instagram',
    });
    t.true(service.addOutcome.notCalled);
    t.true(sources.update.calledOnce);
});

test.serial('меню Добавления игрока: игрок выбран и указано не заигрывать', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: [], team: 'teamId'},
        addCurrentOutcome: false,
    });

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(service.editPlayer.calledOnce);
    t.deepEqual(service.editPlayer.firstCall.args[0], {
        id: 'playerId',
        team: 'teamId',
        name: 'playerName',
        tournaments: []
    });
    t.true(service.addOutcome.notCalled);
    t.true(sources.update.calledOnce);
});

test.serial('меню Добавления игрока: игрок выбран и отмечен как заигранный', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: [], team: 'teamId'},
        addCurrentOutcome: true,
    });

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(service.editPlayer.calledOnce);
    t.deepEqual(service.editPlayer.firstCall.args[0], {
        id: 'playerId',
        team: 'teamId',
        name: 'playerName',
        tournaments: []
    });
    t.true(service.addOutcome.calledOnce);
    t.true(sources.update.calledOnce);
});

test.serial('меню Добавления игрока: введен новый игрок и указано не заигрывать', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: 'playerName',
        newPlayer: {team: 'teamId', tournaments: [], teamName: 'teamName'},
        addCurrentOutcome: false,
    });

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(service.editPlayer.notCalled);
    t.true(service.createPlayer.calledOnce);
    t.deepEqual(service.createPlayer.firstCall.args[0], {
        team: 'teamId',
        name: 'playerName',
        tournaments: [],
        teamName: 'teamName'
    });
    t.true(service.addOutcome.notCalled);
    t.true(sources.update.calledOnce);
});

test.serial('меню Добавления игрока: введен новый игрок и отмечен как заигранный', async t => {
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: 'playerName',
        newPlayer: {team: 'teamId', tournaments: [], teamName: 'teamName'},
        addCurrentOutcome: true,
    });

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(service.editPlayer.notCalled);
    t.true(service.createPlayer.calledOnce);
    t.deepEqual(service.createPlayer.firstCall.args[0], {
        team: 'teamId',
        name: 'playerName',
        tournaments: [],
        teamName: 'teamName'
    });
    t.true(service.addOutcome.calledOnce);
    t.true(sources.update.calledOnce);
});

test.serial('меню Добавления игрока, сезон: перевод из другой команды меняет команду игрока', async t => {
    setRosterTournament({id: 'season', code: '26.2', name: 'Весна', isSeason: true});
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamA', name: 'A'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: ['sB_old'], team: 'teamB', teamName: 'B'},
        confirmSwitchTeam: true,
        addCurrentOutcome: false,
    });

    await menu.open({}, toPrevMenu);

    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', team: 'teamA'});
    t.true(service.addOutcome.notCalled);
});

test.serial('меню Добавления игрока, кубок: игрок другой команды сразу заигран, команда игрока не меняется', async t => {
    setRosterTournament({id: 'cup', code: '26.3', name: 'Кубок', isSeason: false});
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamA', name: 'A'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: ['sB'], team: 'teamB', teamName: 'B'},
    });

    await menu.open({}, toPrevMenu);

    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', team: 'teamB', tournaments: ['sB']});
    t.true(service.addOutcome.calledOnce);
    t.deepEqual(service.addOutcome.firstCall.args, ['playerId', 'teamA']);
});

test.serial('меню Добавления игрока, кубок: игрок без команды получает команду и заигран', async t => {
    setRosterTournament({id: 'cup', code: '26.3', name: 'Кубок', isSeason: false});
    prompt.withArgs(menu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamA', name: 'A'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: []},
    });

    await menu.open({}, toPrevMenu);

    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', team: 'teamA'});
    t.deepEqual(service.addOutcome.firstCall.args, ['playerId', 'teamA']);
});

test.serial('меню Добавления игрока, кубок: в кубке не спрашиваем про перевод и заигранность', t => {
    setRosterTournament({id: 'cup', code: '26.3', name: 'Кубок', isSeason: false});
    const answers = {
        team: {id: 'teamA', name: 'A'},
        newPlayer: {team: 'teamA', teamName: 'A', tournaments: []},
        addPlayer: {id: 'playerId', name: 'playerName', team: 'teamB', teamName: 'B'},
    };
    const question = name => menu.addPlayerMenuPrompt.find(q => q.name === name);

    t.false(question('confirmSwitchTeam').when(answers));
    t.false(question('addCurrentOutcome').when(answers));
});

test.serial('меню Добавления игрока: заигранного за другую команду добавить нельзя', t => {
    setRosterTournament({id: 'cup', code: '26.3', name: 'Кубок', isSeason: false});
    const validate = menu.addPlayerMenuPrompt[0].validate;

    t.is(validate({value: {outcomeTeam: 'B'}}, {team: {name: 'A'}}), 'Игрок уже заигран за другую команду!');
    t.true(validate({value: {outcomeTeam: 'A'}}, {team: {name: 'A'}}));
});