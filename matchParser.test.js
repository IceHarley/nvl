import test from 'ava';
import MatchParser from "./matchParser.js";
import MockResultsRepository from "./mock/mockResults.js";

const mockResults = new MockResultsRepository();

test('для пустого матча возвращается ошибка', t => {
    t.throws(() => new MatchParser().parseMatch());
});

test('для некорректного матча возвращается ошибка', t => {
    t.throws(() => new MatchParser().parseMatch('некорректный матч'));
    const result = mockResults.getGroup('A')[0];
    result.result = 'некорректный матч';
    t.throws(() => new MatchParser().parseMatch(result));
});

test('матч bo3 2:0', t => {
    t.deepEqual(new MatchParser().parseMatch(mockResults.getGroup('A')[0]), [
        {team: 'recV5nUenQAEGrXcU', points: 4, score: 8},
        {team: 'recwdXiTwfieWJ2zl', points: 0, score: -8}]);
});

test('матч bo3 2:1', t => {
    t.deepEqual(new MatchParser().parseMatch(mockResults.getGroup('A')[1]), [
        {team: 'recf5jCoQc4ebLckG', points: 3, score: 5},
        {team: 'recwdXiTwfieWJ2zl', points: 1, score: -5}
    ])
});

test('матч bo5 3:1', t => {
    t.deepEqual(new MatchParser().parseMatch(mockResults.getGroup('L')[2]), [
        {team: 'recsucLBwtB8WNkC6', points: 4, score: 11},
        {team: 'recMYX0UQ505TwwQL', points: 0, score: -11}
    ])
});

test('матч bo5 3:2', t => {
    t.deepEqual(new MatchParser().parseMatch(mockResults.getGroup('O')[2]), [
        {team: 'recXu7MPHQpXpp5s1', points: 3, score: 8},
        {team: 'rec9GbvD9xEOe7ksG', points: 1, score: -8}
    ])
});

test('матч +:- (неявка)', t => {
    t.deepEqual(new MatchParser().parseMatch(mockResults.getGroup('K')[0]), [
        {team: 'recUZ9IN2r9brYDa6', points: 4, score: 50},
        {team: 'recoWmhWBQWh2jzRL', points: 0, score: -50, tech: 'неявка'}
    ])
});

test('матч +:- (снятие)', t => {
    const result = mockResults.getGroup('K')[1];
    t.deepEqual(new MatchParser().parseMatch(result), [
        {team: 'recUZ9IN2r9brYDa6', points: 4, score: 50},
        {team: 'rec9HmVM1YlrsaUR6', points: 0, score: -50, tech: 'снятие'}
    ])
});

test('матч +:- (25:20, 14:16 игрок команды получил травму, а замен не было)', t => {
    const result = mockResults.getGroup('K')[1];
    result.result = '+:- (25:20, 14:16 игрок команды получил травму, а замен не было)';
    t.deepEqual(new MatchParser().parseMatch(result), [
        {team: 'recUZ9IN2r9brYDa6', points: 4, score: 50},
        {team: 'rec9HmVM1YlrsaUR6', points: 0, score: -50, tech: 'иное'}
    ])
});

test('матч -:- (неявка) когда все 3 команды группы не явились', t => {
    const result = mockResults.getGroup('K')[1];
    result.result = '-:- (неявка)';
    result.winner = null;
    t.deepEqual(new MatchParser().parseMatch(result), [
        {},
        {team: 'rec9HmVM1YlrsaUR6', points: 0, score: -50, tech: 'неявка'}
    ])
});

test('для пустого матча с настройкой skipEmpty возвращается пустой массив', t => {
    t.deepEqual(new MatchParser( true)
        .parseMatch(mockResults.getGroup('C', 2, 'recTBtRUiBwh3avjf')[0]), [])
});