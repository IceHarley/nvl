import Distributor from "./distribution/distributor.js";
import inquirer from 'inquirer';
import {dataSaverBuilder} from "./distribution/distributionSaver.js";
import {DistributionRemover} from "./distribution/distributionRemover.js";
import {questions, repositories} from "./cli/cli.js";
import {SpinnerDataLoader} from "./distribution/dataLoader.js";
import PlayersManager from "./players/playersManager.js";
import {provideDb} from "./players/localDbProvider.js";
import {createPlayersApiRepositories} from "./players/playersApiRepositories.js";
import {exportRating} from "./rating/ratingExporter.js";
import {processSchedule, scheduleSaverBuilder} from "./distribution/scheduleProcessor.js";
import {withSpinner} from "./common/utils.js";

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
            const loadRatingFromApi = () => repositories.ratingApi.getExport();
            withSpinner(loadRatingFromApi, 'Загрузка рейтинга с сайта')()
                .then(ratingData => exportRating(answers, ratingData))
        } else if (answers.action === 'players') {
            new PlayersManager(createPlayersApiRepositories(), provideDb()).process();
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
