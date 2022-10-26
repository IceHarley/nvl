import {getTournamentAndTour} from "./utils.js";

export default class DataLoader {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    loadData = async paramsId => this.#repositories.params.getById(paramsId)
        .then(params => Promise.all([
            this.#validateParams(params, paramsId),
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

    #validateParams = (params, paramsId) => {
        if (!params) {
            throw new Error(`Параметры с идентификатором ${paramsId} не найдены`);
        }
        if (params.state !== 'Готово к запуску') {
            throw new Error(`Параметры с кодом ${params.code} в статусе '${params.state}' отличном от 'Готово к запуску'`);
        }
        if (!params.tournament) {
            throw new Error(`В параметрах с кодом ${params.code} не заполнен турнир`);
        }
        if (!params.nextTour) {
            throw new Error(`В параметрах с кодом ${params.code} не заполнен тур`);
        }
        return params;
    }
}