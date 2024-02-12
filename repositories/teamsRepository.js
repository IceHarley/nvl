import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Команды'
const VIEW = TABLE + ' private';

export default class TeamsRepository {
    getById = async id => asyncAirtable.find(TABLE, id).then(record => minify(record));

    getActiveTeams = async () => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Участвует в текущем турнире} = 1`
    }).then(records => records.map(record => minify(record)));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Название'],
    city: record.fields['Город'],
    registrationDate: record.fields['Регистрация в Лиге'],
});
