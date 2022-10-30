import Distributor from "./distributor.js";
import {SpinnerDataLoader} from "./dataLoader.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distributionSaver.js";
import {DistributionRemover} from "./distributionRemover.js";
import {questions, repositories} from "./cli.js";
import RatingCalculator from "./ratingCalculator.js";


inquirer.prompt(questions)
    .then(answers => {
        if (answers.action === 'distribution') {
            const dataLoader = new SpinnerDataLoader(repositories);
            const dataSaver = dataSaverBuilder(answers.distribution.saveResults, repositories);
            new Distributor(dataLoader, dataSaver).distribute(answers.distribution.paramsId);
        } else if (answers.action === 'removeDistribution') {
            new DistributionRemover(repositories).removeDistribution(answers.removeDistribution.paramsId);
        } else if (answers.action === 'rating') {
            new RatingCalculator();
        }
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Your console environment is not supported!")
        } else {
            console.log(error)
        }
    });
