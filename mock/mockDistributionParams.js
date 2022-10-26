import {minify} from "../repositories/distributionParamsRepository.js";

export default class MockDistributionParamsRepository {
    #data;

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => JSON.parse(JSON.stringify(distributionParams)).map(p => minify(p));

    getByCode = code => Promise.resolve(this.#data.find(p => p.code === code));

    getById = id => Promise.resolve(this.#data.find(p => p.id === id));
}

const distributionParams = [
    {
        "id": "recqUk1lPBnwz4s41",
        "createdTime": "2022-10-20T19:32:33.000Z",
        "fields": {
            "Код": 1,
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "2",
            "Статус": "Готово к запуску",
            "Новые команды": [
                "recM6djz83jZzezYJ",
            ],
            "Снявшиеся команды": [
                "rec9HmVM1YlrsaUR6",
                "reccEe7SloEGYhD9e",
                "rec7IAXxfzLtdhMsg"
            ]
        }
    }
];