import {groupBy, positionToChar} from "../common/utils.js";
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
        const values = this.#getColumns(true);
        groupBy(distributions, d => d.group).forEach(value =>
            value.forEach(team => {
                values[`${team.group}_visible`] = this.#encodeText('true');
                values[`${team.group}_groupName`] = this.#encodeText(`Группа ${team.group}`);
                values[`${team.group}_groupDate`] = this.#encodeText(team.schedule ? `${team.schedule}` : ' ');
                values[`${team.group}_team${team.position}`] = this.#encodeText(`${team.name}`);
                values[`${team.group}_city${team.position}`] = this.#encodeText(`${team.city}`);
                values[`${team.group}_teamFull${team.position}`] = this.#encodeText(`${team.name} (${team.city})`);
            }));

        stringify([values], {
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

    #getColumns = (defaultValues = false) => {
        let columns = {};
        for (let i = 0; i < 18; i++) {
            const group = positionToChar(i);
            columns[`${group}_visible`] = defaultValues ? 'false' : `${group}_visible`;
            columns[`${group}_groupName`] = defaultValues ? ' ' : `${group}_groupName`;
            columns[`${group}_groupDate`] = defaultValues ? ' ' : `${group}_groupDate`;
            for (let j = 0; j < 3; j++) {
                columns[`${group}_team${j + 1}`] = defaultValues ? ' ' : `${group}_team${j + 1}`;
                columns[`${group}_city${j + 1}`] = defaultValues ? ' ' : `${group}_city${j + 1}`;
                columns[`${group}_teamFull${j + 1}`] = defaultValues ? ' ' : `${group}_teamFull${j + 1}`;
            }
        }
        return columns;
    };
}