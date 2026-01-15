import {getRosterMenuMessage, quit, rosterPlayerActions} from "./playersCliUtils.js";
import inquirer from "inquirer";
import PlayerActions from "./playerActions.js";
import DocxService from "./docxService.js";

export default class RosterMenu {
    choiceSources
    playersService
    addPlayerMenu
    playerActions
    docxService

    constructor(playersService, choiceSources, addPlayerMenu) {
        this.playersService = playersService;
        this.choiceSources = choiceSources;
        this.addPlayerMenu = addPlayerMenu;
        this.playerActions = new PlayerActions(this.playersService, this.choiceSources);
        this.docxService = new DocxService();
    }

    playersSourceWithSystemChoices = (answers, input = '') =>
        this.choiceSources.playersSource(p => p.team === answers.team.id)(answers, input)
            .then(players => this.addSystemChoices(players));

    playersSourceNoCurrentOutcome = answers =>
        this.choiceSources.playersSource(p => p.team === answers.team.id && !p.currentOutcome)(answers, '');

    addSystemChoices = choices => ([
        {name: '====Добавить игрока', value: 'addPlayer', short: 'Добавить игрока в команду'}])
        .concat(choices).concat([
            new inquirer.Separator(),
            {name: '====Отметить заигранных', value: 'multipleOutcomes', short: 'Отметить заигранных'},
            {name: '====Распечатать заявку', value: 'print', short: 'Заявка'},
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
            when: answers => {
                const isSystemAction = ['back', 'quit', 'addPlayer', 'multipleOutcomes', 'print'].includes(answers.player);
                return !isSystemAction && answers.team !== 'back' && answers.team !== 'quit';
            },
            choices: rosterPlayerActions,
            loop: false,
        },
        {
            type: 'input',
            name: 'newBirthYear',
            message: getRosterMenuMessage('Год рождения'),
            default: answers => answers?.player?.birthYear,
            when: answers => answers.action === 'changeBirthYear',
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
        {
            type: 'checkbox',
            name: 'multipleOutcomes',
            message: getRosterMenuMessage('Пометка заигранных'),
            choices: this.playersSourceNoCurrentOutcome,
            loop: false,
            when: answers => answers.player === 'multipleOutcomes',
        }
    ];

    open = (answers, toPrevMenu) => inquirer.prompt(this.rosterMenuPrompt, answers)
        .then(answers => this.processSystemChoices(answers, toPrevMenu))
        .then(answers => this.applyTeamAction(answers, toPrevMenu))
        .then(answers => this.playerActions.applyPlayerAction(answers, () => this.toPlayerSelection(answers, toPrevMenu)))
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
                    .then(() => this.toPlayerSelection(answers, toPrevMenu));
            case 'multipleOutcomes': {
                const playerIds = answers.multipleOutcomes.map(player => player.id);
                return this.playersService.addCurrentOutcomes(playerIds)
                    .then(() => this.choiceSources.updateList(playerIds))
                    .then(() => this.toPlayerSelection(answers, toPrevMenu));
            }
            case 'print':
                return this.handlePrintRoster(answers)
                    .then(() => this.toPlayerSelection(answers, toPrevMenu));
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

    handlePrintRoster = async (answers) => {
        try {
            console.log('Формирование заявки команды...');

            // Получаем всех игроков команды
            const players = await this.playersService.getPlayersByTeam(answers.team.id);

            // Генерируем DOCX
            const docBuffer = await this.docxService.generateRosterDoc(answers.team, players);

            // Сохраняем файл
            const filename = `заявка_${answers.team.name}_${new Date().toISOString().split('T')[0]}.docx`
                .replace(/[^a-zA-Z0-9а-яА-Я_.]/g, '_');

            const filePath = await this.docxService.saveDocToFile(docBuffer, filename);

            console.log(`✅ Заявка сохранена: ${filePath}`);
            console.log('Готово! Файл можно распечатать.');

        } catch (error) {
            console.error('❌ Ошибка при создании заявки:', error.message);
        }
    };
}