import {apiGet} from '../common/apiClient.js';

const toRecord = t => ({
    id: t.id,
    code: t.code || '',
    name: t.name || '',
    type: t.tournament_type || '',
    // Кубковые правила (team_id не меняется, заявка сразу «заигран») — только при явном false
    isSeason: t.is_season !== false,
    status: t.status || '',
    startDate: t.start_date ?? null,
});

export default class TournamentsApiRepository {
    getRosterOpen = async () => {
        const data = await apiGet('/tournaments/roster-open');
        const arr = Array.isArray(data) ? data : (data.data || []);
        return arr.map(toRecord);
    };
}
