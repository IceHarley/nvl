import ResultsRepository from "./repositories/resultsRepository.js";
import DistributionRepository from "./repositories/distributionRepository.js";
import TournamentsRepository from "./repositories/tournamentsRepository.js";
import DistributionParamsRepository from "./repositories/distributionParamsRepository.js";

const paramsRepository = new DistributionParamsRepository();
const resultsRepository = new ResultsRepository();
const distributionRepository = new DistributionRepository();
const tournamentsRepository = new TournamentsRepository();

const paramsChoices = state => () => paramsRepository.getByState(state)
    .then(params => params.map(params => ({
        name: `${params.code}: сезон ${params.tournamentName}, распределение на ${params.nextTour} тур`,
        value: params.id,
        short: `${params.tournamentName}, ${params.nextTour} тур`
    })));

export const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'Выбор действия',
        choices: () => [
            {name: 'Распределение команд на следующий тур', value: 'distribution', short: 'Распределение'},
            {name: 'Удалить распределение команд', value: 'removeDistribution', short: 'Удаление распределения'},
            {name: 'Составить рейтинговую таблицу - в разработке', value: 'rating', short: 'Рейтинговая таблица'},
        ]
    },
    {
        type: 'list',
        name: 'distribution.paramsId',
        message: 'Параметры распределения',
        when: answers => answers.action === 'distribution',
        choices: paramsChoices("Готово к запуску")
    },
    {
        type: 'confirm',
        name: 'distribution.saveResults',
        message: 'Сохранить распределение в БД?',
        when: answers => answers.action === 'distribution',
        default: true
    },
    {
        type: 'list',
        name: 'removeDistribution.paramsId',
        message: 'Код параметров распределения',
        when: answers => answers.action === 'removeDistribution',
        choices: paramsChoices("Завершено")
    },
];
export const repositories = {
    params: paramsRepository,
    results: resultsRepository,
    distribution: distributionRepository,
    tournaments: tournamentsRepository,
};