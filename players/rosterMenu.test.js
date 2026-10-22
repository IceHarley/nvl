import test from "ava";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import sinon from "sinon";
import inquirer from "inquirer";
import RosterMenu from "./rosterMenu.js";
import PlayersService from "./playersService.js";
import ChoiceSources from "./choiceSources.js";
import {isCupContext, setRosterTournament} from "./rosterContext.js";
import {rosterPlayerActions} from "./playersCliUtils.js";

const db = provideDb();
let prompt, service, sources, menu, addPlayerMenu, toPrevMenu, applyPlayerActionFake;

test.beforeEach(() => {
    prompt = sinon.stub(inquirer, "prompt");
    service = new PlayersService(db, {});
    sources = new ChoiceSources(db);
    addPlayerMenu = {open: sinon.fake.resolves()};
    toPrevMenu = sinon.fake(() => {
        throw () => {
        }
    });
    menu = new RosterMenu(service, sources, addPlayerMenu);
    sinon.replace(service, 'editPlayer', sinon.fake.resolves());
    sinon.replace(service, 'deletePlayer', sinon.fake.resolves());
    sinon.replace(service, 'addOutcome', sinon.fake.resolves());
    sinon.replace(service, 'addOutcomes', sinon.fake.resolves());
    sinon.replace(service, 'removeCurrentOutcome', sinon.fake.resolves());
    sinon.replace(sources, 'update', sinon.fake.resolves());
    sinon.replace(sources, 'updateList', sinon.fake.resolves());
    sinon.replace(sources, 'delete', sinon.fake.resolves());
    sinon.replace(menu, 'open', sinon.fake(menu.open));
    applyPlayerActionFake = sinon.fake(menu.playerActions.applyPlayerAction);
    sinon.replace(menu.playerActions, 'applyPlayerAction', applyPlayerActionFake);
});

test.afterEach.always(async () => {
    sinon.restore();
    setRosterTournament(null);
    await db.playersSource.clear();
});

const CUP = {id: 'cup', code: '26.3', name: 'Осенний кубок', isSeason: false};
const SEASON = {id: 'season', code: '26.2', name: 'Весна', isSeason: true};

const putRosterPlayers = () => db.playersSource.batch()
    .put('p1', {id: 'p1', name: 'Анна', team: 'teamA'})
    .put('p2', {id: 'p2', name: 'Борис', team: 'teamB', currentOutcome: 'outA', outcomeTeam: 'A'})
    .put('p3', {id: 'p3', name: 'Вера', team: 'teamB'})
    .put('p4', {id: 'p4', name: 'Глеб', team: 'teamA', currentOutcome: 'outB', outcomeTeam: 'B'})
    .write();

const playerIds = choices => choices.filter(c => c.value && typeof c.value === 'object').map(c => c.value.id);
const actionValues = actions => actions.map(a => a.value).filter(Boolean);

test.serial('Сбой чтения меты при init: списки выбора и контекст турнира остаются прежними', async t => {
    setRosterTournament(CUP);
    await putRosterPlayers();
    sinon.stub(db.meta, 'get').rejects(Object.assign(new Error('IO error'), {code: 'LEVEL_IO_ERROR'}));

    await t.throwsAsync(() => new ChoiceSources(db).init(), {message: 'IO error'});

    t.deepEqual(await db.playersSource.keys().all(), ['p1', 'p2', 'p3', 'p4']);
    t.true(isCupContext());
});

test.serial('init заменяет списки выбора и учитывает команду игрока в турнире', async t => {
    await putRosterPlayers();
    await db.players.put('p9', {name: 'Дина', team: 'teamA', tournaments: []});
    await db.teams.put('teamA', {name: 'A'});
    await db.outcomes.put('outA', {teamId: 'teamA'});
    await db.meta.put('Roster tournament', CUP, {valueEncoding: 'json'});

    await new ChoiceSources(db).init();

    t.deepEqual(await db.playersSource.keys().all(), ['p9']);
    t.like(await db.playersSource.get('p9'), {teamName: 'A', teamOutcome: 'outA'});
    t.true(isCupContext());
    await Promise.all([db.players.clear(), db.teams.clear(), db.outcomes.clear(), db.meta.clear(), db.teamsSource.clear()]);
});

