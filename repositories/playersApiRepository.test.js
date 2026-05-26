import test from 'ava';
import {extractMutationList} from './playersApiRepository.js';

test('extractMutationList — массив в корне', t => {
    t.deepEqual(extractMutationList([{id: '1'}], 'created'), [{id: '1'}]);
});

test('extractMutationList — поле created/updated', t => {
    t.deepEqual(extractMutationList({created: [{id: '1'}]}, 'created'), [{id: '1'}]);
    t.deepEqual(extractMutationList({updated: [{id: '2'}]}, 'updated'), [{id: '2'}]);
});

test('extractMutationList — data и вложенные ключи', t => {
    t.deepEqual(extractMutationList({data: [{id: '1'}]}, 'created'), [{id: '1'}]);
    t.deepEqual(extractMutationList({data: {created: [{id: '1'}]}}, 'created'), [{id: '1'}]);
});

test('extractMutationList — пустой ответ', t => {
    t.is(extractMutationList(null, 'created'), null);
    t.is(extractMutationList({}, 'created'), null);
});
