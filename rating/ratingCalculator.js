import GroupsParser from "../common/groupsParser.js";
import {alphabetPosition, groupBy, isRegularTour} from "../common/utils.js";
import pkg from 'thenby';
import {
    NEW_TEAM,
    PLAYOFF_STAGES,
    STAGE_CONSOLATION_FINAL,
    STAGE_FINAL,
    STAGE_SEMIFINAL,
    WITHDRAW
} from "../common/constants.js";

const {firstBy} = pkg;

export default class RatingCalculator {
    calculate = (tournament, results = [], tournamentOutcomes, previousTournamentOutcomes = []) => {
        RatingCalculator.#validateGroupResults(tournament, tournamentOutcomes);
        const ratingTable = this.#makeRatingTable(tournamentOutcomes, previousTournamentOutcomes)
        let maxTour = this.#fillRatingTable(ratingTable, results);
        this.#fillTeamTours(ratingTable, maxTour);
        return this.#fillPlace(this.#sortRatingTable(ratingTable, maxTour));
    }

    #fillTeamTours = (ratingTable, maxTour) => ratingTable.forEach(team => {
        team.tours = this.#initTours(maxTour);
        team.regularTours.forEach(regularTour => team.tours[regularTour.tour - 1] = regularTour);
        team.tours = team.tours.concat(team.playoffTours.sort(firstBy(t => PLAYOFF_STAGES.indexOf(t.tour))));
        delete team.regularTours;
        delete team.playoffTours;
    });

    #initTours = maxTour => Array(maxTour).fill({}).map((_, index) => ({
        tour: index + 1,
        group: NEW_TEAM,
        groupPlace: 0,
        rating: 0
    }));

    #makeRatingTable = (tournamentOutcomes, previousTournamentOutcomes) => tournamentOutcomes
        .map(outcome => ({
            outcomeId: outcome.id,
            previousTournamentPlace: this.#getPreviousTournamentPlace(previousTournamentOutcomes, outcome),
            teamId: outcome.teamId,
            teamName: outcome.teamName,
            rating: 0,
            withdraw: false,
            regularTours: [],
            playoffTours: [],
        }));

    #fillRatingTable = (ratingTable, results) => {
        const groupedResults = groupBy(results, r => r.tour);

        let maxTour = 0;
        for (const tour of groupedResults.keys()) {
            maxTour = isRegularTour(tour) && tour > maxTour ? tour : maxTour;
            this.#parseTourGroups(groupedResults, tour, ratingTable);
        }
        return maxTour;
    };

    #sortRatingTable = (ratingTable, maxTour) => ratingTable.sort(this.#getComparator(maxTour));

    #parseTourGroups = (groupedResults, tour, ratingTable) => {
        new GroupsParser().parseGroups(groupedResults.get(tour)).flat().forEach(result => {
            this.#appendTeamTourResult(ratingTable, result, tour);
        })
    };

    #appendTeamTourResult = (ratingTable, result, tour) => {
        const team = ratingTable.find(row => row.teamId === result.team);
        if (team) {
            team.rating = team.rating + result.rating;
            team.withdraw = team.withdraw || !!result.tech && result.tech === WITHDRAW,
            team[isRegularTour(tour) ? 'regularTours' : 'playoffTours'].push({
                tour: tour,
                group: result.group,
                groupPlace: result.place,
                rating: result.rating,
            });
        }
    };

    #getPreviousTournamentPlace = (previousTournamentOutcomes, outcome) =>
        (previousTournamentOutcomes.find(prev => prev.teamId === outcome.teamId) || {}).place;

    #getComparator = maxTour => {
        let comparator = firstBy(row => this.#inFinal(row), "desc")
            .thenBy(row => this.#placeInFinal(row))
            .thenBy(row => this.#inConsolationFinal(row), "desc")
            .thenBy(row => this.#placeInConsolationFinal(row))
            .thenBy(row => this.#inSemiFinal(row), "desc")
            .thenBy(row => this.#placeInSemiFinal(row))
            .thenBy("rating", "desc")
            .thenBy("withdraw")
            .thenBy(row => row.tours.length);
        for (let tour = maxTour - 1; tour >= 0; tour--) {
            comparator = comparator
                .thenBy(row => row.tours.length > tour ? alphabetPosition(row.tours[tour].group) : 0)
                .thenBy(row => row.tours.length > tour ? row.tours[tour].groupPlace : 0)
        }
        comparator = comparator.thenBy("previousTournamentPlace");
        return comparator;
    };

    #inStage = (row, stage) => row.tours.some(t => t.group === stage);

    #inSemiFinal = row => this.#inStage(row, STAGE_SEMIFINAL);

    #inConsolationFinal = row => this.#inStage(row, STAGE_CONSOLATION_FINAL);

    #inFinal = row => this.#inStage(row, STAGE_FINAL);

    #placeInStage = (row, stage) => (row.tours.find(t => t.group === stage) || {groupPlace: 0}).groupPlace;

    #placeInFinal = row => this.#placeInStage(row, STAGE_FINAL);

    #placeInSemiFinal = row => this.#placeInStage(row, STAGE_SEMIFINAL);

    #placeInConsolationFinal = row => this.#placeInStage(row, STAGE_CONSOLATION_FINAL);

    static #validateGroupResults = (tournament, tournamentOutcomes) => {
        if (!tournament) {
            throw new Error('Турнир не найден');
        }
        if (!tournamentOutcomes || tournamentOutcomes.length === 0) {
            throw new Error('Результаты турнира не найдены');
        }
    };

    #fillPlace = ratingTable => ratingTable.map((team, index) => ({...team, place: index + 1}));
}