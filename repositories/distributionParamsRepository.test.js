import test from 'ava';
import DistributionParamsRepository from "./distributionParamsRepository.js";

const repository = new DistributionParamsRepository();

test('загрузка по коду', async t => {
    t.like(await repository.getByCode(1), {
        code: 1,
        tournament: 'recTBtRUiBwh3avjf',
        nextTour: 2
    });
});