import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Турниры';
const VIEW = TABLE + ' private';

export default class TournamentsRepository {
    getById = async id => asyncAirtable.find(TABLE, id)
        .then(record => minify(record));

    getPrevious = async tournament => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `AND({Код}<'${tournament.code}', {Формат} = '${tournament.format}', {Тип турнира} = '${tournament.type}')`,
        fields: ['Название', 'Код', 'Формат', 'Тип турнира', 'Статус'],
        sort: [{field: 'Код', direction: 'desc'}],
        maxRecords: 1
    }).then(records => minify(records[0]));

    getByState = async state => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Статус}="${state}"`,
    }).then(records => records.map(record => minify(record)));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Название'],
    state: record.fields['Статус'],
    code: parseFloat(record.fields['Код']),
    format: record.fields['Формат'],
    type: record.fields['Тип турнира'],
    lastDistributedTour: record.fields['Последний распределенный тур'],
});
