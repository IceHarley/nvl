import test from 'ava';
import GroupsParser from "./groupsParser.js";
import MockResultsRepository from "./mock/mockResults.js";

const mockResults = new MockResultsRepository();

const groupsParser = new GroupsParser();

test('для пустых результатов возвращается ошибка', t => {
    t.throws(() => groupsParser.parseGroups());
});

test('для одной группы возвращается 1 запись', t => {
    const groupResults = mockResults.getGroup('A');
    const actual = groupsParser.parseGroups(groupResults);
    t.is(actual.length, 1)
    t.is(actual[0].length, 3)
});

test('для двух группы возвращаются 2 записи', t => {
    const groupResults = mockResults.getGroups(['A', 'B']);
    const actual = groupsParser.parseGroups(groupResults);
    t.is(actual.length, 2)
    t.is(actual[0].length, 3)
    t.is(actual[1].length, 3)
});

test('для группы А рейтинг по умолчанию 6,5,4', t => {
    const groupResults = mockResults.getGroup('A');
    const actual = groupsParser.parseGroups(groupResults)[0];
    t.is(actual[0].rating, 6)
    t.is(actual[1].rating, 5)
    t.is(actual[2].rating, 4)
});