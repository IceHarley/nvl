export const minify = record => {
    if (record?.fields) {
        return {
            id: record.id,
            name: record.fields['Имя'],
            birthYear: record.fields['Год рождения'],
            team: record.fields['Команда']?.[0],
            tournaments: record.fields['Турниры'] || [],
        };
    }
    return {
        id: record.id,
        name: record.name,
        birthYear: record.birthYear,
        team: record.team,
        tournaments: record.tournaments || [],
    };
};
