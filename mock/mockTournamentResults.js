import {clone} from "../utils.js";
import {minify} from "../repositories/tournamersResultsRepository.js";

export default class MockTournamentResultsRepository {
    #data

    constructor() {
        this.reset();
    }

    reset = () => this.#data = this.#initialData();

    #initialData = () => clone(tournamentResults).map(p => minify(p));

    getAllRecords = () => this.#data;

    getByTournament = tournamentId => Promise
        .resolve(this.#data.filter(r => r.tournamentId === tournamentId))
}

const tournamentResults = [
    {
        "id": "reclhsYWkkw4hnUCI",
        "createdTime": "2022-08-22T09:21:36.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recV5nUenQAEGrXcU"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recnHYLhyq6QqzIBW",
                "reciovAgxQqAijyk0",
                "recp8kUm0JJ9mtLAK",
                "recsGhvA8zFKv0mA2",
                "recNSD5sN0NsCCTpS",
                "recjhewuCiOfovX0a",
                "recOI2ybarKvTNdXv",
                "recPIgry6Cpbwfo0N"
            ],
            "Name": "Осень 2022: Спарта",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Спарта"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recG0pQog2zmwhf7N",
        "createdTime": "2022-08-22T09:21:35.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recf5jCoQc4ebLckG"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recHnYXInnBY5m7Fe",
                "rec9Q4Vk9TT3RC9Lu",
                "recQ7fKINENQx9xzE",
                "rech91S0VnLZICkIi",
                "recVklp2dk2r0IInp",
                "recwg6BnPRRSPwEzp",
                "rec2zwZ5o7gbZAaVS"
            ],
            "Name": "Осень 2022: Мстители",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Мстители"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recxB4OGl3PmEQuXc",
        "createdTime": "2022-08-22T09:21:34.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recwdXiTwfieWJ2zl"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recIHP3HsRBwgXRZK",
                "recfnT73YmtGe8mdE",
                "recgab4k518JrlCMt",
                "recEfws1SXkGx6AKK",
                "receoFp9S1E8FrKu0",
                "recV4SsBJV6qL2zBy",
                "rec7KCJRwbSGKdVVN",
                "rec52yF3h3cECvfvs",
                "recfI5U0JFo51HLlq"
            ],
            "Name": "Осень 2022: Легион-2",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Легион-2"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recIDOWQPWcEUhVoO",
        "createdTime": "2022-08-22T09:21:33.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "receUzM5hTXJpSw7H"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recmKH5piTyIcQ9Z9",
                "recQQ0CDSuWZi9JJe",
                "rec7daTrZd9cGb7rx",
                "rec7STFkbLwlAedmF",
                "reclN9uAbirSame7x",
                "recTqI8JZgAV6Wzvg",
                "recCfKzRdE90lNnXA",
                "recVWIxkreSnVHZSE"
            ],
            "Name": "Осень 2022: Легион",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Легион"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec4jWKPTURmiSsep",
        "createdTime": "2022-08-22T09:21:32.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "reca5NQVSKm3gmn8C"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recqrrs3B2rmwrAjc",
                "rec8utOThiyuA7Ncc",
                "recHafMXng5v6ZD3N",
                "recrn83aqtuQV01p1",
                "rec57Urvr32vTihd8",
                "recCdZ5cJf6pkqyh6",
                "rec46wKOn3AO10xib"
            ],
            "Name": "Осень 2022: Матчбол",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Матчбол"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recIrqMfZlk84oAR3",
        "createdTime": "2022-08-22T09:21:31.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rectlFHt9jokhoEon"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recWqgWjfZMugoOH9",
                "recDJK01jQTTvrdNv",
                "recMNZEenOzRC7Zn5",
                "recLKfQHC9767Q1XE",
                "recWscE5HOcr02UIx",
                "rec136Swl7LJCURaB",
                "recYBoTk5WYxbPg6Z"
            ],
            "Name": "Осень 2022: Сурож",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Сурож"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recMyxwfuMBHAidlp",
        "createdTime": "2022-08-22T09:21:30.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recBpK5dYCD9rugER"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec2RKrlHCYqJQqoO",
                "recOgXwiw1OJCcoXq",
                "recXNwRsMjpOHBfZa",
                "receEvRbEQ38N5oTi",
                "recroh5jbGAHoo6VK",
                "recKVqnxW2IsoQy7A",
                "recgR9ecFUmGycvwI"
            ],
            "Name": "Осень 2022: Черноморец",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Черноморец"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recUQllz4rFCUc88M",
        "createdTime": "2022-08-22T09:21:29.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recmfw38VhgmGHSxC"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recovhTGHUMwnGx02",
                "recbwSyMJbSTrFJk7",
                "rec3AaQHPFZMhXHo3",
                "recVqvrddjPOZMhSV",
                "recFg0IHoSgy9JnGa",
                "recKdJ8dxOERWcpg1",
                "recL6TpPCi5WaSwCq",
                "rec9WjRnZPzipEEAo",
                "recAdxl0umff67XfI"
            ],
            "Name": "Осень 2022: ЧНГ",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "ЧНГ"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec7xGhm0PDA5kF55",
        "createdTime": "2022-08-22T09:21:29.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recQCcUcWqfasbeAr"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rechimSbrySy6Ywpm",
                "recm2DmppLtU3vbLI",
                "recjhuGUW2ESk3SL3",
                "rechAbEstOR6Ull17",
                "recc346UHdwmJzteO",
                "recEDlEpdXbQsbkpL",
                "recdSNPV11ACG2wFz",
                "recX7kiEVD8HVpiFn"
            ],
            "Name": "Осень 2022: Бастион",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Бастион"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recXsfOyG8FPeIqc7",
        "createdTime": "2022-08-22T09:21:28.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recst39AJwl7Edi0c"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recp5eDVN0ld0FXV1",
                "recAjKcfynThYPtf3",
                "rectSGwkQfNGYfgU7",
                "rec4mOLvxMMrGmsWv",
                "recJjYNrP20nJGzxG",
                "recpOqNP9tKn1oJdw"
            ],
            "Name": "Осень 2022: Комус",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Комус"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "reckNgNTmMDUbhxlP",
        "createdTime": "2022-08-22T09:21:26.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recnEELXiDFrxIPix"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recbYUDtR0kYRbx3W",
                "recOU4nbakE5i0uSG",
                "recRPDjHFM2Ahsyr7",
                "recDp0ZQODD3ZsID7",
                "rec4VrsjgRVPl3fyG",
                "recEE7yxHqygm491V",
                "recXegQeZenrQWnLg",
                "recarfoKShMji6em6"
            ],
            "Name": "Осень 2022: Алушта",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Алушта"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recgcgY3ptGawK5EP",
        "createdTime": "2022-08-22T09:21:25.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recDxakzIGaFzydAA"
            ],
            "Результат (место)": 0,
            "Состав": [
                "reciVoArE6O1M5wie",
                "recptX35uujL19zUO",
                "rec2iq51Uxk4Ljz4M",
                "recF0VmYOu8LUUCiy",
                "recCRYf6Tp7S1JDwc",
                "recv1y5UH53LOpbFm",
                "recJhj8gCdbhFueNY"
            ],
            "Name": "Осень 2022: Импульс",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Импульс"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recr5QrGkVRTafFh6",
        "createdTime": "2022-08-22T09:21:24.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec3S7eXfpZv3l7q0"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recZFgAwjN7LNN6JQ",
                "reco9azEBSid5YtFS",
                "reclRD7OysahN4YZy",
                "recTUgsEKCUMckYuF",
                "rect6FO5OqVknhoFS",
                "reclpilUXFQlfxbdQ",
                "recw7cgc9VomySSt2",
                "recxkMZWuXwLI1jZY",
                "rec9dSXBW5L4v2RNr"
            ],
            "Name": "Осень 2022: Ахтиар",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Ахтиар"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recPLkRzWfYsR3JLS",
        "createdTime": "2022-08-22T09:21:22.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recq7xUDdmjx5Ngal"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recd4JiSGGDAroDrI",
                "recTifu5PLz4giQ5m",
                "recKE4MOV3XaVnVDG",
                "recVkXYZLNDr8Tog6",
                "rechjFjDoJocN6aK1",
                "recPLRLJu6DV8xT8n",
                "rec6jvA9CyXipgOdR",
                "recCLIHV9kGqc3ZlP",
                "reclvenpp0SIfLr64",
                "recLVv0nWynUBdIpU"
            ],
            "Name": "Осень 2022: Феникс",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Феникс"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recDK9nDMelu3vrTm",
        "createdTime": "2022-08-22T09:21:21.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recyw2f145WAJGLGx"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recL1IslYBQ2QLno9",
                "recmEoEFr8ecspola",
                "rec5GBN4puDKppUBP",
                "recq08x0mxvt2knYk",
                "rec3YgRUFqCxTKncL",
                "recOzavpGfUFNORGj",
                "reczS0Hgmc7jWgsDn"
            ],
            "Name": "Осень 2022: Медведи",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Медведи"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recLTpmFwAS7vXYno",
        "createdTime": "2022-08-22T09:21:20.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec2hQpJTPt5WSRZf"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec0WsDIF0LXauZLF",
                "recCgyXzRPyt9IVMb",
                "recxnzHJmPlOQGYJH",
                "reckjk4rg62hxEOHM",
                "recuyF2qzNPU9K4XF",
                "recj0CBWm7T5GrUM5",
                "recVfk5t3IN22g71q",
                "recDphDzMAgpnqCSo",
                "recmT54ZMufx2DESO",
                "recXipO5dLnlJ9fV6",
                "recqU0pVPwylrK0qM"
            ],
            "Name": "Осень 2022: ЮБК",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "ЮБК"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recJebLX0j3LSNlTm",
        "createdTime": "2022-08-22T09:21:17.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec4KbD8N7XB3hmEA"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec0vNxHosoSbSKXT",
                "recF9AZpRxbd4s2up",
                "recnAPX1ustNn4u5R",
                "rec7YvMCkrKdXX9gN",
                "recMcNAkIYXuKMA1W",
                "reca3n7PeDqjea76I",
                "recpS1YkOKn1UPChQ",
                "recY0d1xwKkNaZ2IQ"
            ],
            "Name": "Осень 2022: Оникс",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Оникс"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rechmW1pOFjBguL6l",
        "createdTime": "2022-08-22T09:21:19.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recxx0ELRBmt2lYoH"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recDH8lPWv5egcHwd",
                "recikR7eBhLIhRHXe",
                "recHpvuOhfi4SkAys",
                "recpF728hHxTU7V8S",
                "recMTYsJeFxOxcBw1",
                "recQwPmUg9WUSHVPW",
                "recLSeNgvjWm4abYn",
                "recxlubliJCqNMy6x",
                "recHQW7rnRHykzjE1",
                "recDVmwfD5FzsXBzO"
            ],
            "Name": "Осень 2022: Рейнджерс",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Рейнджерс"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "reccGz134BDtC2tMA",
        "createdTime": "2022-08-22T09:21:18.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec9nD4ARhpsgcvUU"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recZhgeM8fM55lByl",
                "recSg0mjgckOaEmpD",
                "recUuurVWAYDwNRy6",
                "recQo8Lgz7nmAEGn8",
                "recIMNEU5cvZiZIDZ",
                "rechE9PzJIjMvxH9a",
                "recgJm2MAemmc7kTk",
                "recEkwqsnucwkiYC1"
            ],
            "Name": "Осень 2022: Заря Крыма",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Заря Крыма"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recEtnJrRoyvj5olj",
        "createdTime": "2022-08-22T09:21:16.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recUdDhsqd0WU5Hgo"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec7N70GxzWr5eCne",
                "rec3OBTsgmeJioeJl",
                "recoM4tIF1oNwAzvz",
                "recnfdIvBKQiv2vRN",
                "recrajFLH37x9dLX9",
                "recOGoWO78tvCQFZL",
                "recL7EPDRZtwlXtr3"
            ],
            "Name": "Осень 2022: Продвижение",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Продвижение"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recVJNLDUKRVGPprz",
        "createdTime": "2022-08-22T09:21:15.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recnTZ9QZUryBmf7E"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recdk9Z6emG7QfApZ",
                "recYvpq4HT7UyH0HK",
                "reczdcfMuAMg7Ddl9",
                "recvwj71VKvxBMijG",
                "recpL8tCAjlZBZNju",
                "recy8VCEmPSEYbgGL",
                "recfhJvwdnaMrOMXR",
                "recv7UIPiEftY5LVo",
                "recUcRJ9zEaLteDGq",
                "recutYkLErx83k9UK",
                "recCqleFaWKcaeMwN",
                "rec9JZeqq9ikbZPaX",
                "recHt0t7Wi1736Pio"
            ],
            "Name": "Осень 2022: Черноморец-2",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Черноморец-2"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recPnXhtZlQ7oyqOe",
        "createdTime": "2022-08-22T09:21:14.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec0yMKHYH64GWmVb"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recqzEVRNPLKW4YWf",
                "recHiowOqgg6wQrKj",
                "recqYUbEW9Sguo1yZ",
                "recBoDomY1a59oCZO",
                "recVVr5iop8yXjvxs",
                "recse5s40Pr0p8HrO",
                "recsmiHylWSOL8nQD",
                "reckc5MH4FJQug6oa",
                "recKsxjWyzzfCRTKY"
            ],
            "Name": "Осень 2022: Лукулл",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Лукулл"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recyOqb8p9xubmoe2",
        "createdTime": "2022-08-22T09:21:13.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recMPmbwQFBKGVSoM"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recE8GohMS6rjt0Xg",
                "recb7m1lZmt5gSMec",
                "rech1yn8pFsHaaITe",
                "rec5LF3gMaztJlpu5",
                "recpT7yu4av5pOdGB",
                "recnUNmGSrmkZBxHG",
                "recPfqfu7jnVsrI5v",
                "receLONUJ2LgINSyL",
                "recbhgkQwvsuu32UW"
            ],
            "Name": "Осень 2022: Ралли-поинт",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Ралли-поинт"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recAEeOfZhS9WONUE",
        "createdTime": "2022-08-22T09:21:12.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recmS8BgTWn8QIpqc"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recfDxndXsjMCBm3U",
                "recdtlMDNPZ1SWcUY",
                "recBMNae1qM6eZ1sv",
                "reciANXOeJrcXMYKs",
                "reczVMG5ovuHljeSk",
                "recY82WfsfJSIlFZW",
                "rec2QvSSZt92UF5r1",
                "recAepczgfMGysiLY",
                "recULHbXaLecMtzUs",
                "recWXL4rp30uQQo2A",
                "recSWROiIBKXIRmsq",
                "rec2IdUJUejK1YFZW"
            ],
            "Name": "Осень 2022: Циркон",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Циркон"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recgIGC3vkHx27fQ4",
        "createdTime": "2022-08-22T09:21:07.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec7V4fSrk0kxRBcR"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec88ko2bOqbFFYAe",
                "rec3cj1nAt9ys4kyi",
                "reckGEiqZ9euDjJgb",
                "reck5fTE5bR2ONu6Z",
                "rec03hRx2UvyWNoQ4",
                "recGQFOjrBudzcMRd",
                "rec44zSPo4AStwnws",
                "rec7XQR0LveJcH1t1",
                "recy1gn0RNidEIq7s",
                "recJb6ZCWuIzj72Hy"
            ],
            "Name": "Осень 2022: Астра",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Астра"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recLGeSfzwqnrhKJn",
        "createdTime": "2022-08-22T09:21:06.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recuchsORYh1p8mL5"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recEZ2Fua4CgE6a9V",
                "recNOC668G7KilMkf",
                "recb1Msf18VU3MLdv",
                "recpTFU7SbggAlsGV",
                "recpnrFzS1zY8Si7Q",
                "recsutx8Gz8E1XmWL",
                "recAB8oSuOiEzpZFl",
                "recwR4kmPyCtJkqvU",
                "recfL9qYGJM2Tm8RF",
                "recMvpXvckKiK9i7Q",
                "recJfOSAFbn6q66A9",
                "rec3z28GbMP67Eglx"
            ],
            "Name": "Осень 2022: Крафт",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Крафт"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rectBnjlFf79fpEfE",
        "createdTime": "2022-08-22T09:21:05.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recVLMP36y7NzwTFk"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recNfVr5nCARd7DT7",
                "recz8iEq5yN44vA4I",
                "rec5nLi1I84G3IT3X",
                "recJzfu2hfGxS5C9O",
                "recirqmRv5sLmo5SH",
                "recBIjeH8KU3IEhGd",
                "rechsqSflmETQ41Vb",
                "recrC0NbAfD5dWoAL",
                "recmEQypmSBvFyalw",
                "recX8vnjiG0klehWM",
                "recf5ROLVZiH1iGrS"
            ],
            "Name": "Осень 2022: Таврия",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Таврия"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec3K6ANjDbhgz57r",
        "createdTime": "2022-08-22T09:21:04.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec8BwgNp8nnHt1kw"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rechXu4q7UmDNOUMD",
                "recGuq1EMAxZmFKfd",
                "recaZecTzzvtYFq7U",
                "rec71t90PPfhVLHGf",
                "recQgGhyJFy2AW8ZS",
                "recWgyrXfU0BKkwgl",
                "recrR6eGy3Hj7L8bc",
                "rec6QsdBynAmR3UOu",
                "rec3kEdiMRV4ogJaf",
                "recYu0j86EfWonTgc",
                "rec8I2Kio8xjMK86j"
            ],
            "Name": "Осень 2022: Молния",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Молния"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recN9mYSzA9nZjp82",
        "createdTime": "2022-08-22T09:21:03.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recWxZUi2wubRzEsb"
            ],
            "Результат (место)": 0,
            "Состав": [
                "rec3GlQGjqyXBIQiC",
                "recKF5kxuHb60RW6I",
                "recj1TolIKHzcUiIi",
                "rec0KeN8d6rxkbWCi",
                "recsE85MBjscdjbXQ",
                "recVN4ehhgjeKKOlO",
                "recOc7FrPAEVGU0n7"
            ],
            "Name": "Осень 2022: Динамит",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Динамит"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recxy5Xu8ZWa2gvEU",
        "createdTime": "2022-08-22T09:21:03.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recmIPtfETs7wIh6N"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recpvMkIkve2xEXHg",
                "rec9o7MZvL3GR60GD",
                "rec7rIECQJRR4AkAz",
                "reciTzF8j8kMmPfH5",
                "recMTyZ8Ur8bvWUcH",
                "recrKkgiVeZj1MV6y",
                "recDPQG6t8rc7M10l",
                "recQcxZ7nY1ax62Vy"
            ],
            "Name": "Осень 2022: Дивизион",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Дивизион"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rect5LrPvYj5lzWzU",
        "createdTime": "2022-08-22T09:21:02.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec9HmVM1YlrsaUR6"
            ],
            "Результат (место)": 0,
            "Name": "Осень 2022: Хром",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Хром"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recaUmAseRIIXQ09G",
        "createdTime": "2022-08-22T09:21:01.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recoWmhWBQWh2jzRL"
            ],
            "Результат (место)": 0,
            "Состав": [
                "reclSEhuX97MyyXFF",
                "recOvtDUml16oLxt4",
                "recV8P7OXYVE9sAgJ",
                "recU0eGyqO38kEDb4",
                "recnB7YV5ju7m5zJ4",
                "recTeo6DJsRZIjdGp",
                "recY4ev8KWg5RLNKl",
                "reclqDgFFg9uRR5KD"
            ],
            "Name": "Осень 2022: ФВМ+1",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "ФВМ+1"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec456StTRIkmbpzU",
        "createdTime": "2022-08-22T09:21:00.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recUZ9IN2r9brYDa6"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recpzdvOqREhe2h8b",
                "rec60C1VRsxcaljZ3",
                "rec8wyZrr1MDxHAxE",
                "rect7ttstpq9uLRxk",
                "recGpAKoRON45vkSh",
                "recOyrJrVFQey72Wa",
                "recM70Nyu34dOWqa3"
            ],
            "Name": "Осень 2022: Коралл",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Коралл"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "reclHClBWtWO4Ugow",
        "createdTime": "2022-08-22T09:21:00.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "reccEe7SloEGYhD9e"
            ],
            "Результат (место)": 0,
            "Name": "Осень 2022: Штурм",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Штурм"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec7n18nKOu7jNzIZ",
        "createdTime": "2022-08-22T09:20:59.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recsucLBwtB8WNkC6"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recd4r8XQBiOirL0h",
                "recUvuwCMsmI14VDh",
                "recP8pfvRTlKmpHJd",
                "recTNLe6B2VYCLOvU",
                "recpEVx6uxuWkM8OL",
                "recvCeyr6yNFqfigh",
                "recAoh4f9qcpyE50j"
            ],
            "Name": "Осень 2022: Карасуно",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Карасуно"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec2pXCZZi7xGM1Hq",
        "createdTime": "2022-08-22T09:20:58.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recMYX0UQ505TwwQL"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recOiNxqKCWfMB7T7",
                "rec5jLCfzdeMO1n5p",
                "rechc4Lh21NiXirDG",
                "recLHFmRbeGDkxKWP",
                "recg9FqbiiJQrv0p2",
                "recwcPi0n5nzvNloK"
            ],
            "Name": "Осень 2022: Стрела",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Стрела"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recHRKgMQtf9DV2zw",
        "createdTime": "2022-08-22T09:20:57.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec8ZHRbPI4NNyGfL"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recqDtnxl57u6lA9b",
                "reczg8sIWubXLjkkd",
                "recVlUsqp4tUUN2Rr",
                "recB0EI6x9jrNkzv2",
                "recv4I7v7sAybHAUZ",
                "rec9rcqfa6STP5Er5",
                "recZ9t5qE0UtTRrb4",
                "recXyCk6u5Yu2Qt6l",
                "rec3x6BdcTTU0Tq9X",
                "recbG2TxU6rb3VPke"
            ],
            "Name": "Осень 2022: Сплин",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Сплин"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec6MuM9BMzFtm54S",
        "createdTime": "2022-08-22T09:20:56.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "reche4L2VLav89gU5"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recGoDAaokH9bjySQ",
                "recD4RhIvrSDkVHq1",
                "recgrX71MaR4EnFG0",
                "recZR7zKKJHUYfrAU",
                "recPJgiCPT4nTRHIL",
                "recrFy0WUmPgnSSkJ",
                "rec8LcnGyhCoSAoZW",
                "recEeknFOlHDqxpZd"
            ],
            "Name": "Осень 2022: Некома",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Некома"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recRdLQi6kuytJeDn",
        "createdTime": "2022-08-22T09:20:55.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recoXc9lMlrWdFoOg"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recmDppOXk6w1BwcS",
                "rec5TJ9lvlVWTQhWe",
                "recuEbUrFl4RLE9lD",
                "reckcaGbbUnhgeYFU",
                "recJ7qTjnDhRWEeTD",
                "receIMbcBXPD6EJWs",
                "rec89ulXJR0y771x5",
                "recTzQwHRZlRSyaHS",
                "recFtJ3iIyqUQkUAv"
            ],
            "Name": "Осень 2022: Омега",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Омега"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rectg9SgQtVLh5cIF",
        "createdTime": "2022-08-22T09:20:55.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recwRIDRji0gaA92X"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recsaMJ2GtIQw54oS",
                "rec4fxt9l7v4uTxkL",
                "rec1FkEXyXIbnfD7x",
                "recudKy5w9Sj3F5Vk",
                "recxDdWx83nYvZGiz",
                "recgaFsjom1UhmlW6",
                "rechj6ZuXuZR6u4D2",
                "recG3BxJKxLajgGio",
                "rec4yumRncmol6hDy"
            ],
            "Name": "Осень 2022: Домино",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Домино"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recGuk5LIPJRNndgn",
        "createdTime": "2022-08-22T09:20:54.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recoeMMLqnbFNAvIJ"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recRpVMOR2Y4NUAyS",
                "recZndx5Ubt1LoXGs",
                "recvSSrqfWu8cJDfd",
                "recfDx9bYwVPNCAkA",
                "recyjsjO0RwHpmJhq",
                "recNRndQli59ZxTla",
                "rec2CyEUyO6yLeNKQ",
                "rect2mTV77qACPxdK",
                "rechxkCqFPtLAbErB",
                "reclWqDZ9gBU50ec4"
            ],
            "Name": "Осень 2022: Барс",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Барс"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recD3O95D4waEfvZr",
        "createdTime": "2022-08-22T09:20:53.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recbn6QHSm4wAfzbq"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recftNDajFuiPAotv",
                "rec18CAUldBZo4k7G",
                "recx4j8OBiflAaG89",
                "reci8T0YnGzplYQnP",
                "recId7gbYz4c7rmAd",
                "recXra5YwIYfXMweS",
                "recUqCjNY7KXKVXIH",
                "recVPA3xrPZlAn6et",
                "recJvSs4uTmT2yP3Q",
                "recRLcZuOcKlOjzex"
            ],
            "Name": "Осень 2022: Атом",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Атом"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recb59gXxu8QxTzye",
        "createdTime": "2022-08-22T09:20:52.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec7IAXxfzLtdhMsg"
            ],
            "Результат (место)": 0,
            "Name": "Осень 2022: Карма",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Карма"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recah7OBpDIHMoAEa",
        "createdTime": "2022-08-22T09:20:51.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec9GbvD9xEOe7ksG"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recmccfKoGPhNTsFG",
                "recCkBy8X1ZJBQnIv",
                "recVfZXI3Ee959Hzp",
                "recpXZygoN6AlGuJ6",
                "rech764LISiQUaXq5",
                "recDj4pe2nnF3Qw63"
            ],
            "Name": "Осень 2022: Энель",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Энель"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "rec4PJej0IAls59xz",
        "createdTime": "2022-08-22T09:20:51.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recXu7MPHQpXpp5s1"
            ],
            "Результат (место)": 0,
            "Состав": [
                "reccTUm9sG3TYO22S",
                "recQBUAteiwKUMFza",
                "receXnmgzD3QBXG8D",
                "recxMxTQzGaBSR7JV",
                "recvWcLQgzZLObtTr",
                "reclwhPX03Z7tEnr0",
                "recOQaL1sz5ZYG0FP",
                "recMGK4rseVl0FQUA",
                "reczblyHQbv0k8vWK",
                "recmW9uAGMLDdY5HF",
                "recPLEAAHlq4IJuCL",
                "rec29qyG3kZcLjftW",
                "reczMkjRo009Zd0SJ",
                "recRGCuI2E41xfx4f",
                "rectKqNZNo1Cak1C5"
            ],
            "Name": "Осень 2022: Черноморец-3",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Черноморец-3"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recYmh3svEnhrJtip",
        "createdTime": "2022-08-22T09:20:50.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recc8PkfQSTRuAKZg"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recJSFJA4ilLpPTf6",
                "rece20ql1sUf8JU5r",
                "recA9Y8iHxv3ITav9",
                "recUmT3HSeQ1og6bh",
                "recdCJbcC3xQdTlBd",
                "recZUoNXAL5lVzyWC"
            ],
            "Name": "Осень 2022: Ортус",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Ортус"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "reccotMvp4MevJQ0t",
        "createdTime": "2022-08-22T09:20:49.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "rec5bpX1gX6m9koGz"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recqewDmN1AXRBMAM",
                "recnjyL2Cmw9zq9yX",
                "recUGhHGBIrYfbS28",
                "rechz4GGrwQ5ZVWEd",
                "recRT04B8XXGm7j2c",
                "recZ5HY817WQ6ONFJ",
                "rec8XETPGg3NONiB0"
            ],
            "Name": "Осень 2022: Шторм",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "Шторм"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recGxpPuv28UwFEvL",
        "createdTime": "2022-08-22T09:20:48.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recrlWD64QAqzpZ9O"
            ],
            "Результат (место)": 0,
            "Состав": [
                "recHndNbUiYdobrqd",
                "recFnO7PfiFK8DqyD",
                "recULXz2YPrtQl2UO",
                "recWzo2jglp5wesiK",
                "recQmborw06i4bLiO",
                "recE9JXNy2MrYg1Ck",
                "recslXWUmyLUb2RZx"
            ],
            "Name": "Осень 2022: ЭкоПик",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "ЭкоПик"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recKgXNDXFx3oZoyB",
        "createdTime": "2022-10-11T12:46:57.000Z",
        "fields": {
            "Турниры": [
                "recTBtRUiBwh3avjf"
            ],
            "Команды": [
                "recM6djz83jZzezYJ"
            ],
            "Результат (место)": 0,
            "Name": "Осень 2022: 7 пределов",
            "Турнир": [
                "22.4 Осень 2022"
            ],
            "Команда": [
                "7 пределов"
            ],
            "Результат (с турниром)": "Осень 2022: в процессе",
            "Результат": "в процессе",
            "Турнир (без кода)": [
                "Осень 2022"
            ],
            "Идентификатор турнира": [
                "recTBtRUiBwh3avjf"
            ]
        }
    },
    {
        "id": "recPzDLSFCgAJ0wjf",
        "createdTime": "2022-07-27T09:22:20.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recrlWD64QAqzpZ9O"
            ],
            "Результат (место)": 1,
            "Состав": [
                "recARRi7lsMYkNCbF",
                "recHiEhrfkhmQYclb",
                "recWzo2jglp5wesiK",
                "reciYyOWOwW25E8vC",
                "recQmborw06i4bLiO",
                "recE9JXNy2MrYg1Ck",
                "recslXWUmyLUb2RZx",
                "recBXqmnZEWljVPJr",
                "recCdZ5cJf6pkqyh6",
                "recFnO7PfiFK8DqyD"
            ],
            "Name": "Летний кубок 2022 мужчины: ЭкоПик",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "ЭкоПик"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 1 место",
            "Результат": "1 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "rectCD88QTjWgVHEv",
        "createdTime": "2022-07-27T09:22:20.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recynyqEDVHyVyk27"
            ],
            "Результат (место)": 5,
            "Состав": [
                "rec8P5NNQJk9BUSlq",
                "recqYUbEW9Sguo1yZ",
                "recVVr5iop8yXjvxs",
                "recVkXYZLNDr8Tog6",
                "recsmiHylWSOL8nQD",
                "recp5eDVN0ld0FXV1",
                "recse5s40Pr0p8HrO"
            ],
            "Name": "Летний кубок 2022 мужчины: Альма-Крым",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "Альма-Крым"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "recC94WlcOeuEY3Eu",
        "createdTime": "2022-07-27T09:22:19.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recDaZodsJJLAkYDs"
            ],
            "Результат (место)": 2,
            "Состав": [
                "rec5eYgfGLP98QMTm",
                "rec9Q4Vk9TT3RC9Lu",
                "rec46wKOn3AO10xib",
                "rec57Urvr32vTihd8",
                "recgJm2MAemmc7kTk",
                "recQ7fKINENQx9xzE",
                "recrn83aqtuQV01p1"
            ],
            "Name": "Летний кубок 2022 мужчины: Балаклава",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "Балаклава"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 2 место",
            "Результат": "2 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "recQiw89y8XGiSqIX",
        "createdTime": "2022-07-27T09:22:18.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recV5nUenQAEGrXcU"
            ],
            "Результат (место)": 3,
            "Состав": [
                "recNSD5sN0NsCCTpS",
                "rec6wE3Ddm9xa9Frq",
                "recsGhvA8zFKv0mA2",
                "rec4gxJ6eF8U2hNFF",
                "recp8kUm0JJ9mtLAK",
                "reciovAgxQqAijyk0",
                "recnHYLhyq6QqzIBW",
                "recgKElQ4S42oGf6G",
                "recwg6BnPRRSPwEzp"
            ],
            "Name": "Летний кубок 2022 мужчины: Спарта",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "Спарта"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 3 место",
            "Результат": "3 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "recM1FfJmKmWfPPUR",
        "createdTime": "2022-07-27T09:22:17.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recUdDhsqd0WU5Hgo"
            ],
            "Результат (место)": 5,
            "Состав": [
                "rechsqSflmETQ41Vb",
                "recrajFLH37x9dLX9",
                "rec3OBTsgmeJioeJl",
                "rec7N70GxzWr5eCne",
                "rec7STFkbLwlAedmF",
                "recGughkzFv1xUd35",
                "recT566QWmav3TAWC",
                "recpyTfCAtGUfoTZz"
            ],
            "Name": "Летний кубок 2022 мужчины: Продвижение",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "Продвижение"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "rec2q9o8HnYX7zCIG",
        "createdTime": "2022-07-27T09:22:16.000Z",
        "fields": {
            "Турниры": [
                "recS1F79Hww82HvFP"
            ],
            "Команды": [
                "recRVFZaAl1tOPBOW"
            ],
            "Результат (место)": 4,
            "Состав": [
                "recxlubliJCqNMy6x",
                "recQwPmUg9WUSHVPW",
                "recikR7eBhLIhRHXe",
                "recQo8Lgz7nmAEGn8",
                "recPfqfu7jnVsrI5v",
                "recJvSs4uTmT2yP3Q",
                "recc346UHdwmJzteO",
                "recEDlEpdXbQsbkpL"
            ],
            "Name": "Летний кубок 2022 мужчины: Альянс",
            "Турнир": [
                "22.3 Летний кубок 2022 мужчины"
            ],
            "Команда": [
                "Альянс"
            ],
            "Результат (с турниром)": "Летний кубок 2022 мужчины: 4 место",
            "Результат": "4 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 мужчины"
            ],
            "Идентификатор турнира": [
                "recS1F79Hww82HvFP"
            ]
        }
    },
    {
        "id": "recN4AqcSjqEQyOTj",
        "createdTime": "2022-07-01T13:17:19.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "recQNpKlpeMTN4yzz"
            ],
            "Результат (место)": 3,
            "Состав": [
                "rec8utOThiyuA7Ncc",
                "recX7kiEVD8HVpiFn",
                "recd4r8XQBiOirL0h",
                "recse5s40Pr0p8HrO",
                "recPLRLJu6DV8xT8n",
                "recp4f9RGeeWnu9RN",
                "rectSGwkQfNGYfgU7"
            ],
            "Name": "Летний кубок 2022 женщины: Прибой",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Прибой"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 3 место",
            "Результат": "3 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "rechP6KYCMKWu8mmH",
        "createdTime": "2022-07-01T13:17:18.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "recs81bRJGIJymEIe"
            ],
            "Результат (место)": 2,
            "Состав": [
                "recIMNEU5cvZiZIDZ",
                "recEkGeMwGbLxffWc",
                "recOzavpGfUFNORGj",
                "recp6r5FmkQ9cRvzU",
                "recmKH5piTyIcQ9Z9",
                "recpEVx6uxuWkM8OL",
                "recXegQeZenrQWnLg"
            ],
            "Name": "Летний кубок 2022 женщины: Василек",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Василек"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 2 место",
            "Результат": "2 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "recIx9JTWouxXtVbg",
        "createdTime": "2022-07-01T13:17:17.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "recMPmbwQFBKGVSoM"
            ],
            "Результат (место)": 5,
            "Состав": [
                "recSIVdHdrH9o3gq0",
                "recuQJmGMXdImsb03",
                "recqzEVRNPLKW4YWf",
                "recJ7qTjnDhRWEeTD",
                "rech1yn8pFsHaaITe",
                "rec5LF3gMaztJlpu5",
                "recftNDajFuiPAotv",
                "recHndNbUiYdobrqd",
                "recnHYLhyq6QqzIBW"
            ],
            "Name": "Летний кубок 2022 женщины: Ралли-поинт",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Ралли-поинт"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "recDesPzGtaUoJ1g7",
        "createdTime": "2022-07-01T13:17:17.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "rec7IAXxfzLtdhMsg"
            ],
            "Результат (место)": 5,
            "Состав": [
                "recfL1Q9qtiNLWpnG",
                "recULXz2YPrtQl2UO",
                "recutYkLErx83k9UK",
                "recE48owwURYOFgZa",
                "recG5fcQCivH7oRGO",
                "reclvenpp0SIfLr64",
                "recKE4MOV3XaVnVDG",
                "recRJnDmd8PCzqN6a",
                "recg28As4Etw66szA",
                "recruBF8Y3q5tHNIe"
            ],
            "Name": "Летний кубок 2022 женщины: Карма",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Карма"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "reckJ1TmAposONndy",
        "createdTime": "2022-07-01T13:17:16.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "recrOngXZfv51zxj6"
            ],
            "Результат (место)": 4,
            "Состав": [
                "recEsT7Rqq4ZPLMvm",
                "reclzzHoFnFq6RwRO",
                "recbkgi2uLBmJGLMO",
                "recvjTMxr3Ui63He7",
                "rechah3vXepBK62vQ",
                "rec2zwZ5o7gbZAaVS",
                "recYXuVNJ5Yi5Cyzu",
                "recv8JsrBccHNmspA",
                "recxRhQCZx2uZPCWf"
            ],
            "Name": "Летний кубок 2022 женщины: Юность",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Юность"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 4 место",
            "Результат": "4 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "rec2R8RhrYMrQTuw9",
        "createdTime": "2022-07-01T13:17:14.000Z",
        "fields": {
            "Турниры": [
                "recAZv73zCdZ3e5Ty"
            ],
            "Команды": [
                "recqwK3m9RaQjvfwe"
            ],
            "Результат (место)": 1,
            "Состав": [
                "rec6PCHPDjg7nP3LA",
                "recH8BBzWCxxNElFk",
                "rectsKxHs4DrLgR8X",
                "recLSeNgvjWm4abYn",
                "recDH8lPWv5egcHwd",
                "rech91S0VnLZICkIi",
                "reclSEhuX97MyyXFF",
                "recPJY5SY9eqAks1x",
                "recVfk5t3IN22g71q",
                "recHzk83BMOC4CJ7k"
            ],
            "Name": "Летний кубок 2022 женщины: Парадокс",
            "Турнир": [
                "22.2 Летний кубок 2022 женщины"
            ],
            "Команда": [
                "Парадокс"
            ],
            "Результат (с турниром)": "Летний кубок 2022 женщины: 1 место",
            "Результат": "1 место",
            "Турнир (без кода)": [
                "Летний кубок 2022 женщины"
            ],
            "Идентификатор турнира": [
                "recAZv73zCdZ3e5Ty"
            ]
        }
    },
    {
        "id": "recMgkLkMpu8iOMKB",
        "createdTime": "2022-03-05T19:10:26.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recwdXiTwfieWJ2zl"
            ],
            "Результат (место)": 1,
            "Состав": [
                "recGuuMQd0Hry2Xnu",
                "recgab4k518JrlCMt",
                "recEfws1SXkGx6AKK",
                "recG6lHMCQDKsG1Kx",
                "rec1euzOPFE8kfiUm",
                "recLg51L7pXnBJpGr",
                "rec7daTrZd9cGb7rx",
                "rec1NIjmPsJdLmrfO",
                "recgJm2MAemmc7kTk",
                "recb33JHWnPptCRqE",
                "recwg6BnPRRSPwEzp",
                "recPcIyF75WhzVrHj",
                "recnU5M5Tc2E9vmZB",
                "rech6kqjZm44y40Jp",
                "recVWIxkreSnVHZSE",
                "recq2R4N2adHJzxBg",
                "recUPmoRiL2JW07f2"
            ],
            "Name": "Весна 2022: Легион-2",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Легион-2"
            ],
            "Результат (с турниром)": "Весна 2022: 1 место",
            "Результат": "1 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recxFq7v4ApBPoyyY",
        "createdTime": "2022-03-05T19:10:36.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "receUzM5hTXJpSw7H"
            ],
            "Результат (место)": 2,
            "Состав": [
                "recfnT73YmtGe8mdE",
                "rec7Q48lBYlLrvPrv",
                "recygB1DOOAGVLXT4",
                "recQQ0CDSuWZi9JJe",
                "recmKH5piTyIcQ9Z9",
                "rec7STFkbLwlAedmF",
                "recw7cgc9VomySSt2",
                "recKw8SkJkyj4cwiO",
                "recmAoDcVXVqTTXDI",
                "recZryIfkGeJE6rHE",
                "rec2zwZ5o7gbZAaVS",
                "rec8IQUl5al69BBIo",
                "recHx1VcT89VwAjWt",
                "recV4SsBJV6qL2zBy",
                "recCPfRGYSr4Cqckh"
            ],
            "Name": "Весна 2022: Легион",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Легион"
            ],
            "Результат (с турниром)": "Весна 2022: 2 место",
            "Результат": "2 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recmiRDMzvBIoxXkA",
        "createdTime": "2022-03-05T19:16:28.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recf5jCoQc4ebLckG"
            ],
            "Результат (место)": 3,
            "Состав": [
                "rec9Q4Vk9TT3RC9Lu",
                "recQ7fKINENQx9xzE",
                "recnUqbfdL2PryY4l",
                "recvhFEfmtwOor4xK",
                "recrKj9gRpxHXHIeM",
                "recjZnrtRjeyamcDo",
                "recMjiZgu8k13bWIv",
                "recHnYXInnBY5m7Fe",
                "rech91S0VnLZICkIi",
                "recF9AZpRxbd4s2up",
                "recSVgbXxTrFMpBrS",
                "rec3VkeS6qDQ4d2yw",
                "rec3tDVFpI4RtpN8O"
            ],
            "Name": "Весна 2022: Мстители",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Мстители"
            ],
            "Результат (с турниром)": "Весна 2022: 3 место",
            "Результат": "3 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recxzeAP5jLU1A7E2",
        "createdTime": "2022-03-05T19:10:14.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recV5nUenQAEGrXcU"
            ],
            "Результат (место)": 4,
            "Состав": [
                "recnHYLhyq6QqzIBW",
                "reciovAgxQqAijyk0",
                "rec4gxJ6eF8U2hNFF",
                "recp8kUm0JJ9mtLAK",
                "recsGhvA8zFKv0mA2",
                "rec6Ku6Xx2SbsbalK",
                "recuPWa0ZaP0DN2JP",
                "rec7rIECQJRR4AkAz"
            ],
            "Name": "Весна 2022: Спарта",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Спарта"
            ],
            "Результат (с турниром)": "Весна 2022: 4 место",
            "Результат": "4 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "rechyn4UYtmlXctdH",
        "createdTime": "2022-03-05T19:10:23.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "reca5NQVSKm3gmn8C"
            ],
            "Результат (место)": 5,
            "Состав": [
                "recHafMXng5v6ZD3N",
                "rec57Urvr32vTihd8",
                "recCdZ5cJf6pkqyh6",
                "recrn83aqtuQV01p1",
                "rec1k5nehFsbRtVtr",
                "rec46wKOn3AO10xib",
                "recjLgN6OaSjojexD",
                "recp6r5FmkQ9cRvzU"
            ],
            "Name": "Весна 2022: Матчбол",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Матчбол"
            ],
            "Результат (с турниром)": "Весна 2022: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reciN73Q6Cn2NjC5A",
        "createdTime": "2022-03-05T12:30:30.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recnEELXiDFrxIPix"
            ],
            "Результат (место)": 6,
            "Состав": [
                "rectZgyE4cPoU4xet",
                "rectPnAzb9dvPWYdF",
                "recOU4nbakE5i0uSG",
                "recRPDjHFM2Ahsyr7",
                "recDp0ZQODD3ZsID7",
                "rec4VrsjgRVPl3fyG",
                "recEE7yxHqygm491V",
                "recXegQeZenrQWnLg",
                "recbYUDtR0kYRbx3W"
            ],
            "Name": "Весна 2022: Алушта",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Алушта"
            ],
            "Результат (с турниром)": "Весна 2022: 6 место",
            "Результат": "6 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reclKwG3viNQLpYH3",
        "createdTime": "2022-03-05T19:11:47.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recDxakzIGaFzydAA"
            ],
            "Результат (место)": 7,
            "Состав": [
                "reciVoArE6O1M5wie",
                "recptX35uujL19zUO",
                "recCRYf6Tp7S1JDwc",
                "recaxQKxX2IOyQMNi",
                "recv1y5UH53LOpbFm",
                "recJhj8gCdbhFueNY",
                "rectTRoBbIltin0IQ",
                "recgY2m8dDKN1gksw",
                "recF0VmYOu8LUUCiy",
                "rec2iq51Uxk4Ljz4M",
                "recfQ3UrYjzpRoxiZ"
            ],
            "Name": "Весна 2022: Импульс",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Импульс"
            ],
            "Результат (с турниром)": "Весна 2022: 7 место",
            "Результат": "7 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recBP3UqladOa8GTj",
        "createdTime": "2022-03-05T19:10:40.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rectlFHt9jokhoEon"
            ],
            "Результат (место)": 8,
            "Состав": [
                "recWqgWjfZMugoOH9",
                "recDJK01jQTTvrdNv",
                "recjeIzGqAC1RXeXB",
                "rec6TymK3iLb1sfoT",
                "recWF9CWQdZdFQ7Dr",
                "recWscE5HOcr02UIx",
                "reck99D0dw0CdXVh4",
                "recMNZEenOzRC7Zn5",
                "rectyTqtnL8rDRKCl",
                "recLKfQHC9767Q1XE",
                "rec136Swl7LJCURaB"
            ],
            "Name": "Весна 2022: Сурож",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Сурож"
            ],
            "Результат (с турниром)": "Весна 2022: 8 место",
            "Результат": "8 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recBPgYeiS6MbnrY8",
        "createdTime": "2022-03-05T19:08:46.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recQCcUcWqfasbeAr"
            ],
            "Результат (место)": 9,
            "Состав": [
                "recjhuGUW2ESk3SL3",
                "rechAbEstOR6Ull17",
                "recc346UHdwmJzteO",
                "recEDlEpdXbQsbkpL",
                "rec8utOThiyuA7Ncc",
                "recdSNPV11ACG2wFz",
                "recX7kiEVD8HVpiFn",
                "recqrrs3B2rmwrAjc"
            ],
            "Name": "Весна 2022: Бастион",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Бастион"
            ],
            "Результат (с турниром)": "Весна 2022: 9 место",
            "Результат": "9 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recYlaJ2D6Qq3Fitu",
        "createdTime": "2022-03-05T19:10:31.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recmfw38VhgmGHSxC"
            ],
            "Результат (место)": 10,
            "Состав": [
                "recovhTGHUMwnGx02",
                "rec3AaQHPFZMhXHo3",
                "recVqvrddjPOZMhSV",
                "recwZsHm5RSJhxNwa",
                "recdj8012hUympOf5",
                "recFg0IHoSgy9JnGa",
                "recykYgh7ejsTpqU8",
                "recKdJ8dxOERWcpg1",
                "recbwSyMJbSTrFJk7",
                "rec6Cf2n9UDWnbbCc",
                "recJugKUI5KLDiHOI"
            ],
            "Name": "Весна 2022: ЧНГ",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "ЧНГ"
            ],
            "Результат (с турниром)": "Весна 2022: 10 место",
            "Результат": "10 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recFeJsl1U96pg8Uu",
        "createdTime": "2022-03-05T19:10:17.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recst39AJwl7Edi0c"
            ],
            "Результат (место)": 11,
            "Состав": [
                "recp5eDVN0ld0FXV1",
                "rectZKhpJzXIUwM40",
                "recAjKcfynThYPtf3",
                "recL6tUpZIwRglpQ9",
                "recprhRuSKEwNzHO6",
                "rec6Jtoq3e1UWuQBG",
                "rec8XSnrDBvv0zIpA",
                "recsE27Mn0ZLKaBdI",
                "rectSGwkQfNGYfgU7",
                "recyBJol6XZEZVW5E"
            ],
            "Name": "Весна 2022: Комус",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Комус"
            ],
            "Результат (с турниром)": "Весна 2022: 11 место",
            "Результат": "11 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "rec6zzWd8N7GLVpfw",
        "createdTime": "2022-03-05T19:11:34.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recq7xUDdmjx5Ngal"
            ],
            "Результат (место)": 12,
            "Состав": [
                "recKE4MOV3XaVnVDG",
                "recVkXYZLNDr8Tog6",
                "rechjFjDoJocN6aK1",
                "recLVv0nWynUBdIpU",
                "rec6IP99pJjCuboXj",
                "recPLRLJu6DV8xT8n",
                "recjgwMJYWd6QU9Pn",
                "reclvenpp0SIfLr64",
                "recnei53Da73ljB9R",
                "recsmiHylWSOL8nQD"
            ],
            "Name": "Весна 2022: Феникс",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Феникс"
            ],
            "Результат (с турниром)": "Весна 2022: 12 место",
            "Результат": "12 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reczkVqoahZV215ZO",
        "createdTime": "2022-03-05T19:11:58.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec4KbD8N7XB3hmEA"
            ],
            "Результат (место)": 13,
            "Состав": [
                "rec0vNxHosoSbSKXT",
                "recnAPX1ustNn4u5R",
                "receoFp9S1E8FrKu0",
                "reca3n7PeDqjea76I",
                "rec7YvMCkrKdXX9gN",
                "recMcNAkIYXuKMA1W",
                "recZ0J9jXtCRjCsax",
                "recHYlr0H1DX1vd9g",
                "reckFzLKrvDPedLCD"
            ],
            "Name": "Весна 2022: Оникс",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Оникс"
            ],
            "Результат (с турниром)": "Весна 2022: 13 место",
            "Результат": "13 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reclZF1jj4neaDNri",
        "createdTime": "2022-03-05T19:16:22.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recBpK5dYCD9rugER"
            ],
            "Результат (место)": 14,
            "Состав": [
                "rec1aTNLUZ74gZ09Q",
                "recu9TPkvgHNONEZ9",
                "receEvRbEQ38N5oTi",
                "rec7L5PDFcPrQxyCH",
                "recXNwRsMjpOHBfZa",
                "rec55afgDUDxcqNT9",
                "recgR9ecFUmGycvwI",
                "recBXqmnZEWljVPJr",
                "rec2RKrlHCYqJQqoO"
            ],
            "Name": "Весна 2022: Черноморец",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Черноморец"
            ],
            "Результат (с турниром)": "Весна 2022: 14 место",
            "Результат": "14 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reclNd2EbkS4X9uKp",
        "createdTime": "2022-03-05T19:08:30.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec3S7eXfpZv3l7q0"
            ],
            "Результат (место)": 15,
            "Состав": [
                "reco9azEBSid5YtFS",
                "recd0uluFzL5nqAzG",
                "recPJY5SY9eqAks1x",
                "rect6FO5OqVknhoFS",
                "recZhgeM8fM55lByl",
                "reclRD7OysahN4YZy",
                "reciA1oXy8ivKN7Eg",
                "recTUgsEKCUMckYuF",
                "recZFgAwjN7LNN6JQ",
                "recKBMPnqF6SaBulN",
                "reclpilUXFQlfxbdQ"
            ],
            "Name": "Весна 2022: Ахтиар",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Ахтиар"
            ],
            "Результат (с турниром)": "Весна 2022: 15 место",
            "Результат": "15 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reca4NljBNhJ8B3cs",
        "createdTime": "2022-03-05T19:11:21.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec2hQpJTPt5WSRZf"
            ],
            "Результат (место)": 16,
            "Состав": [
                "recCgyXzRPyt9IVMb",
                "rec11PjsxNqkhRe2e",
                "recuyF2qzNPU9K4XF",
                "recj0CBWm7T5GrUM5",
                "recDphDzMAgpnqCSo",
                "reckjk4rg62hxEOHM",
                "recxnzHJmPlOQGYJH",
                "recpOqNP9tKn1oJdw"
            ],
            "Name": "Весна 2022: ЮБК",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "ЮБК"
            ],
            "Результат (с турниром)": "Весна 2022: 16 место",
            "Результат": "16 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recVwl9o2WLzKyNC2",
        "createdTime": "2022-03-05T19:11:29.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec9nD4ARhpsgcvUU"
            ],
            "Результат (место)": 17,
            "Состав": [
                "recUuurVWAYDwNRy6",
                "reccH2fne3wEj2cLR",
                "recd4r8XQBiOirL0h",
                "rec3z28GbMP67Eglx",
                "recfPGKhR9j3hruiF",
                "recPbuQmWaXSvYlBI",
                "recdk9Z6emG7QfApZ",
                "recHpvuOhfi4SkAys",
                "recqzEVRNPLKW4YWf",
                "reciizFG7cpA1SmxQ"
            ],
            "Name": "Весна 2022: Заря Крыма",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Заря Крыма"
            ],
            "Результат (с турниром)": "Весна 2022: 17 место",
            "Результат": "17 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "rec4CH8bTN33uDOoD",
        "createdTime": "2022-03-05T12:00:05.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recxx0ELRBmt2lYoH"
            ],
            "Результат (место)": 18,
            "Состав": [
                "recQo8Lgz7nmAEGn8",
                "receMmLOG9fuu8tuA",
                "recikR7eBhLIhRHXe",
                "recMTYsJeFxOxcBw1",
                "recDH8lPWv5egcHwd",
                "recLSeNgvjWm4abYn",
                "recQwPmUg9WUSHVPW",
                "rec8oUkHk6LUuchoz",
                "recOc7FrPAEVGU0n7",
                "recxlubliJCqNMy6x"
            ],
            "Name": "Весна 2022: Рейнджерс",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Рейнджерс"
            ],
            "Результат (с турниром)": "Весна 2022: 18 место",
            "Результат": "18 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "rec0fCYHAUWIk8ser",
        "createdTime": "2022-03-05T19:11:37.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recUdDhsqd0WU5Hgo"
            ],
            "Результат (место)": 19,
            "Состав": [
                "rec7N70GxzWr5eCne",
                "rec3OBTsgmeJioeJl",
                "recrajFLH37x9dLX9",
                "recOGoWO78tvCQFZL",
                "recL7EPDRZtwlXtr3",
                "recWehEuVFGAhGnuG",
                "rec6Qjqt4Js4yVG7Q",
                "recoM4tIF1oNwAzvz"
            ],
            "Name": "Весна 2022: Продвижение",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Продвижение"
            ],
            "Результат (с турниром)": "Весна 2022: 19 место",
            "Результат": "19 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recNmq6u2bfdVLW9P",
        "createdTime": "2022-03-05T19:12:13.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec0yMKHYH64GWmVb"
            ],
            "Результат (место)": 20,
            "Состав": [
                "reckc5MH4FJQug6oa",
                "recqYUbEW9Sguo1yZ",
                "recHYZzXw2QEkJtP9",
                "recO6hCK8hMr0xxmW",
                "recBoDomY1a59oCZO",
                "recVVr5iop8yXjvxs",
                "reclMfBYTBXlTzqUF",
                "recse5s40Pr0p8HrO",
                "reck3iylPCCK7sD45",
                "recyRJUg7xzfLuxMZ",
                "recaFWnwmdVbSuRPx"
            ],
            "Name": "Весна 2022: Лукулл",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Лукулл"
            ],
            "Результат (с турниром)": "Весна 2022: 20 место",
            "Результат": "20 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "reccZjVCwYxS4aGZt",
        "createdTime": "2022-03-05T19:11:52.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recnTZ9QZUryBmf7E"
            ],
            "Результат (место)": 21,
            "Состав": [
                "recYvpq4HT7UyH0HK",
                "rec9JZeqq9ikbZPaX",
                "recQBUAteiwKUMFza",
                "reczdcfMuAMg7Ddl9",
                "recvwj71VKvxBMijG",
                "recfqAAc67W1FgqI2",
                "recroh5jbGAHoo6VK",
                "recrA71hIfEJsU8HU",
                "recv7UIPiEftY5LVo",
                "recUcRJ9zEaLteDGq",
                "recCqleFaWKcaeMwN",
                "recdXR91LK3PpZa94",
                "recKVqnxW2IsoQy7A",
                "recfhJvwdnaMrOMXR",
                "recnBz2pCgzm9K9vA",
                "recENSN83v7u1hGtK",
                "recpF728hHxTU7V8S",
                "recy8VCEmPSEYbgGL",
                "recpL8tCAjlZBZNju",
                "rec4jigPSUvyOo5fq"
            ],
            "Name": "Весна 2022: Черноморец-2",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Черноморец-2"
            ],
            "Результат (с турниром)": "Весна 2022: 21 место",
            "Результат": "21 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recZ8KGqCisBsrJcD",
        "createdTime": "2022-03-05T19:12:25.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec7V4fSrk0kxRBcR"
            ],
            "Результат (место)": 22,
            "Состав": [
                "reckGEiqZ9euDjJgb",
                "recdcugljql5Bwhx5",
                "recvsp5waueDjgZtX",
                "rec03hRx2UvyWNoQ4",
                "recrL6Xpn1FtfPSB5",
                "rec3cj1nAt9ys4kyi",
                "recGQFOjrBudzcMRd",
                "recbWmFKx0KjxEc1x",
                "reck5fTE5bR2ONu6Z",
                "recRiUxLgt5Qe0W9I",
                "rec44zSPo4AStwnws"
            ],
            "Name": "Весна 2022: Астра",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Астра"
            ],
            "Результат (с турниром)": "Весна 2022: 22 место",
            "Результат": "22 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recufv8tCx4NOmhdq",
        "createdTime": "2022-03-05T19:11:16.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recyw2f145WAJGLGx"
            ],
            "Результат (место)": 23,
            "Состав": [
                "recPyJIdNgglpkexv",
                "recq08x0mxvt2knYk",
                "recrnKAU67YsZTG2y",
                "rec3YgRUFqCxTKncL",
                "recOzavpGfUFNORGj",
                "recKCfILf6tRtOqwJ",
                "rechYwpnbi6nG93J5"
            ],
            "Name": "Весна 2022: Медведи",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Медведи"
            ],
            "Результат (с турниром)": "Весна 2022: 23 место",
            "Результат": "23 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recEuxS9IJuy8ccmh",
        "createdTime": "2022-03-05T19:12:09.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recuchsORYh1p8mL5"
            ],
            "Результат (место)": 24,
            "Состав": [
                "rec1O52mVF4uFprXj",
                "rec0IVOkbD7dy0Kjr",
                "recxtEmS22bkp3A8P",
                "recNOC668G7KilMkf",
                "recpTFU7SbggAlsGV",
                "rechXu4q7UmDNOUMD",
                "recEeknFOlHDqxpZd",
                "recvCeyr6yNFqfigh",
                "recAoh4f9qcpyE50j",
                "recpnrFzS1zY8Si7Q",
                "reccFYoAGbYGOpJd8",
                "recb1Msf18VU3MLdv",
                "reclSEhuX97MyyXFF",
                "recEZ2Fua4CgE6a9V"
            ],
            "Name": "Весна 2022: Крафт",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Крафт"
            ],
            "Результат (с турниром)": "Весна 2022: 24 место",
            "Результат": "24 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recMAOkuXbRI4BcWH",
        "createdTime": "2022-03-05T19:12:37.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recWxZUi2wubRzEsb"
            ],
            "Результат (место)": 25,
            "Состав": [
                "recKF5kxuHb60RW6I",
                "recj1TolIKHzcUiIi",
                "rec3GlQGjqyXBIQiC",
                "rec6sIEznmM0M9vp3",
                "recpryu3495oCl4qS",
                "recBEN5uCGRVk4LTy",
                "recSg0mjgckOaEmpD",
                "recsE85MBjscdjbXQ",
                "recp4f9RGeeWnu9RN",
                "rec0KeN8d6rxkbWCi",
                "recTWql5XNytz3ada"
            ],
            "Name": "Весна 2022: Динамит",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Динамит"
            ],
            "Результат (с турниром)": "Весна 2022: 25 место",
            "Результат": "25 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recGfF2SUlglJuySX",
        "createdTime": "2022-03-05T12:10:18.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recMPmbwQFBKGVSoM"
            ],
            "Результат (место)": 26,
            "Состав": [
                "recb7m1lZmt5gSMec",
                "recPfqfu7jnVsrI5v",
                "recJvSs4uTmT2yP3Q",
                "rech1yn8pFsHaaITe",
                "rec5LF3gMaztJlpu5",
                "recpT7yu4av5pOdGB",
                "recftNDajFuiPAotv",
                "recnUNmGSrmkZBxHG"
            ],
            "Name": "Весна 2022: Ралли-поинт",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Ралли-поинт"
            ],
            "Результат (с турниром)": "Весна 2022: 26 место",
            "Результат": "26 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recrqxuRKw1TM1AT0",
        "createdTime": "2022-03-05T19:11:42.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recmS8BgTWn8QIpqc"
            ],
            "Результат (место)": 27,
            "Состав": [
                "rec18CAUldBZo4k7G",
                "recY82WfsfJSIlFZW",
                "recN15WvxLLVChHAE",
                "reciANXOeJrcXMYKs",
                "recBMNae1qM6eZ1sv",
                "recWXL4rp30uQQo2A",
                "reczVMG5ovuHljeSk",
                "recdtlMDNPZ1SWcUY",
                "recethcXpAbJuTwpR",
                "rech0EUusqrNnpkgI",
                "rec2QvSSZt92UF5r1",
                "recfDxndXsjMCBm3U"
            ],
            "Name": "Весна 2022: Циркон",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Циркон"
            ],
            "Результат (с турниром)": "Весна 2022: 27 место",
            "Результат": "27 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recNhFtWBBkMEEdss",
        "createdTime": "2022-03-05T19:12:50.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recVLMP36y7NzwTFk"
            ],
            "Результат (место)": 28,
            "Состав": [
                "recz8iEq5yN44vA4I",
                "rec5nLi1I84G3IT3X",
                "recJzfu2hfGxS5C9O",
                "recmEQypmSBvFyalw",
                "recQg8sJxqYXwlbjJ",
                "recirqmRv5sLmo5SH",
                "recrC0NbAfD5dWoAL"
            ],
            "Name": "Весна 2022: Таврия",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Таврия"
            ],
            "Результат (с турниром)": "Весна 2022: 28 место",
            "Результат": "28 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recAKGMMqJLmyf6hW",
        "createdTime": "2022-03-05T19:12:05.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "rec8BwgNp8nnHt1kw"
            ],
            "Результат (место)": 29,
            "Состав": [
                "recJfOSAFbn6q66A9",
                "rec71t90PPfhVLHGf",
                "recQgGhyJFy2AW8ZS",
                "recWgyrXfU0BKkwgl",
                "recTzD8W31cjlOCzh",
                "recLr6YaPwzeDN3GR",
                "reccTUm9sG3TYO22S",
                "recSYfpIZ4Y2vJlmZ",
                "recaZecTzzvtYFq7U",
                "recsutx8Gz8E1XmWL",
                "recKBr2wvcCSNpIq4",
                "recd4130zuuFfv8Ba"
            ],
            "Name": "Весна 2022: Молния",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Молния"
            ],
            "Результат (с турниром)": "Весна 2022: 29 место",
            "Результат": "29 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recGjxovg9Ch84agS",
        "createdTime": "2022-03-05T19:12:20.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recMYX0UQ505TwwQL"
            ],
            "Результат (место)": 30,
            "Состав": [
                "recRhBhVXEIWIhgmb",
                "recvm6CLxVev6UQDk",
                "rec8LcnGyhCoSAoZW",
                "recrR6eGy3Hj7L8bc",
                "recimwTwNmACSIsmS",
                "rec5jLCfzdeMO1n5p",
                "recN1t26725wWoPsq",
                "recy1gn0RNidEIq7s",
                "rechTSSNOo6yuL6ZZ",
                "recVWl5BibItYD47C",
                "rechc4Lh21NiXirDG"
            ],
            "Name": "Весна 2022: Стрела",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Стрела"
            ],
            "Результат (с турниром)": "Весна 2022: 30 место",
            "Результат": "30 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recIDqNI7wQSqxRBR",
        "createdTime": "2022-03-05T19:12:48.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "recsucLBwtB8WNkC6"
            ],
            "Результат (место)": 31,
            "Состав": [
                "recUvuwCMsmI14VDh",
                "recg07IeoKKCtfS80",
                "recTNLe6B2VYCLOvU",
                "recpEVx6uxuWkM8OL",
                "recP8pfvRTlKmpHJd",
                "recXuJFVmjlCkem7e",
                "recw1lhSyUgRrjV6m",
                "rec08IUxHrt5lsm2r"
            ],
            "Name": "Весна 2022: Карасуно",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Карасуно"
            ],
            "Результат (с турниром)": "Весна 2022: 31 место",
            "Результат": "31 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recbG5lZYkOwW68cW",
        "createdTime": "2022-03-05T19:12:32.000Z",
        "fields": {
            "Турниры": [
                "recC6cmCroZm6Rjb6"
            ],
            "Команды": [
                "reccTk7ZsJZ7SiUWX"
            ],
            "Результат (место)": 32,
            "Состав": [
                "recJ7qTjnDhRWEeTD",
                "recbG2TxU6rb3VPke",
                "recW2vTOn1GWKZI6V",
                "recLstnSJDhRdGAfa",
                "recUIw2bkwxuMyZWk",
                "recWVokLfkRtUvWXe",
                "recpJK7AHjBl9wvd7",
                "recGuq1EMAxZmFKfd",
                "recBU2aXmpPYHR9Fq"
            ],
            "Name": "Весна 2022: Орион",
            "Турнир": [
                "22.1 Весна 2022"
            ],
            "Команда": [
                "Орион"
            ],
            "Результат (с турниром)": "Весна 2022: 32 место",
            "Результат": "32 место",
            "Турнир (без кода)": [
                "Весна 2022"
            ],
            "Идентификатор турнира": [
                "recC6cmCroZm6Rjb6"
            ]
        }
    },
    {
        "id": "recj7Az8aZoVLfnXr",
        "createdTime": "2022-03-05T19:57:12.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recBpK5dYCD9rugER"
            ],
            "Результат (место)": 1,
            "Состав": [
                "receEvRbEQ38N5oTi",
                "rec1aTNLUZ74gZ09Q",
                "recOgXwiw1OJCcoXq",
                "recGjZWgtLgXV4JO1",
                "recCV3f0ej4VenLT4",
                "recu9TPkvgHNONEZ9",
                "rec2RKrlHCYqJQqoO",
                "rec7L5PDFcPrQxyCH",
                "recCfKzRdE90lNnXA",
                "recPpyaBERm1bHVdN",
                "recNaHPcaluWqdrnj",
                "recpF728hHxTU7V8S"
            ],
            "Name": "Осень 2021: Черноморец",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Черноморец"
            ],
            "Результат (с турниром)": "Осень 2021: 1 место",
            "Результат": "1 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "reclX8npQKweYfjC9",
        "createdTime": "2022-03-05T19:57:29.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recf5jCoQc4ebLckG"
            ],
            "Результат (место)": 2,
            "Состав": [
                "rec9Q4Vk9TT3RC9Lu",
                "recgKElQ4S42oGf6G",
                "recQ7fKINENQx9xzE",
                "recrKj9gRpxHXHIeM",
                "recnUqbfdL2PryY4l",
                "recSVgbXxTrFMpBrS",
                "recMjiZgu8k13bWIv",
                "recjZnrtRjeyamcDo",
                "recvhFEfmtwOor4xK",
                "recVklp2dk2r0IInp",
                "rec3tDVFpI4RtpN8O",
                "recZTB3vC2sbZAt6g"
            ],
            "Name": "Осень 2021: Мстители",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Мстители"
            ],
            "Результат (с турниром)": "Осень 2021: 2 место",
            "Результат": "2 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "reci283c0xYc4kW1O",
        "createdTime": "2022-03-05T19:57:41.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recst39AJwl7Edi0c"
            ],
            "Результат (место)": 3,
            "Состав": [
                "recAjKcfynThYPtf3",
                "rectZKhpJzXIUwM40",
                "rec4mOLvxMMrGmsWv",
                "recsy6mCMTtm61OEn",
                "rec9wp1zKfrm9dd3M",
                "recp5eDVN0ld0FXV1",
                "recrQ58Kk22Z5X1sR",
                "recFjavdDpcnzhjQH",
                "recVSqKFhDDeJv8WZ",
                "recTMDdGZahXC1PGs",
                "recuPWa0ZaP0DN2JP",
                "rec6Ku6Xx2SbsbalK"
            ],
            "Name": "Осень 2021: Комус",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Комус"
            ],
            "Результат (с турниром)": "Осень 2021: 3 место",
            "Результат": "3 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "recnYoZNdoX0bXIio",
        "createdTime": "2022-03-05T19:57:50.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "reca5NQVSKm3gmn8C"
            ],
            "Результат (место)": 4,
            "Состав": [
                "recHafMXng5v6ZD3N",
                "rec57Urvr32vTihd8",
                "recCdZ5cJf6pkqyh6",
                "recrn83aqtuQV01p1",
                "recLxe464upK2Szdf",
                "recjLgN6OaSjojexD",
                "recmKH5piTyIcQ9Z9"
            ],
            "Name": "Осень 2021: Матчбол",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Матчбол"
            ],
            "Результат (с турниром)": "Осень 2021: 4 место",
            "Результат": "4 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "recFfJTvaNlcWlPZ3",
        "createdTime": "2022-03-05T19:58:00.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recV5nUenQAEGrXcU"
            ],
            "Результат (место)": 5,
            "Состав": [
                "recsGhvA8zFKv0mA2",
                "recPIgry6Cpbwfo0N",
                "rec6wE3Ddm9xa9Frq",
                "reciovAgxQqAijyk0",
                "recjhewuCiOfovX0a",
                "recRSXM0WmUUYHe8W",
                "recnHYLhyq6QqzIBW",
                "rec4gxJ6eF8U2hNFF",
                "recp8kUm0JJ9mtLAK"
            ],
            "Name": "Осень 2021: Спарта",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Спарта"
            ],
            "Результат (с турниром)": "Осень 2021: 5 место",
            "Результат": "5 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "recSfwo7Z1a7hzJ3R",
        "createdTime": "2022-03-05T19:58:05.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recmfw38VhgmGHSxC"
            ],
            "Результат (место)": 6,
            "Состав": [
                "recVqvrddjPOZMhSV",
                "recbwSyMJbSTrFJk7",
                "recdj8012hUympOf5",
                "recykYgh7ejsTpqU8",
                "rec3AaQHPFZMhXHo3",
                "recwZsHm5RSJhxNwa",
                "recKdJ8dxOERWcpg1",
                "rec6Cf2n9UDWnbbCc",
                "recHnYXInnBY5m7Fe",
                "reczhCeswXEfMT7nw",
                "recc8RdhtU7zAeaCr"
            ],
            "Name": "Осень 2021: ЧНГ",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "ЧНГ"
            ],
            "Результат (с турниром)": "Осень 2021: 6 место",
            "Результат": "6 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    },
    {
        "id": "recPpwbUDPLDLTVO1",
        "createdTime": "2022-03-05T19:58:10.000Z",
        "fields": {
            "Турниры": [
                "receG3kCec3AbPH2F"
            ],
            "Команды": [
                "recRTkl7DeiF8iuDA"
            ],
            "Результат (место)": 7,
            "Состав": [
                "rec88ko2bOqbFFYAe",
                "recKL5fuBZgDA5kiC",
                "rec1k5nehFsbRtVtr",
                "reckcaGbbUnhgeYFU",
                "recJ7qTjnDhRWEeTD",
                "recd4130zuuFfv8Ba",
                "reclSEhuX97MyyXFF",
                "recENSN83v7u1hGtK",
                "recy8VCEmPSEYbgGL"
            ],
            "Name": "Осень 2021: Рестарт",
            "Турнир": [
                "21.5 Осень 2021"
            ],
            "Команда": [
                "Рестарт"
            ],
            "Результат (с турниром)": "Осень 2021: 7 место",
            "Результат": "7 место",
            "Турнир (без кода)": [
                "Осень 2021"
            ],
            "Идентификатор турнира": [
                "receG3kCec3AbPH2F"
            ]
        }
    }
];