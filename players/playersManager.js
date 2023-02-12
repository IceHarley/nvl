import {Level} from "level";
import PlayersRepository from "../repositories/playersRepository.js";
import {SpinnerPlayersService} from "./playersService.js";

const playersRepository = new PlayersRepository();

export default class PlayersManager {
    process = async (options, repositories) => {
        repositories.playersRepository = playersRepository;
        const db = new Level('./db', {valueEncoding: 'json'})
        const manager = new SpinnerPlayersService(db, repositories);

        db.open()
            .then(() => {
                if (options.operation === 'loadFromAirtable') {
                    if (options.loadType === 'full') {
                        return manager.fullLoad();
                    } else if (options.loadType === 'onlyChanges') {
                        return manager.loadOnlyChanges();
                    }
                }
            })
            .then(() => db.close());
    }
}

