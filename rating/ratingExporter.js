import {repositories} from "../cli/cli.js";
import {FORMAT_EXCEL} from "../common/constants.js";
import ExcelSaver from "../excel/excelSaver.js";
import CsvRatingSaver from "../csv/csvRatingSaver.js";

const getRatingSaver = format => format === FORMAT_EXCEL
    ? new ExcelSaver()
    : new CsvRatingSaver(false, true);

export const exportRating = (answers, ratingData) => {
    if (answers.rating.exportFormat) {
        repositories.tournaments.getById(answers.rating.tournamentId)
            .then(tournament => Promise.all([
                repositories.distribution.getByTournamentAndTour(answers.rating.tournamentId, tournament.lastDistributedTour),
                tournament,
            ]))
            .then(([distributions, tournament]) => getRatingSaver(answers.rating.exportFormat).save({
                tournamentName: tournament.name,
                maxFileRecords: 30,
                fileName: process.env.GENERATED_PATH.concat(`Рейтинг ${tournament.name} generated`)
            }, ratingData, distributions));
    }
};