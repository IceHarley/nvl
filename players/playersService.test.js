import test from 'ava';
import PlayersService, {SEQUENCE, SEQUENCE_DEFAULT, SYNC_DATETIME} from "./playersService.js";
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

test.afterEach.always(async () => {
    sinon.restore();
    await dbMain.clear();
    await db.players.clear();
    await db.modifications.clear();
    await db.outcomes.clear();
    await db.meta.clear();
});

test.serial('Скачивание из airtable всех игроков', async t => {
    const actual = await playersService.fullLoad();
    t.is(actual, mockPlayersRepository.getList().length);
    t.true(db.players.clear.called);
    t.true(db.modifications.clear.called);
    t.is(await db.meta.get(SYNC_DATETIME), now.toISOString());
    t.true(db.players.batch.calledOnce);
    t.is(db.players.batch.args[0][0].map(r => r.key).join(), mockPlayersRepository.getList().map(r => r.id).join());
});

test.serial('Скачивание из airtable только изменений', async t => {
    const actual = await playersService.loadOnlyChanges();
    t.is(actual, mockPlayersRepository.getList().length);
    t.true(db.players.clear.notCalled);
    t.true(db.modifications.clear.called);
    t.is(await db.meta.get(SYNC_DATETIME), now.toISOString());
    t.true(db.players.batch.calledOnce);
    t.is(db.players.batch.args[0][0].map(r => r.key).join(), mockPlayersRepository.getList().map(r => r.id).join());
});

test.serial('Загрузка локальных изменений в airtable - добавление новых игроков', async t => {
    await db.modifications.batch()
        .put('rec4h1WslVHlbFKF7', 'del')
        .put('rectzEvP9goiOJDxH', 'del')
        .put('rec0i9tPvUMW55Gi2', 'del')
        .write();
    const actual = await playersService.uploadLocalChanges();
    t.is(actual.removed, 3);
    t.is(mockPlayersRepository.deleteList.args[0][0].length, 3);
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
    t.is(actual.inserted, 3);
    t.is(mockPlayersRepository.createList.args[0][0].length, 3);
    //добавление игроков с проставленным идентификатором
    t.is(db.players.batch.args[1][0].length, 3);
    t.true(db.players.batch.args[1][0].every(r => r.type === 'put' && r.key.startsWith('rec')));
    //удаление игроков в идентификатором ins...
    t.is(db.players.batch.args[2][0].length, 3);
    t.true(db.players.batch.args[2][0].every(r => r.type === 'del' && r.key.startsWith('ins')));
});

test.serial('Загрузка локальных изменений в airtable - обновление данных по игрокам', async t => {
    await db.modifications.batch()
        .put('rec4h1WslVHlbFKF7', 'upd')
        .put('rectzEvP9goiOJDxH', 'upd')
        .put('rec0i9tPvUMW55Gi2', 'upd')
        .write();
    const actual = await playersService.uploadLocalChanges();
    t.is(actual.updated, 3);
    t.is(mockPlayersRepository.updateList.args[0][0].length, 3);
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rec4h1WslVHlbFKF7'));
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rectzEvP9goiOJDxH'));
    t.true(mockPlayersRepository.updateList.args[0][0].map(r => r.id).includes('rec0i9tPvUMW55Gi2'));
});

test.serial('Загрузка локальных изменений в airtable - общие действия', async t => {
    await playersService.uploadLocalChanges();
    t.is(await db.meta.get(SYNC_DATETIME), now.toISOString());
    t.true(db.modifications.clear.calledOnce);
});

test.serial('Обновление существующего игрока в локальной БД - ошибка не задан id', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };

    const actual = await t.throwsAsync(() => playersService.editPlayer(newPlayer));

    t.is(actual.message, 'id не задан');
});

test.serial('Обновление существующего игрока в локальной БД - ошибка не задано имя', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    await db.players.batch()
        .put(id, {
            name: 'current_name',
            team: 'current_team',
            instagram: 'current_instagram',
            tournaments: ['current_tournament']
        })
        .write();
    const newPlayer = {
        id,
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };

    const actual = await t.throwsAsync(() => playersService.editPlayer(newPlayer));

    t.is(actual.message, 'имя не задано');
});

test.serial('Обновление существующего игрока в локальной БД - ошибка не заданы турниры', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    await db.players.batch()
        .put(id, {
            name: 'current_name',
            team: 'current_team',
            instagram: 'current_instagram',
            tournaments: ['current_tournament']
        })
        .write();
    const newPlayer = {
        id,
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
    };

    const actual = await t.throwsAsync(() => playersService.editPlayer(newPlayer));

    t.is(actual.message, 'турниры не заданы. Ожидается массив');
});

test.serial('Обновление существующего игрока в локальной БД', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    await db.players.batch()
        .put(id, {
            name: 'current_name',
            team: 'current_team',
            instagram: 'current_instagram',
            tournaments: ['current_tournament']
        })
        .write();
    const newPlayer = {
        id: id,
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };

    await playersService.editPlayer(newPlayer);

    t.like(await db.players.get(id), newPlayer);
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Обновление добавленного игрока в локальной БД', async t => {
    const id = 'ins100000001';
    await db.players.batch()
        .put(id, {
            name: 'current_name',
            team: 'current_team',
            instagram: 'current_instagram',
            tournaments: ['current_tournament']
        })
        .write();
    const newPlayer = {
        id: id,
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };

    await playersService.editPlayer(newPlayer);

    t.like(await db.players.get(id), newPlayer);
    t.is(await db.modifications.get(id), 'ins');
});

