import TeamsDistribution from "./teamsDistribution.js";

export default class Distributor {
    #teamsDistribution = new TeamsDistribution();
    #dataLoader;
    #dataSaver;

    constructor(dataLoader, dataSaver) {
        this.#dataLoader = dataLoader;
        this.#dataSaver = dataSaver;
    }

    distribute = async paramsId =>
        this.#dataLoader.loadData(paramsId)
            .then(([params, results, lastDistribution]) =>
                this.#teamsDistribution.distribute(results, lastDistribution, params.newTeams, params.withdrawed)
                    .map(d => this.toDistributionRecord(d, params)))
            .then(result => this.#dataSaver.saveData(result));

    toDistributionRecord = (teamDistribution, params) => ({
        ...teamDistribution,
        tournament: params.tournament,
        tour: params.nextTour,
        paramsId: params.id,
    });
}

