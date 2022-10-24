import test from 'ava';
import ResultsRepository from "./resultsRepository.js";

const repository = new ResultsRepository();

test('загрузка по турниру и туру', async t => {
    const actual = await repository.getByTournamentAndTour('recTBtRUiBwh3avjf', 1);
    t.is(actual.length, 47);
});