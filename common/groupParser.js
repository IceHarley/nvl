import MatchParser from "./matchParser.js";
import {alphabetPosition} from "./utils.js";
import pkg from 'thenby';
import {DEFAULT_RATING_RULES} from "./constants.js";

const {firstBy} = pkg;

export default class GroupParser {
    #parsedResults = [];
    #group;
    #skipEmptyMatches
    #ratingRules

    constructor(skipEmptyMatches = false, ratingRules = DEFAULT_RATING_RULES) {
        this.#skipEmptyMatches = skipEmptyMatches;
        this.#ratingRules = ratingRules;
    }

    parseGroup = groupResults => {
        GroupParser.#validateGroupResults(groupResults);
        this.#fillGroup(groupResults);
        this.#makeTeams(groupResults);
        this.#parseMatches(groupResults);
        this.#sortTeams();
        this.#fillTeamPlaces();
        return this.#parsedResults;
    }

    #parseMatches = groupResults => {
        const matchParser = new MatchParser(this.#skipEmptyMatches);
        groupResults.forEach(match => {
            const parsedMatch = matchParser.parseMatch(match);
            for (const teamResult of parsedMatch) {
                if (!teamResult || teamResult === {}) {
                    continue;
                }
                const team = this.#getTeam(teamResult.team);
                if (!team) {
                    continue;
                }
                team.points += teamResult.points;
                team.score += teamResult.score;
                if (teamResult.tech) {
                    team.tech = teamResult.tech;
                }
            }
        });
    };

    static #validateGroupResults = groupResults => {
        if (!groupResults || groupResults.length === 0) {
            GroupParser.#failParsing('Пустой список результатов группы', groupResults);
        }
    };

    #fillGroup = groupResults => {
        this.#group = groupResults[0].group;
        if (!this.#group || groupResults.some(r => r.group !== this.#group)) {
            GroupParser.#failParsing('Результаты матчей должны быть из единой группы', groupResults);
        }
    };

    static #failParsing = (message, groupResults) => {
        throw new Error(`${message} ${JSON.stringify(groupResults, null, 2)}`);
    };

    #sortTeams = () => this.#parsedResults.sort(firstBy('points', 'desc').thenBy('score', 'desc'));

    #getTeam = key => this.#parsedResults.filter(t => t.team === key)[0];

    #makeTeams = groupResults => {
        const teamsKeys = new Set();
        groupResults.forEach(match => {
            match.winner && teamsKeys.add(match.winner);
            teamsKeys.add(match.loser);
        });
        teamsKeys.delete(undefined);
        this.#fillResults(teamsKeys);
    };

    #fillResults = teamsKeys => {
        this.#parsedResults = [];
        for (const key of teamsKeys) {
            this.#parsedResults.push({
                team: key,
                group: this.#group,
                points: 0,
                score: 0,
            })
        }
    };

    #fillTeamPlaces = () => {
        for (let i = 0; i < this.#parsedResults.length; i++) {
            const item = this.#parsedResults[i];
            item.place = !item.tech ? i + 1 : 3;
            item.rating = this.#calcRating(this.#group, item.place, item.tech)
        }
    };

    #calcRating = (group, place, tech) => {
        if (group.length > 1) {
            return 0;
        }
        for (const increase of this.#ratingRules) {
            if (alphabetPosition(group) <= alphabetPosition(increase[0])) {
                if (tech) {
                    return increase[4]
                } else {
                    return increase[place];
                }
            }
        }
        throw new Error("Некорректная группа " + group);
    };
}