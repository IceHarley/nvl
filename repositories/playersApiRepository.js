import {chunkArray} from '../common/utils.js';
import {apiGet, apiPost, apiPut, apiDelete} from '../common/apiClient.js';

export const CHUNK_SIZE = 50;

const toRecord = p => ({
    id: p.id,
    name: p.name || '',
    birthYear: p.birth_year ?? null,
    team: p.team_airtable_id || undefined,
    tournaments: p.tournament_results || [],
});

// API присваивает id сам (rec* — переиспользование пустой записи, loc_* — новая)
const toApiCreate = r => ({
    name: r.name,
    team_airtable_id: r.team ?? null,
    birth_year: r.birthYear ?? null,
    tournament_results: r.tournaments || [],
});

const toApiUpdate = r => ({
    id: r.id,
    team_airtable_id: r.team ?? null,
    name: r.name,
    birth_year: r.birthYear ?? null,
    tournament_results: r.tournaments || [],
});

export default class PlayersApiRepository {
    getList = async (options = {}) => {
        const params = {};
        if (options.syncedSince) params.syncedSince = options.syncedSince;
        const data = await apiGet('/players', params);
        return Array.isArray(data) ? data.map(toRecord) : (data.data || []).map(toRecord);
    };

    createList = async records => {
        const chunks = chunkArray(records.map(toApiCreate), CHUNK_SIZE);
        const allCreated = [];
        for (const chunk of chunks) {
            const res = await apiPost('/players', chunk);
            const created = res.created || res.data || res;
            allCreated.push(...created.map(toRecord));
        }
        return allCreated;
    };

    updateList = async records => {
        const chunks = chunkArray(records.map(toApiUpdate), CHUNK_SIZE);
        const allUpdated = [];
        for (const chunk of chunks) {
            const res = await apiPut('/players', chunk);
            const updated = res.updated || res.data || res;
            allUpdated.push(...updated.map(toRecord));
        }
        return allUpdated;
    };

    deleteList = async ids => {
        await apiDelete('/players', {ids});
    };
}
