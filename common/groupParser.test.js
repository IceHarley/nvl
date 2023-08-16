import test from 'ava';
import GroupParser from "./groupParser.js";
import MockResultsRepository from "../mock/mockResults.js";

const mockResults = new MockResultsRepository();

const ratingRules = [
    ['A', 6, 5, 4, 1],
    ['B', 5, 4, 3, 0],
    ['F', 4, 3, 2, 0],
    ['J', 3, 2, 1, 0],
    ['Z', 0, 0, 0, 0],
];

test('для пустых результатов возвращается ошибка', t => {
    t.throws(() => new GroupParser().parseGroup());
});

test('результаты матчей должны быть из единой группы', t => {
    t.throws(() => new GroupParser().parseGroup([{'Группа': 'A'}, {'Группа': 'A'}, {'Группа': 'B'}]));
});

test('для обычной группы возвращается 3 записи', t => {
    const groupResults = mockResults.getGroup('A');
    t.is(new GroupParser().parseGroup(groupResults).length, 3)
});

test('для обычной группы возвращается места команд в группе', t => {
    const groupResults = mockResults.getGroup('A');
    const actual = new GroupParser().parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'A', team: 'recV5nUenQAEGrXcU', place: 1, points: 7, score: 17, rating: 6});
    t.deepEqual(actual[1], {group: 'A', team: 'recf5jCoQc4ebLckG', place: 2, points: 4, score: -4, rating: 5});
    t.deepEqual(actual[2], {group: 'A', team: 'recwdXiTwfieWJ2zl', place: 3, points: 1, score: -13, rating: 4});
});

test('группа где все друг у друга выиграли с одинаковым счетом', t => {
    const groupResults = mockResults.getGroup('E');
    groupResults[0].result = '2:0 (25:13, 25:21)';
    //recq7xUDdmjx5Ngal Феникс 2:0 (25:13, 25:21) и 0:2 (19:25, 22:25)  +7
    //recyw2f145WAJGLGx Медведи 2:0 (25:19, 25:22) и 0:2 (25:27, 18:25) +0
    //rec3S7eXfpZv3l7q0 Ахитар 2:0 (27:25, 25:18) и 0:2 (13:25, 21:25)  -7
    const actual = new GroupParser().parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'E', team: 'recq7xUDdmjx5Ngal', place: 1, points: 4, score: 7, rating: 4});
    t.deepEqual(actual[1], {group: 'E', team: 'recyw2f145WAJGLGx', place: 2, points: 4, score: 0, rating: 3});
    t.deepEqual(actual[2], {group: 'E', team: 'rec3S7eXfpZv3l7q0', place: 3, points: 4, score: -7, rating: 2});
});

test('группа, где одна команда снялась', t => {
    const groupResults = mockResults.getGroup('O');
    const actual = new GroupParser(false, ratingRules).parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'O', team: 'recXu7MPHQpXpp5s1', place: 1, points: 7, score: 8+50, rating: 0});
    t.deepEqual(actual[1], {group: 'O', team: 'rec9GbvD9xEOe7ksG', place: 2, points: 5, score: -8+50, rating: 0});
    t.deepEqual(actual[2], {group: 'O', team: 'rec7IAXxfzLtdhMsg', place: 3, points: 0, score: -50-50, tech: 'снятие', rating: 0});
});

test('группа, где одна команда не явилась', t => {
    const groupResults = mockResults.getGroup('O');
    for (let i = 0; i < 3; i++) {
        groupResults[i].result = groupResults[i].result.replace('снятие', 'неявка');
    }
    const actual = new GroupParser(false, ratingRules).parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'O', team: 'recXu7MPHQpXpp5s1', place: 1, points: 7, score: 8+50, rating: 0});
    t.deepEqual(actual[1], {group: 'O', team: 'rec9GbvD9xEOe7ksG', place: 2, points: 5, score: -8+50, rating: 0});
    t.deepEqual(actual[2], {group: 'O', team: 'rec7IAXxfzLtdhMsg', place: 3, points: 0, score: -50-50, tech: 'неявка', rating: 0});
});

test('группа, где одна команда снялась, а другая не явилась', t => {
    const groupResults = mockResults.getGroup('K');
    const actual = new GroupParser(false, ratingRules).parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'K', team: 'recUZ9IN2r9brYDa6', place: 1, points: 8, score: 50+50, rating: 0});
    t.deepEqual(actual[1], {group: 'K', team: 'recoWmhWBQWh2jzRL', place: 3, points: 0, score: -50, tech: 'неявка', rating: 0});
    t.deepEqual(actual[2], {group: 'K', team: 'rec9HmVM1YlrsaUR6', place: 3, points: 0, score: -50, tech: 'снятие', rating: 0});
});

test('группа в которой игры не состоялись', t => {
    const groupResults = mockResults.getGroup('Q');
    const actual = new GroupParser().parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'Q', team: 'recrnpNtzebiv8cC7', place: 3, points: 0, score: -50, tech: 'неявка', rating: 0});
    t.deepEqual(actual[1], {group: 'Q', team: 'recOD3widNtopWjf7', place: 3, points: 0, score: -50, tech: 'неявка', rating: 0});
    t.deepEqual(actual[2], {group: 'Q', team: 'reczIrCoCxiUr3LnJ', place: 3, points: 0, score: -50, tech: 'неявка', rating: 0});
});

