import test from 'ava';
import DistributionRepository from "./distributionRepository.js";

const repository = new DistributionRepository();

test('загрузка по турниру и туру', async t => {
    const actual = await repository.getByTournamentAndTour('recTBtRUiBwh3avjf', 1);
    t.pass();
});
//
// test.skip('сохранение', async t => {
//     const actual = await repository.saveList([
//         {
//             tournament: 'recTBtRUiBwh3avjf',
//             team: 'reca5NQVSKm3gmn8C',
//             tour: 2,
//             group: 'D',
//             paramsId: 'recqUk1lPBnwz4s41'
//         },
//         {
//             tournament: 'recTBtRUiBwh3avjf',
//             team: 'recuchsORYh1p8mL5',
//             tour: 2,
//             group: 'G',
//             paramsId: 'recqUk1lPBnwz4s41'
//         }
//     ]);
//     t.is(actual.length, 2);
// });