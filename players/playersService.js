import {resolvePromisesSeq, withSpinner} from "../common/utils.js";
import {minify} from "../repositories/playersRepository.js";

export const SYNC_DATETIME = 'Synchronization datetime';

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
        .then(() => this.#repositories.playersRepository.getList())
        .then(records => this.#db.players.batch(records.map(player => this.#toOperation(player))))
        .then(() => Promise.all([
            this.#db.meta.put(SYNC_DATETIME, new Date().toISOString()),
            this.#db.modifications.clear(),
        ]))
        .then(() => this.#db.players.keys().all())
        .then(keys => keys.length)
        .then(count => {
            !this.#silent && console.log(`Загружено игроков: ${count}`);
            return Promise.resolve(count);
        })

    #toOperation = player => ({
        type: 'put',
        key: player.id,
        value: {
            name: player.name,
            instagram: player.instagram,
            team: player.team,
        }
    });

    loadOnlyChanges = () => this.#db.meta.get(SYNC_DATETIME)
        .catch(() => Promise.resolve(new Date(2021, 1).toISOString()))
        .then(syncDatetime => this.#repositories.playersRepository.getList({
            filterByFormula: `AND(NOT({Имя} = ''), {Изменен} >= '${syncDatetime}')`,
        }))
        .then(records => Promise.all([
            records.length,
            this.#db.players.batch(records.map(player => this.#toOperation(player)))
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
        .then(mods => mods.filter(([, value]) => value === 'del').map(([key]) => key)) //находим идентификаторы удаленных
        .then(ids => Promise.all([ids.length, this.#repositories.playersRepository.deleteList(ids)])) //удаляем в airtable
        .then(([count]) => this.logAndReturn('Удалено игроков в airtable', count));

    #updateModifiedRecords = () => this.#db.modifications.iterator().all() //получаем измененные локально записи в таблице модификаций
        .then(mods => mods.filter(([, value]) => value === 'upd').map(([key]) => key)) //находим идентификаторы обновленных
        .then(keys => Promise.all([keys, this.#db.players.getMany(keys)])) //получаем обновленные записи
        .then(([keys, records]) => records.map((record, index) => ({id: keys[index], ...record}))) //объединяем записи с идентификаторами
        .then(records => this.#repositories.playersRepository.updateList(records)) //обновляем в airtable
        .then(records => this.logAndReturn('Обновлено игроков в airtable', records.flat().length));

    #insertNewRecords = () => this.#db.players.values({lte: 'ins~'}).all() //получаем добавленные локально записи (c идентификаторами на ins...)
        .then(records => this.#repositories.playersRepository.createList(records)) //создаем их в airtable
        .then(records => this.#db.players.batch(records.flat().map(record => this.#toOperation(minify(record))))) //созданные в airtable записи сохраняем локально
        .then(() => this.#db.players.keys({lte: 'ins~'}).all()) //добавленные локально записи
        .then(records => Promise.all([
            records.length,
            this.#db.players.batch(records.map(r => ({type: 'del', key: r}))) //удаляем из локальной БД
        ]))
        .then(([count]) => this.logAndReturn('Создано игроков в airtable', count));

    logAndReturn = (text, obj) => {
        !this.#silent && console.log(`${text}: ${obj}`);
        return obj;
    };
}

export class SpinnerPlayersService {
    #service

    constructor(db, repositories) {
        this.#service = new PlayersService(db, repositories);
        this.fullLoad = withSpinner(this.#service.fullLoad);
        this.loadOnlyChanges = withSpinner(this.#service.loadOnlyChanges);
        this.uploadLocalChanges = withSpinner(this.#service.uploadLocalChanges);
    }
}