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

    constructor(repositories) {
        const db = new Level('./db', {valueEncoding: 'json'});
        this.#db = {
            main: db,
            meta: db.sublevel('meta'),
            players: db.sublevel('players', {valueEncoding: 'json'}),
            playersSource: db.sublevel('playersSource', {valueEncoding: 'json'}),
            teams: db.sublevel('teams', {valueEncoding: 'json'}),
            teamsSource: db.sublevel('teamsSources', {valueEncoding: 'json'}),
            outcomes: db.sublevel('outcomes', {valueEncoding: 'json'}),
            modifications: db.sublevel('modifications', {valueEncoding: 'json'}),
        }

        this.playersService = new SpinnerPlayersService(this.#db, repositories);
    }

    initSources = () => Promise.all([
        this.#db.players.iterator().all(),
        this.#db.teams.iterator().all(),
        this.#db.outcomes.iterator().all(),
        this.#db.playersSource.clear(),
        this.#db.teamsSource.clear(),
    ])
        .then(([players, teams, outcomes]) => ([
            this.toRecords(players),
            this.toRecords(teams),
            this.toRecords(outcomes)
        ]))
        .then(([players, teams, outcomes]) => [players
            .map(player => ({
                ...player,
                teamName: teams.find(team => player.team === team.id)?.name,
                currentOutcome: outcomes.find(outcome => player.tournaments?.includes(outcome.id))?.id,
            })),
            teams.map(team => ({
                ...team,
                outcome: outcomes.find(outcome => outcome.teamId === team.id).id
            }))
        ])
        .then(([players, teams]) => [
            players.map(player => ({
                ...player,
                outcomeTeam: teams.find(team => player.currentOutcome && player.currentOutcome === team.outcome)?.name,
            })),
            teams
        ])
        .then(([players, teams]) => Promise.all([
            this.#db.playersSource.batch(players.map(player => this.#toOperation(player))),
            this.#db.teamsSource.batch(teams.map(team => this.#toOperation(team))),
        ]));

    updateSource = playerId => Promise.all([
        this.#db.players.get(playerId),
        this.#db.teamsSource.iterator().all()
    ])
        .then(([player, teams]) => [player, this.toRecords(teams)])
        .then(([player, teams]) => this.#db.playersSource.put(playerId, {
            ...player,
            teamName: teams.find(team => player.team === team.id)?.name,
            currentOutcome: teams.find(team => player.tournaments?.includes(team.outcome))?.outcome,
            outcomeTeam: teams.find(team => player.tournaments?.includes(team.outcome))?.name,
        }));

    deleteSource = playerId => this.#db.playersSource.del(playerId);

    teamsSource = (answers, input = '') => this.#db.teamsSource.iterator().all()
        .then(teams => fuzzy
            .filter(input, this.toRecords(teams), {extract: t => t.name})
            .map(el => ({name: el.string, value: el.original, short: `${el.original.name} (${el.original.city})`}))
            .concat([
                new inquirer.Separator(),
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ]));


    toRecords = entries => entries.map(([id, entry]) => ({id, ...entry}));

    playersSource = filter => (answers, input = '') => this.getPlayersForSelection(answers.team, filter)
        .then(players => fuzzy
            .filter(input, players, {extract: p => p.name})
            .map(el => ({
                name: this.formatPlayer(el.original),
                value: el.original,
                short: el.original.name
            }))
        )
        .catch(e => {
            console.log(e);
            throw e;
        });

    playersSourceWithSystemChoices = filter => (answers, input = '') => this.playersSource(filter)(answers, input)
        .then(players => this.addSystemChoices(players));

    playersSourceWithNewPlayerChoice = filter => (answers, input = '') => this.playersSource(filter)(answers, input)
        .then(players => (input.length > 2
            ? [{name: `Новый игрок: ${input}`, value: input, short: `Создан новый игрок ${input}`}]
            : []).concat(players));

    addSystemChoices = choices => ([
        {name: '====Добавить игрока', value: 'addPlayer', short: 'Добавить игрока в команду'}])
        .concat(choices).concat([
            new inquirer.Separator(),
            {name: '====Назад', value: 'back', short: 'Назад'},
            {name: '====Выход', value: 'quit', short: 'Выход'},
        ]);

    getPlayersForSelection = (team, filter = p => p.team === team.id) =>
        this.#db.playersSource.iterator().all()
            .then(players => this.toRecords(players).filter(filter));

    formatPlayer = player => new cli.Line()
        .column(player.name, 20, [])
        .padding(2)
        .column(player.teamName || '', 20, [])
        .padding(2)
        .column(player.instagram || '', 20, [])
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
                name: new cli.Line().column('Исключить из состава команды', 28).column(answers.team.name, 40).contents(),
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

    #toOperation = record => ({
        type: 'put',
        key: record.id,
        value: {
            ...record
        }
    });

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
            source: this.playersSourceWithSystemChoices(),
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
            type: 'autocomplete',
            name: 'addPlayer',
            suggestOnly: false,
            message: this.getRosterMenuMessage('Добавление игрока в состав'),
            searchText: 'ищем...',
            source: this.playersSourceWithNewPlayerChoice(p => p),
            pageSize: 6,
            loop: false,
        },
        {
            type: 'input',
            name: 'newPlayer.instagram',
            message: 'Instagram',
            when: answers => typeof answers.addPlayer === 'string'
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
        .then(() => this.initSources())
        .then(() => this.menu(this.playersService))
        .then(() => this.#db.main.close())

    menu = () => inquirer.prompt(menuPrompt)
        .then(answers => {
            if (answers.operation === 'loadFromAirtable') {
                return this.loadFromAirtable(answers.loadType, this.playersService);
            } else if (answers.operation === 'uploadToAirtable') {
                return this.playersService.uploadLocalChanges()
                    .then(() => this.initSources());
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

    addPlayerMenu = team => inquirer.prompt(this.addPlayerMenuPrompt, {
        team,
        newPlayer: {team: team.id, tournaments: []}
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
            answers.addCurrentOutcome ? this.playersService.addCurrentOutcome(player.id, answers.team.outcome) : null]))
        .then(([answers]) => this.updateSource(answers.playerId));

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
                return this.playersService.removeCurrentOutcome(answers.player.id)
                    .then(() => this.updateSource(answers.player.id))
                    .then(() => this.toPlayerSelection(answers));
            case 'addCurrentOutcome':
                return this.playersService.addCurrentOutcome(answers.player.id, answers.team.outcome)
                    .then(() => this.updateSource(answers.player.id))
                    .then(() => this.toPlayerSelection(answers));
            case 'changeInstagram':
                return this.playersService.editPlayer({...answers.player, instagram: answers.newInstagram})
                    .then(() => this.updateSource(answers.player.id))
                    .then(() => this.toPlayerSelection(answers));
            case 'rename':
                return this.playersService.editPlayer({...answers.player, name: answers.newName})
                    .then(() => this.updateSource(answers.player.id))
                    .then(() => this.toPlayerSelection(answers));
            case 'removeFromRoster':
                return this.playersService.editPlayer({...answers.player, team: undefined})
                    .then(() => this.updateSource(answers.player.id))
                    .then(() => this.toPlayerSelection(answers))
            case 'delete':
                if (answers.deleteConfirmation) {
                    return this.playersService.deletePlayer(answers.player.id)
                        .then(() => this.deleteSource(answers.player.id))
                } else {
                    return Promise.resolve({
                        ...answers,
                        action: undefined
                    })
                }
            default:
                return Promise.resolve(answers);
        }
    };

    loadFromAirtable = (loadType, playersService) => {
        switch (loadType) {
            case 'onlyChanges':
                return playersService.loadOnlyChanges()
                    .then(() => this.initSources());
            case 'full':
                return playersService.fullLoad()
                    .then(() => this.initSources());
            case 'activeTeams':
                return playersService.loadActiveTeams()
                    .then(() => playersService.loadActiveTournamentOutcomes())
                    .then(() => this.initSources());
            default:
                return Promise.resolve('continue');
        }
    };
}

