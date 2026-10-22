import cli from "clui";
import inquirer from "inquirer";
import {isCupContext, rosterTournamentLabel} from "./rosterContext.js";

export const getRosterMenuMessage = message => answers => ([
    `[${rosterTournamentLabel()}]`,
    !answers.team ? '' : `\nСостав команды ${answers.team?.name}`,
    !answers.player || typeof answers.player === 'string' ? '' : `\nИгрок: ${formatPlayer(answers.player)}`,
    `\n${message}`,
].join(''))

// Сезон: заявленные в команду (team). Кубок: ещё и заигранные за команду игроки других команд.
export const isInTeamRoster = team => player => player.team === team.id
    || (isCupContext() && !!team.outcome && player.currentOutcome === team.outcome);

export const formatPlayer = player => new cli.Line()
    .column(player.name, 20, [])
    .padding(2)
    .column(player.teamName || '', 20, [])
    .padding(2)
    .column(player.birthYear || '', 20, [])
    .padding(2)
    .column(!player.currentOutcome ? 'не заигран' : `заигран за ${player.outcomeTeam}`, 40, [])
    .contents();

const addOutcomeAction = teamName => ({
    name: new cli.Line().column('Отметить как заигранного за', 28).padding(2).column(teamName || '', 40).contents(),
    value: 'addCurrentOutcome',
    short: 'Заиграть'
});

const removeFromRosterAction = teamName => ({
    name: new cli.Line().column('Исключить из состава команды', 28).padding(2).column(teamName || '', 40).contents(),
    value: 'removeFromRoster',
    short: 'Исключить из команды'
});

const removeOutcomeAction = name => ({name, value: 'removeCurrentOutcome', short: 'Убрать заигранность'});

const hint = text => ({name: text, value: 'hint', disabled: ' '});

// «Список игроков» (без команды): действия относятся к команде игрока (team_id) — как в сезоне, при любом турнире
const playerListOutcomeActions = player => {
    if (player.currentOutcome) {
        return [removeOutcomeAction(`Снять отметку «заигран» за ${player.outcomeTeam}`)];
    }
    if (!player.team) {
        return [];
    }
    return [
        player.teamOutcome
            ? addOutcomeAction(player.teamName)
            : hint(`Команда ${player.teamName || player.team} не участвует в турнире «${rosterTournamentLabel()}»`),
        removeFromRosterAction(player.teamName),
    ];
};

const rosterOutcomeActions = (team, player) => {
    if (!player.currentOutcome) {
        const actions = team.outcome ? [addOutcomeAction(team.name || player.teamName)] : [];
        return isCupContext() ? actions : actions.concat([removeFromRosterAction(player.teamName)]);
    }
    if (player.currentOutcome === team.outcome) {
        return [removeOutcomeAction(isCupContext() ? 'Отзаявить (снять отметку заигранности)' : 'Отметить как незаигранного')];
    }
    // В кубке игрок виден в составе команды, за которую заигран, — отзаявляют там.
    // В сезоне такого состава у игрока нет (фильтр по team_id), поэтому снять отметку можно отсюда.
    return isCupContext()
        ? [hint(`Заигран за ${player.outcomeTeam} — отзаявить можно в составе ${player.outcomeTeam}`)]
        : [removeOutcomeAction(`Снять отметку «заигран» за ${player.outcomeTeam}`)];
};

export const rosterPlayerActions = answers => {
    if (!answers.player) {
        throw 'Игрок не выбран!'
    }
    const actions = answers.team
        ? rosterOutcomeActions(answers.team, answers.player)
        : playerListOutcomeActions(answers.player);
    actions.push({
        name: new cli.Line().column('Редактировать имя/фамилию', 28).padding(2).column(answers.player.name, 40).contents(),
        value: 'rename',
        short: 'Переименовать'
    })
    actions.push({
        name: new cli.Line().column('Редактировать год рождения', 28).padding(2).column(answers.player.birthYear || '', 40).contents(),
        value: 'changeBirthYear',
        short: 'год рождения'
    })
    actions.push({
        name: 'Удалить игрока',
        value: 'delete',
        short: 'Удалить'
    })
    return actions.concat([
        new inquirer.Separator(),
        {name: '====Назад', value: 'back', short: 'Назад'},
        {name: '====Выход', value: 'quit', short: 'Выход'},
    ]);
}

export const quit = () => {
    throw 'quit';
};
