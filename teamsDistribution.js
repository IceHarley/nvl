import {alphabetPosition, groupBy, positionToChar} from "./utils.js";
import GroupParser from "./groupParser.js";

const NEW_TEAM = '+';

export default class TeamsDistribution {
    #groupParser = new GroupParser();

    distribute = (tourResults, lastDistribution = [], newTeams = [], withdrawedTeams = []) => {
        TeamsDistribution.#validateTourResults(tourResults);
        let teams = this.#makeTeamsList(tourResults, lastDistribution, withdrawedTeams);
        teams = TeamsDistribution.#appendNewTeams(teams, newTeams);
        TeamsDistribution.#fillHighestNewGroup(teams);
        TeamsDistribution.#sortTeams(teams);
        TeamsDistribution.#applyHighestNewGroup(teams);
        TeamsDistribution.#fillNewGroup(teams);
        TeamsDistribution.#sortInGroups(teams);
        TeamsDistribution.#clearHighestNewGroup(teams);
        return teams;
    };

    static #clearHighestNewGroup = teams =>
        teams.forEach(team => {
            delete team.previousGroupIndex;
            delete team.groupIndex;
            delete team.highestNewGroup;
            delete team.isLastGroup;
        });

    static #fillNewGroup = teams => {
        for (let i = 0; i < teams.length; i++) {
            teams[i].newGroup = positionToChar(i / 3);
        }
    };

    static #sortInGroups = teams => teams.sort((t1, t2) => t1.newGroup === t2.newGroup && t1.place === t2.place
        ? t1.previousGroupIndex - t2.previousGroupIndex
        : 0);

    static #sortTeams = teams => teams.sort((t1, t2) => this.#comparator(t1, t2));

    static #comparator = (t1, t2) => {
        if (t1.group === NEW_TEAM || t2.group === NEW_TEAM) {
            return this.#compareNewTeams(t1, t2);
        } else if (Math.abs(t1.groupIndex - t2.groupIndex) > 1) {
            return t1.groupIndex - t2.groupIndex;
        } else if (t1.groupIndex === t2.groupIndex) {
            return this.#compareInSameGroup(t1, t2);
        } else if (t1.groupIndex < t2.groupIndex) {
            return this.#compareInAdjacentGroups(t1.place, t2.place);
        } else {
            return this.#compareInAdjacentGroups(t2.place, t1.place);
        }
    };

    static #compareInAdjacentGroups = (place1, place2) => place1 === 3 && place2 === 1 ? -1 : 1;

    static #compareInSameGroup = (t1, t2) => {
        return t1.place === t2.place && t1.previousGroupIndex && t2.previousGroupIndex
            ? t2.previousGroupIndex - t1.previousGroupIndex
            : t1.place - t2.place;
    };

    static #applyHighestNewGroup = teams => {
        for (let i = 0; i < teams.length; i++) {
            if (i / 3 < teams[i].highestNewGroup) {
                for (let j = i + 1; j < teams.length; j++) {
                    if (i / 3 >= teams[j].highestNewGroup) {
                        [teams[i], teams[j]] = [teams[j], teams[i]];
                        break;
                    }
                }
            }
        }
        teams.filter(team => team); //удаляем undefined
    };

    static #fillHighestNewGroup = teams => teams
        .forEach(team => team.highestNewGroup = !team.tech ? 0 : alphabetPosition(team.group) + 1);

    #makeTeamsList = (tourResults, lastDistribution, withdrawedTeams) => Array
        .from(groupBy(tourResults, this.#groupKeyGetter()).values(), this.#parseGroup())
        .map(this.#fillLastGroupField())
        .flat()
        .filter(this.#excludeWithdrawed(withdrawedTeams))
        .map(this.#addGroupIndices(lastDistribution));

    #excludeWithdrawed = withdrawedTeams => team =>
        team.tech !== 'снятие' && !withdrawedTeams.find(w => w.team === team.team);

    #addGroupIndices = lastDistribution => team => ({
        ...team,
        groupIndex: alphabetPosition(team.group),
        previousGroupIndex: alphabetPosition(this.#getPreviousGroup(lastDistribution, team)),
    });

    #groupKeyGetter = () => matchResult => matchResult.group

    #fillLastGroupField = () => (group, index, groups) => group.map(team => ({
        ...team,
        isLastGroup: index === groups.length - 1
    }));

    #parseGroup = () => group => this.#groupParser.parseGroup(group);

    #getPreviousGroup = (lastDistribution, team) =>
        (lastDistribution.find(d => d.team === team.team) || {}).group;

    static #validateTourResults = tourResults => {
        if (!tourResults || tourResults.length === 0) {
            throw new Error('Пустой список результатов группы');
        }
    };

    static #appendNewTeams = (teams, newTeams) =>
        teams.concat(newTeams.map((newTeam, index) => ({
            team: newTeam,
            group: NEW_TEAM,
            place: index + 1
        })));

    static #compareNewTeams = (t1, t2) => this.#isFirstNewTeam(t1) && this.#isLastTeam(t2) ? -1
        : this.#isFirstNewTeam(t2) && this.#isLastTeam(t1) ? 1
            : 0;

    static #isLastTeam = team => team.isLastGroup && team.place === 3;

    static #isFirstNewTeam = team => team.group === NEW_TEAM && team.place === 1;
}