import MatchParser from "./matchParser.js";

export default class GroupParser {
    #parsedResults = [];
    #group;

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
        const matchParser = new MatchParser();
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
                if (!!teamResult.tech) {
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

    #sortTeams = () => {
        this.#parsedResults.sort((r1, r2) => r1.points === r2.points
            ? r1.score > r2.score ? -1 : 1
            : r1.points > r2.points ? -1 : 1);
    };

    #getTeam = key => this.#parsedResults.filter(t => t.team === key)[0];

    #makeTeams = groupResults => {
        const teamsKeys = new Set();
        groupResults.forEach(match => {
            match.winner && teamsKeys.add(match.winner);
            teamsKeys.add(match.loser);
        });
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
            this.#parsedResults[i].place = !this.#parsedResults[i].tech ? i + 1 : 3;
        }
    };
}