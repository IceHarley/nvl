import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../common/airtable.js";

const TABLE = 'Распределение команд';
const VIEW = 'main';

export default class DistributionRepository {
    getByTournamentAndTour = async (tournament, tour) => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `AND({ID турнира}='${tournament}', {Тур} = ${tour})`,
        sort: [{field: 'Группа', direction: 'asc'}, {field: 'Позиция в группе', direction: 'asc'}],
    }).then(records => records.map(record => minify(record)));

    getByParamsId = async paramsId => asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Идентификатор параметров распределения}='${paramsId}'`
    }).then(records => records.map(record => minify(record)));

    saveList = async records => process.env.UPDATE_EMPTY_RECORDS_WHEN_CREATE
        ? this.#workaroundSaveList(records)
        : this.#normalSaveList(records);

    #normalSaveList = records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Турнир": [record.tournament],
            "Команда": [record.team],
            "Тур": `${record.tour}`,
            "Группа": record.newGroup,
            "Параметры распределения": [record.paramsId],
            'Позиция в группе': record.position,
        })))));

    getEmptyList = async count =>
        asyncAirtable.select(TABLE, {
            view: 'с пустыми записями',
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
                "Турнир": [record.tournament],
                "Команда": [record.team],
                "Тур": `${record.tour}`,
                "Группа": record.newGroup,
                "Параметры распределения": [record.paramsId],
                'Позиция в группе': record.position,
            }
        })))));

    clearList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                "Турнир": null,
                "Команда": null,
                "Тур": null,
                "Группа": null,
                "Параметры распределения": null,
                'Позиция в группе': null,
            }
        })))));

    removeList = async records => this.clearList(records);

    removeByParamsId = async paramsId => this.getByParamsId(paramsId)
        .then(records => this.removeList(records));

    updateSchedule = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                'Расписание (сохранится)': record.schedule,
            }
        })))));
}

const minifyEmpty = record => ({
    id: record.id,
});

export const minify = record => ({
    id: record.id,
    tournament: record.fields['ID турнира'][0],
    team: record.fields['Команда'][0],
    tour: parseInt(record.fields['Тур']),
    group: record.fields['Группа'],
    schedule: record.fields['Расписание'],
    position: record.fields['Позиция в группе'],
});