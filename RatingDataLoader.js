import {withSpinner} from "./utils.js";

export default class RatingDataLoader {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    loadData = async tournamentId => this.#repositories.tournaments.getById(RatingDataLoader.#validate(tournamentId))
        .then(tournament => {
            if (!tournament) {
                throw new Error(`Турнир с идентификатором ${tournamentId} не найден`)
            }
            return Promise.all([
                tournament,
                this.#repositories.tournaments.getPrevious(tournament),
                this.#repositories.results.getByTournament(tournament.id),
                this.#repositories.tournamentOutcomes.getByTournament(tournament.id),
            ]);
        })
        .then(([tournament, previousTournament, results, tournamentOutcomes]) => Promise.all([
            tournament,
            results,
            tournamentOutcomes,
            this.#repositories.tournamentOutcomes.getByTournament(previousTournament.id),
        ]));

    static #validate = tournamentId => {
        if (!tournamentId) {
            throw new Error(`Турнир с идентификатором ${tournamentId} не найден`);
        }
        return tournamentId;
    }
}

export class SpinnerRatingDataLoader {
    #dataLoader

    constructor(repositories) {
        this.#dataLoader = new RatingDataLoader(repositories);
        this.loadData = withSpinner(this.#dataLoader.loadData);
    }
}