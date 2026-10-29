import test from 'ava';
import PlayersManager from "./playersManager.js";
import {provideDb} from "../mock/mockLocalDbProvider.js";
import sinon from "sinon";
import inquirer from "inquirer";
import {setRosterTournament} from "./rosterContext.js";

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
    setRosterTournament(null);
});

test.serial('Открытие и закрытие БД', async t => {
    sinon.spy(db.main);
    prompt.resolves({operation: 'quit'});

    await manager.process();

    t.true(db.main.open.calledOnce);
    t.true(db.main.close.calledOnce);
});

test.serial('Загрузка из БД без указания типа', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromDb'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'loadOnlyChanges', sinon.fake.resolves(1));
    sinon.replace(service, 'fullLoad', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.loadOnlyChanges.notCalled);
    t.true(service.fullLoad.notCalled);
    t.true(sources.init.calledOnce);
});

test.serial('Загрузка из БД только изменений', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromDb', loadType: 'onlyChanges'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'loadOnlyChanges', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.loadOnlyChanges.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Полная загрузка из БД', async t => {
    prompt.onFirstCall().resolves({operation: 'loadFromDb', loadType: 'full'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'fullLoad', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.fullLoad.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Выбор турнира для составов', async t => {
    const cup = {id: 'cup', code: '26.3', name: 'Кубок', isSeason: false, status: 'Идёт регистрация'};
    prompt.onFirstCall().resolves({operation: 'selectTournament'})
        .onSecondCall().resolves({tournament: cup})
        .onThirdCall().resolves({operation: 'quit'});
    sinon.replace(service, 'getRosterOpenTournaments', sinon.fake.resolves([cup]));
    sinon.replace(service, 'selectTournament', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.selectTournament.calledOnce);
    t.is(service.selectTournament.firstCall.args[0], cup);
    t.true(sources.init.calledTwice);
});

test.serial('Выбор турнира: назад без изменений', async t => {
    prompt.onFirstCall().resolves({operation: 'selectTournament'})
        .onSecondCall().resolves({tournament: 'back'})
        .onThirdCall().resolves({operation: 'quit'});
    sinon.replace(service, 'getRosterOpenTournaments', sinon.fake.resolves([{id: 'cup', code: '26.3', name: 'Кубок'}]));
    sinon.replace(service, 'selectTournament', sinon.fake.resolves(1));

    await manager.process();

    t.true(service.selectTournament.notCalled);
});

test.serial('Меню состава команды без выбранного турнира: сначала выбор турнира', async t => {
    const season = {id: 'season', code: '26.2', name: 'Весна', isSeason: true, status: 'В процессе'};
    prompt.onFirstCall().resolves({operation: 'roster'})
        .onSecondCall().resolves({tournament: season});
    sinon.replace(service, 'getRosterOpenTournaments', sinon.fake.resolves([season]));
    sinon.replace(service, 'selectTournament', sinon.fake(() => {
        setRosterTournament(season);
        return Promise.resolve(1);
    }));

    await manager.process();

    t.true(service.selectTournament.calledOnce);
    t.true(rosterMenu.open.calledOnce);
});

test.serial('Выгрузка изменений в БД', async t => {
    prompt.onFirstCall().resolves({operation: 'uploadToDb'})
        .onSecondCall().resolves({operation: 'quit'});
    sinon.replace(service, 'uploadLocalChanges', sinon.fake.resolves({}));

    await manager.process();

    t.true(service.uploadLocalChanges.calledOnce);
    t.true(sources.init.calledTwice);
});

test.serial('Меню состава команды', async t => {
    setRosterTournament({id: 'season', code: '26.2', name: 'Весна', isSeason: true});
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