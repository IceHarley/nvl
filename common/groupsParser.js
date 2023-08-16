import GroupParser from "./groupParser.js";
import {groupBy} from "./utils.js";

export default class GroupsParser {
    #groupParser

    constructor(ratingRules) {
        this.#groupParser = new GroupParser(true, ratingRules);
    }

    parseGroups = tourResults => Array
        .from(groupBy(tourResults, this.#groupKeyGetter()).values(), this.#parseGroup());

    #groupKeyGetter = () => matchResult => matchResult.group;

    #parseGroup = () => group => this.#groupParser.parseGroup(group);
}