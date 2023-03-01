import test from "ava";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import sinon from "sinon";
import inquirer from "inquirer";
import RosterMenu from "./rosterMenu.js";
import PlayersService from "./playersService.js";
import ChoiceSources from "./choiceSources.js";

const db = provideDb();
let prompt, service, sources, menu, addPlayerMenu, toPrevMenu;

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
    sinon.replace(service, 'addCurrentOutcome', sinon.fake.resolves());
    sinon.replace(service, 'addCurrentOutcomes', sinon.fake.resolves());
    sinon.replace(service, 'removeCurrentOutcome', sinon.fake.resolves());
    sinon.replace(sources, 'update', sinon.fake.resolves());
    sinon.replace(sources, 'updateList', sinon.fake.resolves());
    sinon.replace(sources, 'delete', sinon.fake.resolves());
    sinon.replace(menu, 'open', sinon.fake(menu.open));
});

test.afterEach.always(() => {
    sinon.restore();
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
    //TODO проверить вызов PlayerActions.applyPlayerAction с параметрами
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
    t.true(service.addCurrentOutcome.calledOnce);
    t.is(service.addCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - отредактировать инстаграм', async t => {
    prompt.withArgs(menu.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        newInstagram: 'newInstagram',
        action: 'changeInstagram'
    })
        .onSecondCall().resolves({team: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.deepEqual(menu.open.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', instagram: 'newInstagram'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
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
    t.true(service.addCurrentOutcomes.calledOnce);
    t.deepEqual(service.addCurrentOutcomes.firstCall.args[0], ['id1', 'id2', 'id3']);
    t.true(sources.updateList.calledOnce);
    t.deepEqual(sources.updateList.firstCall.args[0], ['id1', 'id2', 'id3']);
});