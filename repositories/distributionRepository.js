import {asyncAirtable} from "../config.js";
import {chunkArray} from "../utils.js";

const TABLE = 'Распределение команд';
const VIEW = 'main';

export default class DistributionRepository {
    getByTournamentAndTour = async (tournament, tour) => await asyncAirtable.select(TABLE, {
        view: VIEW,
        filterByFormula: `AND({ID турнира}='${tournament}', {Тур} = ${tour})`
    }).then(records => records.map(record => minify(record)));

    saveList = async records => chunkArray(records)
        .forEach(chunk =>
            asyncAirtable.bulkCreate(TABLE, chunk.map(record => ({
                "Турнир": [record.tournament],
                "Команда": [record.team],
                "Тур": `${record.tour}`,
                "Группа": record.group,
                "Параметры распределения": [record.paramsId]
            }))))

    saveList2 = async records =>
        asyncAirtable.bulkCreate(TABLE, records.slice(0, 9).map(record => ({
            "Турнир": [record.tournament],
            "Команда": [record.team],
            "Тур": `${record.tour}`,
            "Группа": record.group,
            "Параметры распределения": [record.paramsId],
        })))

    // saveList2 = async records =>
    //     console.log(records.slice(0, 9).map(record => ({
    //         "Турнир": [record.tournament],
    //         "Команда": [record.team],
    //         "Тур": `${record.tour}`,
    //         "Группа": record.group,
    //         "Параметры распределения": [record.paramsId]
    //     })));
}

export const minify = record => ({
    id: record.id,
    tournament: record.fields['ID турнира'],
    team: record.fields['Команда'][0],
    tour: parseInt(record.fields['Тур']),
    group: record.fields['Группа'],
});