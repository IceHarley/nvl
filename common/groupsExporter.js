import {repositories} from "../cli/cli.js";
import {GENERATED_PATH} from "../config.js";
import {FORMAT_EXCEL} from "./constants.js";
import ExcelGroupsExporter from "../excel/excelGroupsExporter.js";
import CsvGroupsExporter from "../csv/csvGroupsExporter.js";

const getGroupsExporter = format => format === FORMAT_EXCEL
    ? new ExcelGroupsExporter()
    : new CsvGroupsExporter(false, true);

const getFileExtension = format => format === FORMAT_EXCEL ? 'xlsx' : 'csv';

export const exportGroups = params => {
    repositories.tournaments.getById(params.tournamentId)
        .then(tournament => Promise.all([
            repositories.distribution.getByTournamentAndTour(params.tournamentId, tournament.lastDistributedTour),
            tournament,
            repositories.teams.getActiveTeams(),
        ])).then(([distributions, tournament, teams]) => {
        return getGroupsExporter(params.format).export({
            tournamentName: tournament.name,
            fileName: GENERATED_PATH.concat(`${tournament.name} группы на ${tournament.lastDistributedTour} тур.${getFileExtension(params.format)}`)
        }, distributions, teams);
    });
};