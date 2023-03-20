export default class PlayerActions {
    choiceSources
    playersService

    constructor(playersService, choiceSources) {
        this.playersService = playersService;
        this.choiceSources = choiceSources;
    }

    applyPlayerAction = (answers, toPrevMenu) => this.selectPlayerAction(answers, toPrevMenu)
        .then(() => this.choiceSources.getPlayersForSelection(p => !answers.team || p.team === answers.team.id))
        .then(players => ({
            ...answers,
            player: players.find(player => player.id === answers.player?.id),
        }));

    selectPlayerAction = (answers, toPrevMenu) => {
        switch (answers.action) {
            case 'removeCurrentOutcome':
                return this.playersService.removeCurrentOutcome(answers.player.id)
                    .then(() => this.choiceSources.update(answers.player.id))
                    .then(() => toPrevMenu());
            case 'addCurrentOutcome':
                return this.playersService.addCurrentOutcome(answers.player.id)
                    .then(() => this.choiceSources.update(answers.player.id))
                    .then(() => toPrevMenu());
            case 'changeInstagram':
                return this.playersService.editPlayer({...answers.player, instagram: answers.newInstagram})
                    .then(() => this.choiceSources.update(answers.player.id))
                    .then(() => toPrevMenu());
            case 'rename':
                return this.playersService.editPlayer({...answers.player, name: answers.newName})
                    .then(() => this.choiceSources.update(answers.player.id))
                    .then(() => toPrevMenu());
            case 'removeFromRoster':
                return this.playersService.editPlayer({...answers.player, team: undefined})
                    .then(() => this.choiceSources.update(answers.player.id))
                    .then(() => toPrevMenu());
            case 'delete':
                if (answers.deleteConfirmation) {
                    return this.playersService.deletePlayer(answers.player.id)
                        .then(() => this.choiceSources.delete(answers.player.id))
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
}