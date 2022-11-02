import {withSpinner} from "./utils.js";

export class RatingDBSaver {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    saveData = async (ratingData, tournamentOutcomes) => {
        this.#validateData(tournamentOutcomes, ratingData);
        console.log("Начинаем сохранение " + tournamentOutcomes.length + " записей");
        return this._saveData(ratingData, tournamentOutcomes, ratingData)
            .then(() => console.log(`Обновлено ${tournamentOutcomes.length} записей`))
            .then(() => ratingData);
    }

    _saveData = async (ratingData, tournamentOutcomes) =>
        this.#repositories.tournamentOutcomes.updateRatingList(this.#prepareData(tournamentOutcomes, ratingData))
            .catch(error => console.log('Произошла ошибка ' + error))
            .then(() => ratingData);

    #prepareData = (tournamentOutcomes, ratingData) => tournamentOutcomes.map(o => {
        const record = ratingData.find(data => data.teamId === o.teamId) || {};
        return {
            ...o,
            rating: record.rating,
            place: record.place,
        }
    });

    #validateData = (tournamentOutcomes, ratingData) => {
        if (!ratingData || ratingData.length === 0) {
            console.log("Нет данных для сохранения");
            return Promise.reject("Нет данных для сохранения");
        }
        if (!tournamentOutcomes || tournamentOutcomes.length === 0) {
            console.log("Нет записей в таблице Результаты турниров");
            return Promise.reject("Нет записей в таблице Результаты турниров");
        }
        if (tournamentOutcomes.length > ratingData.length) {
            console.log(`В турнире участвует ${tournamentOutcomes.length} команд, а рейтинговой таблице данные только по ${ratingData.length}. Рейтинги не всех команд будут заполнены`);
        }
        if (ratingData.length > tournamentOutcomes.length) {
            console.log(`В рейтинговой таблице ${ratingData.length} команд, а в турнире участвует лишь ${tournamentOutcomes.length} и только их рейтинги будут заполнены`);
        }
    }
}

export const mockRatingDataSaver = {
    saveData: data => {
        console.log(`Сформировано ${data.length} записей. Они не будут сохранены в БД`)
        return data;
    }
}

export class SpinnerRatingDataSaver {
    #dataSaver

    constructor(repositories) {
        this.#dataSaver = new RatingDBSaver(repositories);
        this.saveData = this.#dataSaver.saveData;
        this.#dataSaver._saveData = withSpinner(this.#dataSaver._saveData, 'Сохранение данных...');
    }
}

export const ratingDataSaverBuilder = (saveToDb, repositories) => saveToDb
    ? new SpinnerRatingDataSaver(repositories)
    : mockRatingDataSaver;
