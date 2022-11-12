import writeXlsxFile from 'write-excel-file/node'
import {groupBy} from "../common/utils.js";

export default class GroupsExporter {
    #silent

    constructor(silent) {
        this.#silent = silent;
    }

    export = async (meta, distributions, teams) => writeXlsxFile(this.prepareTable(meta, distributions, teams), {
        columns: [{width: 30}, {width: 30}, {width: 30}, {width: 30}],
        filePath: meta.fileName,
        sheet: 'Группы'
    }).then(() => !this.#silent && console.log(`Группы турнира ${meta.tournamentName} сохранены в файл ${meta.fileName}`))

    prepareTable = (meta, distributions, teams) => {
        distributions = distributions.map(distribution => ({
            ...distribution,
            ...(teams.find(t => t.id === distribution.team)),
        }));
        const groupedResults = groupBy(distributions, d => d.group);
        return this.prepareDivision(this.getGroups(groupedResults, "AB"))
            .concat(this.prepareDivision(this.getGroups(groupedResults, "CDEF")))
            .concat(this.prepareDivision(this.getGroups(groupedResults, "GHIJ")))
            .concat(this.prepareChallengers(this.getGroups(groupedResults, "KLMN")))
            .concat(this.prepareChallengers(this.getGroups(groupedResults, "OPQR")));
    }

    getGroups = (groupedResults, groups) => groups.split('').map(groupChar => groupedResults.get(groupChar)).filter(Boolean);

    prepareDivision = groups => {
        let result = [[], [], [], [], [], [], [], [], []];
        for (let i = 0; i < groups.length; i++) {
            result[0].push({value: `Группа ${groups[i][0].group}`})
            result[1].push({value: groups[i][0].schedule})
            result[2].push({value: groups[i][0].name})
            result[3].push({value: groups[i][0].city})
            result[4].push({value: groups[i][1].name})
            result[5].push({value: groups[i][1].city})
            result[6].push({value: groups[i][2].name})
            result[7].push({value: groups[i][2].city})
            result[8].push({})
        }
        return result;
    };

    prepareChallengers = groups => {
        let result = [[], [], [], [], []];
        for (let i = 0; i < groups.length; i++) {
            result[0].push({value: `Группа ${groups[i][0].group}`})
            result[1].push({value: `${groups[i][0].name} (${groups[i][0].city})`})
            result[2].push({value: groups[i].length > 1 ? `${groups[i][1].name} (${groups[i][1].city})` : null})
            result[3].push({value: groups[i].length > 1 ? `${groups[i][2].name} (${groups[i][2].city})` : null})
            result[4].push({})
        }
        return result;
    };
}