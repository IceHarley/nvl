import cli from "clui";
import {Level} from "level";
import {SpinnerPlayersService} from "./playersService.js";
import inquirer from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import fuzzy from "fuzzy";

inquirer.registerPrompt('autocomplete', inquirerPrompt);

const menuPrompt = [
    {
        type: 'list',
        name: 'operation',
        message: 'Выбор операции с базой игроков',
        choices: [
            {name: 'Загрузка данных из airtable', value: 'loadFromAirtable', short: 'Загрузка из airtable'},
            {name: 'Состав команды', value: 'roster', short: 'Состав команды'},
            {name: 'Список игроков', value: 'playersList', short: 'Список игроков'},
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

    constructor(repositories) {
        const db = new Level('./db', {valueEncoding: 'json'});
        this.#db = {
            main: db,
            meta: db.sublevel('meta'),
            players: db.sublevel('players', {valueEncoding: 'json'}),
            teams: db.sublevel('teams', {valueEncoding: 'json'}),
            outcomes: db.sublevel('outcomes', {valueEncoding: 'json'}),
            modifications: db.sublevel('modifications', {valueEncoding: 'json'}),
        }

        this.playersService = new SpinnerPlayersService(this.#db, repositories);
    }

    teamsSource = (answers, input = '') => Promise.all([
        this.#db.teams.iterator().all(),
        this.#db.outcomes.iterator().all()
    ])
        .then(([teams, outcomes]) => ([
            this.toRecords(teams),
            this.toRecords(outcomes)
        ]))
        .then(([teams, outcomes]) => teams.map(team => ({
            ...team,
            outcome: outcomes.find(outcome => outcome.teamId === team.id).id
        })))
        .then(teams => fuzzy
            .filter(input, teams, {extract: t => t.name})
            .map(el => ({name: el.string, value: el.original, short: `${el.original.name} (${el.original.city})`}))
            .concat([
                new inquirer.Separator(),
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ]));


    toRecords = entries => entries.map(([id, entry]) => ({id, ...entry}));

    playersSource = (answers, input = '') => Promise.all([
        this.#db.players.iterator().all(),
        this.#db.outcomes.iterator().all()
    ])
        .then(([players, outcomes]) => ([
            this.toRecords(players),
            this.toRecords(outcomes)
        ]))
        .then(([players, outcomes]) => players
            .map(player => ({
                ...player,
                currentOutcome: outcomes.find(outcome => player.tournaments?.includes(outcome.id))?.id,
            }))
            .map(player => ({
                ...player,
                outcomeTeam: player.currentOutcome === answers.team.outcome ? answers.team.name : 'другую команду!',
            }))
            .filter(p => p.team === answers.team.id))
        .then(players => fuzzy
            .filter(input, players, {extract: p => p.name})
            .map(el => ({
                name: new cli.Line()
                    .column(el.original.name, 20, [])
                    .padding(2)
                    .column(el.original.instagram || '', 10, [])
                    .padding(2)
                    .column(!el.original.currentOutcome ? 'не заигран' : `заигран за ${el.original.outcomeTeam}`, 40, [])
                    .contents(),
                value: el.original,
                short: el.original.name
            }))
            .concat([
                new inquirer.Separator(),
                {name: '====Добавить игрока', value: 'addPlayer', short: 'Добавить игрока в команду'},
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ]))
        .catch(e => {
            console.log(e);
            return e;
        });

    rosterMenuPrompt = [
        {
            type: 'autocomplete',
            name: 'team',
            suggestOnly: false,
            message: 'Выбор команды',
            searchText: 'ищем...',
            emptyText: 'Команда не найдена!',
            source: this.teamsSource,
            pageSize: 7,
            loop: false,
        },
        {
            type: 'autocomplete',
            name: 'player',
            suggestOnly: false,
            message: 'Выбор игрока',
            searchText: 'ищем...',
            emptyText: 'Игрок не найден!',
            source: this.playersSource,
            pageSize: 6,
            loop: false,
            when: answers => answers.team !== 'back' && answers.team !== 'quit',
        },
    ];

    process = () => this.#db.main.open()
        .then(() => this.menu(this.playersService))
        .then(() => this.#db.main.close())

    menu = () => inquirer.prompt(menuPrompt)
        .then(answers => {
            if (answers.operation === 'loadFromAirtable') {
                return this.loadFromAirtable(answers.loadType, this.playersService);
            }
            return answers.operation;
        })
        .then(result => {
            if (result === 'roster') {
                return this.rosterMenu();
            }
            if (result !== 'quit') {
                return this.menu();
            } else {
                return result;
            }
        });

    rosterMenu = () => inquirer.prompt(this.rosterMenuPrompt)
        .then(answers => {
            console.log(answers);
            return {
                ...answers,
                quit: answers.team === 'quit' || answers.player === 'quit',
                back: answers.team === 'back' || answers.player === 'back',
            };
        })
        .then(answers => {
            if (answers.quit) {
                return 'quit';
            }
            if (!answers.back) {
                return this.rosterMenu();
            } else {
                return this.menu();
            }
        });

    loadFromAirtable = (loadType, playersService) => {
        switch (loadType) {
            case 'onlyChanges':
                return playersService.loadOnlyChanges();
            case 'full':
                return playersService.fullLoad();
            case 'activeTeams':
                return playersService.loadActiveTeams()
                    .then(() => playersService.loadActiveTournamentOutcomes());
            default:
                return Promise.resolve('continue');
        }
    };
}

