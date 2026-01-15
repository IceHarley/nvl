import inquirer from "inquirer";
import {getRosterMenuMessage, quit} from "./playersCliUtils.js";

export default class AddPlayerMenu {
    choiceSources
    playersService

    constructor(playersService, choiceSources) {
        this.playersService = playersService;
        this.choiceSources = choiceSources;
    }

    playersSourceWithNewPlayerChoice = (answers, input = '') => this.choiceSources.playersSource(p => p)(answers, input)
        .then(players => (input.length > 2
            ? [{name: `Новый игрок: ${input}`, value: input, short: `Создан новый игрок ${input}`}]
            : []).concat(players).concat([
            new inquirer.Separator(),
            {name: '====Назад', value: 'back', short: 'Назад'},
            {name: '====Выход', value: 'quit', short: 'Выход'}
        ]));

    addPlayerMenuPrompt = [
        {
            type: 'autocomplete',
            name: 'addPlayer',
            suggestOnly: false,
            message: getRosterMenuMessage('Добавление игрока в состав'),
            searchText: 'ищем...',
            source: this.playersSourceWithNewPlayerChoice,
            pageSize: 6,
            loop: false,
            when: answers => !answers.createPlayerOnly,
            validate: (input, answers) => {
                if (input.value.outcomeTeam && input.value.outcomeTeam !== answers.team.name) {
                    return 'Игрок уже заигран за другую команду!';
                }
                return true;
            }
        },
        {
            type: 'autocomplete',
            name: 'addPlayer',
            suggestOnly: false,
            message: 'Имя и фамилия нового игрока',
            source: (answers, input = '') => [
                {name: `Новый игрок: ${input}`, value: input, short: `Создан новый игрок ${input}`},
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ],
            when: answers => answers.createPlayerOnly,
            validate: input => {
                if (!input || !input.value) {
                    return "Имя не задано";
                }
                if (input.value.length < 4) {
                    return "Имя слишком короткое";
                }
                if (!input.value.includes(' ')) {
                    return "Введите имя и фамилию через пробел";
                }
                return true;
            },
        },
        {
            type: 'input',
            name: 'newPlayer.birthYear',
            message: 'Год рождения',
            when: answers => typeof answers.addPlayer === 'string' && answers.addPlayer !== 'back' && answers.addPlayer !== 'quit'
        },
        {
            type: 'list',
            name: 'confirmSwitchTeam',
            message: answers => `Игрок уже числится в составе команды ${answers.addPlayer.teamName}. Точно перевести в команду ${answers.newPlayer.teamName}`,
            choices: answers => [
                {
                    name: 'Да',
                    value: true,
                    short: `Перевод из ${answers.addPlayer.teamName} в ${answers.newPlayer.teamName}`
                },
                {name: 'Нет', value: 'back', short: 'Отмена добавления игрока'},
            ],
            when: answers => typeof answers.addPlayer !== 'string' && answers.addPlayer?.teamName
                && answers.addPlayer?.teamName !== answers.newPlayer.teamName
                && answers.addPlayer !== 'back' && answers.addPlayer !== 'quit'
        },
        {
            type: 'list',
            name: 'addCurrentOutcome',
            message: answers => 'Отметить как заигранного за ' + answers.newPlayer.teamName,
            choices: answers => [
                {name: 'Да', value: true, short: 'Заигран за ' + answers.newPlayer.teamName},
                {name: 'Нет', value: false, short: 'Не заигран'},
            ],
            when: answers => answers.newPlayer?.team && answers.addPlayer !== 'back' && answers.addPlayer !== 'quit'
                && !answers.addPlayer?.outcomeTeam && answers.confirmSwitchTeam !== 'back'
        }
    ];

    open = ({team, createPlayerOnly}, toPrevMenu) => inquirer.prompt(this.addPlayerMenuPrompt, {
        team,
        createPlayerOnly,
        newPlayer: !team ? {tournaments: []} : {team: team.id, tournaments: [], teamName: team.name},
    })
        .then(answers => {
            if (answers.addPlayer === 'quit') {
                quit();
            }
            if (answers.addPlayer === 'back' || answers.confirmSwitchTeam === 'back') {
                toPrevMenu();
            }
            return answers;
        })
        .then(answers => ({
            ...answers,
            newPlayer: typeof answers.addPlayer !== 'string'
                ? undefined
                : {
                    ...answers.newPlayer,
                    name: answers.addPlayer,
                },
            addPlayer: typeof answers.addPlayer === 'string' ? undefined : answers.addPlayer,
        }))
        .then(answers => Promise.all([
            answers,
            answers.addPlayer
                ? this.playersService.editPlayer({
                    ...answers.addPlayer,
                    team: answers.team.id,
                    tournaments: answers.addPlayer.tournaments || [],
                }).then(() => answers.addPlayer)
                : this.playersService.createPlayer(answers.newPlayer)
        ]))
        .then(([answers, player]) => Promise.all([{...answers, playerId: player.id},
            answers.addCurrentOutcome ? this.playersService.addCurrentOutcome(player.id) : null]))
        .then(([answers]) => this.choiceSources.update(answers.playerId));
}