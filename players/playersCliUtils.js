import cli from "clui";

export const getRosterMenuMessage = message => answers => ([
    !answers.team ? '' : `\nСостав команды ${answers.team?.name}`,
    !answers.player ? '' : `\nИгрок: ${formatPlayer(answers.player)}`,
    `\n${message}`,
].join(''))

export const formatPlayer = player => new cli.Line()
    .column(player.name, 20, [])
    .padding(2)
    .column(player.teamName || '', 20, [])
    .padding(2)
    .column(player.instagram || '', 20, [])
    .padding(2)
    .column(!player.currentOutcome ? 'не заигран' : `заигран за ${player.outcomeTeam}`, 40, [])
    .contents();

export const quit = () => {
    throw 'quit';
};