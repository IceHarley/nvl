import Distributor from "./distributor.js";
import DistributionParamsRepository from "./repositories/distributionParamsRepository.js";
import DistributionRepository from "./repositories/distributionRepository.js";
import ResultsRepository from "./repositories/resultsRepository.js";
import TournamentsRepository from "./repositories/tournamentsRepository.js";
import DataLoader from "./dataLoader.js";
import inquirer from 'inquirer';

const paramsRepository = new DistributionParamsRepository();
const resultsRepository = new ResultsRepository();
const distributionRepository = new DistributionRepository();
const tournamentsRepository = new TournamentsRepository();


const paramsChoices = () => paramsRepository.getReadyForExecution()
    .then(params => params.map(params => ({
        name: `${params.code}: сезон ${params.tournamentName}, распределение на ${params.nextTour} тур`,
        value: params.id,
        short: `${params.tournamentName}, ${params.nextTour} тур`
    })));

const questions = [
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
        message: 'Код параметров распределения',
        when: answers => answers.action === 'distribution',
        choices: paramsChoices
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
        choices: paramsChoices
    },
];

inquirer.prompt(questions)
    .then(answers => answers)
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }
    })
    .then(answers => {
        if (answers.action === 'distribution') {
            const dataLoader = new DataLoader({
                params: paramsRepository,
                results: resultsRepository,
                distribution: distributionRepository,
                tournaments: tournamentsRepository,
            });
            new Distributor(dataLoader, distributionRepository)
                .distribute(answers.distribution.paramsId)
                .then(result => {
                    console.log("Начинаем сохранение " + result.length + " записей");
                    return result;
                })
                .then(result => distributionRepository.saveList(result))
                .then(number => console.log(`Создано ${number.flat().length} записей`))
                .catch(error => console.log('Произошла ошибка ' + error));
        } else if (answers.action === 'removeDistribution') {
            distributionRepository.removeByParamsId(answers.removeDistribution.paramsId)
                .then(number => console.log(`Удалено ${number.flat().length} записей`))
                .catch(error => console.log('Произошла ошибка ' + error))
        }
    });
