import {minify} from "../repositories/distributionRepository.js";
import {clone} from "../common/utils.js";

export default class MockScheduleRepository {
    #data

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => clone(distribution).map(p => minify(p));

    getAll = () => this.#data;
}

const distribution =  [
    {
        "id": "recnCys0P9kxs8IDo",
        "createdTime": "2023-02-17T20:30:48.000Z",
        "fields": {
            "Дата": "08.10",
            "Время": "14:00",
            "Зал": "Муссон",
            "Наименование": "A: Матчбол, Черноморец, Кристалл не 22, не 29. Меня возможно не будет 15гоне 1хотят 8 или 15",
            "Распределение команд": [
                "recvuQpZfPy2R7KZh",
                "recwkcdlws5NZwI4L",
                "recdk9C65eQRaWcwp"
            ],
            "Группа": [
                "A"
            ],
            "Команды": [
                "recVKjQlclPTbwNbV",
                "recm4g5Did6ZmEGHa",
                "recZz5MvBuqzk2Wa0"
            ],
            "Неигровые дни": [
                "не 22, не 29. Меня возможно не будет 15го",
                "не 1",
                "хотят 8 или 15"
            ],
            "Тур": [
                "2"
            ],
            "Турнир": [
                "recSBaC5mNq3ZeZAX"
            ],
            "Текст": "08.10, Муссон, 14:00"
        }
    },
    {
        "id": "recdItILm9ZRoKYqh",
        "createdTime": "2023-02-17T20:31:44.000Z",
        "fields": {
            "Наименование": "B: Спарта, Сурож, ЧНГ Не 1. Хотят 8 или 29Хотят 1 или 29. Не 22не 1, не 15. Хотят 8",
            "Текст": "08.10, ФОК, 11:00",
            "Распределение команд": [
                "recDmpVlNLuUMEFFR",
                "recFIiyy0mENFtASD",
                "recKSjvhsVXzs1QnZ"
            ],
            "Группа": [
                "B"
            ],
            "Команды": [
                "recGKTUEHr3uBBnfd",
                "rece0bHTtURacy4rG",
                "rec7U23yfSJcBRiAV"
            ],
            "Неигровые дни": [
                "Не 1. Хотят 8 или 29",
                "Хотят 1 или 29. Не 22",
                "не 1, не 15. Хотят 8"
            ],
            "Тур": [
                "2"
            ],
            "Турнир": [
                "recSBaC5mNq3ZeZAX"
            ],
            "Дата": "08.10",
            "Время": "11:00",
            "Зал": "ФОК"
        }
    },
    {
        "id": "recDSitT3L5p2OpwH",
        "createdTime": "2023-02-17T20:31:44.000Z",
        "fields": {
            "Наименование": "C: Строммонтаж, Алушта, Заря Крыма хотят 8 или 15не 1, не 8, не 15не 22",
            "Текст": "29.10, Муссон, 11:00",
            "Распределение команд": [
                "recEhjdX1ep5EXfgF",
                "rec1T9QilCxpwcG1x",
                "recoJVO9M4pQ1N6I3"
            ],
            "Группа": [
                "C"
            ],
            "Команды": [
                "rechStijQQL4RTsCE",
                "rec8jaLnCe8hsSflQ",
                "recU2940bSSibmVXd"
            ],
            "Неигровые дни": [
                "хотят 8 или 15",
                "не 1, не 8, не 15",
                "не 22"
            ],
            "Тур": [
                "2"
            ],
            "Турнир": [
                "recSBaC5mNq3ZeZAX"
            ],
            "Дата": "29.10",
            "Время": "11:00",
            "Зал": "Муссон"
        }
    }
];