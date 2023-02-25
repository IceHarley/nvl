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
            when: answers => !answers.createPlayerOnly
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
            when: answers => answers.createPlayerOnly
        //    TODO filter - не давать вводить пустое имя
        },
        {
            type: 'input',
            name: 'newPlayer.instagram',
            message: 'Instagram',
            when: answers => typeof answers.addPlayer === 'string' && answers.addPlayer !== 'back' && answers.addPlayer !== 'quit'
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
            if (answers.addPlayer === 'back') {
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
                    team: answers.team.id
                }).then(() => answers.addPlayer)
                : this.playersService.createPlayer(answers.newPlayer)
        ]))
        .then(([answers, player]) => Promise.all([{...answers, playerId: player.id},
            answers.addCurrentOutcome ? this.playersService.addCurrentOutcome(player.id) : null]))
        .then(([answers]) => this.choiceSources.update(answers.playerId));
}