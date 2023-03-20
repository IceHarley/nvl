import {Level} from "level";

export const provideDb = () => {
    const db = new Level('./db', {valueEncoding: 'json'});
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