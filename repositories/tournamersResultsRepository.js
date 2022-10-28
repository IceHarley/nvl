import {asyncAirtable} from "../config.js";

const TABLE = 'Результаты турниров';
const VIEW = TABLE + 'private';

export default class TournamentResultsRepository {
    getByTournament = async tournamentId => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Идентификатор турнира}='${tournamentId}'`
    }).then(records => records.map(record => minify(record)));
}

export const minify = record => ({
    id: record.id,
    tournamentId: record.fields['Идентификатор турнира'][0],
    teamId: record.fields['Команды'][0],
    teamName: record.fields['Команда'][0],
    result: record.fields['Результат (место)'],
});