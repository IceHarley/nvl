export class DistributionRemover {
    #repositories = {};

    constructor(repositories) {
        this.#repositories = repositories;
    }

    removeDistribution = paramsId => this.#repositories.distribution.removeByParamsId(paramsId)
        .then(number => console.log(`Удалено ${number.flat().length} записей`))
        .catch(error => console.log('Произошла ошибка ' + error))
        .then(() => this.#repositories.params.updateState(paramsId, "Готово к запуску"))
        .catch(error => console.log('Произошла ошибка при обновлении статуса ' + error))
}