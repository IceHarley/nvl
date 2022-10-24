import {asyncAirtable} from "../config.js";

const TABLE = 'Команды';
const VIEW = TABLE + ' private';

export default class TeamsRepository {
    getById = async id => await asyncAirtable.find(TABLE, id).then(record => minify(record));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Название'],
    city: record.fields['Город'],
    registrationDate: record.fields['Регистрация в Лиге'],
});
