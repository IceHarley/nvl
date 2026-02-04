import {clone} from "../common/utils.js";
import {minify} from "../repositories/playersRepository.js";

export default class MockPlayersRepository {
    #data

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => clone(players).map(p => minify(p));

    getList = () => this.#data;

    createList = records => clone(records).map((record, index) => ({
        id: `rec1000000000${index}`,
        createdTime: new Date().toISOString(),
        fields: {
            "Имя": record.name,
            "Турниры": record.tournaments,
            "Изменен": new Date().toISOString(),
            "Год рождения": record.birthYear,
        }
    }));

    updateList = records => clone(records).map(record => ({
        id: record.id,
        fields: {
            "Имя": record.name,
            "Турниры": record.tournaments,
            "Изменен": new Date().toISOString(),
            "Год рождения": record.birthYear,
        }
    }));

    deleteList = () => {
    };
}

const players = [
    {
        "id": "rec4h1WslVHlbFKF7",
        "createdTime": "2022-03-06T20:56:47.000Z",
        "fields": {
            "Имя": "Дмитрий Малоок",
            "Год рождения": "1984",
            "Турниры": [
                "rectNBFGJnls8sUGo"
            ],
            "Достижения": [
                "Осень 2021: 28 место"
            ],
            "Изменен": "2022-03-06T20:57:42.000Z"
        }
    },
    {
        "id": "rectzEvP9goiOJDxH",
        "createdTime": "2022-03-07T12:48:48.000Z",
        "fields": {
            "Имя": "Ника Давыденко",
            "Год рождения": "2014",
            "Турниры": [
                "rec6pxHXiYHqvqTsp"
            ],
            "Достижения": [
                "Осень 2021: 16 место"
            ],
            "Изменен": "2022-03-07T12:48:57.000Z"
        }
    },
    {
        "id": "rec8FAJuTcs5lUw5h",
        "createdTime": "2022-03-07T12:46:57.000Z",
        "fields": {
            "Имя": "Мария Ченцова",
            "Год рождения": "2006",
            "Турниры": [
                "rec6pxHXiYHqvqTsp"
            ],
            "Достижения": [
                "Осень 2021: 16 место"
            ],
            "Изменен": "2022-03-07T12:49:26.000Z"
        }
    },
    {
        "id": "rec5ssK9aYaGHFVa4",
        "createdTime": "2022-03-07T17:47:43.000Z",
        "fields": {
            "Имя": "Ульяна Иванова",
            "Турниры": [
                "rectNBFGJnls8sUGo"
            ],
            "Достижения": [
                "Осень 2021: 28 место"
            ],
            "Изменен": "2022-03-07T17:47:53.000Z"
        }
    },
    {
        "id": "rectmrTP2btRcPi2k",
        "createdTime": "2022-03-07T17:47:55.000Z",
        "fields": {
            "Имя": "Наталья Костенко",
            "Год рождения": "1990",
            "Турниры": [
                "rectNBFGJnls8sUGo"
            ],
            "Достижения": [
                "Осень 2021: 28 место"
            ],
            "Изменен": "2022-03-07T17:48:10.000Z"
        }
    },
    {
        "id": "recky2Bq71PhVZkG5",
        "createdTime": "2022-03-07T17:48:29.000Z",
        "fields": {
            "Имя": "Екатерина Ресенчук",
            "Турниры": [
                "rectNBFGJnls8sUGo"
            ],
            "Достижения": [
                "Осень 2021: 28 место"
            ],
            "Изменен": "2022-03-07T17:48:39.000Z"
        }
    },
    {
        "id": "rec0i9tPvUMW55Gi2",
        "createdTime": "2022-03-07T17:48:53.000Z",
        "fields": {
            "Имя": "Константин Панфамиров",
            "Турниры": [
                "recTXUdRFu40HljbU"
            ],
            "Достижения": [
                "Осень 2021: 30 место"
            ],
            "Изменен": "2022-03-07T17:49:05.000Z"
        }
    },
    {
        "id": "recl4NzrsnKtSbdiQ",
        "createdTime": "2022-03-07T17:49:05.000Z",
        "fields": {
            "Имя": "Евгения Панфамирова",
            "Турниры": [
                "recTXUdRFu40HljbU"
            ],
            "Достижения": [
                "Осень 2021: 30 место"
            ],
            "Изменен": "2022-03-07T17:49:16.000Z"
        }
    },
    {
        "id": "recZ98prAgqg9T5fG",
        "createdTime": "2022-03-07T17:49:16.000Z",
        "fields": {
            "Имя": "Ресул Асанов",
            "Турниры": [
                "recTXUdRFu40HljbU"
            ],
            "Достижения": [
                "Осень 2021: 30 место"
            ],
            "Изменен": "2022-03-07T17:49:25.000Z"
        }
    },
    {
        "id": "rec91uQVwd28DnzVa",
        "createdTime": "2022-03-07T17:49:25.000Z",
        "fields": {
            "Имя": "Диана Алимова",
            "Турниры": [
                "recTXUdRFu40HljbU"
            ],
            "Достижения": [
                "Осень 2021: 30 место"
            ],
            "Изменен": "2022-03-07T17:49:32.000Z"
        }
    }
];