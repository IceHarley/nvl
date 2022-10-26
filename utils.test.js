import test from 'ava';
import {alphabetPosition, chunkArray, positionToChar} from "./utils.js";

test('индекс символа в алфавите', t => {
    t.is(alphabetPosition(undefined), undefined);
    t.is(alphabetPosition('A'), 0);
    t.is(alphabetPosition('a'), 0);
    t.is(alphabetPosition('B'), 1);
    t.is(alphabetPosition('J'), 9);
});

test('символ по позиции в алфавите', t => {
    t.is(positionToChar(0), 'A');
    t.is(positionToChar(1), 'B');
    t.is(positionToChar(9), 'J');
});

test('разбивка массива на части', t => {
    t.deepEqual(chunkArray([], 10), []);
    t.deepEqual(chunkArray([1], 10), [[1]]);
    t.deepEqual(chunkArray([1], 1), [[1]]);
    t.deepEqual(chunkArray([1, 2], 1), [[1], [2]]);
    t.deepEqual(chunkArray([1, 2], 2), [[1, 2]]);
    t.deepEqual(chunkArray([1, 2, 3, 4, 5, 6, 7], 3), [[1, 2, 3], [4, 5, 6], [7]])
});