test('группа из двух команд', t => {
    const groupResults = mockResults.getGroup('O').splice(2, 1);
    const actual = new GroupParser(false, ratingRules).parseGroup(groupResults);
    t.is(actual.length, 2);
    t.deepEqual(actual[0], {group: 'O', team: 'recXu7MPHQpXpp5s1', place: 1, points: 3, score: 8, rating: 0});
    t.deepEqual(actual[1], {group: 'O', team: 'rec9GbvD9xEOe7ksG', place: 2, points: 1, score: -8, rating: 0});
});

test('группа А, где одна команда не явилась', t => {
    const groupResults = mockResults.getGroup('O');
    for (let i = 0; i < 3; i++) {
        groupResults[i].result = groupResults[i].result.replace('снятие', 'неявка');
        groupResults[i].group = 'A';
    }
    const actual = new GroupParser().parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'A', team: 'recXu7MPHQpXpp5s1', place: 1, points: 7, score: 8+50, rating: 6});
    t.deepEqual(actual[1], {group: 'A', team: 'rec9GbvD9xEOe7ksG', place: 2, points: 5, score: -8+50, rating: 5});
    t.deepEqual(actual[2], {group: 'A', team: 'rec7IAXxfzLtdhMsg', place: 3, points: 0, score: -50-50, tech: 'неявка', rating: 1});
});

test('для полуфиналов возвращается 4 записи', t => {
    const groupResults = mockResults.getGroup('полуфинал', 'Финал четырех', 'recC6cmCroZm6Rjb6');
    t.is(new GroupParser().parseGroup(groupResults).length, 4)
});

test('для матча за 3 место возвращается 2 записи: 1 место - это итоговое третье, 2 место - итоговое четвертое', t => {
    const groupResults = mockResults.getGroup('за 3 место', 'Финал четырех', 'recC6cmCroZm6Rjb6');
    const actual = new GroupParser().parseGroup(groupResults);
    t.is(actual.length, 2)
    t.is(actual[0].place, 1);
    t.is(actual[1].place, 2);
});

test('для финала возвращается 2 записи: 1 место - это итоговое третье, 2 место - итоговое четвертое', t => {
    const groupResults = mockResults.getGroup('финал', 'Финал четырех', 'recC6cmCroZm6Rjb6');
    const actual = new GroupParser().parseGroup(groupResults);
    t.is(actual.length, 2)
    t.is(actual[0].place, 1);
    t.is(actual[1].place, 2);
});

test('SkipEmptyMatches=true группа, где матчи еще не сыграны', t => {
    const groupResults = mockResults.getGroup('C', 2, 'recTBtRUiBwh3avjf');
    const actual = new GroupParser(true).parseGroup(groupResults);
    t.deepEqual(actual, []);
});

test('SkipEmptyMatches=true группа, где сыгран 1 матч, а 2 еще не сыграны - результаты по сыгранному матчу', t => {
    const groupResults = mockResults.getGroup('A');
    groupResults[1].result = undefined;
    groupResults[1].winner = undefined;
    groupResults[1].loser = undefined;
    groupResults[2].result = undefined;
    groupResults[2].winner = undefined;
    groupResults[2].loser = undefined;
    const actual = new GroupParser(true).parseGroup(groupResults);
    t.deepEqual(actual.length, 2);
    t.deepEqual(actual[0], {group: 'A', team: 'recV5nUenQAEGrXcU', place: 1, points: 4, score: 8, rating: 6});
    t.deepEqual(actual[1], {group: 'A', team: 'recwdXiTwfieWJ2zl', place: 2, points: 0, score: -8, rating: 5});
});

test('SkipEmptyMatches=true группа, где сыграно 2 матч, а 1 еще не сыгран - результаты по сыгранным матчам', t => {
    const groupResults = mockResults.getGroup('A');
    groupResults[2].result = undefined;
    groupResults[2].winner = undefined;
    groupResults[2].loser = undefined;
    const actual = new GroupParser(true).parseGroup(groupResults);
    t.deepEqual(actual.length, 3);
    t.deepEqual(actual[0], {group: 'A', team: 'recV5nUenQAEGrXcU', place: 1, points: 4, score: 8, rating: 6});
    t.deepEqual(actual[1], {group: 'A', team: 'recf5jCoQc4ebLckG', place: 2, points: 3, score: 5, rating: 5});
    t.deepEqual(actual[2], {group: 'A', team: 'recwdXiTwfieWJ2zl', place: 3, points: 1, score: -8-5, rating: 4});
});

test('нижняя группа, в которой только одна команда', t => {
    const groupResults = [{
        group: 'P',
        winner: 'teamId',
        result: '+:- (нет соперника)',
        tour: '3',
    }];
    const actual = new GroupParser().parseGroup(groupResults);
    t.deepEqual(actual[0], {group: 'P', team: 'teamId', place: 1, points: 4, score: 50, rating: 1});
});