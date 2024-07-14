import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Расписание';
const VIEW = 'Расписание main';

// Таблица Расписание содержит только текущее расписание на один тур, поэтому всегда вычитываем и очищаем все содержимое таблицы
export default class ScheduleRepository {
    getAll = async () => asyncAirtable.select(TABLE, {
        view: VIEW,
    }).then(records => records.map(record => minify(record)));

    saveList = async records => process.env.UPDATE_EMPTY_RECORDS_WHEN_CREATE
        ? this.#workaroundSaveList(records)
        : this.#normalSaveList(records);

    #normalSaveList = records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Распределение команд": record.distributions,
        })))));

    getEmptyList = async count =>
        asyncAirtable.select(TABLE, {
            view: VIEW,
            filterByFormula: "{Турнир} = ''",
            maxRecords: count,
        }).then(records => records.map(record => minifyEmpty(record)));

    #workaroundSaveList = records =>
        this.getEmptyList(records.length)
            .then(emptyRecords => records.map((record, index) => ({
                ...record,
                id: emptyRecords[index].id
            }))) //объединяем записи с идентификаторами
            .then(records => this.updateList(records));

    updateList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Распределение команд": record.distributions,
            }
        })))));

    removeAll = async () => this.getAll()
        .then(records => records.map(r => ({...r, distributions: null})))
        .then(records => this.updateList(records));
}

export const minify = record => ({
    id: record.id,
    distributions: record.fields['Распределение команд'],
    teams: record.fields['Команды'],
    tournament: record.fields['Турнир'] && record.fields['Турнир'][0],
    group: record.fields['Группа'] && record.fields['Группа'][0],
    tour: !record.fields['Тур'] ? 0 : parseInt(record.fields['Тур']),
    text: record.fields['Текст'],
});

const minifyEmpty = record => ({
    id: record.id,
});