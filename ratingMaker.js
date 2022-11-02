import RatingCalculator from "./ratingCalculator.js";

export default class RatingMaker {
    #ratingCalculator = new RatingCalculator();
    #dataLoader;
    #dataSaver;

    constructor(dataLoader, dataSaver) {
        this.#dataLoader = dataLoader;
        this.#dataSaver = dataSaver;
    }

    makeRating = async tournamentId =>
        this.#dataLoader.loadData(tournamentId)
            .then(([tournament, results, tournamentOutcomes, previousTournamentOutcomes]) => Promise.all([
                tournamentOutcomes,
                this.#ratingCalculator.calculate(tournament, results, tournamentOutcomes, previousTournamentOutcomes)]))
            .then(([tournamentOutcomes, result]) => this.#dataSaver.saveData(result, tournamentOutcomes));
}

