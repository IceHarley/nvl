export class DistributionDBSaver {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    saveData = distributionData => {
        if (!distributionData || distributionData.length === 0) {
            console.log("Нет данных для сохранения");
            return Promise.reject("Нет данных для сохранения");
        }
        console.log("Начинаем сохранение " + distributionData.length + " записей");
        return this.#repositories.distribution.saveList(distributionData)
            .then(result => console.log(`Создано ${result.flat().length} записей`))
            .then(() => this.#repositories.params.updateState(distributionData[0].paramsId, "Завершено"))
            .catch(error => {
                console.log('Произошла ошибка ' + error);
                return this.#repositories.params.updateState(distributionData[0].paramsId, "Ошибка");
            })
            .then(() => distributionData);
    }

    addMissingTournamentOutcomes = distributionData =>
        this.#repositories.tournamentOutcomes.getByTournament(distributionData[0].tournament)
            .then(outcomes => distributionData.filter(distribution => !outcomes.some(outcome => distribution.team === outcome.teamId)))
            .then(missingOutcomes => {
                console.log("Начинаем сохранение " + missingOutcomes.length + " недостающих записей в таблицу результатов турниров");
                return this.#repositories.tournamentOutcomes.createList(missingOutcomes.map(o => ({
                    tournamentId: o.tournament,
                    teamId: o.team,
                })));
            })
            .then(() => {
                console.log("Записи в таблицу результатов турниров добавлены");
                return distributionData;
            })
}

export const mockDataSaver = {
    saveData: data => {
        console.log(`Сформировано ${data.length} записей. Они не будут сохранены в БД`)
        return data;
    },

    addMissingTournamentOutcomes: data => {
        return data;
    }
}

export const dataSaverBuilder = (saveToDb, args) => saveToDb
    ? new DistributionDBSaver(args)
    : mockDataSaver;