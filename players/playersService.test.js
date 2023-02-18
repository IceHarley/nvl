import test from 'ava';
import PlayersService, {SYNC_DATETIME} from "./playersService.js";
import MockPlayersRepository from "../mock/mockPlayers.js";
import {MemoryLevel} from "memory-level";
import sinon from "sinon";

const mockPlayersRepository = new MockPlayersRepository();
const dbMain = new MemoryLevel({valueEncoding: 'json'});
const db = {
    meta: dbMain.sublevel('meta'),
    players: dbMain.sublevel('players', {valueEncoding: 'json'}),
    teams: dbMain.sublevel('teams', {valueEncoding: 'json'}),
    outcomes: dbMain.sublevel('outcomes', {valueEncoding: 'json'}),
    modifications: dbMain.sublevel('modifications', {valueEncoding: 'json'}),
};
const now = new Date();

const playersService = new PlayersService(db, {
    players: mockPlayersRepository,
}, true);

test.beforeEach(() => {
    sinon.spy(db.players);
    sinon.spy(db.modifications);
    sinon.spy(mockPlayersRepository);
    sinon.useFakeTimers(now);
});

test.afterEach(async () => {
    sinon.restore();
    await dbMain.clear();
    await db.players.clear();
    await db.modifications.clear();
});

test.serial('Скачивание из airtable всех игроков', async t => {
    const actual = await playersService.fullLoad();
    t.is(actual, mockPlayersRepository.getList().length);
    t.true(db.players.clear.called);
    t.true(db.modifications.clear.called);
    t.is(now.toISOString(), await db.meta.get(SYNC_DATETIME));
    t.true(db.players.batch.calledOnce);
    t.is(mockPlayersRepository.getList().map(r => r.id).join(), db.players.batch.args[0][0].map(r => r.key).join());
});

test.serial('Скачивание из airtable только изменений', async t => {
    const actual = await playersService.loadOnlyChanges();
    t.is(actual, mockPlayersRepository.getList().length);
    t.true(db.players.clear.notCalled);
    t.true(db.modifications.clear.called);
    t.is(now.toISOString(), await db.meta.get(SYNC_DATETIME));
    t.true(db.players.batch.calledOnce);
    t.is(mockPlayersRepository.getList().map(r => r.id).join(), db.players.batch.args[0][0].map(r => r.key).join());
});

test.serial('Загрузка локальных изменений в airtable - добавление новых игроков', async t => {
    await db.modifications.batch()
        .put('rec4h1WslVHlbFKF7', 'del')
        .put('rectzEvP9goiOJDxH', 'del')
        .put('rec0i9tPvUMW55Gi2', 'del')
        .write();
    const actual = await playersService.uploadLocalChanges();
    t.is(3, actual.removed);
    t.is(3, mockPlayersRepository.deleteList.args[0][0].length);
    t.true(mockPlayersRepository.deleteList.args[0][0].includes('rec4h1WslVHlbFKF7'));
    t.true(mockPlayersRepository.deleteList.args[0][0].includes('rectzEvP9goiOJDxH'));
    t.true(mockPlayersRepository.deleteList.args[0][0].includes('rec0i9tPvUMW55Gi2'));
});

test.serial('Загрузка локальных изменений в airtable - удаление игроков', async t => {
    await db.players.batch()
        .put('insPlayer1', {name: 'Иван Первый'})
        .put('insPlayer2', {name: 'Иван Второй'})
        .put('insPlayer3', {name: 'Иван Третий'})
        .write();
    const actual = await playersService.uploadLocalChanges();
    t.is(3, actual.inserted);
    t.is(3, mockPlayersRepository.createList.args[0][0].length);
    //добавление игроков с проставленным идентификатором
    t.is(3, db.players.batch.args[1][0].length);
    t.true(db.players.batch.args[1][0].every(r => r.type === 'put' && r.key.startsWith('rec')));
    //удаление игроков в идентификатором ins...
    t.is(3, db.players.batch.args[2][0].length);
    t.true(db.players.batch.args[2][0].every(r => r.type === 'del' && r.key.startsWith('ins')));
});

test.serial('Загрузка локальных изменений в airtable - обновление данных по игрокам', async t => {
    await db.modifications.batch()
        .put('rec4h1WslVHlbFKF7', 'upd')
        .put('rectzEvP9goiOJDxH', 'upd')
        .put('rec0i9tPvUMW55Gi2', 'upd')
        .write();
    const actual = await playersService.uploadLocalChanges();
    t.is(3, actual.updated);
    t.is(3, mockPlayersRepository.updateList.args[0][0].length);
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rec4h1WslVHlbFKF7'));
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rectzEvP9goiOJDxH'));
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rec0i9tPvUMW55Gi2'));
});

test.serial('Загрузка локальных изменений в airtable - общие действия', async t => {
    await playersService.uploadLocalChanges();
    t.is(now.toISOString(), await db.meta.get(SYNC_DATETIME));
    t.true(db.modifications.clear.calledOnce);
});
