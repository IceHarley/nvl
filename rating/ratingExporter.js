import {FORMAT_EXCEL} from "../common/constants.js";
import ExcelSaver from "../excel/excelSaver.js";
import CsvRatingSaver from "../csv/csvRatingSaver.js";

const getRatingSaver = format => format === FORMAT_EXCEL
    ? new ExcelSaver()
    : new CsvRatingSaver(false, true);

const TOURNAMENT_NAME = 'Текущий турнир';

export const exportRating = (answers, ratingData) => {
    if (answers.rating.exportFormat) {
        const distributions = [];
        return getRatingSaver(answers.rating.exportFormat).save({
            tournamentName: TOURNAMENT_NAME,
            maxFileRecords: 30,
            fileName: process.env.GENERATED_PATH.concat(`Рейтинг ${TOURNAMENT_NAME} generated`)
        }, ratingData, distributions);
    }
};