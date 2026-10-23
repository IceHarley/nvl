import {toOperation, toRecords} from "../common/utils.js";
import fuzzy from "fuzzy";
import inquirer from "inquirer";
import {formatPlayer} from "./playersCliUtils.js";
import {readRosterTournament, setRosterTournament} from "./rosterContext.js";

const replaceOperations = (sublevel, oldIds, records) => {
    const newIds = new Set(records.map(r => r.id));
    return oldIds.filter(id => !newIds.has(id)).map(key => ({type: 'del', sublevel, key}))
        .concat(records.map(record => ({...toOperation(record), sublevel})));
};

export default class ChoiceSources {
    #db

    constructor(db) {
        this.#db = db;
    }

    // Списки выбора и контекст турнира меняются только после успешного чтения всех данных — при сбое остаются прежние
    init = () => Promise.all([
        this.#db.players.iterator().all(),
        this.#db.teams.iterator().all(),
        this.#db.outcomes.iterator().all(),
        readRosterTournament(this.#db.meta),
        this.#db.playersSource.keys().all(),
        this.#db.teamsSource.keys().all(),
    ])
        .then(([players, teams, outcomes, tournament, oldPlayerIds, oldTeamIds]) =>
            this.#buildSources(toRecords(players), toRecords(teams), toRecords(outcomes))
                .then(([players, teams]) => this.#db.playersSource.db.batch([
                    ...replaceOperations(this.#db.playersSource, oldPlayerIds, players),
                    ...replaceOperations(this.#db.teamsSource, oldTeamIds, teams),
                ]))
                .then(() => setRosterTournament(tournament)));

    #buildSources = (players, teams, outcomes) => Promise.resolve([players
            .map(player => ({
                ...player,
                teamName: teams.find(team => player.team === team.id)?.name,
                teamOutcome: player.team && outcomes.find(outcome => outcome.teamId === player.team)?.id,
                currentOutcome: outcomes.find(outcome => player.tournaments?.includes(outcome.id))?.id,
            })),
            teams.map(team => ({
                ...team,
                outcome: outcomes.find(outcome => outcome.teamId === team.id)?.id
            }))
        ])
        .then(([players, teams]) => [
            players.map(player => ({
                ...player,
                outcomeTeam: teams.find(team => player.currentOutcome && player.currentOutcome === team.outcome)?.name,
                outcomeTeamId: teams.find(team => player.currentOutcome && player.currentOutcome === team.outcome)?.id,
            })),
            teams
        ]);

    update = playerId => Promise.all([
        this.#db.players.get(playerId),
        this.#db.teamsSource.iterator().all()
    ])
        .then(([player, teams]) => [player, toRecords(teams)])
        .then(([player, teams]) => this.#db.playersSource.put(playerId, {
            ...player,
            teamName: teams.find(team => player.team === team.id)?.name,
            teamOutcome: teams.find(team => player.team === team.id)?.outcome,
            currentOutcome: teams.find(team => team.outcome && player.tournaments?.includes(team.outcome))?.outcome,
            outcomeTeam: teams.find(team => team.outcome && player.tournaments?.includes(team.outcome))?.name,
            outcomeTeamId: teams.find(team => team.outcome && player.tournaments?.includes(team.outcome))?.id,
        }));

    updateList = playerIds => Promise.all(playerIds.map(id => this.update(id)));

    delete = playerId => this.#db.playersSource.del(playerId);

    teamsSource = (answers, input = '') => this.#db.teamsSource.iterator().all()
        .then(teams => {
            const recs = toRecords(teams);
            recs.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ru'));
            return fuzzy.filter(input, recs, {extract: t => t.name});
        })
        .then(filtered => filtered
            .map(el => ({name: el.string, value: el.original, short: `${el.original.name} (${el.original.city})`}))
        )
        .then(mapped => mapped.concat([
                new inquirer.Separator(),
                {name: '====Назад', value: 'back', short: 'Назад'},
                {name: '====Выход', value: 'quit', short: 'Выход'},
            ]));

    getPlayersForSelection = filter =>
        this.#db.playersSource.iterator().all()
            .then(players => toRecords(players).filter(filter));

    playersSource = filter => (answers, input = '') => this.getPlayersForSelection(filter)
        .then(players => {
            players.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ru'));
            return fuzzy.filter(input, players, {extract: p => p.name});
        })
        .then(filtered => filtered
            .map(el => ({
                name: formatPlayer(el.original),
                value: el.original,
                short: el.original.name
            }))
        )
        .catch(e => {
            console.log(e);
            throw e;
        });
}
