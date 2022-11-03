import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../config.js";

const TABLE = 'Результаты турниров';
const VIEW = TABLE + ' private';

export default class TournamentOutcomesRepository {
    getByTournament = async tournamentId => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Идентификатор турнира}='${tournamentId}'`
    }).then(records => records.map(record => minify(record)));

    updateRatingList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Результат (место)": record.place,
                "Рейтинг": record.rating,
            }
        })))));
}

export const minify = record => ({
    id: record.id,
    tournamentId: record.fields['Идентификатор турнира'][0],
    teamId: record.fields['Команды'][0],
    teamName: record.fields['Команда'][0],
    place: record.fields['Результат (место)'],
});