import {getTournamentAndTour} from "./utils.js";

export default class DataLoader {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    loadData = async paramsCode => this.#repositories.params.getByCode(paramsCode)
        .then(params => Promise.all([
            this.#validateParams(params, paramsCode),
            this.#repositories.tournaments.getById(params.tournament)
        ]))
        .then(([params, tournament]) => Promise.all([
            {...params, currentTournament: tournament},
            this.#repositories.tournaments.getPrevious(tournament)
        ]))
        .then(([params, previousTournament]) => ({
                ...params,
                previousTournament,
                ...getTournamentAndTour({...params, previousTournament})
            })
        )
        .then(params => Promise.all([
            params,
            this.#repositories.results.getByTournamentAndTour(...params.results),
            this.#repositories.distribution.getByTournamentAndTour(...params.distribution),
        ]));

    #validateParams = (params, paramsCode) => {
        if (!params) {
            throw new Error(`Параметры с кодом ${paramsCode} не найдены`);
        }
        if (params.state !== 'Готово к запуску') {
            throw new Error(`Параметры с кодом ${paramsCode} в статусе '${params.state}' отличном от 'Готово к запуску'`);
        }
        if (!params.tournament) {
            throw new Error(`В параметрах с кодом ${paramsCode} не заполнен турнир`);
        }
        if (!params.nextTour) {
            throw new Error(`В параметрах с кодом ${paramsCode} не заполнен тур`);
        }
        return params;
    }
}