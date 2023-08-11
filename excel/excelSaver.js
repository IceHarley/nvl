import writeXlsxFile from 'write-excel-file/node'
import {NEW_TEAM} from "../common/constants.js";
import {isRegularTour} from "../common/utils.js";

const TOURS = 3;

const SUBSCRIPT = '₁₂₃₄₅₆₇₈';
export const ROME = ["", "I", "II", "III", "IV", "V", "VI"];

const COLUMNS_WIDTH = [
    {width: 0.7}, {width: 5}, {width: 4}, {width: 30}, Array.from({length: TOURS * 2}, () => ({width: 8})), {width: 8}, {width: 0.7}
].flat();

export default class ExcelSaver {
    #silent

    constructor(silent) {
        this.#silent = silent;
    }

    save = async (meta, data, distributions = []) => writeXlsxFile(this.prepareTable(meta, mergeDistributions(data, distributions)), {
        columns: COLUMNS_WIDTH,
        filePath: meta.fileName,
        fontFamily: 'Calibri',
        fontSize: 12,
        sheet: 'Рейтинг'
    }).then(() => !this.#silent && console.log(`Рейтинговая таблица турнира ${meta.tournamentName} сохранена в файл ${meta.fileName}`))

    prepareTable = (meta, data) => ([
        this.emptyLine(3.75),
        [this.emptyColumn(), this.prepareTitle(), null, null, this.emptyColumns(TOURS * 2), null, this.emptyColumn()].flat(),
        [this.emptyColumn(), this.prepareSubtitle(meta), null, null, this.emptyColumns(TOURS * 2), null, this.emptyColumn()].flat(),
        [this.emptyColumn(), this.preparePlaceHeader(), null, this.prepareTeamHeader(), this.prepareToursHeaders(), this.prepareRatingHeader(), this.emptyColumn()].flat(),
        [this.emptyColumn(), null, null, null, this.prepareToursSubheaders(), null, this.emptyColumn()].flat()]
        .concat(this.mainData(data))
        .concat([this.emptyLine(3.75, true)]));

    prepareToursHeaders = () => Array.from({length: TOURS}, (a, index) => this.prepareTourHeader(index + 1)).flat();

    prepareToursSubheaders = () => Array.from({length: TOURS},
        () => ([this.prepareGroupHeader(), this.preparePointsHeader()])).flat();

    emptyColumns = amount => Array.from({length: amount}, () => null);

    emptyColumn = () => ({
        borderColor: '#FFFFFF',
        topBorderStyle: 'thin',
        bottomBorderStyle: 'thin',
    });

    emptyLine = (height, bottom = false) => [{height: height}].concat(Array.from({length: TOURS * 2 + 4}, () => ({
        topBorderColor: bottom ? '#1F4E78' : '#FFFFFF',
        topBorderStyle: 'medium',
        bottomBorderColor: bottom ? '#FFFFFF' : '#1F4E78',
        bottomBorderStyle: 'medium',
        borderColor: '#FFFFFF',
        leftBorderStyle: 'thin',
        rightBorderStyle: 'thin',
    })));

    preparePointsHeader = () => ({
        value: 'Очки',
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    });

    prepareGroupHeader = () => ({
        value: 'Группа',
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    });

    prepareTourHeader = tour => [{
        value: `${tour} тур`,
        span: 2,
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    }, null];

    prepareRatingHeader = () => ({
        value: 'Итог',
        rowSpan: 2,
        align: 'center',
        alignVertical: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    });

    prepareTitle = () => ({
        value: 'Рейтинговая таблица NVL',
        height: 30,
        span: TOURS * 2 + 4,
        align: 'center',
        alignVertical: 'bottom',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#ffffff',
        backgroundColor: '#2F75B5',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
        bottomBorderStyle: 'none'
    });

    prepareSubtitle = meta => ({
        value: meta.tournamentName || 'Сезон',
        height: 30,
        span: TOURS * 2 + 4,
        align: 'center',
        alignVertical: 'top',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#ffffff',
        backgroundColor: '#2F75B5',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
        topBorderStyle: 'none'
    });

    preparePlaceHeader = () => ({
        value: 'Место',
        rowSpan: 2,
        span: 2,
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    });

    prepareTeamHeader = () => ({
        value: 'Команда',
        rowSpan: 2,
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000000',
        backgroundColor: '#BDD7EE',
        borderColor: '#1F4E78',
        borderStyle: 'medium',
    });

    mainData = data => data.map((row, index) => this.prepareDataRow({
        ...row,
        isPlayoffTeam: row.tours.some(tour => !isRegularTour(tour.tour)),
        isFirst: index === 0,
        isLast: index === data.length - 1
    }));

    prepareDataRow = row => [this.emptyColumn()].concat([
        this.preparePlaceColumn(row),
        this.prepareDeltaColumn(row),
        this.prepareTeamColumn(row),
        this.prepareToursColumns(row),
        this.prepareEmptyToursColumns(row),
        this.prepareRatingColumn(row)]
        .flat(2)
        .map(this.addBorder(row)))
        .concat(this.emptyColumn());

    addBorder = row => column => ({
        ...column,
        borderColor: '#1F4E78',
        topBorderStyle: row.isFirst ? 'medium' : 'thin',
        bottomBorderStyle: row.isLast ? 'medium' : 'thin',
    });

    preparePlaceColumn = row => ({
        value: row.place,
        height: 15,
        align: 'right',
        alignVertical: 'center',
        fontSize: 14,
        leftBorderStyle: 'medium',
        rightBorderStyle: 'none',
        backgroundColor: this.getBackgroundColor(row)
    });

    getBackgroundColor = row => row.isPlayoffTeam ? '#92D050' : '#FFFFFF';

    prepareDeltaColumn = row => ({
        value: row.delta ? row.delta : null,
        type: Number,
        align: 'right',
        alignVertical: 'top',
        fontSize: 10,
        fontWeight: 'bold',
        format: '+###0;-###0',
        color: row.delta < 0 ? '#9C0006' : '#375623',
        leftBorderStyle: 'thin',
        leftBorderColor: this.getBackgroundColor(row),
        rightBorderStyle: 'medium',
        backgroundColor: this.getBackgroundColor(row)
    });

    prepareTeamColumn = row => ({
        value: row.teamName,
        align: 'left',
        alignVertical: 'center',
        fontSize: 14,
        leftBorderStyle: 'medium',
        rightBorderStyle: 'medium',
        backgroundColor: this.getBackgroundColor(row)
    });

    prepareToursColumns = row => row.tours.filter(tour => isRegularTour(tour.tour)).map(tour => ([
        this.prepareGroupColumn({...tour, isFirst: row.isFirst, isLast: row.isLast, isPlayoffTeam: row.isPlayoffTeam}),
        this.prepareTourRatingColumn({
            ...tour,
            isFirst: row.isFirst,
            isLast: row.isLast,
            isPlayoffTeam: row.isPlayoffTeam
        })
    ]));

    prepareEmptyToursColumns = row => Array.from({length: TOURS - (row.tours.length || 0)}, () => [
        this.prepareGroupColumn({
            group: null,
            isFirst: row.isFirst,
            isLast: row.isLast,
            isPlayoffTeam: row.isPlayoffTeam
        }),
        this.prepareTourRatingColumn({
            rating: null,
            isFirst: row.isFirst,
            isLast: row.isLast,
            isPlayoffTeam: row.isPlayoffTeam
        })
    ]);

    prepareGroupColumn = tour => ({
        value: this.getGroupWithPlace(tour),
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        leftBorderStyle: 'medium',
        rightBorderStyle: 'thin',
        backgroundColor: this.getBackgroundColor(tour)
    });

    getGroupWithPlace = tour => !tour.group || tour.group === NEW_TEAM
        ? null
        : tour.group.concat(tour.groupPlace ? SUBSCRIPT.charAt(tour.groupPlace - 1) : '');

    prepareTourRatingColumn = tour => ({
        value: tour.rating,
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        leftBorderStyle: 'thin',
        rightBorderStyle: 'medium',
        backgroundColor: this.getBackgroundColor(tour)
    });

    prepareRatingColumn = row => ({
        value: row.isPlayoffTeam ? this.getPlayoffPlace(row) : row.rating,
        align: 'center',
        alignVertical: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        leftBorderStyle: 'medium',
        rightBorderStyle: 'medium',
        backgroundColor: this.getBackgroundColor(row)
    });

    getPlayoffPlace = row => ROME[row.place];
}

export const mergeDistributions = (data, distributions) => {
    data.forEach(team =>
        team.tours.forEach(tour => {
            if (!tour.group || tour.group === NEW_TEAM) {
                let distribution = distributions.find(d => d.team === team.teamId && d.tour === tour.tour);
                if (distribution) {
                    tour.group = distribution.group;
                }
            }
        }));
    return data;
}