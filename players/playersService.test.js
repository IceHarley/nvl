import test from 'ava';
import PlayersService, {SEQUENCE, SEQUENCE_DEFAULT, SYNC_DATETIME} from "./playersService.js";
import MockPlayersRepository from "../mock/mockPlayers.js";
import {MemoryLevel} from "memory-level";
import sinon from "sinon";
import {ROSTER_TOURNAMENT} from "./rosterContext.js";

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
    const loadedId = mockPlayersRepository.getList()[0].id;
    await db.modifications.batch().put(loadedId, 'upd').put('ins100500', 'ins').write();

    const actual = await playersService.loadOnlyChanges();
    t.is(actual, mockPlayersRepository.getList().length);
    t.true(db.players.clear.notCalled);
    t.deepEqual(await db.modifications.keys().all(), ['ins100500'], 'невыгруженные правки других игроков остаются в очереди');
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
    //локальные ins... заменены игроками с серверными идентификаторами
    const keys = await db.players.keys().all();
    t.is(keys.length, 3);
    t.true(keys.every(key => key.startsWith('rec')));
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

test.serial('Загрузка локальных изменений в airtable - модификации принятых записей снимаются', async t => {
    await db.players.batch().put('insPlayer1', {name: 'Новый'}).put('recUpd', {name: 'Старый'}).write();
    await db.modifications.batch().put('insPlayer1', 'ins').put('recUpd', 'upd').put('recDel', 'del').write();

    await playersService.uploadLocalChanges();

    t.deepEqual(await db.modifications.keys().all(), []);
    t.is(await db.meta.get(SYNC_DATETIME), now.toISOString());
});

test.serial('Выгрузка: отклонённые сервером записи остаются локально и в очереди выгрузки', async t => {
    const repository = {
        createList: sinon.fake(async (records, onChunk) => onChunk({
            saved: [{localId: 'insOk', record: {id: 'loc_ok', name: 'Принят', tournaments: []}}],
            rejected: [{id: 'insBad', name: 'Отклонён', error: 'Игрок уже заигран в турнире'}],
        })),
        updateList: sinon.fake(async (records, onChunk) => onChunk({
            saved: [records.find(r => r.id === 'recOk')],
            rejected: [{id: 'recBad', error: 'Игрок уже заигран в турнире 26.3 за команду A'}],
        })),
        deleteList: sinon.fake.resolves(),
    };
    const service = new PlayersService(db, {players: repository}, true);
    sinon.stub(console, 'error');
    await db.players.batch()
        .put('insOk', {name: 'Принят', tournaments: []})
        .put('insBad', {name: 'Отклонён', tournaments: ['cup_A']})
        .put('recOk', {name: 'Обновлён', tournaments: []})
        .put('recBad', {name: 'Не обновлён', tournaments: ['cup_A']})
        .write();
    await db.modifications.batch()
        .put('insOk', 'ins').put('insBad', 'ins').put('recOk', 'upd').put('recBad', 'upd')
        .write();

    const actual = await service.uploadLocalChanges();

    t.deepEqual(actual, {removed: 0, inserted: 1, updated: 1, rejected: 2});
    t.deepEqual((await db.players.keys().all()).sort(), ['insBad', 'loc_ok', 'recBad', 'recOk']);
    t.deepEqual((await db.modifications.keys().all()).sort(), ['insBad', 'recBad']);
    t.deepEqual(await db.players.get('recBad'), {name: 'Не обновлён', tournaments: ['cup_A']});
    t.is(console.error.callCount, 2);
});

test.serial('Выгрузка: сбой на второй пачке создания - игроки первой пачки уже заменены серверными', async t => {
    const repository = {
        createList: async (records, onChunk) => {
            await onChunk({saved: [{localId: 'ins1', record: {id: 'loc_1', name: 'Первый', tournaments: []}}], rejected: []});
            throw new Error('HTTP 500');
        },
        deleteList: sinon.fake.resolves(),
    };
    const service = new PlayersService(db, {players: repository}, true);
    await db.players.batch()
        .put('ins1', {name: 'Первый', tournaments: []})
        .put('ins2', {name: 'Второй', tournaments: []})
        .write();
    await db.modifications.batch().put('ins1', 'ins').put('ins2', 'ins').write();

    await t.throwsAsync(() => service.uploadLocalChanges(), {message: 'HTTP 500'});

    t.deepEqual((await db.players.keys().all()).sort(), ['ins2', 'loc_1']);
    t.deepEqual(await db.modifications.keys().all(), ['ins2']);
});

