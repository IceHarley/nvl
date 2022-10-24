import {minify} from "../repositories/distributionRepository.js";

export default class MockDistributionRepository {
    #data

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => JSON.parse(JSON.stringify(distribution)).map(p => minify(p));

    getAllRecords = () => this.#data;

    getByTournamentAndTour = (tournamentId, tour) => Promise
        .resolve(this.#data.filter(r => r.tournament === tournamentId && r.tour === tour))
}

const distribution = [
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": "recTBtRUiBwh3avjf",
            "Команда": [
                "reca5NQVSKm3gmn8C"
            ],
            "Name": "Осень 2022: Матчбол: 1 - B",
            "Тур": "1",
            "Группа": "B"
        }
    },
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": "recTBtRUiBwh3avjf",
            "Команда": [
                "rectlFHt9jokhoEon"
            ],
            "Name": "Осень 2022: Сурож: 1 - D",
            "Тур": "1",
            "Группа": "D"
        }
    },
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": "recC6cmCroZm6Rjb6",
            "Команда": [
                "reca5NQVSKm3gmn8C"
            ],
            "Name": "Весна 2022: Матчбол: 1 - A",
            "Тур": "3",
            "Группа": "A"
        }
    },
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": "recC6cmCroZm6Rjb6",
            "Команда": [
                "rectlFHt9jokhoEon"
            ],
            "Name": "Весна 2022: Сурож: 1 - C",
            "Тур": "3",
            "Группа": "С"
        }
    }
];