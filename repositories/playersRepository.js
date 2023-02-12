import {asyncAirtable} from "../config.js";

const TABLE = 'Игроки'
const VIEW = TABLE + ' private';

const DEFAULT_OPTIONS = {
    view: VIEW,
    filterByFormula: "NOT({Имя} = '')",
};

export default class PlayersRepository {
    getById = async id => asyncAirtable.find(TABLE, id).then(record => minify(record));

    getList = async options =>
        asyncAirtable.select(TABLE, {...DEFAULT_OPTIONS, ...options})
            .then(records => records.map(record => minify(record)));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Имя'],
    instagram: record.fields['Instagram'],
    team: record.fields['Команда'],
    modified: record.fields['Изменен'],
});
