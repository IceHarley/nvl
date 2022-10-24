import TeamsDistribution from "./teamsDistribution.js";

export default class Distributor {
    #teamsDistribution = new TeamsDistribution();
    #dataLoader;
    #distributionRepository;

    constructor(dataLoader, distributionRepository) {
        this.#dataLoader = dataLoader;
        this.#distributionRepository = distributionRepository;
    }

    distribute = async paramsCode =>
        this.#dataLoader.loadData(paramsCode)
            .then(([params, results, lastDistribution]) =>
                this.#teamsDistribution.distribute(results, lastDistribution, params.newTeams, params.withdrawed)
                    .map(d => this.toDistributionRecord(d, params)));

    toDistributionRecord = (teamDistribution, params) => ({
        ...teamDistribution,
        tournament: params.tournament,
        tour: params.nextTour,
        paramsId: params.id,
    });
}

