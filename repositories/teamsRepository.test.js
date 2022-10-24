import test from 'ava';
import TeamsRepository from "./teamsRepository.js";

const repository = new TeamsRepository();

test('загрузка по id', async t => {
    const actual = await repository.getById('recM6djz83jZzezYJ');
    t.like(actual, {id: 'recM6djz83jZzezYJ', name: '7 пределов', city: 'Севастополь'});
});