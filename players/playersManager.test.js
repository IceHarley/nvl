import test from 'ava';
import PlayersManager, {menuPrompt} from "./playersManager.js";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import sinon from "sinon";
import inquirer from "inquirer";

const db = provideDb();
const manager = new PlayersManager({}, db);
let prompt, service, sources, rosterMenu, addPlayerMenu, playersListMenu, mainMenu;

test.beforeEach(() => {
    prompt = sinon.stub(inquirer, "prompt");
    service = manager.playersService;
    sources = manager.choiceSources;
    addPlayerMenu = manager.addPlayerMenu;
    sinon.replace(service, 'editPlayer', sinon.fake.resolves({}));
    sinon.replace(service, 'createPlayer', sinon.fake.resolves({}));
    sinon.replace(service, 'deletePlayer', sinon.fake.resolves({}));
    sinon.replace(service, 'addCurrentOutcome', sinon.fake.resolves({}));
    sinon.replace(service, 'removeCurrentOutcome', sinon.fake.resolves({}));
    sinon.replace(sources, 'init', sinon.fake.resolves([]));
    sinon.replace(sources, 'update', sinon.fake.resolves());
    sinon.replace(sources, 'delete', sinon.fake.resolves());
    rosterMenu = sinon.replace(manager, 'rosterMenu', sinon.fake(manager.rosterMenu));
    // addPlayerMenu = sinon.replace(manager.addPlayerMenu, 'open', sinon.fake(manager.addPlayerMenu.open));
    sinon.replace(addPlayerMenu, 'open', sinon.fake(addPlayerMenu.open));
    playersListMenu = sinon.replace(manager, 'playersListMenu', sinon.fake(manager.playersListMenu));
    mainMenu = sinon.replace(manager, 'menu', sinon.fake(manager.menu));
});

test.afterEach.always(() => {
    sinon.restore();
});

test.serial('Открытие и закрытие БД', async t => {
    sinon.spy(db.main);
    prompt.resolves({operation: 'quit'});

    await manager.process();

    t.true(db.main.open.calledOnce);
    t.true(db.main.close.calledOnce);
});

test.serial('Загрузка из Airtable без указания типа', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromAirtable'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'loadOnlyChanges', sinon.fake.resolves(1));
    sinon.replace(service, 'fullLoad', sinon.fake.resolves(1));
    sinon.replace(service, 'loadActiveTeams', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.loadOnlyChanges.notCalled);
    t.true(service.fullLoad.notCalled);
    t.true(service.loadActiveTeams.notCalled);
    t.true(sources.init.calledOnce);
});

test.serial('Загрузка из Airtable только изменений', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromAirtable', loadType: 'onlyChanges'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'loadOnlyChanges', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.loadOnlyChanges.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Полная загрузка из Airtable', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromAirtable', loadType: 'full'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'fullLoad', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.fullLoad.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Загрузка из Airtable команд', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromAirtable', loadType: 'activeTeams'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'loadActiveTeams', sinon.fake.resolves(1));
    sinon.replace(service, 'loadActiveTournamentOutcomes', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.loadActiveTeams.calledOnce);
    t.true(service.loadActiveTournamentOutcomes.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Выгрузка изменений в Airtable', async t => {
    prompt.onFirstCall().resolves({operation: 'uploadToAirtable'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'uploadLocalChanges', sinon.fake.resolves({}));

    await manager.process();

    t.true(service.uploadLocalChanges.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('меню Состав команды: выход', async t => {
    prompt.onFirstCall().resolves({operation: 'roster'});
    prompt.withArgs(manager.rosterMenuPrompt).resolves({team: 'quit'});

    await manager.process();

    t.true(sources.init.calledOnce);
});

test.serial('меню Состав команды: Выбор команды - назад - выход в главное меню', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .onSecondCall().resolves({operation: 'quit'})
        .withArgs(manager.rosterMenuPrompt).resolves({team: 'back'});

    await manager.process();

    t.true(rosterMenu.calledOnce);
});

test.serial('меню Состав команды: Выбор игрока - назад - возврат к выбору команды', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'back'})
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args, []);
});

test.serial('меню Состав команды: Выбор действия с игроком - назад - возврат к выбору игрока', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, action: 'back'})
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
});


test.serial('меню Состав команды: Выбор игрока - Добавить игрока - открытие меню добавления игрока - выход', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({addPlayer: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledOnce);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - открытие меню добавления игрока - назад', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, addPlayer: 'back'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
});

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - игрок выбран и указано не заигрывать', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: [], team: 'teamId'},
        addCurrentOutcome: false,
    });

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
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

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - игрок выбран и отмечен как заигранный', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: {id: 'playerId', name: 'playerName', tournaments: [], team: 'teamId'},
        addCurrentOutcome: true,
    });

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
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

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - введен новый игрок и указано не заигрывать', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: 'playerName',
        newPlayer: {team: 'teamId', tournaments: [], teamName: 'teamName'},
        addCurrentOutcome: false,
    });

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
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

test.serial('меню Состав команды: Выбор игрока - Добавить игрока - введен новый игрок и отмечен как заигранный', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({team: {id: 'teamId'}, player: 'addPlayer'})
        .onSecondCall().resolves({team: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        addPlayer: 'playerName',
        newPlayer: {team: 'teamId', tournaments: [], teamName: 'teamName'},
        addCurrentOutcome: true,
    });

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {player: 'addPlayer', team: {id: 'teamId'}});
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

