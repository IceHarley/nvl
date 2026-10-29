// Турнир, с которым идёт работа в меню составов. Источник истины — db.meta (ROSTER_TOURNAMENT),
// здесь — копия для синхронных подписей и условий в prompt'ах inquirer.
export const ROSTER_TOURNAMENT = 'Roster tournament';

const state = {tournament: null};

export const setRosterTournament = tournament => {
    state.tournament = tournament || null;
};

export const getRosterTournament = () => state.tournament;

// Единое чтение меты для меню и PlayersService: «не выбран» только при отсутствии ключа, прочие сбои — ошибка
export const readRosterTournament = meta => meta.get(ROSTER_TOURNAMENT, {valueEncoding: 'json'})
    .catch(err => {
        if (err.code === 'LEVEL_NOT_FOUND') {
            return null;
        }
        throw err;
    });

// Без выбранного турнира действуют правила сезона (как до появления выбора турнира).
export const isCupContext = () => state.tournament?.isSeason === false;

export const rosterTournamentLabel = () => state.tournament
    ? `${state.tournament.code} ${state.tournament.name}`
    : 'турнир не выбран';

export const formatTournamentChoice = t => `${t.code} ${t.name} (${t.isSeason ? 'сезон' : 'кубок'}, ${t.status})`;
