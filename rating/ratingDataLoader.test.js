import test from 'ava';
import MockResultsRepository from "../mock/mockResults.js";
import MockTournamentsRepository from "../mock/mockTournaments.js";
import RatingDataLoader from "./ratingDataLoader.js";
import MockTournamentOutcomesRepository from "../mock/mockTournamentOutcomes.js";

const mockTournamentOutcomesRepository = new MockTournamentOutcomesRepository();
const mockResultsRepository = new MockResultsRepository();
const mockTournamentsRepository = new MockTournamentsRepository();

const TOURNAMENT_ID = 'recTBtRUiBwh3avjf';

const dataLoader = new RatingDataLoader({
    results: mockResultsRepository,
    tournamentOutcomes: mockTournamentOutcomesRepository,
    tournaments: mockTournamentsRepository,
});

test.beforeEach(() => {
    mockTournamentOutcomesRepository.reset();
    mockResultsRepository.reset();
    mockTournamentsRepository.reset();
});

test.serial('для пустого id турнира - ошибка', async t => {
    await t.throwsAsync(dataLoader.loadData(), {
        message: 'Турнир с идентификатором undefined не найден'
    });
});

test.serial('для не найденного id турнира - ошибка', async t => {
    await t.throwsAsync(dataLoader.loadData('unknownId', {
        message: 'Турнир с идентификатором unknownId не найден'
    }));
});

test.serial('результаты считаны', async t => {
    const [tournament, results, tournamentOutcomes, previousTournamentOutcomes] = await dataLoader.loadData(TOURNAMENT_ID);
    t.truthy(tournament);
    t.truthy(results.length > 0);
    t.truthy(tournamentOutcomes.length > 0);
    t.truthy(previousTournamentOutcomes.length > 0);
});