test.serial('меню Состав команды: Выбор действия с игроком - отметить как незаигранного', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: ['current_tournament']},
        action: 'removeCurrentOutcome'
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.removeCurrentOutcome.calledOnce);
    t.is(service.removeCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - отметить как заигранного', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'addCurrentOutcome'
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.addCurrentOutcome.calledOnce);
    t.is(service.addCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - отредактировать инстаграм', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        newInstagram: 'newInstagram',
        action: 'changeInstagram'
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', instagram: 'newInstagram'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - отредактировать имя', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        newName: 'newName',
        action: 'rename'
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'newName'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - исключить из состава', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'removeFromRoster'
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}});
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', team: undefined});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - удалить игрока', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'delete',
        deleteConfirmation: true,
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}, player: undefined});
    t.true(service.deletePlayer.calledOnce);
    t.is(service.deletePlayer.firstCall.args[0], 'playerId');
    t.true(sources.delete.calledOnce);
    t.is(sources.delete.firstCall.args[0], 'playerId');
});

test.serial('меню Состав команды: Выбор действия с игроком - удалить игрока, отказ при подтверждении', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'roster'})
        .withArgs(manager.rosterMenuPrompt)
        .onFirstCall().resolves({
        team: {id: 'teamId'},
        player: {id: 'playerId', name: 'playerName', team: 'teamId', tournaments: []},
        action: 'delete',
        deleteConfirmation: false,
    })
        .onSecondCall().resolves({team: 'quit'});

    await manager.process();

    t.true(rosterMenu.calledTwice);
    t.deepEqual(rosterMenu.secondCall.args[0], {team: {id: 'teamId'}, player: undefined});
    t.true(service.deletePlayer.notCalled);
    t.true(sources.delete.notCalled);
});

test.serial('меню Список игроков: выход', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledOnce);
    t.is(playersListMenu.firstCall.args[0], undefined);
});

test.serial('меню Список игроков: назад', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .onSecondCall().resolves({operation: 'quit'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: 'back'});

    await manager.process();

    t.true(playersListMenu.calledOnce);
    t.is(playersListMenu.firstCall.args[0], undefined);
    t.true(mainMenu.calledTwice);
    t.is(mainMenu.secondCall.args[0], undefined);
});

test.serial('меню Список игроков: Выбор игрока - назад - возврат к выбору игрока', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId'}, action: 'back'})
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
});

test.serial('меню Список игроков: Выбор игрока - выход', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId'}, action: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledOnce);
    t.true(mainMenu.calledOnce);
});

test.serial('меню Список игроков: Выбор игрока - редактирование имени', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: {id: 'playerId', name: 'playerName'}, newName: 'newName', action: 'rename'})
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'newName'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - редактирование Instagram', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName'},
        newInstagram: 'newInstagram',
        action: 'changeInstagram'
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', instagram: 'newInstagram'});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - отметить как заигранного', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'addCurrentOutcome'
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.addCurrentOutcome.calledOnce);
    t.is(service.addCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - отметить как незаигранного', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'removeCurrentOutcome'
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.removeCurrentOutcome.calledOnce);
    t.is(service.removeCurrentOutcome.firstCall.args[0], 'playerId');
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - исключить из состава', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'removeFromRoster'
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.editPlayer.calledOnce);
    t.like(service.editPlayer.firstCall.args[0], {id: 'playerId', name: 'playerName', team: undefined});
    t.true(sources.update.calledOnce);
    t.is(sources.update.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - удалить', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'delete',
        deleteConfirmation: true
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.deletePlayer.calledOnce);
    t.is(service.deletePlayer.firstCall.args[0], 'playerId');
    t.true(sources.delete.calledOnce);
    t.is(sources.delete.firstCall.args[0], 'playerId');
});

test.serial('меню Список игроков: Выбор игрока - удалить без подтверждения', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({
        player: {id: 'playerId', name: 'playerName', team: 'teamId'},
        action: 'delete',
        deleteConfirmation: false
    })
        .onSecondCall().resolves({player: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(mainMenu.calledOnce);
    t.true(service.deletePlayer.notCalled);
    t.true(sources.delete.notCalled);
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - открытие меню добавления игрока - выход', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({addPlayer: 'quit'});

    await manager.process();

    t.true(playersListMenu.calledOnce);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - открытие меню добавления игрока - назад', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'})
        .onSecondCall().resolves({player: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({addPlayer: 'back'});

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
});

test.serial('меню Список игроков: Выбор игрока - Добавить игрока - введен новый игрок', async t => {
    prompt.withArgs(menuPrompt)
        .onFirstCall().resolves({operation: 'playersList'})
        .withArgs(manager.playersListPrompt)
        .onFirstCall().resolves({player: 'addPlayer'})
        .onSecondCall().resolves({player: 'quit'})
        .withArgs(addPlayerMenu.addPlayerMenuPrompt)
        .onFirstCall().resolves({
        team: undefined,
        addPlayer: 'playerName',
        newPlayer: {tournaments: [], instagram: 'instagram'},
    });

    await manager.process();

    t.true(playersListMenu.calledTwice);
    t.true(addPlayerMenu.open.calledOnce);
    t.deepEqual(addPlayerMenu.open.firstCall.args[0], {createPlayerOnly: true});
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