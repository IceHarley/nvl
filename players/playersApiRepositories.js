import PlayersApiRepository from '../repositories/playersApiRepository.js';
import TeamsApiRepository from '../repositories/teamsApiRepository.js';
import TournamentOutcomesApiRepository from '../repositories/tournamentOutcomesApiRepository.js';
import TournamentsApiRepository from '../repositories/tournamentsApiRepository.js';

export const createPlayersApiRepositories = () => ({
    players: new PlayersApiRepository(),
    teams: new TeamsApiRepository(),
    tournamentOutcomes: new TournamentOutcomesApiRepository(),
    tournaments: new TournamentsApiRepository(),
});
