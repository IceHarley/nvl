import Distributor from "./distributor.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distributionSaver.js";
import {DistributionRemover} from "./distributionRemover.js";
import {questions, repositories} from "./cli.js";
import {SpinnerRatingDataLoader} from "./RatingDataLoader.js";
import RatingMaker from "./ratingMaker.js";
import {ratingDataSaverBuilder} from "./ratingSaver.js";
import {SpinnerDataLoader} from "./dataLoader.js";

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
