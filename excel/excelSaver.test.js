import test from 'ava';
import ExcelSaver from "./excelSaver.js";

const excelSaver = new ExcelSaver();

test('сохранение в файл', async t => {
    await excelSaver.save({tournamentName: 'Весна 2022', fileName: './test-output/file.xlsx'}, [
            {
                "outcomeId": "reclhsYWkkw4hnUCI",
                "previousTournamentPlace": 4,
                "teamId": "recV5nUenQAEGrXcU",
                "teamName": "Спарта",
                "rating": 12,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "A",
                        "groupPlace": 1,
                        "rating": 6
                    },
                    {
                        "tour": 2,
                        "group": "A",
                        "groupPlace": 1,
                        "rating": 6
                    }
                ],
                "place": 1,
                "delta": 3
            },
            {
                "outcomeId": "recG0pQog2zmwhf7N",
                "previousTournamentPlace": 3,
                "teamId": "recf5jCoQc4ebLckG",
                "teamName": "Мстители",
                "rating": 10,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "A",
                        "groupPlace": 2,
                        "rating": 5
                    },
                    {
                        "tour": 2,
                        "group": "A",
                        "groupPlace": 2,
                        "rating": 5
                    }
                ],
                "place": 2,
                "delta": 1
            },
            {
                "outcomeId": "recIDOWQPWcEUhVoO",
                "previousTournamentPlace": 2,
                "teamId": "receUzM5hTXJpSw7H",
                "teamName": "Легион",
                "rating": 9,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "B",
                        "groupPlace": 1,
                        "rating": 5
                    },
                    {
                        "tour": 2,
                        "group": "A",
                        "groupPlace": 3,
                        "rating": 4
                    }
                ],
                "place": 3,
                "delta": -1
            },
            {
                "outcomeId": "rec4jWKPTURmiSsep",
                "previousTournamentPlace": 5,
                "teamId": "reca5NQVSKm3gmn8C",
                "teamName": "Матчбол",
                "rating": 9,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "B",
                        "groupPlace": 2,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "B",
                        "groupPlace": 1,
                        "rating": 5
                    }
                ],
                "place": 4,
                "delta": 1
            },
            {
                "outcomeId": "recxB4OGl3PmEQuXc",
                "previousTournamentPlace": 1,
                "teamId": "recwdXiTwfieWJ2zl",
                "teamName": "Легион-2",
                "rating": 8,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "A",
                        "groupPlace": 3,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "B",
                        "groupPlace": 2,
                        "rating": 4
                    }
                ],
                "place": 5,
                "delta": -4
            },
            {
                "outcomeId": "recr5QrGkVRTafFh6",
                "previousTournamentPlace": 15,
                "teamId": "rec3S7eXfpZv3l7q0",
                "teamName": "Ахтиар",
                "rating": 8,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "E",
                        "groupPlace": 1,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "D",
                        "groupPlace": 1,
                        "rating": 4
                    }
                ],
                "place": 6,
                "delta": 9
            },
            {
                "outcomeId": "recMyxwfuMBHAidlp",
                "previousTournamentPlace": 14,
                "teamId": "recBpK5dYCD9rugER",
                "teamName": "Черноморец",
                "rating": 7,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "C",
                        "groupPlace": 1,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "B",
                        "groupPlace": 3,
                        "rating": 3
                    }
                ],
                "place": 7,
                "delta": 7
            },
            {
                "outcomeId": "recEtnJrRoyvj5olj",
                "previousTournamentPlace": 19,
                "teamId": "recUdDhsqd0WU5Hgo",
                "teamName": "Продвижение",
                "rating": 7,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "G",
                        "groupPlace": 1,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "F",
                        "groupPlace": 1,
                        "rating": 4
                    }
                ],
                "place": 8,
                "delta": 11
            },
            {
                "outcomeId": "recgcgY3ptGawK5EP",
                "previousTournamentPlace": 7,
                "teamId": "recDxakzIGaFzydAA",
                "teamName": "Импульс",
                "rating": 6,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "D",
                        "groupPlace": 2,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "D",
                        "groupPlace": 2,
                        "rating": 3
                    }
                ],
                "place": 9,
                "delta": -2
            },
            {
                "outcomeId": "recLTpmFwAS7vXYno",
                "previousTournamentPlace": 16,
                "teamId": "rec2hQpJTPt5WSRZf",
                "teamName": "ЮБК",
                "rating": 6,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "F",
                        "groupPlace": 2,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "F",
                        "groupPlace": 2,
                        "rating": 3
                    }
                ],
                "place": 10,
                "delta": 6
            },
            {
                "outcomeId": "recPnXhtZlQ7oyqOe",
                "previousTournamentPlace": 20,
                "teamId": "rec0yMKHYH64GWmVb",
                "teamName": "Лукулл",
                "rating": 6,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "H",
                        "groupPlace": 1,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "G",
                        "groupPlace": 1,
                        "rating": 3
                    }
                ],
                "place": 11,
                "delta": 9
            },
            {
                "outcomeId": "recgIGC3vkHx27fQ4",
                "previousTournamentPlace": 22,
                "teamId": "rec7V4fSrk0kxRBcR",
                "teamName": "Астра",
                "rating": 5,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "I",
                        "groupPlace": 1,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "H",
                        "groupPlace": 2,
                        "rating": 2
                    }
                ],
                "place": 12,
                "delta": 10
            },
            {
                "outcomeId": "recxy5Xu8ZWa2gvEU",
                "teamId": "recmIPtfETs7wIh6N",
                "teamName": "Дивизион",
                "rating": 5,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "J",
                        "groupPlace": 1,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "I",
                        "groupPlace": 2,
                        "rating": 2
                    }
                ],
                "place": 13,
                "delta": null
            },
            {
                "outcomeId": "reckNgNTmMDUbhxlP",
                "previousTournamentPlace": 6,
                "teamId": "recnEELXiDFrxIPix",
                "teamName": "Алушта",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "D",
                        "groupPlace": 1,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 14,
                "delta": -8
            },
            {
                "outcomeId": "rechmW1pOFjBguL6l",
                "previousTournamentPlace": 18,
                "teamId": "recxx0ELRBmt2lYoH",
                "teamName": "Рейнджерс",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "F",
                        "groupPlace": 1,
                        "rating": 4
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 15,
                "delta": 3
            },
            {
                "outcomeId": "recUQllz4rFCUc88M",
                "previousTournamentPlace": 10,
                "teamId": "recmfw38VhgmGHSxC",
                "teamName": "ЧНГ",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "C",
                        "groupPlace": 3,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "D",
                        "groupPlace": 3,
                        "rating": 2
                    }
                ],
                "place": 16,
                "delta": -6
            },
            {
                "outcomeId": "recPLkRzWfYsR3JLS",
                "previousTournamentPlace": 12,
                "teamId": "recq7xUDdmjx5Ngal",
                "teamName": "Феникс",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "E",
                        "groupPlace": 3,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "F",
                        "groupPlace": 3,
                        "rating": 2
                    }
                ],
                "place": 17,
                "delta": -5
            },
            {
                "outcomeId": "reccGz134BDtC2tMA",
                "previousTournamentPlace": 17,
                "teamId": "rec9nD4ARhpsgcvUU",
                "teamName": "Заря Крыма",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "G",
                        "groupPlace": 2,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "G",
                        "groupPlace": 2,
                        "rating": 2
                    }
                ],
                "place": 18,
                "delta": -1
            },
            {
                "outcomeId": "recVJNLDUKRVGPprz",
                "previousTournamentPlace": 21,
                "teamId": "recnTZ9QZUryBmf7E",
                "teamName": "Черноморец-2",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "G",
                        "groupPlace": 3,
                        "rating": 1
                    },
                    {
                        "tour": 2,
                        "group": "H",
                        "groupPlace": 1,
                        "rating": 3
                    }
                ],
                "place": 19,
                "delta": 2
            },
            {
                "outcomeId": "recAEeOfZhS9WONUE",
                "previousTournamentPlace": 27,
                "teamId": "recmS8BgTWn8QIpqc",
                "teamName": "Циркон",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "H",
                        "groupPlace": 3,
                        "rating": 1
                    },
                    {
                        "tour": 2,
                        "group": "I",
                        "groupPlace": 1,
                        "rating": 3
                    }
                ],
                "place": 20,
                "delta": 7
            },
            {
                "outcomeId": "recLGeSfzwqnrhKJn",
                "previousTournamentPlace": 24,
                "teamId": "recuchsORYh1p8mL5",
                "teamName": "Крафт",
                "rating": 4,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "I",
                        "groupPlace": 3,
                        "rating": 1
                    },
                    {
                        "tour": 2,
                        "group": "J",
                        "groupPlace": 1,
                        "rating": 3
                    }
                ],
                "place": 21,
                "delta": 3
            },
            {
                "outcomeId": "recIrqMfZlk84oAR3",
                "previousTournamentPlace": 8,
                "teamId": "rectlFHt9jokhoEon",
                "teamName": "Сурож",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "B",
                        "groupPlace": 3,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 22,
                "delta": -14
            },
            {
                "outcomeId": "rec7xGhm0PDA5kF55",
                "previousTournamentPlace": 9,
                "teamId": "recQCcUcWqfasbeAr",
                "teamName": "Бастион",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "C",
                        "groupPlace": 2,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 23,
                "delta": -14
            },
            {
                "outcomeId": "recDK9nDMelu3vrTm",
                "previousTournamentPlace": 23,
                "teamId": "recyw2f145WAJGLGx",
                "teamName": "Медведи",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "E",
                        "groupPlace": 2,
                        "rating": 3
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 24,
                "delta": -1
            },
            {
                "outcomeId": "recJebLX0j3LSNlTm",
                "previousTournamentPlace": 13,
                "teamId": "rec4KbD8N7XB3hmEA",
                "teamName": "Оникс",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "F",
                        "groupPlace": 3,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "G",
                        "groupPlace": 3,
                        "rating": 1
                    }
                ],
                "place": 25,
                "delta": -12
            },
            {
                "outcomeId": "recyOqb8p9xubmoe2",
                "previousTournamentPlace": 26,
                "teamId": "recMPmbwQFBKGVSoM",
                "teamName": "Ралли-поинт",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "H",
                        "groupPlace": 2,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "H",
                        "groupPlace": 3,
                        "rating": 1
                    }
                ],
                "place": 26,
                "delta": 0
            },
            {
                "outcomeId": "rectBnjlFf79fpEfE",
                "previousTournamentPlace": 28,
                "teamId": "recVLMP36y7NzwTFk",
                "teamName": "Таврия",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "I",
                        "groupPlace": 2,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "I",
                        "groupPlace": 3,
                        "rating": 1
                    }
                ],
                "place": 27,
                "delta": 1
            },
            {
                "outcomeId": "rec3K6ANjDbhgz57r",
                "previousTournamentPlace": 29,
                "teamId": "rec8BwgNp8nnHt1kw",
                "teamName": "Молния",
                "rating": 3,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "J",
                        "groupPlace": 2,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "J",
                        "groupPlace": 3,
                        "rating": 1
                    }
                ],
                "place": 28,
                "delta": 1
            },
            {
                "outcomeId": "recXsfOyG8FPeIqc7",
                "previousTournamentPlace": 11,
                "teamId": "recst39AJwl7Edi0c",
                "teamName": "Комус",
                "rating": 2,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "D",
                        "groupPlace": 3,
                        "rating": 2
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 29,
                "delta": -18
            },
            {
                "outcomeId": "rec456StTRIkmbpzU",
                "teamId": "recUZ9IN2r9brYDa6",
                "teamName": "Коралл",
                "rating": 2,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "K",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "J",
                        "groupPlace": 2,
                        "rating": 2
                    }
                ],
                "place": 30,
                "delta": null
            },
            {
                "outcomeId": "recN9mYSzA9nZjp82",
                "previousTournamentPlace": 25,
                "teamId": "recWxZUi2wubRzEsb",
                "teamName": "Динамит",
                "rating": 1,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "J",
                        "groupPlace": 3,
                        "rating": 1
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 31,
                "delta": -6
            },
            {
                "outcomeId": "recKgXNDXFx3oZoyB",
                "teamId": "recM6djz83jZzezYJ",
                "teamName": "7 пределов",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 32,
                "delta": null
            },
            {
                "outcomeId": "rec7n18nKOu7jNzIZ",
                "previousTournamentPlace": 31,
                "teamId": "recsucLBwtB8WNkC6",
                "teamName": "Карасуно",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "L",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 33,
                "delta": -2
            },
            {
                "outcomeId": "rec2pXCZZi7xGM1Hq",
                "previousTournamentPlace": 30,
                "teamId": "recMYX0UQ505TwwQL",
                "teamName": "Стрела",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "L",
                        "groupPlace": 2,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 34,
                "delta": -4
            },
            {
                "outcomeId": "reccotMvp4MevJQ0t",
                "teamId": "rec5bpX1gX6m9koGz",
                "teamName": "Шторм",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "P",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 35,
                "delta": null
            },
            {
                "outcomeId": "recGxpPuv28UwFEvL",
                "teamId": "recrlWD64QAqzpZ9O",
                "teamName": "ЭкоПик",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "P",
                        "groupPlace": 2,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 36,
                "delta": null
            },
            {
                "outcomeId": "recYmh3svEnhrJtip",
                "teamId": "recc8PkfQSTRuAKZg",
                "teamName": "Ортус",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "P",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 37,
                "delta": null
            },
            {
                "outcomeId": "recaUmAseRIIXQ09G",
                "teamId": "recoWmhWBQWh2jzRL",
                "teamName": "ФВМ+1",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "K",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "L",
                        "groupPlace": 1,
                        "rating": 0
                    }
                ],
                "place": 38,
                "delta": null
            },
            {
                "outcomeId": "recRdLQi6kuytJeDn",
                "teamId": "recoXc9lMlrWdFoOg",
                "teamName": "Омега",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "M",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "L",
                        "groupPlace": 2,
                        "rating": 0
                    }
                ],
                "place": 39,
                "delta": null
            },
            {
                "outcomeId": "recHRKgMQtf9DV2zw",
                "teamId": "rec8ZHRbPI4NNyGfL",
                "teamName": "Сплин",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "M",
                        "groupPlace": 2,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "L",
                        "groupPlace": 3,
                        "rating": 0
                    }
                ],
                "place": 40,
                "delta": null
            },
            {
                "outcomeId": "recD3O95D4waEfvZr",
                "teamId": "recbn6QHSm4wAfzbq",
                "teamName": "Атом",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "N",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "M",
                        "groupPlace": 1,
                        "rating": 0
                    }
                ],
                "place": 41,
                "delta": null
            },
            {
                "outcomeId": "recGuk5LIPJRNndgn",
                "teamId": "recoeMMLqnbFNAvIJ",
                "teamName": "Барс",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "N",
                        "groupPlace": 2,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "M",
                        "groupPlace": 2,
                        "rating": 0
                    }
                ],
                "place": 42,
                "delta": null
            },
            {
                "outcomeId": "rec4PJej0IAls59xz",
                "teamId": "recXu7MPHQpXpp5s1",
                "teamName": "Черноморец-3",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "O",
                        "groupPlace": 1,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "M",
                        "groupPlace": 3,
                        "rating": 0
                    }
                ],
                "place": 43,
                "delta": null
            },
            {
                "outcomeId": "rec6MuM9BMzFtm54S",
                "teamId": "reche4L2VLav89gU5",
                "teamName": "Некома",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "M",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "N",
                        "groupPlace": 1,
                        "rating": 0
                    }
                ],
                "place": 44,
                "delta": null
            },
            {
                "outcomeId": "recah7OBpDIHMoAEa",
                "teamId": "rec9GbvD9xEOe7ksG",
                "teamName": "Энель",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "O",
                        "groupPlace": 2,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "N",
                        "groupPlace": 2,
                        "rating": 0
                    }
                ],
                "place": 45,
                "delta": null
            },
            {
                "outcomeId": "rectg9SgQtVLh5cIF",
                "teamId": "recwRIDRji0gaA92X",
                "teamName": "Домино",
                "rating": 0,
                "withdraw": false,
                "tours": [
                    {
                        "tour": 1,
                        "group": "N",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "N",
                        "groupPlace": 3,
                        "rating": 0
                    }
                ],
                "place": 46,
                "delta": null
            },
            {
                "outcomeId": "rect5LrPvYj5lzWzU",
                "teamId": "rec9HmVM1YlrsaUR6",
                "teamName": "Хром",
                "rating": 0,
                "withdraw": true,
                "tours": [
                    {
                        "tour": 1,
                        "group": "K",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 47,
                "delta": null
            },
            {
                "outcomeId": "reclHClBWtWO4Ugow",
                "teamId": "reccEe7SloEGYhD9e",
                "teamName": "Штурм",
                "rating": 0,
                "withdraw": true,
                "tours": [
                    {
                        "tour": 1,
                        "group": "L",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 48,
                "delta": null
            },
            {
                "outcomeId": "recb59gXxu8QxTzye",
                "teamId": "rec7IAXxfzLtdhMsg",
                "teamName": "Карма",
                "rating": 0,
                "withdraw": true,
                "tours": [
                    {
                        "tour": 1,
                        "group": "O",
                        "groupPlace": 3,
                        "rating": 0
                    },
                    {
                        "tour": 2,
                        "group": "+",
                        "groupPlace": 0,
                        "rating": 0
                    }
                ],
                "place": 49,
                "delta": null
            }
        ]
    )
    t.pass();
});


