import test from 'ava';
import RatingCalculator from "./ratingCalculator.js";
import MockResultsRepository from "../mock/mockResults.js";
import MockTournamentsRepository from "../mock/mockTournaments.js";
import MockTournamentOutcomesRepository from "../mock/mockTournamentOutcomes.js";
import {NEW_TEAM} from "../common/constants.js";
import {format} from "../common/utils.js";

const TOURNAMENT_ID = 'recTBtRUiBwh3avjf';
const PREV_TOURNAMENT_ID = 'recC6cmCroZm6Rjb6';

const mockResults = new MockResultsRepository();
const mockTournaments = new MockTournamentsRepository();
const mockTournamentOutcomes = new MockTournamentOutcomesRepository();

const tournament = mockTournaments.getById(TOURNAMENT_ID);
const outcomes = mockTournamentOutcomes.getByTournamentLimit(TOURNAMENT_ID, 5);
const prevOutcomes = mockTournamentOutcomes.getByTournamentLimit(PREV_TOURNAMENT_ID, 10);

const calculator = new RatingCalculator();

test.beforeEach(() => {
    mockResults.reset();
    mockTournaments.reset();
    mockTournamentOutcomes.reset();
});

test('для пустых результатов возвращается ошибка', t => {
    t.throws(() => calculator.calculate());
});

test('для пустых итогов турнира возвращается ошибка', t => {
    t.throws(() => calculator.calculate({}, [], undefined));
    t.throws(() => calculator.calculate({}, [], []));
});

test('пустые результаты матчей - возвращаем итоги турнира', async t => {
    const actual = await calculator.calculate(tournament, [], outcomes);
    const expected = outcomes.map(o => ({teamName: o.teamName}));
    assertRatingTable(t, actual, expected);
});

test('пустые результаты матчей и есть итоги прошлого турнира - возвращаем итоги по итогам прошлого турнира', async t => {
    const expected = [
        {teamName: 'Легион-2'},
        {teamName: 'Легион'},
        {teamName: 'Мстители'},
        {teamName: 'Спарта'},
        {teamName: 'Матчбол'},
    ];
    const actual = await calculator.calculate(tournament, [], outcomes, prevOutcomes);
    assertRatingTable(t, actual, expected);
});

test('сыгран турнир одной группы - сортировка по рейтингу', async t => {
    const expected = [
        {teamName: 'Легион', rating: 5},
        {teamName: 'Матчбол', rating: 4},
        {teamName: 'Спарта'},
        {teamName: 'Мстители'},
        {teamName: 'Легион-2'},
    ];
    const actual = await calculator.calculate(tournament, mockResults.getGroup('B'), outcomes);
    assertRatingTable(t, actual, expected);
});

test('сыгран турнир двух групп и есть итоги прошлого турнира - сортировка по рейтингу, затем по группе', async t => {
    const expected = [
        {teamName: 'Спарта', rating: 6},
        {teamName: 'Мстители', rating: 5},
        {teamName: 'Легион', rating: 5},
        {teamName: 'Легион-2', rating: 4},
        {teamName: 'Матчбол', rating: 4},
    ];
    const actual = await calculator.calculate(tournament, mockResults.getGroups(['A', 'B']), outcomes);
    assertRatingTable(t, actual, expected);
});

