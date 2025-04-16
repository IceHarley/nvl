import {repositories} from "../cli/cli.js";
import {exportGroups} from "../common/groupsExporter.js";

export class ScheduleProcessor {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    saveSchedule = paramsId => this.#repositories.schedule.removeAll()
        .then(() => this.#repositories.distribution.getByParamsId(paramsId))
        .then(distributionData => this.#getSchedule(distributionData))
        .then(schedule => this.#repositories.schedule.saveList(schedule))
        .then(result => console.log(`Создано расписание для ${result.flat().length} групп`))
        .catch(error => console.log('Произошла ошибка ' + error));

    #getSchedule = distributionData => {
        const schedule = [...new Set(distributionData.map(d => d.group))]
            .map(group => ({group: group, distributions: []}));
        distributionData.forEach(d => schedule.find(s => s.group === d.group).distributions[d.position - 1] = d.id);
        return schedule;
    };

    //TODO ошибка, когда групп меньше 18, а в расписании 18 записей
    copyScheduleToDistribution = () => this.#repositories.schedule.getAll()
        .then(scheduleList => scheduleList.map(schedule => schedule.distributions.map(distributionId => ({
            id: distributionId,
            schedule: schedule.text,
        }))))
        .then(distributions => this.#repositories.distribution.updateSchedule(distributions.flat()))
        .then(result => console.log(`Скопировано расписание для ${result.flat().length} команд`))
        .catch(error => console.log('Произошла ошибка ' + error));
}

export const mockScheduleSaver = {
    saveSchedule: data => {
        console.log(`Расписание не будет сохранено в БД`)
        return data;
    },
    copyScheduleToDistribution: () => {
        console.log(`Расписание не будет скопировано в таблицу распределения`)
    },
}

export const scheduleSaverBuilder = (saveToDb, args) => saveToDb
    ? new ScheduleProcessor(args)
    : mockScheduleSaver;

export function processSchedule(answers) {
    const processor = scheduleSaverBuilder(true, repositories);
    if (answers.schedule.action === 'makeUp') {
        processor.saveSchedule(answers.schedule.paramsId)
    } else if (answers.schedule.action === 'copy') {
        processor.copyScheduleToDistribution();
    } else if (answers.schedule.action === 'groupsExport') {
        processor.copyScheduleToDistribution()
            .then(() => exportGroups(answers.groupsExport));
    }
}