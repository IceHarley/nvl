import inquirer from "inquirer";
import {getRosterMenuMessage, quit} from "./playersCliUtils.js";
import cli from "clui";
import PlayerActions from "./playerActions.js";

export default class PlayersListMenu {
    choiceSources
    playersService
    addPlayerMenu

    constructor(playersService, choiceSources, addPlayerMenu) {
        this.playersService = playersService;
        this.choiceSources = choiceSources;
        this.addPlayerMenu = addPlayerMenu;
    }

    playersSourceWithSystemChoices = (answers, input = '') =>
        this.choiceSources.playersSource(p => p)(answers, input)
            .then(players => this.addSystemChoices(players));

    addSystemChoices = choices => ([
        {name: '====Добавить игрока', value: 'addPlayer', short: 'Добавить нового игрока'}])
        .concat(choices).concat([
            new inquirer.Separator(),
            {name: '====Назад', value: 'back', short: 'Назад'},
            {name: '====Выход', value: 'quit', short: 'Выход'},
        ]);

//TODO вынести rosterPlayerActions в отдельный класс и устранить дублирование
    rosterPlayerActions = answers => {
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
            name: new cli.Line().column('Редактировать instagram', 28).padding(2).column(answers.player.instagram || '', 40).contents(),
            value: 'changeInstagram',
            short: 'instagram'
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

    playersListPrompt = [
        {
            type: 'autocomplete',
            name: 'player',
            suggestOnly: false,
            message: getRosterMenuMessage('Выбор игрока'),
            searchText: 'ищем...',
            emptyText: 'Игрок не найден!',
            source: this.playersSourceWithSystemChoices,
            pageSize: 6,
            loop: false,
        },
        {
            type: 'list',
            name: 'action',
            message: getRosterMenuMessage('Выбор действия'),
            when: answers => answers.player !== 'back' && answers.player !== 'quit' && answers.player !== 'addPlayer',
            choices: this.rosterPlayerActions,
        },
        {
            type: 'input',
            name: 'newInstagram',
            message: getRosterMenuMessage('Instagram'),
            default: answers => answers?.player?.instagram,
            when: answers => answers.action === 'changeInstagram',
        },
        {
            type: 'input',
            name: 'newName',
            message: getRosterMenuMessage('Имя фамилия'),
            default: answers => answers?.player?.name,
            when: answers => answers.action === 'rename',
        },
        {
            type: 'confirm',
            name: 'deleteConfirmation',
            message: getRosterMenuMessage('Точно удалить игрока?'),
            default: true,
            when: answers => answers.action === 'delete',
        },
    ];

    open = (answers, toPrevMenu) => inquirer.prompt(this.playersListPrompt, answers)
        .then(answers => {
            if (answers.player === 'back') {
                toPrevMenu();
            }
            if (answers.player === 'quit' || answers.action === 'quit') {
                quit();
            }
            if (answers.action === 'back') {
                this.toPlayersListMenu(toPrevMenu);
            }
            if (answers.player === 'addPlayer') {
                return this.addPlayerMenu.open({createPlayerOnly: true}, this.toPlayersListMenu(toPrevMenu))
                    .then(this.toPlayersListMenu(toPrevMenu))
            }
            return answers;
        })
        .then(answers => new PlayerActions(this.playersService, this.choiceSources, this.toPlayersListMenu).applyPlayerAction(answers))
        .then(() => this.open(undefined, toPrevMenu))
        .catch(command => {
            if (command === 'quit') {
                return 'quit';
            }
            if (command instanceof Function) {
                return command();
            }
            throw command;
        });

    toPlayersListMenu = toPrevMenu => () => {
        throw () => this.open({}, toPrevMenu);
    }
}