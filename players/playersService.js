import {getMethods, resolvePromisesSeq, toOperation, toRecords, verifyLength, withSpinner} from "../common/utils.js";
import {minify} from "../repositories/playersRepository.js";

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
        .then(count => this.logAndReturn('Загружено игроков', count));

    loadActiveTeams = () => this.#db.teams.clear()
        .then(() => this.#repositories.teams.getActiveTeams())
        .then(records => this.#db.teams.batch(records.map(player => toOperation(player))))
        .then(() => this.#db.teams.keys().all())
        .then(keys => keys.length)
        .then(count => this.logAndReturn('Загружено команд', count));

    loadActiveTournamentOutcomes = () => this.#db.outcomes.clear()
        .then(() => this.#repositories.tournamentOutcomes.getByActiveTournament())
        .then(records => this.#db.outcomes.batch(records.map(outcome => toOperation(outcome))))
        .then(() => this.#db.outcomes.keys().all())
        .then(keys => keys.length)
        .then(count => this.logAndReturn('Загружено результатов турниров', count));

    loadOnlyChanges = () => this.#db.meta.get(SYNC_DATETIME)
        .catch(() => Promise.resolve(new Date(2021, 1).toISOString()))
        .then(syncDatetime => this.#repositories.players.getList({
            filterByFormula: `AND(NOT({Имя} = ''), {Изменен} >= '${syncDatetime}')`,
        }))
        .then(records => Promise.all([
            records.length,
            this.#db.players.batch(records.map(player => toOperation(player)))
        ]))
        .then(([count]) => Promise.all([
            count,
            this.#db.meta.put(SYNC_DATETIME, new Date().toISOString()),
            this.#db.modifications.clear(),
        ]))
        .then(([count]) => {
            !this.#silent && console.log(`Обновлено игроков: ${count}`);
            return Promise.resolve(count);
        });

    uploadLocalChanges = async () => resolvePromisesSeq([
        this.#removeDeletedRecords(),
        this.#insertNewRecords(),
        this.#updateModifiedRecords(),
    ])
        .then(([removed, inserted, updated]) => Promise.all([
            {removed, inserted, updated},
            this.#db.meta.put(SYNC_DATETIME, new Date().toISOString()), //устанавливаем время последней синхронизации - считаем что все обновлено
            this.#db.modifications.clear(),  //очищаем локальную таблицу изменений
        ]))
        .then(([result]) => result);

    #removeDeletedRecords = () => this.#db.modifications.iterator().all() //получаем измененные локально записи в таблице модификаций
        .then(mods => mods.filter(([, value]) => value === DEL).map(([key]) => key)) //находим идентификаторы удаленных
        .then(ids => Promise.all([ids.length, this.#repositories.players.deleteList(ids)])) //удаляем в airtable
        .then(([count]) => this.logAndReturn('Удалено игроков в airtable', count));

    #updateModifiedRecords = () => this.#db.modifications.iterator().all() //получаем измененные локально записи в таблице модификаций
        .then(mods => mods.filter(([, value]) => value === UPD).map(([key]) => key)) //находим идентификаторы обновленных
        .then(keys => Promise.all([keys, this.#db.players.getMany(keys)])) //получаем обновленные записи
        .then(([keys, records]) => records.map((record, index) => ({id: keys[index], ...record}))) //объединяем записи с идентификаторами
        .then(records => this.#repositories.players.updateList(records)) //обновляем в airtable
        .then(records => this.logAndReturn('Обновлено игроков в airtable', records.flat().length));

    #insertNewRecords = () => this.#db.players.values({lte: LTE_INS}).all() //получаем добавленные локально записи (c идентификаторами на ins...)
        .then(records => this.#repositories.players.createList(records)) //создаем их в airtable
        .then(records => this.#db.players.batch(records.flat().map(record => toOperation(minify(record))))) //созданные в airtable записи сохраняем локально
        .then(() => this.#db.players.keys({lte: LTE_INS}).all()) //добавленные локально записи
        .then(records => Promise.all([
            records.length,
            this.#db.players.batch(records.map(r => ({type: DEL, key: r}))) //удаляем из локальной БД
        ]))
        .then(([count]) => this.logAndReturn('Создано игроков в airtable', count));

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
                return UPD; // если нет в таблице модификаций, то игрок существует в airtable но локально не менялся
            } else {
                throw err;
            }
        })
        .then(modification => modification === INS
            ? this.#db.modifications.del(playerId) :    //для добавленных только локально игроков просто удаляем запись в модификациях
            this.#db.modifications.put(playerId, DEL))  //для существующих в airtable игроков проставляем модификацию удаления
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

    addCurrentOutcome = playerId => Promise.all([this.#db.players.get(playerId), this.#db.outcomes.iterator().all()])
        .then(([player, outcomes]) => {
            outcomes = toRecords(outcomes);
            if (!player.team) {
                throw new Error('Игрок не числится в команде');
            }
            const outcomeId = outcomes.find(outcome => outcome.teamId === player.team)?.id;
            if (!outcomeId) {
                throw new Error('Команда игрока не участвует в текущем турнире');
            }
            if (player.tournaments?.includes(outcomeId)) {
                throw new Error(`Список турниров игрока [${player.tournaments}] уже содержит ${outcomeId}`);
            }
            if (outcomes.some(outcome => player.tournaments?.includes(outcome.id))) {
                throw new Error(`Список турниров игрока [${player.tournaments}] уже содержит другую запись для текущего турнира`);
            }
            return this.editPlayer({
                ...player,
                id: playerId,
                tournaments: [outcomeId].concat(player.tournaments || [])
            });
        });

    addCurrentOutcomes = playerIds => Promise.all(playerIds
        .map(id => this.addCurrentOutcome(id)));

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