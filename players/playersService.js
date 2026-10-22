import {getMethods, resolvePromisesSeq, toOperation, toRecords, verifyLength, withSpinner} from "../common/utils.js";
import {minify} from "./playerFormat.js";
import {readRosterTournament, ROSTER_TOURNAMENT} from "./rosterContext.js";

export const SYNC_DATETIME = 'Synchronization datetime';
export const SEQUENCE = 'SEQUENCE';
export const SEQUENCE_DEFAULT = 100000;

const UPD = 'upd';
const DEL = 'del';
const INS = 'ins';
const LTE_INS = 'ins~';

const ERROR_MULTIPLE_CURRENT_OUTCOMES = 'Игрок отмечен заигранным более чем за одну команду!';

export default class PlayersService {
    #repositories = {};
    #db = {};
    #silent

    constructor(db, repositories, silent = false) {
        this.#repositories = repositories;
        this.#db = db;
        this.#silent = silent;
    }

    fullLoad = () => this.#db.players.clear()
        .then(() => this.#repositories.players.getList())
        .then(records => this.#db.players.batch(records.map(player => toOperation(player))))
        .then(() => Promise.all([
            this.#db.meta.put(SYNC_DATETIME, new Date().toISOString()),
            this.#db.modifications.clear(),
        ]))
        .then(() => this.#db.players.keys().all())
        .then(keys => keys.length)
        .then(count => this.logAndReturn('Загружено игроков', count))
        .then(count => this.refreshRosterTournament().then(() => count));

    getRosterOpenTournaments = () => this.#repositories.tournaments.getRosterOpen();

    getRosterTournament = () => readRosterTournament(this.#db.meta);

    // Команды и outcomes выбранного турнира заменяют локальные: все отметки «заигран» дальше относятся к нему
    selectTournament = tournament => this.#replaceTournamentData(tournament)
        .then(({teamsCount, outcomesCount}) => {
            this.logAndReturn('Турнир', `${tournament.code} ${tournament.name}`);
            this.logAndReturn('Загружено команд', teamsCount);
            return this.logAndReturn('Загружено результатов турниров', outcomesCount);
        });

    // Перечитывает команды и outcomes уже выбранного турнира вместе с игроками
    refreshRosterTournament = () => this.getRosterTournament()
        .then(tournament => tournament && this.#replaceTournamentData(tournament)
            .then(({teamsCount}) => this.logAndReturn(`Обновлено команд турнира ${tournament.code}`, teamsCount))
            .catch(err => console.error(`Команды турнира ${tournament.code} не обновлены (остались прежние): ${err.message}`)));

    // Одним batch по корню базы: при сбое остаются прежние команды, outcomes и мета турнира
    #replaceTournamentData = async tournament => {
        const [teams, outcomes, oldTeamIds, oldOutcomeIds] = await Promise.all([
            this.#repositories.teams.getByTournament(tournament.id),
            this.#repositories.tournamentOutcomes.getByTournament(tournament.id),
            this.#db.teams.keys().all(),
            this.#db.outcomes.keys().all(),
        ]);
        const replace = (sublevel, oldIds, records) => {
            const newIds = new Set(records.map(r => r.id));
            return oldIds.filter(id => !newIds.has(id)).map(key => ({type: DEL, sublevel, key}))
                .concat(records.map(record => ({...toOperation(record), sublevel})));
        };
        await this.#db.teams.db.batch([
            ...replace(this.#db.teams, oldTeamIds, teams),
            ...replace(this.#db.outcomes, oldOutcomeIds, outcomes),
            {type: 'put', sublevel: this.#db.meta, key: ROSTER_TOURNAMENT, value: tournament, valueEncoding: 'json'},
        ]);
        return {teamsCount: teams.length, outcomesCount: outcomes.length};
    };

    // Флаги модификаций снимаются только с игроков, перезаписанных серверной версией
    loadOnlyChanges = () => this.#db.meta.get(SYNC_DATETIME)
        .catch(() => Promise.resolve(new Date(2021, 1).toISOString()))
        .then(syncDatetime => this.#repositories.players.getList({syncedSince: syncDatetime}))
        .then(records =>
            this.#db.players.batch(records.map(player => toOperation(player)))
                .then(() => Promise.all([
                    records.length,
                    records.length > 0
                        ? this.#db.meta.put(SYNC_DATETIME, new Date().toISOString())
                        : Promise.resolve(),
                    this.#db.modifications.batch(records.map(r => ({type: DEL, key: r.id}))),
                ]))
        )
        .then(([count]) => {
            !this.#silent && console.log(`Обновлено игроков: ${count}`);
            return count;
        })
        .then(count => this.refreshRosterTournament().then(() => count));

    // Модификации снимаются только с принятых сервером записей: отклонённые остаются в очереди до следующей выгрузки
    uploadLocalChanges = async () => {
        const {deletedIds, newRecords, updatedRecords} = await this.#fetchLocalChanges();
        return resolvePromisesSeq([
            () => this.#removeDeletedRecords(deletedIds),
            () => this.#insertNewRecords(newRecords),
            () => this.#updateModifiedRecords(updatedRecords),
        ])
        .then(([removed, inserted, updated]) => Promise.all([
            {removed, inserted: inserted.saved, updated: updated.saved, rejected: inserted.rejected + updated.rejected},
            this.#db.meta.put(SYNC_DATETIME, new Date().toISOString()),
        ]))
        .then(([result]) => result);
    };

    #reportRejected = rejected => rejected.forEach(r => console.error(
        `Сервер отклонил игрока ${r.name || r.id}: ${r.error}. `
        + 'Изменение осталось в очереди выгрузки — исправьте его и выгрузите повторно.'));

    #fetchLocalChanges = async () => {
        const [mods, newEntries] = await Promise.all([
            this.#db.modifications.iterator().all(),
            this.#db.players.iterator({lte: LTE_INS}).all(),
        ]);
        const deletedIds = mods.filter(([, value]) => value === DEL).map(([key]) => key);
        const updKeys = mods.filter(([, value]) => value === UPD).map(([key]) => key);
        const newRecords = newEntries.map(([key, value]) => ({id: key, ...value}));
        const updatedRecords = updKeys.length > 0
            ? (await this.#db.players.getMany(updKeys)).map((record, index) => ({id: updKeys[index], ...(record || {})}))
            : [];
        return {deletedIds, newRecords, updatedRecords};
    };

    #removeDeletedRecords = async ids => {
        if (ids.length > 0) {
            await this.#repositories.players.deleteList(ids);
            await this.#db.modifications.batch(ids.map(id => ({type: DEL, key: id})));
        }
        return this.logAndReturn('Удалено игроков в БД', ids.length);
    };

    // Флаг снимается только с id, которые сервер вернул в updated; остальные (отклонённые или неподтверждённые) остаются в очереди
    #updateModifiedRecords = async records => {
        let savedCount = 0;
        let rejectedCount = 0;
        if (records.length > 0) {
            const sentIds = new Set(records.map(r => r.id));
            await this.#repositories.players.updateList(records, async ({saved, rejected}) => {
                const savedIds = saved.map(r => r.id).filter(id => sentIds.has(id));
                await this.#db.modifications.batch(savedIds.map(id => ({type: DEL, key: id})));
                this.#reportRejected(rejected);
                savedCount += savedIds.length;
                rejectedCount += rejected.length;
            });
            const unconfirmed = records.length - savedCount - rejectedCount;
            unconfirmed > 0 && console.error(`Сервер не подтвердил обновление ${unconfirmed} игрок(ов) без указания причины. `
                + 'Изменения остались в очереди выгрузки.');
        }
        return {saved: this.logAndReturn('Обновлено игроков в БД', savedCount), rejected: rejectedCount};
    };

    // Локальная ins*-запись заменяется серверной только для созданных игроков — сразу после каждой пачки, одним batch
    #insertNewRecords = async records => {
        let savedCount = 0;
        let rejectedCount = 0;
        if (records.length > 0) {
            await this.#repositories.players.createList(records, async ({saved, rejected}) => {
                await this.#db.players.db.batch(saved.flatMap(({localId, record}) => [
                    {type: DEL, sublevel: this.#db.players, key: localId},
                    {type: DEL, sublevel: this.#db.modifications, key: localId},
                    {...toOperation(minify(record)), sublevel: this.#db.players},
                ]));
                this.#reportRejected(rejected);
                savedCount += saved.length;
                rejectedCount += rejected.length;
            });
        }
        return {saved: this.logAndReturn('Создано игроков в БД', savedCount), rejected: rejectedCount};
    };

    editPlayer = player => this.validate(player)
        .then(player => this.#db.players.put(player.id, player))
        .then(() => this.#db.modifications.put(player.id, player.id.substring(0, 3) === INS ? INS : UPD))
        .then(() => this.#db.players.get(player.id));

    createPlayer = player => this.generateId()
        .then(id => this.editPlayer({...player, id: `${INS}${id}`, tournaments: player.tournaments || []}));

    deletePlayer = playerId => this.#db.players.get(playerId)
        .catch(err => {
            throw err.code === 'LEVEL_NOT_FOUND' ? new Error('Игрок не найден') : err;
        })
        .then(() => this.#db.modifications.get(playerId))
        .catch(err => {
            if (err.code === 'LEVEL_NOT_FOUND') {
                return UPD; // если нет в таблице модификаций, то игрок существует в БД но локально не менялся
            } else {
                throw err;
            }
        })
        .then(modification => modification === INS
            ? this.#db.modifications.del(playerId) :    //для добавленных только локально игроков просто удаляем запись в модификациях
            this.#db.modifications.put(playerId, DEL))  //для существующих в БД игроков проставляем модификацию удаления
        .then(() => this.#db.players.del(playerId));

    validate = player => {
        if (!player.id) {
            return Promise.reject(new Error('id не задан'));
        }
        if (!player.name) {
            return Promise.reject(new Error('имя не задано'));
        }
        if (!player.tournaments) {
            return Promise.reject(new Error('турниры не заданы. Ожидается массив'));
        }
        return Promise.resolve(player);
    };

    generateId = () => this.#db.meta.get(SEQUENCE, {valueEncoding: 'json'})
        .then(currentValue => currentValue + 1)
        .catch(() => SEQUENCE_DEFAULT)
        .then(nextValue => Promise.all([nextValue, this.#db.meta.put(SEQUENCE, nextValue, {valueEncoding: 'json'})]))
        .then(([nextValue]) => nextValue);

    removeCurrentOutcome = playerId => Promise.all([this.#db.players.get(playerId), this.#db.outcomes.keys().all()])
        .then(([player, outcomes]) => [
            player,
            verifyLength(outcomes.filter(outcome => player.tournaments?.includes(outcome)), 1, ERROR_MULTIPLE_CURRENT_OUTCOMES)[0]])
        .then(([player, outcome]) => this.editPlayer({
            ...player,
            id: playerId,
            tournaments: player.tournaments.filter(t => t !== outcome)
        }));

    /**
     * Отметка «заигран» за команду teamId в выбранном турнире.
     * Сезон: только за команду, в которую игрок заявлен (team). Кубок: за любую команду турнира, team не меняется.
     */
    addOutcome = (playerId, teamId) => Promise.all([
        this.#db.players.get(playerId),
        this.#db.outcomes.iterator().all(),
        this.getRosterTournament(),
    ])
        .then(([player, outcomes, tournament]) => {
            outcomes = toRecords(outcomes);
            const isCup = tournament?.isSeason === false;
            const targetTeamId = teamId || player.team;
            if (!targetTeamId) {
                throw new Error('Игрок не числится в команде');
            }
            if (!isCup && player.team !== targetTeamId) {
                throw new Error('Игрок не заявлен за команду');
            }
            const outcomeId = outcomes.find(outcome => outcome.teamId === targetTeamId)?.id;
            if (!outcomeId) {
                throw new Error('Команда не участвует в выбранном турнире');
            }
            if (player.tournaments?.includes(outcomeId)) {
                throw new Error(`Список турниров игрока [${player.tournaments}] уже содержит ${outcomeId}`);
            }
            const otherOutcome = outcomes.find(outcome => player.tournaments?.includes(outcome.id));
            if (otherOutcome) {
                throw new Error(`Игрок уже заигран в этом турнире за команду ${otherOutcome.teamName || otherOutcome.teamId}`);
            }
            return this.editPlayer({
                ...player,
                id: playerId,
                tournaments: [outcomeId].concat(player.tournaments || [])
            });
        });

    addOutcomes = (playerIds, teamId) => Promise.all(playerIds
        .map(id => this.addOutcome(id, teamId)));

    logAndReturn = (text, obj) => {
        !this.#silent && console.log(`${text}: ${obj}`);
        return obj;
    };
}

export class SpinnerPlayersService {
    constructor(db, repositories) {
        const service = new PlayersService(db, repositories);
        getMethods(service)
            .map(methodName => this[methodName] = withSpinner(service[methodName]));
    }
}