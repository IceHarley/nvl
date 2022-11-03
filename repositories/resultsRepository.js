import {isRegularTour} from "../common/utils.js";
import {asyncAirtable} from "../config.js";

const TABLE = 'Результаты матчей';
const VIEW = TABLE + ' private';

export default class ResultsRepository {
    getByTournamentAndTour = async (tournamentId, tour) => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `AND({ID турнира}='${tournamentId}', {Тур} = ${tour})`
    }).then(records => records.map(r => minify(r)));

    getByTournament = async tournamentId => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{ID турнира}='${tournamentId}'`
    }).then(records => records.map(r => minify(r)));
}

export const minify = record => ({
    id: record.id,
    tournament: record.fields['Турнир link'][0],
    group: record.fields['Группа'],
    winner: record.fields['Команда-победитель'] && record.fields['Команда-победитель'].length > 0
        ? record.fields['Команда-победитель'][0] : undefined,
    loser: record.fields['Команда-проигравший'] && record.fields['Команда-проигравший'].length > 0
        ? record.fields['Команда-проигравший'][0] : undefined,
    result: record.fields['Результат'],
    tour: isRegularTour(record.fields['Тур']) ? parseInt(record.fields['Тур']) : record.fields['Тур'],
    fullResult: record.fields['Результат полностью']
});