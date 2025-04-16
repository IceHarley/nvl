import {groupBy, extractPart} from "../common/utils.js";
import {stringify} from 'csv-stringify';
import {writeFileSync} from 'fs';

export default class CsvGroupsExporter {
    #silent
    #encode

    constructor(silent, encode = false) {
        this.#silent = silent;
        this.#encode = encode;
    }

    export = async (meta, distributions, teams) => {
        distributions = distributions.map(distribution => ({
            ...distribution,
            ...(teams.find(t => t.id === distribution.team)),
        }));
        const values = [];

        const extractDatetime = schedule => extractPart(schedule, 0, ", ");
        const extractLocation = schedule => extractPart(schedule, 1, ", ");

        groupBy(distributions, d => d.group).forEach(value => {
            let group = [];
            group.push(this.#encodeText(`${value[0].group}`));
            group.push(this.#encodeText('true'));
            group.push(this.#encodeText(value[0].schedule ? `${extractDatetime(value[0].schedule[0])}` : ' '));
            group.push(this.#encodeText(value[0].schedule ? `${extractLocation(value[0].schedule[0])}` : ' '));
            value.forEach(team => {
                group.push(this.#encodeText(`${team.name}`));
                group.push(this.#encodeText(`${team.city}`));
                group.push(this.#encodeText(`${team.name} (${team.city})`));
            });
            values.push(group);
        });

        stringify(values, {
            header: true,
            columns: this.#getColumns(),
        }, (err, output) => {
            writeFileSync(meta.fileName, output);
            !this.#silent && console.log(`Группы турнира ${meta.tournamentName} сохранены в файл ${meta.fileName}`)
        });
    };

    #encodeText = value => this.#encode
        ? encodeURIComponent(value)
        : value

    #getColumns = () => {
        let columns = {};
        columns[`groupName`] = `groupName`;
        columns[`groupVisible`] = `groupVisible`;
        columns[`groupDate`] = `groupDate`;
        columns[`groupLocation`] = `groupLocation`;
        for (let j = 0; j < 3; j++) {
            columns[`team${j + 1}`] = `team${j + 1}`;
            columns[`city${j + 1}`] = `city${j + 1}`;
            columns[`team${j + 1}FullName`] = `team${j + 1}FullName`;
        }
        return columns;
    };
}