import {minify} from "../repositories/distributionRepository.js";
import {clone} from "../common/utils.js";

export default class MockDistributionRepository {
    #data

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => clone(distribution).map(p => minify(p));

    getAllRecords = () => this.#data;

    getByTournamentAndTour = (tournamentId, tour) => Promise.resolve(this.getByTournamentAndTourDirect(tournamentId, tour));

    getByTournamentAndTourDirect = (tournamentId, tour) => this.#data.filter(r => r.tournament === tournamentId && r.tour === tour);
}

const distribution = [
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": ["recTBtRUiBwh3avjf"],
            "Команда": [
                "reca5NQVSKm3gmn8C"
            ],
            "Name": "Осень 2022: Матчбол: 1 - B",
            "Тур": "1",
            "Группа": "B",
            "Позиция в группе": 1,
        }
    },
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": ["recTBtRUiBwh3avjf"],
            "Команда": [
                "rectlFHt9jokhoEon"
            ],
            "Name": "Осень 2022: Сурож: 1 - D",
            "Тур": "1",
            "Группа": "D",
            "Позиция в группе": 1,
        }
    },
    {
        "id": "rec3mMcD0KplDtWkq",
        "createdTime": "2022-10-18T07:52:14.000Z",
        "fields": {
            "ID турнира": ["recC6cmCroZm6Rjb6"],
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
            "ID турнира": ["recC6cmCroZm6Rjb6"],
            "Команда": [
                "rectlFHt9jokhoEon"
            ],
            "Name": "Весна 2022: Сурож: 1 - C",
            "Тур": "3",
            "Группа": "С"
        }
    },
    {
        "id": "recGigREwHr1au7Kc",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recf5jCoQc4ebLckG"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "хотят как можно раньше, на 20.11 согласны",
            "Группа": "A",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Мстители -> группа A",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recMI8c5Vty1tEhyq",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "reca5NQVSKm3gmn8C"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11, хотим 20.11",
            "Группа": "A",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Матчбол -> группа A",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recM3zIf5G0jjrubj",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recV5nUenQAEGrXcU"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "A",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Спарта -> группа A",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "rec1AyCF7FhdcGxux",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recQCcUcWqfasbeAr"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11 и не 20.11",
            "Группа": "B",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 11:00, Металлист",
            "Name": "Осень 2022, 3 тур: Бастион -> группа B",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recn3KYJxj5zkLj8f",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "receUzM5hTXJpSw7H"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "хотят как можно позже",
            "Группа": "B",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 11:00, Металлист",
            "Name": "Осень 2022, 3 тур: Легион -> группа B",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recuyJ22k60Nezr2i",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recwdXiTwfieWJ2zl"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "хотят как можно позже",
            "Группа": "B",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 11:00, Металлист",
            "Name": "Осень 2022, 3 тур: Легион-2 -> группа B",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recQsbuIM3qAN2mYW",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recnEELXiDFrxIPix"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11 не 27.11  не 11.12",
            "Группа": "C",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Алушта -> группа C",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recZxh2IHuWiGdsAy",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec3S7eXfpZv3l7q0"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "C",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Ахтиар -> группа C",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "receCE8ErcPP2sPTB",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recBpK5dYCD9rugER"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "девочки уезжают до середины ноября, а мальчики - до 8-9 декабря. Хотят в самый конец в декабре. Написать Жанне по вариантам",
            "Группа": "C",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Черноморец -> группа C",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recItP1a00aNj3QmF",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recDxakzIGaFzydAA"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 11.12",
            "Группа": "D",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "04.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Импульс -> группа D",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recZSTFtB878Mcb12",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recyw2f145WAJGLGx"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "D",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "04.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Медведи -> группа D",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recbdH8VfgGnHjV2a",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rectlFHt9jokhoEon"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "D",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "04.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Сурож -> группа D",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recKR7pjtY9fansDA",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recmfw38VhgmGHSxC"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "E",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: ЧНГ -> группа E",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "reclSbGflBxdgPvYp",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recUdDhsqd0WU5Hgo"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "E",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Продвижение -> группа E",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recvxmkJ8dIONEkbO",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recxx0ELRBmt2lYoH"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "E",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27.11 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Рейнджерс -> группа E",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "rec8987csKtJOPAyc",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recst39AJwl7Edi0c"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "на конец по возможности",
            "Группа": "F",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Комус -> группа F",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "rechwi1TQH6t8iRko",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec0yMKHYH64GWmVb"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11. Хотят в самый конец",
            "Группа": "F",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: Лукулл -> группа F",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "reczHNPJXJu5LFwtk",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec2hQpJTPt5WSRZf"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "F",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "11.12 14:00, Муссон",
            "Name": "Осень 2022, 3 тур: ЮБК -> группа F",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recZtwEnpJfs7ce72",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recnTZ9QZUryBmf7E"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "девочки уезжают до середины ноября, а мальчики - до 8-9 декабря. Хотят в самый конец в декабре. Написать Жанне по вариантам",
            "Группа": "G",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Черноморец-2 -> группа G",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "reciUxwdk6T4XJPgu",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recq7xUDdmjx5Ngal"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "G",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Феникс -> группа G",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "rectJKZwNPYSqcagO",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec9nD4ARhpsgcvUU"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "G",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "18 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Заря Крыма -> группа G",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recbBnJNyBLBlTPXM",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec7V4fSrk0kxRBcR"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "H",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Астра -> группа H",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recwGcWaRrTYNEWda",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec4KbD8N7XB3hmEA"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "H",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Оникс -> группа H",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recAbZfsFKoQFKg3o",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recmS8BgTWn8QIpqc"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "H",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "20 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Циркон -> группа H",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "rec1cjJyZooVq58o5",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recMPmbwQFBKGVSoM"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "I",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Ралли-поинт -> группа I",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "rec7HDiJrHlGyUB7J",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recuchsORYh1p8mL5"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "I",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Крафт -> группа I",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recEWiLwg7BJEys12",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recmIPtfETs7wIh6N"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 04.12",
            "Группа": "I",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "27 ноября, 11:00",
            "Name": "Осень 2022, 3 тур: Дивизион -> группа I",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recSJna3xXQaMzUnH",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recVLMP36y7NzwTFk"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 20.11",
            "Группа": "J",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "4 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Таврия -> группа J",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recTIChqtjDmSOpoO",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recUZ9IN2r9brYDa6"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Неигровой день": "не 13.11",
            "Группа": "J",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "4 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Коралл -> группа J",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recvbi7ZC5Sk6U0r5",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recsucLBwtB8WNkC6"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "J",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Расписание": "4 декабря, 11:00",
            "Name": "Осень 2022, 3 тур: Карасуно -> группа J",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recTOhEoO2vewqsB3",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recoWmhWBQWh2jzRL"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "K",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: ФВМ+1 -> группа K",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recpU3BcdRIf5qnCJ",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recMYX0UQ505TwwQL"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "K",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Стрела -> группа K",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recroRanBm1f1pCVh",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec8BwgNp8nnHt1kw"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "K",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Молния -> группа K",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "reckbw7Ck4TTD4nu5",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recbn6QHSm4wAfzbq"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "L",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Атом -> группа L",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "reckizglDx7y3ctWo",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recWxZUi2wubRzEsb"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "L",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Динамит -> группа L",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "reczilR0u4PBWTKVZ",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recoXc9lMlrWdFoOg"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "L",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Омега -> группа L",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "rec4W9b0ZYWrxhOth",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "reche4L2VLav89gU5"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "M",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Некома -> группа M",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recn7vlxDhLXvFeqd",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec8ZHRbPI4NNyGfL"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "M",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Сплин -> группа M",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recwajq5IXcmypydt",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recoeMMLqnbFNAvIJ"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "M",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Барс -> группа M",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "rec31p8NkoJMZEU9L",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec9GbvD9xEOe7ksG"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "N",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Энель -> группа N",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recKqWhOLPYKrkCKJ",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recwRIDRji0gaA92X"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "N",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Домино -> группа N",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recz862YTycSckFeQ",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recXu7MPHQpXpp5s1"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "N",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Черноморец-3 -> группа N",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recYLIkEft7vJPcD2",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "rec5bpX1gX6m9koGz"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "O",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Шторм -> группа O",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    },
    {
        "id": "recpmJ1mhvjxMkAJv",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recM6djz83jZzezYJ"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "O",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: 7 пределов -> группа O",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 2,
        }
    },
    {
        "id": "recsQJMLySHnHPNrK",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recrlWD64QAqzpZ9O"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "O",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: ЭкоПик -> группа O",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 3,
        }
    },
    {
        "id": "recgujeN7ILaRcMFX",
        "createdTime": "2022-11-06T16:22:24.000Z",
        "fields": {
            "Команда": [
                "recc8PkfQSTRuAKZg"
            ],
            "Турнир": [
                "recTBtRUiBwh3avjf"
            ],
            "Тур": "3",
            "Группа": "P",
            "Параметры распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Name": "Осень 2022, 3 тур: Ортус -> группа P",
            "ID турнира": [
                "recTBtRUiBwh3avjf"
            ],
            "Идентификатор параметров распределения": [
                "recVadfyjkJbSxdI9"
            ],
            "Тур (число)": 3,
            "Позиция в группе": 1,
        }
    }
];