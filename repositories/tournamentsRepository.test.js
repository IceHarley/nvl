import test from 'ava';
import TournamentsRepository from "./tournamentsRepository.js";

const repository = new TournamentsRepository();

test('загрузка по id', async t => {
    const actual = await repository.getById('recTBtRUiBwh3avjf');
    t.like(actual, {name: 'Осень 2022', code: 22.4});
});

test('предыдущий турнир', async t => {
    const actual = await repository.getPrevious({
        id: 'recTBtRUiBwh3avjf',
        name: 'Осень 2022',
        state: 'в процессе',
        code: 22.4,
        format: 'mix',
        type: 'Сезон',
    });
    t.like(actual, {name: 'Весна 2022', code: 22.1});
});