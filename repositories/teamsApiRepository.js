import {apiGet} from '../common/apiClient.js';

const toRecord = t => ({
    id: t.id,
    name: t.name || '',
    city: t.city || '',
    registrationDate: t.registration_date ?? null,
});

const toRecords = data => (Array.isArray(data) ? data : (data.data || [])).map(toRecord);

export default class TeamsApiRepository {
    getActiveTeams = async () => toRecords(await apiGet('/teams/active'));

    getByTournament = async tournamentId => toRecords(await apiGet('/teams/active', {tournament_id: tournamentId}));
}
