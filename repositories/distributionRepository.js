import {chunkArray} from "../common/utils.js";
import {asyncAirtable} from "../config.js";

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

    saveList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Турнир": [record.tournament],
            "Команда": [record.team],
            "Тур": `${record.tour}`,
            "Группа": record.newGroup,
            "Параметры распределения": [record.paramsId],
            'Позиция в группе': record.position,
        })))));

    removeList = async records => Promise.all(
        chunkArray(records).map(chunk => asyncAirtable.bulkDelete(TABLE, chunk)));

    removeByParamsId = async paramsId => this.getByParamsId(paramsId)
        .then(records => this.removeList(records.map(record => record.id)));

    updateSchedule = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkUpdate(TABLE, chunk.map(record => ({
            id: record.id,
            fields: {
                'Расписание': record.schedule,
            }
        })))));
}

export const minify = record => ({
    id: record.id,
    tournament: record.fields['ID турнира'][0],
    team: record.fields['Команда'][0],
    tour: parseInt(record.fields['Тур']),
    group: record.fields['Группа'],
    schedule: record.fields['Расписание'],
    position: record.fields['Позиция в группе'],
});