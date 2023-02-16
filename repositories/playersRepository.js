import {asyncAirtable} from "../config.js";
import {chunkArray} from "../common/utils.js";

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

    createList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Имя": record.name,
            "Instagram": record.instagram,
            "Команда": [record.team],
        })))));

    updateList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Имя": record.name,
                "Instagram": record.instagram,
                "Команда": [record.team],
            }
        })))));

    deleteList = async ids => Promise.all(chunkArray(ids)
        .map(chunk => asyncAirtable.bulkDelete(TABLE, chunk)));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Имя'],
    instagram: record.fields['Instagram'],
    team: record.fields['Команда'] && record.fields['Команда'].length > 0
        ? record.fields['Команда'][0] : undefined,
    modified: record.fields['Изменен'],
});