test('сыгран 1 тур и одна группа сыграла второй - сортировка по рейтингу', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID,
        ['Лукулл', 'Оникс', 'Заря Крыма', 'Ралли-поинт', 'Черноморец-2']);
    const expected = [
        {teamName: 'Лукулл', rating: 3 + 3},
        {teamName: 'Заря Крыма', rating: 2 + 2},
        {teamName: 'Оникс', rating: 2 + 1},
        {teamName: 'Ралли-поинт', rating: 2},
        {teamName: 'Черноморец-2', rating: 1},
    ];
    const results = mockResults.getGroups(['F', 'G', 'H'])
        .concat(mockResults.getGroup('G', 2));
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('сыграны 2 тура - сортировка по рейтингу', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID,
        ['Лукулл', 'Оникс', 'Заря Крыма', 'Ралли-поинт', 'Черноморец-2']);
    const expected = [
        {teamName: 'Лукулл', rating: 3 + 3},
        {teamName: 'Заря Крыма', rating: 2 + 2},
        {teamName: 'Черноморец-2', rating: 1 + 3},
        {teamName: 'Оникс', rating: 2 + 1},
        {teamName: 'Ралли-поинт', rating: 2 + 1},
    ];
    const results = mockResults.getGroups(['F', 'G', 'H'])
        .concat(mockResults.getGroups(['F', 'G', 'H'], 2));
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('сыграны 2 тура (результаты в обратном порядке) - сортировка по рейтингу', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID,
        ['Лукулл', 'Оникс', 'Заря Крыма', 'Ралли-поинт', 'Черноморец-2']);
    const expected = [
        {teamName: 'Лукулл', rating: 3 + 3},
        {teamName: 'Заря Крыма', rating: 2 + 2},
        {teamName: 'Черноморец-2', rating: 1 + 3},
        {teamName: 'Оникс', rating: 2 + 1},
        {teamName: 'Ралли-поинт', rating: 2 + 1},
    ];
    const results = mockResults.getGroups(['F', 'G', 'H'], 2)
        .concat(mockResults.getGroups(['F', 'G', 'H']));
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды с одинаковым рейтингом - сортировка по группе последнего тура', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['Лукулл', 'ЮБК'])
        .concat(mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['Импульс']));
    const expected = [
        {teamName: 'Импульс', rating: 3 + 3},
        {teamName: 'ЮБК', rating: 3 + 3},
        {teamName: 'Лукулл', rating: 3 + 3},
    ];
    const results = mockResults.getGroups(['D', 'F', 'H'])
        .concat(mockResults.getGroups(['D', 'F', 'G'], 2));
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды с одинаковым рейтингом играли в одной группе - сортировка месту в группе', async t => {
    const tournamentId = 'recC6cmCroZm6Rjb6';
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Бастион'])
        .concat(mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Сурож']));
    const expected = [
        {teamName: 'Сурож', rating: 3 + 3},
        {teamName: 'Бастион', rating: 4 + 2},
    ];
    const results = mockResults.getGroups(['C', 'D'], 1, tournamentId)
        .concat(mockResults.getGroup('C', 2, tournamentId));
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды с одинаковым рейтингом играли в одной группе и обе не явились - сортировка по группе предыдущего тура', async t => {
    const tournamentId = 'recC6cmCroZm6Rjb6';
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Бастион'])
        .concat(mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Сурож']));
    const expected = [
        {teamId: 'rectlFHt9jokhoEon', teamName: 'Сурож', rating: 4},
        {teamId: 'recQCcUcWqfasbeAr', teamName: 'Бастион', rating: 4},
    ];
    const results = [
        {
            tournament: tournamentId,
            tour: 1,
            group: 'C',
            winner: 'rectlFHt9jokhoEon',
            loser: 'reca5NQVSKm3gmn8C',
            result: "3:0 (25:20, 25:20, 25:20)"
        },
        {
            tournament: tournamentId,
            tour: 1,
            group: 'D',
            winner: 'recQCcUcWqfasbeAr',
            loser: 'reca5NQVSKm3gmn8C',
            result: "3:0 (25:20, 25:20, 25:20)"
        },
        {
            tournament: tournamentId,
            tour: 2,
            group: 'C',
            winner: 'reca5NQVSKm3gmn8C',
            loser: 'rectlFHt9jokhoEon',
            result: "+:- (неявка)"
        },
        {
            tournament: tournamentId,
            tour: 2,
            group: 'C',
            winner: 'reca5NQVSKm3gmn8C',
            loser: 'recQCcUcWqfasbeAr',
            result: "+:- (неявка)"
        },
    ];
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды игравшие в полуфиналах - сортируются по ним несмотря на рейтинг', async t => {
    const tournamentId = 'recC6cmCroZm6Rjb6';
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Легион', 'Легион-2', 'Спарта', 'Мстители', 'Матчбол']);
    const expected = [
        {teamName: 'Легион', rating: 4},
        {teamName: 'Легион-2', rating: 0},
        {teamName: 'Мстители', rating: 0},
        {teamName: 'Спарта', rating: 0},
        {teamName: 'Матчбол', rating: 4},
    ];
    const results = mockResults.getByTournamentDirect(tournamentId)
        .filter(r => r.group !== 'за 3 место' && r.group !== 'финал');
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды игравшие в матче за 3 место - сортируются по нему несмотря на рейтинг и полуфиналы', async t => {
    const tournamentId = 'recC6cmCroZm6Rjb6';
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Спарта', 'Мстители', 'Матчбол']);
    const expected = [
        {teamName: 'Спарта', rating: 0},
        {teamName: 'Мстители', rating: 0},
        {teamName: 'Матчбол', rating: 4},
    ];
    const results = mockResults.getByTournamentDirect(tournamentId)
        .filter(r => r.group !== 'финал');
    results.find(r => r.group === 'за 3 место').winner = 'recV5nUenQAEGrXcU';
    results.find(r => r.group === 'за 3 место').loser = 'recf5jCoQc4ebLckG';
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команды игравшие в финале - сортируются по нему несмотря на рейтинг и полуфиналы', async t => {
    const tournamentId = 'recC6cmCroZm6Rjb6';
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(tournamentId, ['Легион', 'Легион-2', 'Спарта', 'Мстители', 'Матчбол']);
    const expected = [
        {teamName: 'Легион-2', rating: 0},
        {teamName: 'Легион', rating: 4},
        {teamName: 'Мстители', rating: 0},
        {teamName: 'Спарта', rating: 0},
        {teamName: 'Матчбол', rating: 4},
    ];
    const results = mockResults.getByTournamentDirect(tournamentId);
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
    t.deepEqual(actual[0].tours, [
        {
            "tour": 1,
            "group": "+",
            "groupPlace": 0,
            "rating": 0,
        },
        {
            "tour": 2,
            "group": "+",
            "groupPlace": 0,
            "rating": 0,
        },
        {
            "tour": "Финал четырех",
            "group": "полуфинал",
            "groupPlace": 2,
            "rating": 0,
        },
        {
            "tour": "Финал четырех",
            "group": "финал",
            "groupPlace": 1,
            "rating": 0,
        }
    ])
});

