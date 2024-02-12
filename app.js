import Distributor from "./distribution/distributor.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distribution/distributionSaver.js";
import {DistributionRemover} from "./distribution/distributionRemover.js";
import {questions, repositories} from "./cli/cli.js";
import {SpinnerRatingDataLoader} from "./rating/ratingDataLoader.js";
import RatingMaker from "./rating/ratingMaker.js";
import {ratingDataSaverBuilder} from "./rating/ratingSaver.js";
import {SpinnerDataLoader} from "./distribution/dataLoader.js";
import PlayersManager from "./players/playersManager.js";
import {provideDb} from "./players/localDbProvider.js";
import {exportRating} from "./rating/ratingExporter.js";
import {processSchedule, scheduleSaverBuilder} from "./distribution/scheduleProcessor.js";

inquirer.prompt(questions)
    .then(answers => {
        if (answers.action === 'distribution') {
            const dataLoader = new SpinnerDataLoader(repositories);
            const dataSaver = dataSaverBuilder(answers.distribution.saveResults, repositories);
            new Distributor(dataLoader, dataSaver).distribute(answers.distribution.paramsId)
                .then(() => scheduleSaverBuilder(answers.distribution.saveResults, repositories).saveSchedule(answers.distribution.paramsId));
        } else if (answers.action === 'removeDistribution') {
            new DistributionRemover(repositories).removeDistribution(answers.removeDistribution.paramsId);
        } else if (answers.action === 'schedule') {
            processSchedule(answers);
        } else if (answers.action === 'rating') {
            const dataLoader = new SpinnerRatingDataLoader(repositories);
            const dataSaver = ratingDataSaverBuilder(answers.rating.saveResults, repositories);
            new RatingMaker(dataLoader, dataSaver).makeRating(answers.rating.tournamentId)
                .then(ratingData => exportRating(answers, ratingData))
        } else if (answers.action === 'players') {
            new PlayersManager(repositories, provideDb()).process();
        } else {
            console.log(answers);
        }
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }

    });
