import test from 'ava';
import MockResultsRepository from "./mock/mockResults.js";
import MockDistributionRepository from "./mock/mockDistribution.js";
import MockTournamentsRepository from "./mock/mockTournaments.js";
import MockDistributionParamsRepository from "./mock/mockDistributionParams.js";
import DataLoader from "./dataLoader.js";

const mockParamsRepository = new MockDistributionParamsRepository();
const mockDistributionRepository = new MockDistributionRepository();
const mockResultsRepository = new MockResultsRepository();
const mockTournamentsRepository = new MockTournamentsRepository();

const PARAMS_ID = 'recqUk1lPBnwz4s41';

const dataLoader = new DataLoader({
    params: mockParamsRepository,
    results: mockResultsRepository,
    distribution: mockDistributionRepository,
    tournaments: mockTournamentsRepository,
});

test.beforeEach(() => {
    mockParamsRepository.reset();
    mockResultsRepository.reset();
    mockDistributionRepository.reset();
});

test.serial('загрузка данных: для пустых параметров - ошибка', async t => {
    await t.throwsAsync(dataLoader.loadData(), {
        message: 'Параметры с идентификатором undefined не найдены'
    });
});

test.serial('загрузка данных: для не найденных параметров - ошибка', async t => {
    await t.throwsAsync(dataLoader.loadData('unknownCode', {
        message: 'Параметры с кодом unknownCode не найдены'
    }));
});

test.serial('загрузка данных: для параметров в статус отличном от "Готово к запуску" - ошибка', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).state = 'некорректный статус';
    await t.throwsAsync(dataLoader.loadData(PARAMS_ID), {
        message: "Параметры с кодом 1 в статусе 'некорректный статус' отличном от 'Готово к запуску'"
    });
});

test.serial('загрузка данных: не заполнен турнир - ошибка', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).tournament = undefined;
    await t.throwsAsync(dataLoader.loadData(PARAMS_ID), {
        message: 'В параметрах с кодом 1 не заполнен турнир'
    });
});

test.serial('загрузка данных: не заполнен тур - ошибка', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).nextTour = undefined;
    await t.throwsAsync(dataLoader.loadData(PARAMS_ID), {
        message: 'В параметрах с кодом 1 не заполнен тур'
    });
});

test.serial('для генерации первого тура текущий тур третий (прошлого сезона), предыдущий - второй (прошлого сезона)', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).nextTour = 1;
    const [params] = await dataLoader.loadData(PARAMS_ID);
    t.like(params, {
        nextTour: 1,
        previousTournament: {code: 22.1},
        results: [params.previousTournament.id, 3],
        distribution: [params.previousTournament.id, 2],
    });
});

test.serial('для генерации второго тура текущий тур первый, предыдущий - третий (прошлого сезона)', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).nextTour = 2;
    const [params] = await dataLoader.loadData(PARAMS_ID);
    t.like(params, {
        nextTour: 2,
        previousTournament: {code: 22.1},
        results: [params.currentTournament.id, 1],
        distribution: [params.previousTournament.id, 3],
    });
});

test.serial('для генерации третьего тура текущий тур второй, предыдущий - первый', async t => {
    (await mockParamsRepository.getById(PARAMS_ID)).nextTour = 3;
    const [params] = await dataLoader.loadData(PARAMS_ID);
    t.like(params, {
        nextTour: 3,
        previousTournament: {code: 22.1},
        results: [params.currentTournament.id, 2],
        distribution: [params.currentTournament.id, 1]
    });
});

test.serial('результаты тура считаны', async t => {
    const [, results] = await dataLoader.loadData(PARAMS_ID);
    t.truthy(results.length > 0);
});

test.serial('предыдущее распределение считано', async t => {
    const [, , distribution] = await dataLoader.loadData(PARAMS_ID);
    t.truthy(distribution.length > 0);
});