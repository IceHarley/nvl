import {withSpinner} from "../common/utils.js";

const SYNC_DATETIME = 'Synchronization datetime';

export default class PlayersService {
    #repositories = {};
    #db
    #playersDb
    #metaDb

    constructor(db, repositories) {
        this.#repositories = repositories;
        this.#db = db;
        this.#playersDb = this.#db.sublevel('players');
        this.#metaDb = this.#db.sublevel('meta');
    }

    fullLoad = () => this.#playersDb.clear()
        .then(() => this.#repositories.playersRepository.getList())
        .then(records => this.#playersDb.batch(records.map(player => ({
            type: 'put',
            key: player.id,
            value: {
                name: player.name,
                instagram: player.instagram,
                team: player.team,
            }
        }))))
        .then(() => this.#metaDb.put(SYNC_DATETIME, new Date().toISOString()))
        .then(() => this.#playersDb.keys().all())
        .then(keys => keys.length)
        .then(count => {
            console.log(`Загружено игроков: ${count}`);
            return Promise.resolve(count);
        })

    loadOnlyChanges = () => this.#metaDb.get(SYNC_DATETIME)
        .catch(() => Promise.resolve(new Date(2021, 1).toISOString()))
        .then(syncDatetime => this.#repositories.playersRepository.getList({
            filterByFormula: `AND(NOT({Имя} = ''), {Изменен} >= '${syncDatetime}')`,
        }))
        .then(records => Promise.all([
            records.length,
            this.#playersDb.batch(records.map(player => ({
                type: 'put',
                key: player.id,
                value: {
                    name: player.name,
                    instagram: player.instagram,
                    team: player.team,
                }
            })))
        ]))
        .then(([count]) => Promise.all([count, this.#metaDb.put(SYNC_DATETIME, new Date().toISOString())]))
        .then(([count]) => {
            console.log(`Обновлено игроков: ${count}`);
            return Promise.resolve(count);
        });
}

export class SpinnerPlayersService {
    #service

    constructor(db, repositories)  {
        this.#service = new PlayersService(db, repositories);
        this.fullLoad = withSpinner(this.#service.fullLoad);
        this.loadOnlyChanges = withSpinner(this.#service.loadOnlyChanges);
    }
}