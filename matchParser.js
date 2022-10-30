import {format} from "./utils.js";

const SCORE_REGEXP = /(\d{1,2}):(\d{1,2})/;
const COMMON_MATCH_REGEXP = /(\d)\s*:\s*(\d)\s*\((\d{1,2}:\d{1,2})?,?\s*(\d{1,2}:\d{1,2})?,?\s*(\d{1,2}:\d{1,2})?,?\s*(\d{1,2}:\d{1,2})?,?\s*(\d{1,2}:\d{1,2})?,?\s*\)/;

export default class MatchParser {
    parseMatch = match => {
        MatchParser.#validateMatch(match);
        const parsedMatchData = this.#parseCommonMatch(match.result);
        if (parsedMatchData) {
            return this.#processCommonMatch(parsedMatchData, match);
        }
        if (this.#isTechMatch(match.result)) {
            return this.#processTechMatch(match.result, match);
        }
        MatchParser.#invalidMatch(match);
    }

    #parseCommonMatch = matchResult => matchResult.match(COMMON_MATCH_REGEXP);

    #processCommonMatch = (parsedMatchData, match) => {
        const winnerScore = parseInt(parsedMatchData[1]);
        const loserScore = parseInt(parsedMatchData[2]);
        const score = this.#calcScore(winnerScore + loserScore, parsedMatchData, match);
        return [{
            team: match.winner,
            points: this.#calculateWinnerPoints(winnerScore, loserScore),
            score: score
        }, {
            team: match.loser,
            points: this.#calculateLoserPoints(winnerScore, loserScore),
            score: -score
        }];
    };

    #calcScore = (games, parsedMatchData, match) => {
        let score = 0;
        for (let i = 3; i < 3 + games; i++) {
            if (!parsedMatchData[i]) {
                MatchParser.#invalidMatch(match);
            }
            let parsedScore = parsedMatchData[i].match(SCORE_REGEXP);
            if (!parsedScore || parsedScore.length !== 3) {
                MatchParser.#invalidMatch(match);
            }
            score += parseInt(parsedScore[1]) - parseInt(parsedScore[2]);
        }
        return score;
    };

    #calculateWinnerPoints = (winnerScore, loserScore) =>
        (winnerScore === 3 && loserScore === 2) || (winnerScore === 2 && loserScore === 1) ? 3 : 4;

    #calculateLoserPoints = (winnerScore, loserScore) =>
        (winnerScore === 3 && loserScore === 2) || (winnerScore === 2 && loserScore === 1) ? 1 : 0;

    #isTechMatch = matchResult => new RegExp(/^[+-]:-/).test(matchResult);

    #processTechMatch = (matchResult, match) => {
        const tech = matchResult.match(/(неявка|снятие)/);
        return [matchResult.startsWith('+') ? {
            team: match.winner,
            points: 4,
            score: 50
        } : {}, {
            team: match.loser,
            points: 0,
            score: -50,
            tech: !tech || tech.length < 1 ? 'иное' : tech[0]
        }];
    };

    static #validateMatch = match => {
        if (!match || !match.result) {
            this.#invalidMatch(match);
        }
    };

    static #invalidMatch = match => {
        throw new Error(`Некорректный формат матча ${format(match)}`);
    }
}