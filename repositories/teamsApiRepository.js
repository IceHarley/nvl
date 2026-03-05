import {apiGet} from '../common/apiClient.js';

const toRecord = t => ({
    id: t.id,
    name: t.name || '',
    city: t.city || '',
    registrationDate: t.registration_date ?? null,
});

export default class TeamsApiRepository {
    getActiveTeams = async () => {
        const data = await apiGet('/teams/active');
        const arr = Array.isArray(data) ? data : (data.data || []);
        return arr.map(toRecord);
    };
}
