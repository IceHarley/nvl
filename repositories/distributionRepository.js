import {asyncAirtable} from "../config.js";
import {chunkArray} from "../utils.js";

const TABLE = 'Распределение команд';
const VIEW = 'main';

export default class DistributionRepository {
    getByTournamentAndTour = async (tournament, tour) => await asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `AND({ID турнира}='${tournament}', {Тур} = ${tour})`
    }).then(records => records.map(record => minify(record)));

    getByParamsId = async paramsId => await asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `{Идентификатор параметров распределения}='${paramsId}'`
    }).then(records => records.map(record => minify(record)));

    saveList = async records => Promise.all(chunkArray(records)
        .map(chunk => asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
            "Турнир": [record.tournament],
            "Команда": [record.team],
            "Тур": `${record.tour}`,
            "Группа": record.newGroup,
            "Параметры распределения": [record.paramsId]
        })))));

    removeList = async records => Promise.all(
        chunkArray(records).map(chunk => asyncAirtable.bulkDelete(TABLE, chunk)));

    removeByParamsId = async paramsId => this.getByParamsId(paramsId)
        .then(records => this.removeList(records.map(record => record.id)));
}

export const minify = record => ({
    id: record.id,
    tournament: record.fields['ID турнира'],
    team: record.fields['Команда'][0],
    tour: parseInt(record.fields['Тур']),
    group: record.fields['Группа'],
});