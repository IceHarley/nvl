import Distributor from "./distribution/distributor.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distribution/distributionSaver.js";
import {DistributionRemover} from "./distribution/distributionRemover.js";
import {questions, repositories} from "./cli/cli.js";
import {SpinnerRatingDataLoader} from "./rating/ratingDataLoader.js";
import RatingMaker from "./rating/ratingMaker.js";
import {ratingDataSaverBuilder} from "./rating/ratingSaver.js";
import {SpinnerDataLoader} from "./distribution/dataLoader.js";
import ExcelSaver from "./excel/excelSaver.js";
import {GENERATED_PATH} from "./config.js";
import {exportGroups} from "./common/groupsExporter.js";

const exportToExcel = (answers, ratingData) => {
    if (answers.rating.exportToExcel) {
        repositories.tournaments.getById(answers.rating.tournamentId)
            .then(tournament => Promise.all([
                repositories.distribution.getByTournamentAndTour(answers.rating.tournamentId, tournament.lastDistributedTour),
                tournament,
            ]))
            .then(([distributions, tournament]) => new ExcelSaver().save({
                tournamentName: tournament.name,
                fileName: GENERATED_PATH.concat(`Рейтинг ${tournament.name} generated.xlsx`)
            }, ratingData, distributions));
    }
};

inquirer.prompt(questions)
    .then(answers => {
        if (answers.action === 'distribution') {
            const dataLoader = new SpinnerDataLoader(repositories);
            const dataSaver = dataSaverBuilder(answers.distribution.saveResults, repositories);
            new Distributor(dataLoader, dataSaver).distribute(answers.distribution.paramsId);
        } else if (answers.action === 'removeDistribution') {
            new DistributionRemover(repositories).removeDistribution(answers.removeDistribution.paramsId);
        } else if (answers.action === 'rating') {
            const dataLoader = new SpinnerRatingDataLoader(repositories);
            const dataSaver = ratingDataSaverBuilder(answers.rating.saveResults, repositories);
            new RatingMaker(dataLoader, dataSaver).makeRating(answers.rating.tournamentId)
                .then(ratingData => exportToExcel(answers, ratingData))
        } else if (answers.action === 'groupsExport') {
            exportGroups(answers.groupsExport);
        }
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }
    });
