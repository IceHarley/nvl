import cli from "clui";
import inquirer from "inquirer";

export const getRosterMenuMessage = message => answers => ([
    !answers.team ? '' : `\nСостав команды ${answers.team?.name}`,
    !answers.player || typeof answers.player === 'string' ? '' : `\nИгрок: ${formatPlayer(answers.player)}`,
    `\n${message}`,
].join(''))

export const formatPlayer = player => new cli.Line()
    .column(player.name, 20, [])
    .padding(2)
    .column(player.teamName || '', 20, [])
    .padding(2)
    .column(player.birthYear || '', 20, [])
    .padding(2)
    .column(!player.currentOutcome ? 'не заигран' : `заигран за ${player.outcomeTeam}`, 40, [])
    .contents();

export const rosterPlayerActions = answers => {
    const actions = [];
    if (!answers.player) {
        throw 'Игрок не выбран!'
    }
    if (!answers.player.currentOutcome) {
        answers.player.team && actions.push({
            name: new cli.Line().column('Отметить как заигранного за', 28).padding(2).column(answers.player.teamName, 40).contents(),
            value: 'addCurrentOutcome',
            short: 'Заиграть'
        });
        answers.player.team && actions.push({
            name: new cli.Line().column('Исключить из состава команды', 28).padding(2).column(answers.player.teamName, 40).contents(),
            value: 'removeFromRoster',
            short: 'Исключить из команды'
        })
    } else {
        actions.push({
            name: 'Отметить как незаигранного',
            value: 'removeCurrentOutcome',
            short: 'Убрать заигранность'
        })
    }
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