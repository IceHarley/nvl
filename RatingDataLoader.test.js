import test from 'ava';
import MockResultsRepository from "./mock/mockResults.js";
import MockTournamentsRepository from "./mock/mockTournaments.js";
import RatingDataLoader from "./RatingDataLoader.js";
import MockTournamentResultsRepository from "./mock/mockTournamentResults.js";

const mockTournamentResultsRepository = new MockTournamentResultsRepository();
const mockResultsRepository = new MockResultsRepository();
const mockTournamentsRepository = new MockTournamentsRepository();

const TOURNAMENT_ID = 'recTBtRUiBwh3avjf';

const dataLoader = new RatingDataLoader({
    results: mockResultsRepository,
    tournamentResults: mockTournamentResultsRepository,
    tournaments: mockTournamentsRepository,
});

test.beforeEach(() => {
    mockTournamentResultsRepository.reset();
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
    const [tournament, previousTournament, results, tournamentResults] = await dataLoader.loadData(TOURNAMENT_ID);
    t.truthy(tournament);
    t.truthy(previousTournament);
    t.truthy(results.length > 0);
    t.truthy(tournamentResults.length > 0);
});
