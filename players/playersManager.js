import {Level} from "level";
import PlayersRepository from "../repositories/playersRepository.js";
import {SpinnerPlayersService} from "./playersService.js";

const playersRepository = new PlayersRepository();

export default class PlayersManager {
    process = async (options, repositories) => {
        repositories.playersRepository = playersRepository;
        const db = new Level('./db', {valueEncoding: 'json'})
        const playersService = new SpinnerPlayersService({
            players: db.sublevel('players', {valueEncoding: 'json'}),
            meta: db.sublevel('meta'),
            modifications: db.sublevel('modifications', {valueEncoding: 'json'}),
        }, repositories);

        db.open()
            .then(() => {
                if (options.operation === 'loadFromAirtable') {
                    switch (options.loadType) {
                        case 'full':
                            return playersService.fullLoad();
                        case 'onlyChanges':
                            return playersService.loadOnlyChanges();
                    }
                } else if (options.operation === 'upload') {
                    return playersService.uploadLocalChanges();
                }
            })
            .then(() => db.close());
    }
}

