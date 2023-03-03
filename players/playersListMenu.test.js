import test from "ava";
import sinon from "sinon";
import inquirer from "inquirer";
import PlayersListMenu from "./playersListMenu.js";
import PlayersService from "./playersService.js";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import ChoiceSources from "./choiceSources.js";

const db = provideDb();
let toPrevMenu, prompt, service, sources, addPlayerMenu, menu, applyPlayerActionFake;

test.beforeEach(() => {
    service = new PlayersService(db, {});
    sources = new ChoiceSources(db);
    addPlayerMenu = {open: sinon.fake.resolves()};
    menu = new PlayersListMenu(service, sources, addPlayerMenu);
    sinon.spy(menu, 'open');
    sinon.spy(menu, '_toPlayersListMenu');
    toPrevMenu = sinon.fake(() => {
        throw () => {
        }
    });
    prompt = sinon.stub(inquirer, "prompt");
    sinon.replace(service, 'editPlayer', sinon.fake.resolves());
    sinon.replace(service, 'deletePlayer', sinon.fake.resolves());
    sinon.replace(service, 'addCurrentOutcome', sinon.fake.resolves());
    sinon.replace(service, 'removeCurrentOutcome', sinon.fake.resolves());
    sinon.replace(sources, 'update', sinon.fake.resolves());
    sinon.replace(sources, 'delete', sinon.fake.resolves());
    applyPlayerActionFake = sinon.fake(menu.playerActions.applyPlayerAction);
    sinon.replace(menu.playerActions, 'applyPlayerAction', applyPlayerActionFake);
});

test.afterEach.always(() => {
    sinon.restore();
});

test.serial('меню Список игроков: выход', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: 'quit'});

    t.is(await menu.open({}, toPrevMenu), 'quit');
    t.true(menu.open.calledOnce);
    t.true(toPrevMenu.notCalled);
});

test.serial('меню Список игроков: назад', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: 'back'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledOnce);
    t.true(toPrevMenu.calledOnce);
});

test.serial('меню Список игроков: Выбор игрока - назад - возврат к выбору игрока', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId'}, action: 'back'})
        .onSecondCall().resolves({player: 'quit'});

    const actual = await menu.open({}, toPrevMenu);

    t.true(toPrevMenu.notCalled);
    t.true(menu.open.calledTwice);
    t.is(actual, 'quit');
});

test.serial('меню Список игроков: Выбор игрока - выход', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId'}, action: 'quit'});

    const actual = await menu.open({}, toPrevMenu);

    t.true(toPrevMenu.notCalled);
    t.true(menu.open.calledOnce);
    t.is(actual, 'quit');
});

test.serial('меню Список игроков: Выбор игрока - редактирование имени', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId', name: 'playerName'}, newName: 'newName', action: 'rename'})
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'newName'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'rename'});
});

test.serial('меню Список игроков: Выбор игрока - редактирование Instagram', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName'},
        newInstagram: 'newInstagram',
        action: 'changeInstagram'
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', instagram: 'newInstagram'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'changeInstagram'});
});

test.serial('меню Список игроков: Выбор игрока - отметить как заигранного', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'addCurrentOutcome'
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.addCurrentOutcome.calledOnce);
    t.is(service.addCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'addCurrentOutcome'});
});

test.serial('меню Список игроков: Выбор игрока - отметить как незаигранного', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'removeCurrentOutcome'
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.removeCurrentOutcome.calledOnce);
    t.is(service.removeCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'removeCurrentOutcome'});
});

test.serial('меню Список игроков: Выбор игрока - исключить из состава', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'removeFromRoster'
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'playerName', team: undefined});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'removeFromRoster'});
});

test.serial('меню Список игроков: Выбор игрока - удалить', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'delete',
        deleteConfirmation: true
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.deletePlayer.calledOnce);
    t.is(service.deletePlayer.firstCall.args[0], 'playerId');
    t.true(sources.delete.calledOnce);
    t.is(sources.delete.firstCall.args[0], 'playerId');
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'delete'});
});

test.serial('меню Список игроков: Выбор игрока - удалить без подтверждения', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'delete',
        deleteConfirmation: false
    })
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(service.deletePlayer.notCalled);
    t.true(sources.delete.notCalled);
    t.true(applyPlayerActionFake.calledOnce);
    t.like(applyPlayerActionFake.getCall(0).args[0], { action: 'delete'});
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - открытие меню добавления игрока - выход', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'});
    addPlayerMenu.open = sinon.fake.throws('quit');

    await t.throwsAsync(() => menu.open({}, toPrevMenu));

    t.true(menu.open.calledOnce);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
    t.true(menu._toPlayersListMenu.notCalled);
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - открытие меню добавления игрока - назад', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'})
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
    t.true(menu._toPlayersListMenu.calledOnce);
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - выбрано действие с игроком', async t => {
    prompt.withArgs(menu.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'})
        .onSecondCall().resolves({player: 'quit'});

    await menu.open({}, toPrevMenu);

    t.true(menu.open.calledTwice);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
    t.true(menu._toPlayersListMenu.calledOnce);
});