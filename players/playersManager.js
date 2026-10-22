import {SpinnerPlayersService} from "./playersService.js";
import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import ChoiceSources from "./choiceSources.js";
import AddPlayerMenu from "./addPlayerMenu.js";
import PlayersListMenu from "./playersListMenu.js";
import RosterMenu from "./rosterMenu.js";
import {apiEnv} from "../common/apiClient.js";
import {formatTournamentChoice, getRosterTournament, rosterTournamentLabel} from "./rosterContext.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export const menuPrompt = [
    {
        type: 'list',
        name: 'operation',
        message: () => `Выбор операции с базой игроков [${apiEnv} | ${rosterTournamentLabel()}]`,
        choices: [
            {name: 'Состав команды', value: 'roster', short: 'Состав команды'},
            {name: 'Список игроков', value: 'playersList', short: 'Список игроков'},
            {name: 'Выбор турнира для составов', value: 'selectTournament', short: 'Выбор турнира'},
            {name: 'Загрузка данных из БД', value: 'loadFromDb', short: 'Загрузка из БД'},
            {name: 'Выгрузка данных в БД', value: 'uploadToDb', short: 'Выгрузка в БД'},
            new inquirer.Separator(),
            {name: 'Выход', value: 'quit', short: 'Выход'},
        ]
    },
    {
        type: 'list',
        name: 'loadType',
        message: `Выбор действия [${apiEnv}]`,
        when: answers => answers.operation === 'loadFromDb',
        choices: [
            {name: 'Только загрузка изменений по игрокам из БД', value: 'onlyChanges', short: 'Только изменения'},
            {name: 'Очистка локальной БД и полная загрузка из БД', value: 'full', short: 'Полная загрузка'},
        ]
    },
];

export const tournamentPrompt = tournaments => [
    {
        type: 'list',
        name: 'tournament',
        message: `Турнир, с составами которого работаем [${apiEnv}]`,
        choices: tournaments
            .map(t => ({name: formatTournamentChoice(t), value: t, short: `${t.code} ${t.name}`}))
            .concat([
                new inquirer.Separator(),
                {name: '====Назад', value: 'back', short: 'Назад'},
            ]),
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
            if (answers.operation === 'loadFromDb') {
                return this.loadFromDb(answers.loadType, this.playersService);
            } else if (answers.operation === 'uploadToDb') {
                return this.playersService.uploadLocalChanges()
                    .then(() => this.choiceSources.init());
            } else if (answers.operation === 'selectTournament') {
                return this.selectTournament();
            } else if (answers.operation === 'roster' && !getRosterTournament()) {
                return this.selectTournament()
                    .then(() => getRosterTournament() ? 'roster' : 'continue');
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

    selectTournament = () => this.playersService.getRosterOpenTournaments()
        .then(tournaments => {
            if (tournaments.length === 0) {
                console.log('Нет турниров со статусом «Идёт регистрация» или «В процессе»');
                return 'back';
            }
            return inquirer.prompt(tournamentPrompt(tournaments)).then(answers => answers.tournament);
        })
        .then(tournament => tournament === 'back'
            ? 'continue'
            : this.playersService.selectTournament(tournament)
                .then(() => this.choiceSources.init())
                .then(() => 'continue'));

    loadFromDb = (loadType, playersService) => {
        switch (loadType) {
            case 'onlyChanges':
                return playersService.loadOnlyChanges()
                    .then(() => this.choiceSources.init());
            case 'full':
                return playersService.fullLoad()
                    .then(() => this.choiceSources.init());
            default:
                return Promise.resolve('continue');
        }
    };
}
