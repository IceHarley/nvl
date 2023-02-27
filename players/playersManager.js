import {SpinnerPlayersService} from "./playersService.js";
import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import ChoiceSources from "./choiceSources.js";
import AddPlayerMenu from "./addPlayerMenu.js";
import PlayersListMenu from "./playersListMenu.js";
import RosterMenu from "./rosterMenu.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);


export const menuPrompt = [
    {
        type: 'list',
        name: 'operation',
        message: 'Выбор операции с базой игроков',
        choices: [
            {name: 'Состав команды', value: 'roster', short: 'Состав команды'},
            {name: 'Список игроков', value: 'playersList', short: 'Список игроков'},
            {name: 'Загрузка данных из airtable', value: 'loadFromAirtable', short: 'Загрузка из airtable'},
            {name: 'Выгрузка данных в airtable', value: 'uploadToAirtable', short: 'Выгрузка в airtable'},
            new inquirer.Separator(),
            {name: 'Выход', value: 'quit', short: 'Выход'},
        ]
    },
    {
        type: 'list',
        name: 'loadType',
        message: 'Выбор действия',
        when: answers => answers.operation === 'loadFromAirtable',
        choices: [
            {name: 'Только загрузка изменений по игрокам из airtable', value: 'onlyChanges', short: 'Только изменения'},
            {name: 'Очистка локальной БД и полная загрузка из airtable', value: 'full', short: 'Полная загрузка'},
            {name: 'Загрузка активных команд из airtable', value: 'activeTeams', short: 'Активные команды'},
        ]
    },
];

export default class PlayersManager {
    #db
    playersService
    choiceSources
    addPlayerMenu

    constructor(repositories, db) {
        this.#db = db;

        this.playersService = new SpinnerPlayersService(this.#db, repositories);
        this.choiceSources = new ChoiceSources(this.#db);
        this.addPlayerMenu = new AddPlayerMenu(this.playersService, this.choiceSources);
        this.playersListMenu = new PlayersListMenu(this.playersService, this.choiceSources, this.addPlayerMenu);
        this.rosterMenu = new RosterMenu(this.playersService, this.choiceSources, this.addPlayerMenu);
    }

    process = () => this.#db.main.open()
        .then(() => this.choiceSources.init())
        .then(() => this.menu(this.playersService))
        .then(() => this.#db.main.close())

    menu = () => inquirer.prompt(menuPrompt)
        .then(answers => {
            if (answers.operation === 'loadFromAirtable') {
                return this.loadFromAirtable(answers.loadType, this.playersService);
            } else if (answers.operation === 'uploadToAirtable') {
                return this.playersService.uploadLocalChanges()
                    .then(() => this.choiceSources.init());
            }
            return answers.operation;
        })
        .then(result => {
            if (result === 'roster') {
                return this.rosterMenu.open(undefined, this.toMainMenu);
            }
            if (result === 'playersList') {
                return this.playersListMenu.open(undefined, this.toMainMenu);
            }
            if (result !== 'quit') {
                return this.menu();
            } else {
                return result;
            }
        });

    toMainMenu = () => {
        throw () => this.menu()
    };

    loadFromAirtable = (loadType, playersService) => {
        switch (loadType) {
            case 'onlyChanges':
                return playersService.loadOnlyChanges()
                    .then(() => this.choiceSources.init());
            case 'full':
                return playersService.fullLoad()
                    .then(() => this.choiceSources.init());
            case 'activeTeams':
                return playersService.loadActiveTeams()
                    .then(() => playersService.loadActiveTournamentOutcomes())
                    .then(() => this.choiceSources.init());
            default:
                return Promise.resolve('continue');
        }
    };
}

