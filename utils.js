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

export const alphabetPosition = char => !!char ? parseInt(char, 36) - 10 : undefined;

export const positionToChar = position => String.fromCharCode('A'.charCodeAt(0) + position)

export const assertDistribution = (t, actual, expected) => {
    const distribution = expected.replace(/[ \t]/g, '').split('\n').filter(s => s !== '');
    t.is(actual.length, distribution.length);
    for (let i = 0; i < actual.length; i++) {
        t.like(actual[i], {
            group: distribution[i][0],
            place: parseInt(distribution[i][1]),
            newGroup: distribution[i].length === 3 ? distribution[i][2] : distribution[i][3],
            tech: distribution[i].length === 4 && distribution[i][2] === '!' ? 'неявка' : undefined
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

export const chunkArray = (array, chunkSize = 10) =>
    Array.from({length: Math.ceil(array.length / chunkSize)}, () => array.splice(0, chunkSize));