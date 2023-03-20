import test from 'ava';
import PlayersManager from "./playersManager.js";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import sinon from "sinon";
import inquirer from "inquirer";

const db = provideDb();
const manager = new PlayersManager({}, db);
let prompt, service, sources, rosterMenu, playersListMenu;

test.beforeEach(() => {
    prompt = sinon.stub(inquirer, "prompt");
    service = manager.playersService;
    sources = manager.choiceSources;
    playersListMenu = manager.playersListMenu;
    rosterMenu = manager.rosterMenu;
    sinon.replace(sources, 'init', sinon.fake.resolves());
    sinon.replace(rosterMenu, 'open', sinon.fake.resolves('quit'));
    sinon.replace(playersListMenu, 'open', sinon.fake.resolves('quit'));
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

test.serial('Меню состава команды', async t => {
    prompt.onFirstCall().resolves({operation: 'roster'})
        .onSecondCall().resolves({operation: 'quit'});

    await manager.process();

    t.true(rosterMenu.open.calledOnce);
    t.is(rosterMenu.open.getCall(0).args[0], undefined);
    t.is(rosterMenu.open.getCall(0).args[1], manager.toMainMenu);
});

test.serial('Меню списка игроков', async t => {
    prompt.onFirstCall().resolves({operation: 'playersList'})
        .onSecondCall().resolves({operation: 'quit'});

    await manager.process();

    t.true(playersListMenu.open.calledOnce);
    t.is(playersListMenu.open.getCall(0).args[0], undefined);
    t.is(playersListMenu.open.getCall(0).args[1], manager.toMainMenu);
});