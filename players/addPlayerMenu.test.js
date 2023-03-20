import test from "ava";
import PlayersService from "./playersService.js";
import ChoiceSources from "./choiceSources.js";
import sinon from "sinon";
import inquirer from "inquirer";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import AddPlayerMenu from "./addPlayerMenu.js";

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
    sinon.replace(service, 'addCurrentOutcome', sinon.fake.resolves());
    sinon.replace(sources, 'update', sinon.fake.resolves());
});

test.afterEach.always(() => {
    sinon.restore();
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
    t.true(service.addCurrentOutcome.notCalled);
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
    t.true(service.addCurrentOutcome.notCalled);
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
    t.true(service.addCurrentOutcome.calledOnce);
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
    t.true(service.addCurrentOutcome.notCalled);
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
    t.true(service.addCurrentOutcome.calledOnce);
    t.true(sources.update.calledOnce);
});