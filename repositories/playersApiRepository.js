import {chunkArray} from '../common/utils.js';
import {apiGet, apiPost, apiPut, apiDelete} from '../common/apiClient.js';

export const CHUNK_SIZE = 50;

const toRecord = p => ({
    id: p.id,
    name: p.name || '',
    birthYear: p.birth_year ?? null,
    team: p.team_id || undefined,
    tournaments: p.tournament_results || [],
});

// API присваивает id сам (rec* — переиспользование пустой записи, loc_* — новая)
const toApiCreate = r => ({
    name: r.name,
    team_id: r.team ?? null,
    birth_year: r.birthYear ?? null,
    tournament_results: r.tournaments || [],
});

const toApiUpdate = r => ({
    id: r.id,
    team_id: r.team ?? null,
    name: r.name,
    birth_year: r.birthYear ?? null,
    tournament_results: r.tournaments || [],
});

export const extractMutationList = (res, key) => {
    if (res == null) return null;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res[key])) return res[key];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.[key])) return res.data[key];
    return null;
};

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
            const res = await apiPost('/players', {players: chunk});
            const created = extractMutationList(res, 'created');
            if (!created?.length) {
                throw new Error(
                    'API POST /players: в ответе нет списка созданных игроков (поле created или массив data).'
                );
            }
            allCreated.push(...created.map(toRecord));
        }
        return allCreated;
    };

    updateList = async records => {
        const chunks = chunkArray(records.map(toApiUpdate), CHUNK_SIZE);
        const allUpdated = [];
        for (const chunk of chunks) {
            const res = await apiPut('/players', {players: chunk});
            const updated = extractMutationList(res, 'updated');
            if (!updated?.length) {
                throw new Error(
                    'API PUT /players: в ответе нет списка обновлённых игроков (поле updated или массив data).'
                );
            }
            allUpdated.push(...updated.map(toRecord));
        }
        return allUpdated;
    };

    deleteList = async ids => {
        await apiDelete('/players', {ids});
    };
}
