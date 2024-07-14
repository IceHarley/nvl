import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Игроки'
const VIEW = TABLE + ' private';

const DEFAULT_OPTIONS = {
    view: VIEW,
    filterByFormula: "NOT({Имя} = '')",
};

const EMPTY_OPTIONS = (count) => ({
    view: VIEW,
    filterByFormula: "{Имя} = ''",
    maxRecords: count,
});

export default class PlayersRepository {
    getById = async id => asyncAirtable.find(TABLE, id).then(record => minify(record));

    getList = async options =>
        asyncAirtable.select(TABLE, {...DEFAULT_OPTIONS, ...options})
            .then(records => records.map(record => minify(record)));

    createList = async records => process.env.UPDATE_EMPTY_RECORDS_WHEN_CREATE
        ? this.workaroundCreateList(records)
        : this.normalCreateList(records);

    normalCreateList = records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Имя": record.name,
            "Instagram": record.instagram,
            "Команда": record.team ? [record.team] : [],
            "Турниры": record.tournaments,
        })))));

    workaroundCreateList = records =>
        this.getList(EMPTY_OPTIONS(records.length))
            .then(emptyRecords => records.map((record, index) => ({...record, id: emptyRecords[index].id}))) //объединяем записи с идентификаторами
            .then(records => this.updateList(records));

    updateList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Имя": record.name,
                "Instagram": record.instagram,
                "Команда": record.team ? [record.team] : [],
                "Турниры": record.tournaments,
            }
        })))));

    deleteList = async records => Promise.all(chunkArray(records.map(r => ({id: r})))
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Имя": null,
                "Instagram": null,
                "Команда": null,
                "Турниры": null,
            }
        })))));
}

export const minify = record => ({
    id: record.id,
    name: record.fields['Имя'],
    instagram: record.fields['Instagram'],
    team: record.fields['Команда'] && record.fields['Команда'].length > 0
        ? record.fields['Команда'][0] : undefined,
    tournaments: record.fields['Турниры'] || [],
    modified: record.fields['Изменен'],
});
