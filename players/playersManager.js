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
            {name: 'Состав команды', value: 'roster', short: 'Состав команды'},
            {name: 'Список игроков', value: 'playersList', short: 'Список игроков'},
            {name: 'Загрузка данных из airtable', value: 'loadFromAirtable', short: 'Загрузка из airtable'},
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

    playersSource = (answers, input = '') => this.getPlayersForSelection(answers.team)
        .then(players => fuzzy
            .filter(input, players, {extract: p => p.name})
            .map(el => ({
                name: this.formatPlayer(el.original),
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

    getPlayersForSelection = team => Promise.all([
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
                outcomeTeam: player.currentOutcome === team.outcome ? team.name : 'другую команду!',
            }))
            .filter(p => p.team === team.id));

    formatPlayer = player => new cli.Line()
        .column(player.name, 20, [])
        .padding(2)
        .column(player.instagram || '', 10, [])
        .padding(2)
        .column(!player.currentOutcome ? 'не заигран' : `заигран за ${player.outcomeTeam}`, 40, [])
        .contents();

    rosterPlayerActions = answers => {
        const actions = [];
        if (!answers.player) {
            throw 'Игрок не выбран!'
        }
        if (!answers.player.currentOutcome) {
            actions.push({
                name: new cli.Line().column('Отметить как заигранного за', 28).column(answers.team.name, 40).contents(),
                value: 'addCurrentOutcome',
                short: 'Заиграть'
            });
            actions.push({
                name: new cli.Line().column('Удалить из состава команды', 28).column(answers.team.name, 40).contents(),
                value: 'removeFromRoster',
                short: 'Удалить из команды'
            })
        } else {
            actions.push({
                name: 'Отметить как незаигранного',
                value: 'removeCurrentOutcome',
                short: 'Убрать заигранность'
            })
        }
        actions.push({
            name: new cli.Line().column('Редактировать имя/фамилию', 28).column(answers.player.name, 40).contents(),
            value: 'rename',
            short: 'Переименовать'
        })
        actions.push({
            name: new cli.Line().column('Редактировать instagram', 28).column(answers.player.instagram || '', 40).contents(),
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

    getRosterMenuMessage = message => answers => {
        return ([
            `\nСостав команды ${answers.team?.name}`,
            !answers.player ? '' : `\nИгрок: ${this.formatPlayer(answers.player)}`,
            `\n${message}`,
        ].join(''));
    }

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
            message: this.getRosterMenuMessage('Выбор игрока'),
            searchText: 'ищем...',
            emptyText: 'Игрок не найден!',
            source: this.playersSource,
            pageSize: 6,
            loop: false,
            when: answers => answers.team !== 'back' && answers.team !== 'quit',
        },
        {
            type: 'list',
            name: 'action',
            message: this.getRosterMenuMessage('Выбор действия'),
            when: answers => answers.player !== 'back' && answers.player !== 'quit'
                && answers.team !== 'back' && answers.team !== 'quit' && answers.player !== 'addPlayer',
            choices: this.rosterPlayerActions,
        },
        {
            type: 'input',
            name: 'newInstagram',
            message: this.getRosterMenuMessage('Instagram'),
            default: answers => answers?.player?.instagram,
            when: answers => answers.action === 'changeInstagram',
        },
        {
            type: 'input',
            name: 'newName',
            message: this.getRosterMenuMessage('Имя фамилия'),
            default: answers => answers?.player?.name,
            when: answers => answers.action === 'rename',
        },
        {
            type: 'confirm',
            name: 'deleteConfirmation',
            message: this.getRosterMenuMessage('Точно удалить игрока?'),
            default: true,
            when: answers => answers.action === 'delete',
        },
    ];

    addPlayerMenuPrompt = [
        {
            type: 'input',
            name: 'newPlayer.name',
            message: 'Имя фамилия',
        },
        // {
        //     type: 'autocomplete',
        //     name: 'player',
        //     suggestOnly: false,
        //     message: this.getRosterMenuMessage('Ввод имени и фамилии нового или поиск существующего игрока'),
        //     searchText: 'ищем...',
        //     emptyText: 'Будет создан новый игрок',
        //     source: this.playersSource,
        //     pageSize: 6,
        //     loop: false,
        // },
        {
            type: 'input',
            name: 'newPlayer.instagram',
            message: 'Instagram',
        },
        {
            type: 'list',
            name: 'addCurrentOutcome',
            message: answers => 'Отметить как заигранного за ' + answers.team.name,
            choices: answers => [
                {name: 'Да', value: answers.team.outcome, short: 'Заигран за ' + answers.team.name},
                {name: 'Нет', value: undefined, short: 'Не заигран'},
            ]
        }
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

    rosterMenu = answers => inquirer.prompt(this.rosterMenuPrompt, answers)
        .then(answers => {
            console.log(answers);
            return answers;
        })
        .then(answers => this.processSystemChoices(answers))
        .then(answers => this.applyTeamAction(answers))
        .then(answers => this.applyPlayerAction(answers))
        .then(answers => this.rosterMenu({
            team: answers.team,
            player: answers.player
        })) //к действиям с выбранным игроком
        .catch(command => {
            if (command === 'quit') {
                return 'quit';
            }
            if (command instanceof Function) {
                return command();
            }
            throw command;
        });

    addPlayerMenu = team => inquirer.prompt(this.addPlayerMenuPrompt, {team, newPlayer: {team: team.id, tournaments: []}})
        .then(answers => this.playersService.createPlayer(answers.newPlayer)
            .then((player) => answers.addCurrentOutcome ? this.playersService.addCurrentOutcome(player.id, answers.team.outcome) : null));

    processSystemChoices = answers => {
        if (answers.team === 'quit' || answers.player === 'quit' || answers.action === 'quit') {
            this.quit();
        } else if (answers.team === 'back') {
            this.toMainMenu(); //в главное меню
        } else if (answers.player === 'back') {
            this.toTeamSelection(); //к выбору команды
        } else if (answers.action === 'back') {
            this.toPlayerSelection(answers); //к выбору игрока
        }
        return answers;
    };

    toPlayerSelection = answers => {
        throw () => this.rosterMenu({team: answers.team})
    };

    toTeamSelection = () => {
        throw () => this.rosterMenu()
    };

    toMainMenu = () => {
        throw () => this.menu()
    };

    quit = () => {
        throw 'quit';
    };

    applyTeamAction = answers => this.selectTeamAction(answers);

    selectTeamAction = answers => {
        switch (answers.player) {
            case 'addPlayer':
                return this.addPlayerMenu(answers.team)
                    .then(() => this.toPlayerSelection(answers))
            default:
                return Promise.resolve(answers);
        }
    };

    applyPlayerAction = answers => this.selectPlayerAction(answers)
        .then(() => this.getPlayersForSelection(answers.team))
        .then(players => ({
            ...answers,
            player: players.find(player => player.id === answers.player?.id),
        }));

    selectPlayerAction = answers => {
        switch (answers.action) {
            case 'removeCurrentOutcome':
                return this.playersService.removeCurrentOutcome(answers.player.id);
            case 'addCurrentOutcome':
                return this.playersService.addCurrentOutcome(answers.player.id, answers.team.outcome);
            case 'changeInstagram':
                return this.playersService.editPlayer({...answers.player, instagram: answers.newInstagram})
            case 'rename':
                return this.playersService.editPlayer({...answers.player, name: answers.newName})
            case 'removeFromRoster':
                return this.playersService.editPlayer({...answers.player, team: undefined})
                    .then(() => this.toPlayerSelection(answers))
            case 'delete':
                return answers.deleteConfirmation ? this.playersService.deletePlayer(answers.player.id) : Promise.resolve({...answers, action: undefined})
            default:
                return Promise.resolve(answers);
        }
    };

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

