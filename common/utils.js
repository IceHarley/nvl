import cli from "clui";

export const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

export const alphabetPosition = char => char ? parseInt(char, 36) - 10 : undefined;

export const positionToChar = position => String.fromCharCode('A'.charCodeAt(0) + position)

export const assertDistribution = (t, actual, expected) => {
    const distribution = expected.replace(/[ \t]/g, '').split('\n').filter(s => s !== '');
    t.is(actual.length, distribution.length);
    for (let i = 0; i < actual.length; i++) {
        t.like(actual[i], {
            group: distribution[i][0],
            place: parseInt(distribution[i][1]),
            newGroup: distribution[i].length === 3 ? distribution[i][2] : distribution[i][3],
            tech: distribution[i].length === 4 && distribution[i][2] === '!' ? 'неявка' : undefined,
            position: i % 3 + 1,
        });
    }
};

export const getTournamentAndTour = params => {
    switch (params.nextTour) {
        case 3:
            return {
                results: [params.currentTournament.id, 2],
                distribution: [params.currentTournament.id, 1]
            }
        case 2:
            return {
                results: [params.currentTournament.id, 1],
                distribution: [params.previousTournament.id, 3]
            }
        case 1:
            return {
                results: [params.previousTournament.id, 3],
                distribution: [params.previousTournament.id, 2]
            }
    }
};

export const clone = obj => JSON.parse(JSON.stringify(obj));

export const chunkArray = (array, chunkSize = 10) => {
    const clonedArray = clone(array);
    return Array.from({length: Math.ceil(clonedArray.length / chunkSize)}, () => clonedArray.splice(0, chunkSize));
};

export const withSpinner = (func, message = "Загрузка данных...") => (...args) => {
    const spinner = new cli.Spinner(message, ['◜', '◠', '◝', '◞', '◡', '◟']);
    spinner.start();
    return func(...args).then(res => {
        spinner.stop();
        return res;
    });
}

export const format = obj => JSON.stringify(obj, null, 2);

export const isRegularTour = tour => Number.isInteger(parseFloat(tour));

export const resolvePromisesSeq = async (tasks) => {
    const results = [];
    for (const task of tasks) {
        results.push(await task);
    }
    return results;
};

//Только описанные в классе, без родительских, конструкторов, геттеров, сеттеров
export const getMethods = obj => {
    let properties = new Set()
    Object.getOwnPropertyNames(obj).map(item => properties.add(item))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}
export const verifyLength = (array, length, errorMore = 'Размер массива более ожидаемого', errorLess = 'Размер массива менее ожидаемого') => {
    if (array.length > length) {
        throw new Error(errorMore);
    }
    if (array.length < length) {
        throw new Error(errorLess);
    }
    return array;
};

export const toRecords = entries => entries.map(([id, entry]) => ({id, ...entry}));

export const toOperation = record => ({
    type: 'put',
    key: record.id,
    value: {
        ...record
    }
});