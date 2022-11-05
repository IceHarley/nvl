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

const exportToExcel = (answers, ratingData) => {
    if (answers.rating.exportToExcel) {
        Promise.all([
            repositories.distribution.getByTournamentAndTour(answers.rating.tournamentId, ratingData[0].tours.length),
            repositories.tournaments.getById(answers.rating.tournamentId)
        ]).then(([distributions, tournament]) => new ExcelSaver().save({
            tournamentName: tournament.name,
            fileName: 'd:\\Users\\levin\\Documents\\NVL\\2022 осень\\Рейтинг Осень 2022 сгенерированный.xlsx',
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
        }
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }
    });