test.serial('меню Состав команды: выход', async t => {
    prompt.withArgs(menu.rosterMenuPrompt).resolves({team: 'quit'});

    t.is(await menu.open({}, toPrevMenu).catch(err => err), 'quit');

    t.true(menu.open.calledOnce);
});

test.serial('меню Состав команды: Выбор команды - назад - выход в главное меню', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .resolves({team: 'back'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
});

test.serial('меню Состав команды: Выбор игрока - назад - возврат к выбору команды', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'back'})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args, [undefined, toPrevMenu]);
});

test.serial('меню Состав команды: Выбор действия с игроком - назад - возврат к выбору игрока', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, action: 'back'})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор действия с игроком - назад и еще раз назад - возврат в главное меню', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: ['current_tournament']},
        action: 'removeCurrentOutcome'
    })
        .onSecondCall().resolves({team: 'back'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
});


test.serial('меню Состав команды: Выбор игрока - Добавить игрока - открытие меню добавления игрока - выход', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'});
    addPlayerMenu.open = sinon.fake.throws('quit');

    await t.throwsAsync(() => menu.open({}, toPrevMenu));

    t.true(menu.open.calledOnce);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - открытие меню добавления игрока - назад', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - выбрано действие с игроком', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор действия с игроком - отметить как незаигранного', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: ['current_tournament']},
        action: 'removeCurrentOutcome'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.removeCurrentOutcome.calledOnce);
    t.is(service.removeCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'removeCurrentOutcome'});
});

test.serial('меню Состав команды: Выбор действия с игроком - отметить как заигранного', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'addCurrentOutcome'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.addOutcome.calledOnce);
    t.deepEqual(service.addOutcome.firstCall.args, ['playerId', 'teamId']);
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'addCurrentOutcome'});
});

test.serial('меню Состав команды: Выбор действия с игроком - отредактировать год рождения', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        newBirthYear: '1990',
        action: 'changeBirthYear'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', birthYear: '1990'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'changeBirthYear'});
});

test.serial('меню Состав команды: Выбор действия с игроком - отредактировать имя', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        newName: 'newName',
        action: 'rename'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'newName'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'rename'});
});

test.serial('меню Состав команды: Выбор действия с игроком - исключить из состава', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'removeFromRoster'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', team: undefined});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'removeFromRoster'});
});

test.serial('меню Состав команды: Выбор действия с игроком - удалить игрока', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'delete',
        deleteConfirmation: true,
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}, player: undefined});
    t.true(service.deletePlayer.calledOnce);
    t.is(service.deletePlayer.firstCall.args[0], 'playerId');
    t.true(sources.delete.calledOnce);
    t.is(sources.delete.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'delete'});
});

test.serial('меню Состав команды: Выбор действия с игроком - удалить игрока, отказ при подтверждении', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'delete',
        deleteConfirmation: false,
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}, player: undefined});
    t.true(service.deletePlayer.notCalled);
    t.true(sources.delete.notCalled);
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'delete'});
});

test.serial('меню Состав команды: Выбор игрока - Отметить заигранных - никто не выбран', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'multipleOutcomes', multipleOutcomes: []})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args, [{team: {id: 'teamId'}}, toPrevMenu]);
});

test.serial('меню Состав команды: Выбор игрока - Отметить заигранных - выбраны игроки', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'multipleOutcomes', multipleOutcomes: [
            {id: 'id1', name: 'Player1'},
            {id: 'id2', name: 'Player2'},
            {id: 'id3', name: 'Player3'},
        ]})
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args, [{team: {id: 'teamId'}}, toPrevMenu]);
    t.true(service.addOutcomes.calledOnce);
    t.deepEqual(service.addOutcomes.firstCall.args, [['id1', 'id2', 'id3'], 'teamId']);
    t.true(sources.updateList.calledOnce);
    t.deepEqual(sources.updateList.firstCall.args[0], ['id1', 'id2', 'id3']);
});

test.serial('Состав команды в сезоне: только заявленные в команду', async t => {
    setRosterTournament(SEASON);
    await putRosterPlayers();

    const choices = await menu.playersSourceWithSystemChoices({team: {id: 'teamA', outcome: 'outA'}});

    t.deepEqual(playerIds(choices), ['p1', 'p4']);
});