test.serial('Удаление заигранности существующего игрока в локальной БД', async t => {
    const id = 'ins10000001';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await playersService.removeCurrentOutcome(id);

    t.like(await db.players.get(id), {...player, tournaments: ['other_tournament', 'another_tournament']})
    t.is(await db.modifications.get(id), 'ins');
});

test.serial('Удаление заигранности добавленного игрока в локальной БД', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await playersService.removeCurrentOutcome(id);

    t.like(await db.players.get(id), {...player, tournaments: ['other_tournament', 'another_tournament']})
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Удаление заигранности игрока у которого нет заигранностей - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: []
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await t.throwsAsync(() => playersService.removeCurrentOutcome(id));
});

test.serial('Удаление заигранности игрока у которого более 1 заигранности - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).put('other_tournament', {}).write()

    await t.throwsAsync(() => playersService.removeCurrentOutcome(id));
});

test.serial('Добавление заигранности игрока у которого она уже есть - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    t.is((await t.throwsAsync(() => playersService.addCurrentOutcome(id, 'current_tournament'))).message,
        'Список турниров игрока [other_tournament,current_tournament,another_tournament] уже содержит current_tournament');
});

test.serial('Добавление заигранности игроку с другой заигранностью - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['current_tournament_team2']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament_team1', {}).put('current_tournament_team2', {}).write()

    t.is((await t.throwsAsync(() => playersService.addCurrentOutcome(id, 'current_tournament_team1'))).message,
        'Список турниров игрока [current_tournament_team2] уже содержит другую запись для текущего турнира');
});

test.serial('Добавление заигранности не относящейся к текущему сезону - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: []
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    t.is((await t.throwsAsync(() => playersService.addCurrentOutcome(id, 'other_tournament_team1'))).message,
        'other_tournament_team1 не относится к текущему турниру');
});

test.serial('Добавление заигранности игроку', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: []
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await playersService.addCurrentOutcome(id, 'current_tournament');
    t.like(await db.players.get(id), {...player, tournaments: ['current_tournament']})
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Добавление заигранности игроку без турниров', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await playersService.addCurrentOutcome(id, 'current_tournament');
    t.like(await db.players.get(id), {...player, tournaments: ['current_tournament']})
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Добавление текущей заигранности игроку с другими заигранностями всегда в начало', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {}).write()

    await playersService.addCurrentOutcome(id, 'current_tournament');
    t.like(await db.players.get(id), {...player, tournaments: ['current_tournament', 'other_tournament', 'another_tournament']})
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Генерация идентификатора', async t => {
    await db.meta.put(SEQUENCE, 100, {valueEncoding: 'json'});

    t.is(await playersService.generateId(), 101);
    t.is(await playersService.generateId(), 102);
});

test.serial('Генерация идентификатора - дефолтное значение', async t => {
    t.is(await playersService.generateId(), SEQUENCE_DEFAULT);
});

test.serial('Добавление нового игрока в локальную БД', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };
    const id = 'ins' + SEQUENCE_DEFAULT;

    await playersService.createPlayer(newPlayer);

    t.like(await db.players.get(id), newPlayer);
    t.is(await db.modifications.get(id), 'ins');
});

test.serial('Добавление нового игрока в локальную БД без турниров', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
    };
    const id = 'ins' + SEQUENCE_DEFAULT;

    const actual = await t.throwsAsync(() => playersService.createPlayer(newPlayer));

    t.is(actual.message, 'турниры не заданы. Ожидается массив');
});

test.serial('Удаление игрока с некорректным id', async t => {
    const actual =  await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
    t.is(actual.message, 'Игрок не найден');
});

test.serial('Удаление игрока из БД который есть в airtable и локально не менялся (нет в модификациях)', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };
    const id = 'id';
    await db.players.put(id, newPlayer);

    await playersService.deletePlayer(id);

    t.is((await t.throwsAsync(() => db.players.get(id))).code, 'LEVEL_NOT_FOUND');
    t.is(await db.modifications.get(id), 'del');
});

test.serial('Удаление игрока из БД который есть в airtable и локально менялся (есть в модификациях)', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };
    const id = 'id';
    await db.players.put(id, newPlayer);
    await db.modifications.put(id, 'upd');

    await playersService.deletePlayer(id);

    t.is((await t.throwsAsync(() => db.players.get(id))).code, 'LEVEL_NOT_FOUND');
    t.is(await db.modifications.get(id), 'del');
});

test.serial('Удаление игрока из БД который есть в airtable и локально уже был удален (del в модификациях, нет в players) - ошибка', async t => {
    const id = 'id';
    await db.modifications.put(id, 'del');

    const actual =  await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
    t.is(actual.message, 'Игрок не найден');
});

test.serial('Удаление игрока из БД который есть в airtable и локально уже был удален (del в модификациях, есть в players) - ошибка', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };
    const id = 'id';
    await db.players.put(id, newPlayer);
    await db.modifications.put(id, 'del');

    const actual =  await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
    t.is(actual.message, 'Игрок не найден');
});

test.serial('Удаление добавленного локально игрока из БД', async t => {
    const newPlayer = {
        name: 'new_name',
        team: 'new_team',
        instagram: 'new_instagram',
        tournaments: ['new_tournament', 'current_tournament']
    };
    const id = 'ins10000';
    await db.players.put(id, newPlayer);
    await db.modifications.put(id, 'ins');

    await playersService.deletePlayer(id);

    t.is((await t.throwsAsync(() => db.players.get(id))).code, 'LEVEL_NOT_FOUND');
    t.is((await t.throwsAsync(() => db.modifications.get(id))).code, 'LEVEL_NOT_FOUND');
});