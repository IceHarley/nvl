import Distributor from "./distribution/distributor.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distribution/distributionSaver.js";
import {DistributionRemover} from "./distribution/distributionRemover.js";
import {questions, repositories} from "./cli/cli.js";
import {SpinnerRatingDataLoader} from "./rating/ratingDataLoader.js";
import RatingMaker from "./rating/ratingMaker.js";
import {ratingDataSaverBuilder} from "./rating/ratingSaver.js";
import {SpinnerDataLoader} from "./distribution/dataLoader.js";

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
            new RatingMaker(dataLoader, dataSaver).makeRating(answers.rating.tournamentId);
        }
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }
    });
