import ResultsRepository from "../repositories/resultsRepository.js";
import DistributionRepository from "../repositories/distributionRepository.js";
import TournamentsRepository from "../repositories/tournamentsRepository.js";
import DistributionParamsRepository from "../repositories/distributionParamsRepository.js";
import TournamentOutcomesRepository from "../repositories/tournamentOutcomesRepository.js";
import {withSpinner} from "../common/utils.js";

const paramsRepository = new DistributionParamsRepository();
const resultsRepository = new ResultsRepository();
const distributionRepository = new DistributionRepository();
const tournamentsRepository = new TournamentsRepository();
const tournamentOutcomesRepository = new TournamentOutcomesRepository();

const paramsChoices = state => () => paramsRepository.getByState(state)
    .then(params => params.map(params => ({
        name: `${params.code}: сезон ${params.tournamentName}, распределение на ${params.nextTour} тур`,
        value: params.id,
        short: `${params.tournamentName}, ${params.nextTour} тур`
    })));

const tournamentsChoices = state => () => withSpinner(tournamentsRepository.getByState, 'Загрузка турниров')(state)
    .then(tournaments => tournaments.map(tournament => ({
        name: tournament.name,
        value: tournament.id,
        short: tournament.name
    })));

export const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'Выбор действия',
        choices: () => [
            {name: 'Распределение команд на следующий тур', value: 'distribution', short: 'Распределение'},
            {name: 'Удалить распределение команд', value: 'removeDistribution', short: 'Удаление распределения'},
            {name: 'Составить рейтинговую таблицу', value: 'rating', short: 'Рейтинговая таблица'},
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
    {
        type: 'list',
        name: 'rating.tournamentId',
        message: 'Выбор турнира',
        when: answers => answers.action === 'rating',
        choices: tournamentsChoices("В процессе")
    },
    {
        type: 'confirm',
        name: 'rating.saveResults',
        message: 'Сохранить рейтинг и места команд в БД?',
        when: answers => answers.action === 'rating',
        default: true
    },
    {
        type: 'confirm',
        name: 'rating.exportToExcel',
        message: 'Выгрузить рейтинговую таблицу в файл Excel',
        when: answers => answers.action === 'rating',
        default: true
    },
];
export const repositories = {
    params: paramsRepository,
    results: resultsRepository,
    distribution: distributionRepository,
    tournaments: tournamentsRepository,
    tournamentOutcomes: tournamentOutcomesRepository,
};