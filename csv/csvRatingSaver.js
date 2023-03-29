import {stringify} from 'csv-stringify';
import {writeFileSync} from 'fs';
import {isRegularTour} from "../common/utils.js";
import {mergeDistributions, ROME} from "../excel/excelSaver.js";

export default class CsvRatingSaver {
    #silent
    #encode

    constructor(silent, encode = false) {
        this.#silent = silent;
        this.#encode = encode;
    }

    save = async (meta, ratingData, distributions) => {
        let values = mergeDistributions(ratingData, distributions)
            .map(record => ({
                place: record.place,
                delta: record.delta,
                team: record.teamName,
                group1: record.tours[0] && record.tours[0].group,
                groupPlace1: record.tours[0] && record.tours[0].groupPlace,
                rating1: record.tours[0] && record.tours[0].rating,
                group2: record.tours[1] && record.tours[1].group,
                groupPlace2: record.tours[1] && record.tours[1].groupPlace,
                rating2: record.tours[1] && record.tours[1].rating,
                group3: record.tours[2] && record.tours[2].group,
                groupPlace3: record.tours[2] && record.tours[2].groupPlace,
                rating3: record.tours[2] && record.tours[2].rating,
                rating: record.tours.some(tour => !isRegularTour(tour.tour)) ? ROME[record.place] : record.rating,
                withdraw: record.withdraw,
                visible: 1,
                isPlayoffTeam: record.place <= 6,
            }))
        while (values.length % meta.maxFileRecords > 0) {
            values.push({visible: 0});
        }
        for (let i = 1; i <= values.length / meta.maxFileRecords; i++) {
            stringify(values.slice((i - 1) * 25, i * 25), {
                header: true,
                columns: ['place', 'delta', 'team', 'group1', 'groupPlace1', 'rating1', 'group2', 'groupPlace2', 'rating2',
                    'group3', 'groupPlace3', 'rating3', 'rating', 'withdraw', 'visible', 'isPlayoffTeam'],
            }, (err, output) => {
                writeFileSync(`${meta.fileName}${i}.csv`, output);
                !this.#silent && console.log(`Рейтинг турнира ${meta.tournamentName} сохранен в файл ${meta.fileName}${i}.csv`)
            });
        }
    };

}