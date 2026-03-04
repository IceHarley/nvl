import {apiGet} from '../common/apiClient.js';

const toRecord = o => ({
    id: o.id,
    tournamentId: o.tournament_airtable_id || o.tournament_id,
    teamId: o.team_airtable_id || o.team_id,
    teamName: o.team_name || '',
    place: o.result_place ?? o.place ?? null,
});

export default class TournamentOutcomesApiRepository {
    getByActiveTournament = async () => {
        const data = await apiGet('/tournament-outcomes/active');
        const arr = Array.isArray(data) ? data : (data.data || []);
        return arr.map(toRecord);
    };
}
