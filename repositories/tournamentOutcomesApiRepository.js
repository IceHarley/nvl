import {apiGet} from '../common/apiClient.js';

const toRecord = o => ({
    id: o.id,
    tournamentId: o.tournament_id,
    teamId: o.team_id,
    teamName: o.team_name || '',
    place: o.result_place ?? null,
});

const toRecords = data => (Array.isArray(data) ? data : (data.data || [])).map(toRecord);

export default class TournamentOutcomesApiRepository {
    getByActiveTournament = async () => toRecords(await apiGet('/tournament-outcomes/active'));

    getByTournament = async tournamentId =>
        toRecords(await apiGet('/tournament-outcomes/active', {tournament_id: tournamentId}));
}
