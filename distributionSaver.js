export default class DistributionDBSaver {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    saveData = distributionData =>
        Promise.resolve(distributionData)
            .then(result => {
                console.log("Начинаем сохранение " + result.length + " записей");
                return result;
            })
            .then(result => this.#repositories.distribution.saveList(result))
            .then(number => {
                console.log(`Создано ${number.flat().length} записей`);
                return distributionData;
            })
            .catch(error => console.log('Произошла ошибка ' + error))
}

export const mockDataSaver = {
    saveData: data => {
        console.log(`Сформировано ${data.length} записей. Они не будут сохранены в БД`)
        return data;
    }
}

export const dataSaverBuilder = (saveToDb, args) => saveToDb
    ? new DistributionDBSaver(args)
    : mockDataSaver;