import {asyncAirtable} from "../config.js";

const TABLE = 'Команды';
export default class TeamsRepository {
    getById = async id => asyncAirtable.find(TABLE, id).then(record => minify(record));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Название'],
    city: record.fields['Город'],
    registrationDate: record.fields['Регистрация в Лиге'],
});
