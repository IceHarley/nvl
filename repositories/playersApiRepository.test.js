import test from 'ava';
import sinon from 'sinon';
import PlayersApiRepository from './playersApiRepository.js';
import {extractMutationList} from './playersApiRepository.js';

const jsonResponse = (status, body) => new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
});

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

test.serial('updateList отправляет массив игроков с id', async t => {
    const bodies = [];
    sinon.stub(globalThis, 'fetch').callsFake(async (_url, init) => {
        bodies.push(JSON.parse(init.body));
        return jsonResponse(200, {
            updated: [{id: 'rec1', name: 'Алан', birth_year: null, team_id: 'team1', tournament_results: []}],
        });
    });
    try {
        const chunks = [];
        await new PlayersApiRepository().updateList([{
            id: 'rec1',
            name: 'Алан Пепеляев',
            team: 'team1',
            birthYear: '1990',
            tournaments: [],
        }], chunk => chunks.push(chunk));
        t.true(Array.isArray(bodies[0]));
        t.deepEqual(bodies[0][0], {
            id: 'rec1',
            team_id: 'team1',
            name: 'Алан Пепеляев',
            birth_year: '1990',
            tournament_results: [],
        });
        t.is(chunks[0].rejected.length, 0);
        t.is(chunks[0].saved[0].id, 'rec1');
    } finally {
        sinon.restore();
    }
});

test.serial('createList отправляет массив игроков без обёртки players', async t => {
    const bodies = [];
    sinon.stub(globalThis, 'fetch').callsFake(async (_url, init) => {
        bodies.push(JSON.parse(init.body));
        return jsonResponse(201, {
            created: [{id: 'loc_1', name: 'Алан', birth_year: null, team_id: null, tournament_results: []}],
        });
    });
    try {
        const chunks = [];
        await new PlayersApiRepository().createList([{
            id: 'ins100001',
            name: 'Алан Пепеляев',
            tournaments: [],
        }], chunk => chunks.push(chunk));
        t.true(Array.isArray(bodies[0]));
        t.is(bodies[0][0].id, undefined);
        t.is(bodies[0][0].name, 'Алан Пепеляев');
        t.is(chunks[0].saved[0].localId, 'ins100001');
        t.is(chunks[0].saved[0].record.id, 'loc_1');
    } finally {
        sinon.restore();
    }
});
