import {Level} from "level";
import {apiEnv} from "../common/apiClient.js";

// Отдельный каталог на окружение: турнир и игроки develop не должны попадать в test/prod.
const dbPath = `./db/${/^[a-z0-9_-]+$/.test(apiEnv) ? apiEnv : 'prod'}`;

export const provideDb = () => {
    const db = new Level(dbPath, {valueEncoding: 'json'});
    return {
        main: db,
        meta: db.sublevel('meta'),
        players: db.sublevel('players', {valueEncoding: 'json'}),
        playersSource: db.sublevel('playersSource', {valueEncoding: 'json'}),
        teams: db.sublevel('teams', {valueEncoding: 'json'}),
        teamsSource: db.sublevel('teamsSource', {valueEncoding: 'json'}),
        outcomes: db.sublevel('outcomes', {valueEncoding: 'json'}),
        modifications: db.sublevel('modifications', {valueEncoding: 'json'}),
    }
}