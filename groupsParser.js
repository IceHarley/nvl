import GroupParser from "./groupParser.js";
import {groupBy} from "./utils.js";

export default class GroupsParser {
    #groupParser = new GroupParser(true);

    parseGroups = tourResults => Array
        .from(groupBy(tourResults, this.#groupKeyGetter()).values(), this.#parseGroup());

    #groupKeyGetter = () => matchResult => matchResult.group;

    #parseGroup = () => group => this.#groupParser.parseGroup(group);
}