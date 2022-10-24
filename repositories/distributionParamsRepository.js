import {asyncAirtable} from "../config.js";

const TABLE = 'Параметры распределения';
const VIEW = 'main';

export default class DistributionParamsRepository {
    getByCode = async code => await asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Код}=${code}`,
        maxRecords: 1
    }).then(records => minify(records[0]));

    getReadyForExecution = async () => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: '{Статус}="Готово к запуску"',
    }).then(records => records.map(record => minify(record)));
}

export const minify = record => ({
    id: record.id,
    code: record.fields['Код'],
    tournament: record.fields['Турнир'].length < 1 ? undefined : record.fields['Турнир'][0],
    tournamentName: record.fields['Название турнира'],
    nextTour: parseInt(record.fields['Тур']),
    state: record.fields['Статус'],
    newTeams: record.fields['Новые команды'],
    withdrawed: record.fields['Снявшиеся команды'],
});