test.serial('Выгрузка: обновление без подтверждения сервера остаётся в очереди', async t => {
    const repository = {
        updateList: async (records, onChunk) => onChunk({saved: [records[0]], rejected: []}),
        deleteList: sinon.fake.resolves(),
    };
    const service = new PlayersService(db, {players: repository}, true);
    sinon.stub(console, 'error');
    await db.players.batch().put('recA', {name: 'A', tournaments: []}).put('recB', {name: 'B', tournaments: []}).write();
    await db.modifications.batch().put('recA', 'upd').put('recB', 'upd').write();

    const actual = await service.uploadLocalChanges();

    t.is(actual.updated, 1);
    t.deepEqual(await db.modifications.keys().all(), ['recB']);
    t.true(console.error.calledOnce);
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
    await db.outcomes.batch().put('current_tournament', {teamId: 'current_team'}).write()

    t.is((await t.throwsAsync(() => playersService.addOutcome(id))).message,
        'Список турниров игрока [other_tournament,current_tournament,another_tournament] уже содержит current_tournament');
});

test.serial('Добавление заигранности игроку без команды - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();
    await db.outcomes.batch().put('current_tournament', {teamId: 'current_team'}).write()

    t.is((await t.throwsAsync(() => playersService.addOutcome(id))).message,
        'Игрок не числится в команде');
});

test.serial('Добавление заигранности игроку чья команда не участвует в текущем турнире - ошибка', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    const player = {
        name: 'current_name',
        team: 'current_team',
        instagram: 'current_instagram',
        tournaments: ['other_tournament', 'current_tournament', 'another_tournament']
    };
    await db.players.batch().put(id, player).write();

    t.is((await t.throwsAsync(() => playersService.addOutcome(id))).message,
        'Команда не участвует в выбранном турнире');
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
    await db.outcomes.batch()
        .put('current_tournament_team1', {teamId: 'current_team'})
        .put('current_tournament_team2', {teamId: 'other_team', teamName: 'Другая'})
        .write()

    t.is((await t.throwsAsync(() => playersService.addOutcome(id))).message,
        'Игрок уже заигран в этом турнире за команду Другая');
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
    await db.outcomes.batch().put('current_tournament', {teamId: 'current_team'}).write()

    await playersService.addOutcome(id);
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
    await db.outcomes.batch().put('current_tournament', {teamId: 'current_team'}).write()

    await playersService.addOutcome(id);
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
    await db.outcomes.batch().put('current_tournament', {teamId: 'current_team'}).write()

    await playersService.addOutcome(id);
    t.like(await db.players.get(id), {
        ...player,
        tournaments: ['current_tournament', 'other_tournament', 'another_tournament']
    })
    t.is(await db.modifications.get(id), 'upd');
});

test.serial('Сезон: заиграть можно только за команду, в которую игрок заявлен', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    await db.meta.put(ROSTER_TOURNAMENT, {id: 'season', isSeason: true}, {valueEncoding: 'json'});
    await db.players.batch().put(id, {name: 'current_name', team: 'current_team', tournaments: []}).write();
    await db.outcomes.batch()
        .put('season_team', {teamId: 'current_team'})
        .put('season_other', {teamId: 'other_team'})
        .write();

    t.is((await t.throwsAsync(() => playersService.addOutcome(id, 'other_team'))).message,
        'Игрок не заявлен за команду');

    await playersService.addOutcome(id, 'current_team');
    t.like(await db.players.get(id), {team: 'current_team', tournaments: ['season_team']});
});

test.serial('Кубок: игрок заигран за другую команду, его сезонная команда и прошлые отметки сохраняются', async t => {
    const id = 'rec4h1WslVHlbFKF7';
    await db.meta.put(ROSTER_TOURNAMENT, {id: 'cup', isSeason: false}, {valueEncoding: 'json'});
    await db.players.batch().put(id, {name: 'current_name', team: 'season_team', tournaments: ['spring_outcome']}).write();
    await db.outcomes.batch()
        .put('cup_teamA', {teamId: 'teamA', teamName: 'A'})
        .put('cup_teamB', {teamId: 'teamB', teamName: 'B'})
        .write();

    await playersService.addOutcome(id, 'teamA');

    t.like(await db.players.get(id), {team: 'season_team', tournaments: ['cup_teamA', 'spring_outcome']});
    t.is((await t.throwsAsync(() => playersService.addOutcome(id, 'teamB'))).message,
        'Игрок уже заигран в этом турнире за команду A');

    await playersService.removeCurrentOutcome(id);
    t.like(await db.players.get(id), {team: 'season_team', tournaments: ['spring_outcome']});
});

