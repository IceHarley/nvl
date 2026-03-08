import {apiGet} from '../common/apiClient.js';

/**
 * Репозиторий для выгрузки рейтинга через Data API сайта.
 * Эндпоинты: GET /rating/export (активный турнир), GET /rating/export/{tournamentId}
 */
export default class RatingApiRepository {
    /**
     * Выгрузка рейтинга для активного турнира
     */
    getExport = async () => {
        const data = await apiGet('/rating/export');
        return Array.isArray(data) ? data : (data.data || []);
    };

    /**
     * Выгрузка рейтинга для указанного турнира
     */
    getExportByTournament = async tournamentId => {
        const data = await apiGet(`/rating/export/${tournamentId}`);
        return Array.isArray(data) ? data : (data.data || []);
    };
}
