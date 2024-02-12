import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Расписание';
const VIEW = 'Расписание main';

// Таблица Расписание содержит только текущее расписание на 1 тур, поэтому всегда вычитываем и удаляем все содержимое таблицы
export default class ScheduleRepository {
    getAll = async () => asyncAirtable.select(TABLE, {
        view: VIEW,
    }).then(records => records.map(record => minify(record)));

    saveList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Распределение команд": record.distributions,
        })))));

    removeList = async records => Promise.all(
        chunkArray(records).map(chunk => asyncAirtable.bulkDelete(TABLE, chunk)));

    removeAll = async () => this.getAll()
        .then(records => records.map(r => r.id))
        .then(records => this.removeList(records));
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