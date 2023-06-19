import test from 'ava';
import MockDistributionRepository from "../mock/mockDistribution.js";
import CsvRatingSaver from "./csvRatingSaver.js";

const ratingSaver = new CsvRatingSaver(true);
const mockDistribution = new MockDistributionRepository();

test('сохранение рейтинга в файл ./test-output/rating.csv', async t => {
    await ratingSaver.save({tournamentName: 'Весна 2022', fileName: './test-output/rating', maxFileRecords: 25},
        TEST_RATING_DATA,
        mockDistribution.getByTournamentAndTourDirect('recTBtRUiBwh3avjf', 3),
    )
    t.pass();
});
export const TEST_RATING_DATA = [
    {
        "outcomeId": "reck9wSE0EakpZfAf",
        "previousTournamentPlace": 5,
        "teamId": "recqVnYKZuF1ntaus",
        "teamName": "Матчбол",
        "rating": 15,
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
            },
            {
                "tour": 3,
                "group": "A",
                "groupPlace": 1,
                "rating": 6
            },
            {
                "tour": "Финал четырех",
                "group": "финал",
                "groupPlace": 1,
                "rating": 0
            },
            {
                "tour": "Финал четырех",
                "group": "полуфинал",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 1,
        "delta": 4
    },
    {
        "outcomeId": "recYto4FWGvC1oIKE",
        "previousTournamentPlace": 2,
        "teamId": "recuK9UUoDgHwZjtx",
        "teamName": "Легион",
        "rating": 13,
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
            },
            {
                "tour": 3,
                "group": "B",
                "groupPlace": 2,
                "rating": 4
            },
            {
                "tour": "Финал четырех",
                "group": "финал",
                "groupPlace": 2,
                "rating": 0
            },
            {
                "tour": "Финал четырех",
                "group": "полуфинал",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 2,
        "delta": 0
    },
    {
        "outcomeId": "recWQZYdnMSkDo2tD",
        "previousTournamentPlace": 3,
        "teamId": "recvVTKdXWnciSZGw",
        "teamName": "Мстители",
        "rating": 14,
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
            },
            {
                "tour": 3,
                "group": "A",
                "groupPlace": 3,
                "rating": 4
            },
            {
                "tour": "Финал четырех",
                "group": "за 3 место",
                "groupPlace": 1,
                "rating": 0
            },
            {
                "tour": "Финал четырех",
                "group": "полуфинал",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 3,
        "delta": 0
    },
    {
        "outcomeId": "recB726Lr4P2ouHYy",
        "previousTournamentPlace": 4,
        "teamId": "recbVX23uATCNyKyK",
        "teamName": "Спарта",
        "rating": 17,
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
            },
            {
                "tour": 3,
                "group": "A",
                "groupPlace": 2,
                "rating": 5
            },
            {
                "tour": "Финал четырех",
                "group": "за 3 место",
                "groupPlace": 2,
                "rating": 0
            },
            {
                "tour": "Финал четырех",
                "group": "полуфинал",
                "groupPlace": 4,
                "rating": 0
            }
        ],
        "place": 4,
        "delta": 0
    },
    {
        "outcomeId": "recnngpb7zWycrsrV",
        "previousTournamentPlace": 9,
        "teamId": "rec6sM213ay8zi1Wh",
        "teamName": "Бастион",
        "rating": 12,
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
                "group": "C",
                "groupPlace": 1,
                "rating": 4
            },
            {
                "tour": 3,
                "group": "B",
                "groupPlace": 1,
                "rating": 5
            }
        ],
        "place": 5,
        "delta": 4
    },
    {
        "outcomeId": "recNrEWvsN8kLXhj2",
        "previousTournamentPlace": 1,
        "teamId": "recM3xqIDZBc3QPVb",
        "teamName": "Легион-2",
        "rating": 11,
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
            },
            {
                "tour": 3,
                "group": "B",
                "groupPlace": 3,
                "rating": 3
            }
        ],
        "place": 6,
        "delta": -5
    },
    {
        "outcomeId": "rec2o7E4BwUFHp0Hf",
        "previousTournamentPlace": 14,
        "teamId": "recRfkd25mW7yB30H",
        "teamName": "Черноморец",
        "rating": 11,
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
            },
            {
                "tour": 3,
                "group": "C",
                "groupPlace": 1,
                "rating": 4
            }
        ],
        "place": 7,
        "delta": 7
    },
    {
        "outcomeId": "recADQVItwWSiokHF",
        "previousTournamentPlace": 6,
        "teamId": "recDueTMpnYpEPCEn",
        "teamName": "Алушта",
        "rating": 10,
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
                "group": "C",
                "groupPlace": 2,
                "rating": 3
            },
            {
                "tour": 3,
                "group": "C",
                "groupPlace": 2,
                "rating": 3
            }
        ],
        "place": 8,
        "delta": -2
    },
    {
        "outcomeId": "recHVqzvrFaRhmsDW",
        "previousTournamentPlace": 15,
        "teamId": "recjIHmMm9itasUMQ",
        "teamName": "Ахтиар",
        "rating": 10,
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
            },
            {
                "tour": 3,
                "group": "C",
                "groupPlace": 3,
                "rating": 2
            }
        ],
        "place": 9,
        "delta": 6
    },
    {
        "outcomeId": "recxcw9eVpCznBysb",
        "previousTournamentPlace": 18,
        "teamId": "recNnAMAYlFr9sLKx",
        "teamName": "Рейнджерс",
        "rating": 10,
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
                "group": "E",
                "groupPlace": 2,
                "rating": 3
            },
            {
                "tour": 3,
                "group": "E",
                "groupPlace": 2,
                "rating": 3
            }
        ],
        "place": 10,
        "delta": 8
    },
    {
        "outcomeId": "recYh0U465D6bvndT",
        "previousTournamentPlace": 8,
        "teamId": "recJbfPig3HiovrKd",
        "teamName": "Сурож",
        "rating": 9,
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
                "group": "C",
                "groupPlace": 3,
                "rating": 2
            },
            {
                "tour": 3,
                "group": "D",
                "groupPlace": 1,
                "rating": 4
            }
        ],
        "place": 11,
        "delta": -3
    },
    {
        "outcomeId": "recw2Q6SwdZ8DRS0F",
        "previousTournamentPlace": 7,
        "teamId": "recTnKsoPqtDGF0Wq",
        "teamName": "Импульс",
        "rating": 9,
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
            },
            {
                "tour": 3,
                "group": "D",
                "groupPlace": 2,
                "rating": 3
            }
        ],
        "place": 12,
        "delta": -5
    },
    {
        "outcomeId": "recTAJvsTYEsaCefc",
        "previousTournamentPlace": 23,
        "teamId": "recOmCnQbPfyQNy2n",
        "teamName": "Медведи",
        "rating": 9,
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
                "group": "E",
                "groupPlace": 1,
                "rating": 4
            },
            {
                "tour": 3,
                "group": "D",
                "groupPlace": 3,
                "rating": 2
            }
        ],
        "place": 13,
        "delta": 10
    },
    {
        "outcomeId": "recUjXRgY8RtqcbH9",
        "previousTournamentPlace": 19,
        "teamId": "reca3dphxXjU1cuCe",
        "teamName": "Продвижение",
        "rating": 9,
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
            },
            {
                "tour": 3,
                "group": "E",
                "groupPlace": 3,
                "rating": 2
            }
        ],
        "place": 14,
        "delta": 5
    },
    {
        "outcomeId": "rec5dxpi6595vFda4",
        "previousTournamentPlace": 20,
        "teamId": "recgomSw5rp2N39h1",
        "teamName": "Лукулл",
        "rating": 9,
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
            },
            {
                "tour": 3,
                "group": "F",
                "groupPlace": 2,
                "rating": 3
            }
        ],
        "place": 15,
        "delta": 5
    },
    {
        "outcomeId": "recaGVtobbYA1jVuC",
        "previousTournamentPlace": 10,
        "teamId": "recC56bX21zkNOFTs",
        "teamName": "ЧНГ",
        "rating": 8,
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
            },
            {
                "tour": 3,
                "group": "E",
                "groupPlace": 1,
                "rating": 4
            }
        ],
        "place": 16,
        "delta": -6
    },
    {
        "outcomeId": "rec1JZuuDkb5C4LJe",
        "previousTournamentPlace": 16,
        "teamId": "reci7qxy0zM33ZEl5",
        "teamName": "ЮБК",
        "rating": 8,
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
            },
            {
                "tour": 3,
                "group": "F",
                "groupPlace": 3,
                "rating": 2
            }
        ],
        "place": 17,
        "delta": -1
    },
    {
        "outcomeId": "rec5BUZo3ZhqYaw7I",
        "previousTournamentPlace": 12,
        "teamId": "recGX72sk6CvcU3wb",
        "teamName": "Феникс",
        "rating": 7,
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
            },
            {
                "tour": 3,
                "group": "G",
                "groupPlace": 1,
                "rating": 3
            }
        ],
        "place": 18,
        "delta": -6
    },
    {
        "outcomeId": "recwygKSC40v9e2cU",
        "previousTournamentPlace": 22,
        "teamId": "recnLEnHy4jiEYoyH",
        "teamName": "Астра",
        "rating": 7,
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
            },
            {
                "tour": 3,
                "group": "H",
                "groupPlace": 2,
                "rating": 2
            }
        ],
        "place": 19,
        "delta": 3
    },
    {
        "outcomeId": "recNoF5jfJf89ni0K",
        "teamId": "recCypB4LDL5DP4sD",
        "teamName": "Дивизион",
        "rating": 7,
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
            },
            {
                "tour": 3,
                "group": "I",
                "groupPlace": 2,
                "rating": 2
            }
        ],
        "place": 20,
        "delta": null
    },
    {
        "outcomeId": "recdiPWnNSYNlPdyX",
        "previousTournamentPlace": 11,
        "teamId": "recIjDhpQgE5Lk5m2",
        "teamName": "Комус",
        "rating": 6,
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
                "group": "E",
                "groupPlace": 3,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "F",
                "groupPlace": 1,
                "rating": 4
            }
        ],
        "place": 21,
        "delta": -10
    },
    {
        "outcomeId": "recsw99SblWrJ9g8q",
        "previousTournamentPlace": 17,
        "teamId": "recpddcpY1IqnjigK",
        "teamName": "Заря Крыма",
        "rating": 6,
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
            },
            {
                "tour": 3,
                "group": "G",
                "groupPlace": 2,
                "rating": 2
            }
        ],
        "place": 22,
        "delta": -5
    },
    {
        "outcomeId": "recZ4LTM73mJZU8fc",
        "previousTournamentPlace": 13,
        "teamId": "reckALLXURgzao90q",
        "teamName": "Оникс",
        "rating": 6,
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
            },
            {
                "tour": 3,
                "group": "H",
                "groupPlace": 1,
                "rating": 3
            }
        ],
        "place": 23,
        "delta": -10
    },
    {
        "outcomeId": "recOE0jXwTQsitbAS",
        "previousTournamentPlace": 26,
        "teamId": "rec2FWjlXpUIN2FKC",
        "teamName": "Ралли-поинт",
        "rating": 6,
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
            },
            {
                "tour": 3,
                "group": "I",
                "groupPlace": 1,
                "rating": 3
            }
        ],
        "place": 24,
        "delta": 2
    },
    {
        "outcomeId": "recbznTs1uaTNWcNp",
        "previousTournamentPlace": 21,
        "teamId": "recDJzhF6EKwIt2tu",
        "teamName": "Черноморец-2",
        "rating": 5,
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
            },
            {
                "tour": 3,
                "group": "G",
                "groupPlace": 3,
                "rating": 1
            }
        ],
        "place": 25,
        "delta": -4
    },
    {
        "outcomeId": "recQuOW461b73VAgu",
        "previousTournamentPlace": 27,
        "teamId": "recCIIJ50GG6XPcM2",
        "teamName": "Циркон",
        "rating": 5,
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
            },
            {
                "tour": 3,
                "group": "H",
                "groupPlace": 3,
                "rating": 1
            }
        ],
        "place": 26,
        "delta": 1
    },
    {
        "outcomeId": "rec1wO04GgJlyox5d",
        "previousTournamentPlace": 24,
        "teamId": "recK2RADYIAZwf97V",
        "teamName": "Крафт",
        "rating": 5,
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
            },
            {
                "tour": 3,
                "group": "I",
                "groupPlace": 3,
                "rating": 1
            }
        ],
        "place": 27,
        "delta": -3
    },
    {
        "outcomeId": "recJrXraMZq7mwrBu",
        "previousTournamentPlace": 28,
        "teamId": "recbBmXSdiqLGDG1a",
        "teamName": "Таврия",
        "rating": 5,
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
            },
            {
                "tour": 3,
                "group": "J",
                "groupPlace": 2,
                "rating": 2
            }
        ],
        "place": 28,
        "delta": 0
    },
    {
        "outcomeId": "recndBgcRyN5qUm4P",
        "previousTournamentPlace": 31,
        "teamId": "recIkMTqDdU63U7YW",
        "teamName": "Карасуно",
        "rating": 3,
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
                "group": "K",
                "groupPlace": 1,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "J",
                "groupPlace": 1,
                "rating": 3
            }
        ],
        "place": 29,
        "delta": 2
    },
    {
        "outcomeId": "recjAGICqnufnGSth",
        "previousTournamentPlace": 29,
        "teamId": "recor6oCwSGlOAOGm",
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
            },
            {
                "tour": 3,
                "group": "K",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 30,
        "delta": -1
    },
    {
        "outcomeId": "reckVG0i0B1iticVK",
        "teamId": "recaPJQC9bs9y5qwW",
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
            },
            {
                "tour": 3,
                "group": "J",
                "groupPlace": 4,
                "rating": 0
            }
        ],
        "place": 31,
        "delta": null
    },
    {
        "outcomeId": "rec3ZW6HGksl6qcuS",
        "previousTournamentPlace": 25,
        "teamId": "reccnz279gN9YGrO1",
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
                "group": "K",
                "groupPlace": 3,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "L",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 32,
        "delta": -7
    },
    {
        "outcomeId": "recqKWIhlB1G4XNvw",
        "teamId": "recEMWpLIAff9qmdB",
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
            },
            {
                "tour": 3,
                "group": "K",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 33,
        "delta": null
    },
    {
        "outcomeId": "recifxKO62qvNTO3g",
        "previousTournamentPlace": 30,
        "teamId": "rec2Ox8JXPj30DjcB",
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
                "group": "K",
                "groupPlace": 2,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "K",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 34,
        "delta": -4
    },
    {
        "outcomeId": "rec73lY7d4NwAQ1Zd",
        "teamId": "recENMhaT5KUkMba6",
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
            },
            {
                "tour": 3,
                "group": "L",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 35,
        "delta": null
    },
    {
        "outcomeId": "recTTohUKOP8Lmilh",
        "teamId": "recrdGYwZ6nuHmmxg",
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
            },
            {
                "tour": 3,
                "group": "L",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 36,
        "delta": null
    },
    {
        "outcomeId": "recXHkoBXdy7K2PVm",
        "teamId": "recoPhZ0WsnLUFtBB",
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
            },
            {
                "tour": 3,
                "group": "M",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 37,
        "delta": null
    },
    {
        "outcomeId": "recWkUdAPz2PUu0Cd",
        "teamId": "recE4mUAx7uDUHi4z",
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
            },
            {
                "tour": 3,
                "group": "M",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 38,
        "delta": null
    },
    {
        "outcomeId": "recmC4UYIwSDAtSqI",
        "teamId": "recx4ETR2vttfg3gV",
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
            },
            {
                "tour": 3,
                "group": "M",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 39,
        "delta": null
    },
    {
        "outcomeId": "reckFjm87sTjzcWTp",
        "teamId": "recdkHUEOAIVwwSOR",
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
            },
            {
                "tour": 3,
                "group": "N",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 40,
        "delta": null
    },
    {
        "outcomeId": "recJ6J05XdeJocZ4v",
        "teamId": "recMHiLGq2jehHWoN",
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
            },
            {
                "tour": 3,
                "group": "N",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 41,
        "delta": null
    },
    {
        "outcomeId": "recq7HWqwn1FTvn00",
        "teamId": "recpwLDsghXMle7Ow",
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
            },
            {
                "tour": 3,
                "group": "N",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 42,
        "delta": null
    },
    {
        "outcomeId": "rec06xVs4pQ1v6bUr",
        "teamId": "rec2WNrofNCXGlmkz",
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
            },
            {
                "tour": 3,
                "group": "O",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 43,
        "delta": null
    },
    {
        "outcomeId": "recse3UkwO5cCQDmj",
        "teamId": "recl1Z5QnHpkgrb2p",
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
                "group": "O",
                "groupPlace": 3,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "O",
                "groupPlace": 2,
                "rating": 0
            }
        ],
        "place": 44,
        "delta": null
    },
    {
        "outcomeId": "recWnZXjCMrSDMrRB",
        "teamId": "recHbwLVbAToGwMvE",
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
                "group": "O",
                "groupPlace": 3,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "O",
                "groupPlace": 3,
                "rating": 0
            }
        ],
        "place": 45,
        "delta": null
    },
    {
        "outcomeId": "rececRbhCoGfyQgEf",
        "teamId": "recsYps4XCcPBHxl6",
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
                "group": "O",
                "groupPlace": 3,
                "rating": 0
            },
            {
                "tour": 3,
                "group": "P",
                "groupPlace": 1,
                "rating": 0
            }
        ],
        "place": 46,
        "delta": null
    },
    {
        "outcomeId": "recJVlzECIC3sGJVK",
        "teamId": "recpxW3B8IEpzhHdW",
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
                "group": null,
                "groupPlace": 0,
                "rating": null
            },
            {
                "tour": 3,
                "group": null,
                "groupPlace": 0,
                "rating": null
            }
        ],
        "place": 47,
        "delta": null
    },
    {
        "outcomeId": "recBxctq3dfMb13Km",
        "teamId": "recsuOfHs8XE5oqv4",
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
                "group": null,
                "groupPlace": 0,
                "rating": null
            },
            {
                "tour": 3,
                "group": null,
                "groupPlace": 0,
                "rating": null
            }
        ],
        "place": 48,
        "delta": null
    },
    {
        "outcomeId": "recrVJoMEerOE0mU4",
        "teamId": "recnya5mmj4rkozO6",
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
                "group": null,
                "groupPlace": 0,
                "rating": null
            },
            {
                "tour": 3,
                "group": null,
                "groupPlace": 0,
                "rating": null
            }
        ],
        "place": 49,
        "delta": null
    }];