test.serial('Состав команды в кубке: заигранные за команду (и из других команд) выше её незаигранных игроков', async t => {
    setRosterTournament(CUP);
    await putRosterPlayers();

    const choices = await menu.playersSourceWithSystemChoices({team: {id: 'teamA', outcome: 'outA'}});

    t.deepEqual(playerIds(choices), ['p2', 'p1', 'p4']);
});

test.serial('Действия в сезоне: незаигранный игрок команды - заиграть или исключить', t => {
    setRosterTournament(SEASON);
    const actions = rosterPlayerActions({
        team: {id: 'teamA', outcome: 'outA'},
        player: {id: 'p1', name: 'Анна', team: 'teamA', teamName: 'A'},
    });

    t.true(actionValues(actions).includes('addCurrentOutcome'));
    t.true(actionValues(actions).includes('removeFromRoster'));
});

test.serial('Действия в кубке: незаигранный игрок - только заиграть, без исключения из сезонной команды', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        team: {id: 'teamA', name: 'A', outcome: 'outA'},
        player: {id: 'p1', name: 'Анна', team: 'teamA', teamName: 'A'},
    });

    t.true(actionValues(actions).includes('addCurrentOutcome'));
    t.false(actionValues(actions).includes('removeFromRoster'));
});

test.serial('Действия в кубке: заигранный за команду игрок другой команды - отзаявить', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        team: {id: 'teamA', name: 'A', outcome: 'outA'},
        player: {id: 'p2', name: 'Борис', team: 'teamB', currentOutcome: 'outA'},
    });

    t.true(actionValues(actions).includes('removeCurrentOutcome'));
    t.false(actionValues(actions).includes('addCurrentOutcome'));
});

test.serial('Действия в кубке: игрок команды заигран за другую команду - отметки недоступны', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        team: {id: 'teamA', name: 'A', outcome: 'outA'},
        player: {id: 'p4', name: 'Глеб', team: 'teamA', currentOutcome: 'outB'},
    });

    t.false(actionValues(actions).includes('removeCurrentOutcome'));
    t.false(actionValues(actions).includes('addCurrentOutcome'));
    t.false(actionValues(actions).includes('removeFromRoster'));
    t.true(actions.some(a => a.disabled && a.name.includes('Заигран за')));
});

test.serial('Действия в сезоне: игрок команды заигран за другую команду - можно снять отметку с явным указанием команды', t => {
    setRosterTournament(SEASON);
    const actions = rosterPlayerActions({
        team: {id: 'teamA', name: 'A', outcome: 'outA'},
        player: {id: 'p4', name: 'Глеб', team: 'teamA', currentOutcome: 'outB', outcomeTeam: 'B'},
    });

    const remove = actions.find(a => a.value === 'removeCurrentOutcome');
    t.truthy(remove);
    t.true(remove.name.includes('за B'));
});

test.serial('Список игроков в кубке: действия по команде игрока, исключение из состава доступно', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        player: {id: 'p1', name: 'Анна', team: 'teamA', teamName: 'A', teamOutcome: 'outA'},
    });

    t.true(actionValues(actions).includes('addCurrentOutcome'));
    t.true(actionValues(actions).includes('removeFromRoster'));
});

test.serial('Список игроков: команда игрока не участвует в турнире - заиграть нельзя, есть пояснение', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        player: {id: 'p1', name: 'Анна', team: 'teamZ', teamName: 'Z'},
    });

    t.false(actionValues(actions).includes('addCurrentOutcome'));
    t.true(actionValues(actions).includes('removeFromRoster'));
    t.true(actions.some(a => a.disabled && a.name.includes('Z не участвует')));
});

test.serial('Список игроков: заигранный игрок - снять отметку за команду, за которую заигран', t => {
    setRosterTournament(CUP);
    const actions = rosterPlayerActions({
        player: {id: 'p2', name: 'Борис', team: 'teamB', teamOutcome: 'outB', currentOutcome: 'outA', outcomeTeam: 'A'},
    });

    t.true(actions.find(a => a.value === 'removeCurrentOutcome').name.includes('за A'));
    t.false(actionValues(actions).includes('addCurrentOutcome'));
});