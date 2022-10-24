import Distributor from "./distributor.js";
import DistributionParamsRepository from "./repositories/distributionParamsRepository.js";
import DistributionRepository from "./repositories/distributionRepository.js";
import ResultsRepository from "./repositories/resultsRepository.js";
import TournamentsRepository from "./repositories/tournamentsRepository.js";
import DataLoader from "./dataLoader.js";


const paramsRepository = new DistributionParamsRepository();
const resultsRepository = new ResultsRepository();
const distributionRepository = new DistributionRepository();
const tournamentsRepository = new TournamentsRepository();

const dataLoader = new DataLoader({
    params: paramsRepository,
    results: resultsRepository,
    distribution: distributionRepository,
    tournaments: tournamentsRepository,
});
const distributor = new Distributor(dataLoader, distributionRepository);

distributor
    .distribute(1)
    .then(result => distributionRepository.saveList2(result))
    .then(ids => console.log(`Создано ${ids.length} записей`))
    .catch(error => console.log('Произошла ошибка ' + error));

// const playersRep = new Repository('Игроки', 'Игроки private');
// const matchesRep = new Repository('Результаты матчей', 'Результаты матчей private');

// matchesRep.getAllRecords({
//     view: 'Осень 2022',
//     where: {'Тур': '1'}
// }).then(res => {
// const map = groupBy(res, r => r. fields['Группа']);

// console.log(groupBy(res, r => r.group));
// for (const group of map.entries()) {
//     console.log(group[0]);
//     console.log(new GroupParser().parseGroup(group[1]));
// }
// console.log(new GroupParser().parseGroup(res));
// });

// console.log(new GroupParser().parseGroup(res))

// const mockResults = new MockResultsRepository();
// mockResults.getAllRecords()
//     .then(res => console.log(res.length));

// playersRep.getAllRecords({maxRecords: 4})
//     .then(res => console.log(res));
//
// const mockPlayersRep = new MockPlayersRepository();
//
// mockPlayersRep.getAllRecords({maxRecords: 1})
//     .then(res => console.log(res));