test.serial('Выбор турнира: команды и результаты заменяются данными выбранного турнира', async t => {
    const tournament = {id: 'cup', code: '26.3', name: 'Кубок', isSeason: false};
    const service = new PlayersService(db, {
        teams: {getByTournament: sinon.fake.resolves([{id: 'teamA', name: 'A'}])},
        tournamentOutcomes: {getByTournament: sinon.fake.resolves([{id: 'cup_teamA', teamId: 'teamA'}])},
    }, true);
    await db.teams.put('old_team', {id: 'old_team'});
    await db.outcomes.put('old_outcome', {teamId: 'old_team'});

    await service.selectTournament(tournament);

    t.deepEqual(await db.teams.keys().all(), ['teamA']);
    t.deepEqual(await db.outcomes.keys().all(), ['cup_teamA']);
    t.deepEqual(await service.getRosterTournament(), tournament);
    await db.teams.clear();
});

test.serial('Выбор турнира: при сбое загрузки остаются прежние команды, outcomes и турнир', async t => {
    const season = {id: 'season', code: '26.2', name: 'Сезон', isSeason: true};
    const service = new PlayersService(db, {
        teams: {getByTournament: sinon.fake.resolves([{id: 'teamA', name: 'A'}])},
        tournamentOutcomes: {getByTournament: sinon.fake.rejects(new Error('HTTP 500'))},
    }, true);
    await db.meta.put(ROSTER_TOURNAMENT, season, {valueEncoding: 'json'});
    await db.teams.put('old_team', {id: 'old_team'});
    await db.outcomes.put('old_outcome', {teamId: 'old_team'});

    await t.throwsAsync(() => service.selectTournament({id: 'cup', code: '26.3', name: 'Кубок', isSeason: false}));

    t.deepEqual(await db.teams.keys().all(), ['old_team']);
    t.deepEqual(await db.outcomes.keys().all(), ['old_outcome']);
    t.deepEqual(await service.getRosterTournament(), season);
    await db.teams.clear();
});

test.serial('Загрузка игроков обновляет команды и outcomes выбранного турнира', async t => {
    const cup = {id: 'cup', code: '26.3', name: 'Кубок', isSeason: false};
    const teams = {getByTournament: sinon.fake.resolves([{id: 'teamA'}, {id: 'teamNew'}])};
    const service = new PlayersService(db, {
        players: mockPlayersRepository,
        teams,
        tournamentOutcomes: {getByTournament: sinon.fake.resolves([{id: 'cup_new', teamId: 'teamNew'}])},
    }, true);
    await db.meta.put(ROSTER_TOURNAMENT, cup, {valueEncoding: 'json'});
    await db.teams.put('teamA', {id: 'teamA'});

    await service.loadOnlyChanges();
    await service.fullLoad();

    t.is(teams.getByTournament.callCount, 2);
    t.is(teams.getByTournament.firstCall.args[0], 'cup');
    t.deepEqual(await db.teams.keys().all(), ['teamA', 'teamNew']);
    t.deepEqual(await db.outcomes.keys().all(), ['cup_new']);
    await db.teams.clear();
});

test.serial('Сбой чтения турнира из меты не превращается в «турнир не выбран»', async t => {
    sinon.stub(db.meta, 'get').rejects(Object.assign(new Error('IO error'), {code: 'LEVEL_IO_ERROR'}));

    t.is((await t.throwsAsync(() => playersService.getRosterTournament())).message, 'IO error');
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

    await playersService.createPlayer(newPlayer);

    t.like(await db.players.get(id), {...newPlayer, tournaments: []});
    t.is(await db.modifications.get(id), 'ins');
});

test.serial('Удаление игрока с некорректным id', async t => {
    const actual = await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
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

    const actual = await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
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

    const actual = await t.throwsAsync(() => playersService.deletePlayer('incorrect_id'));
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