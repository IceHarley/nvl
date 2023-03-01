import {getRosterMenuMessage, quit, rosterPlayerActions} from "./playersCliUtils.js";
import inquirer from "inquirer";
import PlayerActions from "./playerActions.js";

export default class RosterMenu {
    choiceSources
    playersService
    addPlayerMenu

    constructor(playersService, choiceSources, addPlayerMenu) {
        this.playersService = playersService;
        this.choiceSources = choiceSources;
        this.addPlayerMenu = addPlayerMenu;
    }

    playersSourceWithSystemChoices = (answers, input = '') =>
        this.choiceSources.playersSource(p => p.team === answers.team.id)(answers, input)
            .then(players => this.addSystemChoices(players));

    addSystemChoices = choices => ([
        {name: '====Добавить игрока', value: 'addPlayer', short: 'Добавить игрока в команду'}])
        .concat(choices).concat([
            new inquirer.Separator(),
            {name: '====Назад', value: 'back', short: 'Назад'},
            {name: '====Выход', value: 'quit', short: 'Выход'},
        ]);


    rosterMenuPrompt = [
        {
            type: 'autocomplete',
            name: 'team',
            suggestOnly: false,
            message: 'Выбор команды',
            searchText: 'ищем...',
            emptyText: 'Команда не найдена!',
            source: (answers, input = '') => this.choiceSources.teamsSource(answers, input),
            pageSize: 7,
            loop: false,
        },
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
            when: answers => answers.team !== 'back' && answers.team !== 'quit',
        },
        {
            type: 'list',
            name: 'action',
            message: getRosterMenuMessage('Выбор действия'),
            when: answers => answers.player !== 'back' && answers.player !== 'quit'
                && answers.team !== 'back' && answers.team !== 'quit' && answers.player !== 'addPlayer',
            choices: rosterPlayerActions,
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

    open = (answers, toPrevMenu) => inquirer.prompt(this.rosterMenuPrompt, answers)
        .then(answers => this.processSystemChoices(answers, toPrevMenu))
        .then(answers => this.applyTeamAction(answers, toPrevMenu))
        .then(answers => new PlayerActions(this.playersService, this.choiceSources, () => this.toPlayerSelection(answers, toPrevMenu)).applyPlayerAction(answers))
        .then(answers => this.open({
            team: answers.team,
            player: answers.player
        }, toPrevMenu)) //к действиям с выбранным игроком
        .catch(command => {
            if (command === 'quit') {
                return 'quit';
            }
            if (command instanceof Function) {
                return command();
            }
            throw command;
        });

    processSystemChoices = (answers, toPrevMenu) => {
        if (answers.team === 'quit' || answers.player === 'quit' || answers.action === 'quit') {
            quit();
        } else if (answers.team === 'back') {
            toPrevMenu(); //в главное меню
        } else if (answers.player === 'back') {
            this.toTeamSelection(toPrevMenu); //к выбору команды
        } else if (answers.action === 'back') {
            this.toPlayerSelection(answers, toPrevMenu); //к выбору игрока
        }
        return answers;
    };

    applyTeamAction = (answers, toPrevMenu) => this.selectTeamAction(answers, toPrevMenu);

    selectTeamAction = (answers, toPrevMenu) => {
        switch (answers.player) {
            case 'addPlayer':
                return this.addPlayerMenu.open(answers, () => {
                    throw () => this.open({team: answers.team}, toPrevMenu)
                })
                    .then(() => this.toPlayerSelection(answers, toPrevMenu))
            default:
                return Promise.resolve(answers);
        }
    };

    toPlayerSelection = ({team}, toPrevMenu) => {
        throw () => this.open({team: team}, toPrevMenu)
    };

    toTeamSelection = toPrevMenu => {
        throw () => this.open(undefined, toPrevMenu)
    };

}