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

// Сервер отклоняет записи поштучно (например, вторую отметку «заигран» в одном турнире), остальные сохраняет.
// errors[].index — позиция в отправленной пачке.
const rejectedOf = (res, chunk) => (res.errors || []).map(e => ({
    id: chunk[e.index]?.id ?? e.id,
    name: chunk[e.index]?.name,
    error: e.error,
}));

export default class PlayersApiRepository {
    getList = async (options = {}) => {
        const params = {};
        if (options.syncedSince) params.syncedSince = options.syncedSince;
        const data = await apiGet('/players', params);
        return Array.isArray(data) ? data.map(toRecord) : (data.data || []).map(toRecord);
    };

    /**
     * onChunk вызывается после каждой пачки: принятое сервером нужно зафиксировать локально сразу,
     * иначе сбой следующей пачки приведёт к повторной отправке (и дубликатам) уже созданных игроков.
     * @param records
     * @param {function({saved: {localId: string, record: object}[], rejected: {id: string, name: string, error: string}[]}): Promise} onChunk
     */
    createList = async (records, onChunk) => {
        for (const chunk of chunkArray(records, CHUNK_SIZE)) {
            const res = await apiPost('/players', chunk.map(toApiCreate));
            // created идут в порядке отправки без отклонённых — по нему восстанавливаем локальный id
            const rejectedIndexes = new Set((res.errors || []).map(e => e.index));
            const accepted = chunk.filter((r, index) => !rejectedIndexes.has(index));
            const created = res.created || res.data || res;
            if (!Array.isArray(created) || created.length !== accepted.length) {
                throw new Error(`Ответ сервера на создание игроков не сопоставляется с отправленными: `
                    + `принято ${accepted.length}, вернулось ${created?.length}. `
                    + `Проверьте на сервере игроков: ${accepted.map(r => r.name).join(', ')}`);
            }
            await onChunk({
                saved: created.map((record, index) => ({localId: accepted[index].id, record: toRecord(record)})),
                rejected: rejectedOf(res, chunk),
            });
        }
    };

    /**
     * @param records
     * @param {function({saved: object[], rejected: {id: string, name: string, error: string}[]}): Promise} onChunk
     */
    updateList = async (records, onChunk) => {
        for (const chunk of chunkArray(records.map(toApiUpdate), CHUNK_SIZE)) {
            const res = await apiPut('/players', chunk);
            const updated = res.updated || res.data || res;
            await onChunk({
                saved: Array.isArray(updated) ? updated.map(toRecord) : [],
                rejected: rejectedOf(res, chunk),
            });
        }
    };

    deleteList = async ids => {
        await apiDelete('/players', {ids});
    };
}
