import {toOperation, toRecords} from "../common/utils.js";
import fuzzy from "fuzzy";
import inquirer from "inquirer";
import cli from "clui";

export default class ChoiceSources {
    #db

    constructor(db) {
        this.#db = db;
    }

    init = () => Promise.all([
        this.#db.players.iterator().all(),
        this.#db.teams.iterator().all(),
        this.#db.outcomes.iterator().all(),
        this.#db.playersSource.clear(),
        this.#db.teamsSource.clear(),
    ])
        .then(([players, teams, outcomes]) => ([
            toRecords(players),
            toRecords(teams),
            toRecords(outcomes)
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
            this.#db.playersSource.batch(players.map(player => toOperation(player))),
            this.#db.teamsSource.batch(teams.map(team => toOperation(team))),
        ]));

    update = playerId => Promise.all([
        this.#db.players.get(playerId),
        this.#db.teamsSource.iterator().all()
    ])
        .then(([player, teams]) => [player, toRecords(teams)])
        .then(([player, teams]) => this.#db.playersSource.put(playerId, {
            ...player,
            teamName: teams.find(team => player.team === team.id)?.name,
            currentOutcome: teams.find(team => player.tournaments?.includes(team.outcome))?.outcome,
            outcomeTeam: teams.find(team => player.tournaments?.includes(team.outcome))?.name,
        }));

    delete = playerId => this.#db.playersSource.del(playerId);

    teamsSource = (answers, input = '') => this.#db.teamsSource.iterator().all()
        .then(teams => fuzzy
            .filter(input, toRecords(teams), {extract: t => t.name})
            .map(el => ({name: el.string, value: el.original, short: `${el.original.name} (${el.original.city})`}))
            .concat([
                new inquirer.Separator(),
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ]));

    getPlayersForSelection = filter =>
        this.#db.playersSource.iterator().all()
            .then(players => toRecords(players).filter(filter));

    playersSource = filter => (answers, input = '') => this.getPlayersForSelection(filter)
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

    //TODO убрать отсюда в общее место и удалить дублирование
    formatPlayer = player => new cli.Line()
        .column(player.name, 20, [])
        .padding(2)
        .column(player.teamName || '', 20, [])
        .padding(2)
        .column(player.instagram || '', 20, [])
        .padding(2)
        .column(!player.currentOutcome ? 'не заигран' : `заигран за ${player.outcomeTeam}`, 40, [])
        .contents();
}