test('две команды с одинаковым рейтингом и разными местами в прошлом турнире - смотрим по последней группе', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['Дивизион'])
        .concat(mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['Астра']));
    const expected = [
        {teamName: 'Астра', rating: 3 + 2},
        {teamName: 'Дивизион', rating: 3 + 2},
    ];
    const results = mockResults.getGroups(['J', 'I'])
        .concat(mockResults.getGroups(['H', 'I'], 2));
    const actual = await calculator.calculate(tournament, results, outcomes, [
        {
            id: 'id',
            tournamentId: PREV_TOURNAMENT_ID,
            teamId: 'rec7V4fSrk0kxRBcR',
            teamName: 'Астра',
            place: 22
        },
        {
            id: 'id',
            tournamentId: PREV_TOURNAMENT_ID,
            teamId: 'recmIPtfETs7wIh6N',
            teamName: 'Дивизион',
            place: 0
        }]);
    assertRatingTable(t, actual, expected);
});

test('новая команда, еще не игравшая - рейтинг 0', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['7 пределов']);
    const expected = [{teamName: '7 пределов', rating: 0}];
    const actual = await calculator.calculate(tournament, mockResults.getGroup('B'), outcomes);
    assertRatingTable(t, actual, expected);
});

test('новая команда, сыгравшая только во втором туре - рейтинг 0', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['7 пределов']);
    const expected = [{
        teamName: '7 пределов', rating: 3, tours: [
            {
                tour: 1,
                group: NEW_TEAM,
                groupPlace: 0,
                rating: 0,
            },
            {
                tour: 2,
                group: 'J',
                groupPlace: 1,
                rating: 3,
            }
        ]
    }];
    const results = [{
        tournament: TOURNAMENT_ID,
        tour: 2,
        group: 'J',
        winner: 'recM6djz83jZzezYJ',
        loser: 'recmfw38VhgmGHSxC',
        result: '3:0 (25:20, 25:20, 25:20)'
    }];
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('новая команда, сыгравшая только в третьем туре - рейтинг 0', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['7 пределов']);
    const expected = [{
        teamName: '7 пределов', rating: 3, tours: [
            {
                tour: 1,
                group: NEW_TEAM,
                groupPlace: 0,
                rating: 0,
            },
            {
                tour: 2,
                group: NEW_TEAM,
                groupPlace: 0,
                rating: 0,
            },
            {
                tour: 3,
                group: 'J',
                groupPlace: 1,
                rating: 3,
            }
        ]
    }];
    const results = [{
        tournament: TOURNAMENT_ID,
        tour: 3,
        group: 'J',
        winner: 'recM6djz83jZzezYJ',
        loser: 'recmfw38VhgmGHSxC',
        result: '3:0 (25:20, 25:20, 25:20)'
    }];
    const actual = await calculator.calculate(tournament, results, outcomes);
    assertRatingTable(t, actual, expected);
});

test('команда с неявкой - ниже других с таким же рейтингом', async t => {
    const outcomes = mockTournamentOutcomes.getByTournamentTeams(TOURNAMENT_ID, ['Коралл', 'ФВМ+1', 'Хром']);
    const expected = [
        {teamName: 'Коралл', rating: 0, withdraw: false},
        {teamName: 'ФВМ+1', rating: 0, withdraw: false},
        {teamName: 'Хром', rating: 0, withdraw: true},
    ];
    const actual = await calculator.calculate(tournament, mockResults.getGroup('K'), outcomes);
    console.log(format(actual));
    assertRatingTable(t, actual, expected);
});

const assertRatingTable = (t, actual, expected) => {
    for (let i = 0; i < expected.length; i++) {
        t.like(actual[i], {...expected[i], place: i + 1});
    }
};
