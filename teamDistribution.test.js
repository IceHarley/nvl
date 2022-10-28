import test from 'ava';
import TeamsDistribution from "./teamsDistribution.js";
import MockResultsRepository from "./mock/mockResults.js";
import MockDistributionRepository from "./mock/mockDistribution.js";
import {assertDistribution} from "./utils.js";


const mockResults = new MockResultsRepository();
const mockDistribution = new MockDistributionRepository();
const teamsDistribution = new TeamsDistribution();

test('для пустых результатов возвращается ошибка', t => {
    t.throws(() => new TeamsDistribution().distribute());
});

test('обычные группы - ротация третьих и первых мест', t => {
    assertDistribution(t, teamsDistribution.distribute(mockResults.getGroups(['A', 'B', 'C'])),
        `A1 A
         A2 A
         B1 A
         
         A3 B
         B2 B
         C1 B
         
         B3 C
         C2 C
         C3 C`);
});

test('в группе В неявка', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[4].result = '+:- (неявка)';
    groups[5].result = '+:- (неявка)';
    assertDistribution(t, teamsDistribution.distribute(groups),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         B2  B
         C1  B
         
         B3! C
         C2  C
         C3  C`);
});

test('в группе В неявка двух команд', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[3].result = '+:- (неявка)';
    groups[4].result = '+:- (неявка)';
    groups.splice(5, 1);
    assertDistribution(t, teamsDistribution.distribute(groups),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         C1  B
         C2  B
         
         B3! C
         B3! C
         C3  C`);
});

test('в группе В и в группе С неявка двух команд', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[3].result = '+:- (неявка)';
    groups[4].result = '+:- (неявка)';
    groups.splice(5, 1);
    groups[5].result = '+:- (неявка)';
    groups[6].result = '+:- (неявка)';
    groups.splice(7, 1);
    assertDistribution(t, teamsDistribution.distribute(groups),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         C1  B
         B3! B
         
         B3! C
         C3! C
         C3! C`);
});

test('в группе В снятие', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[4].result = '+:- (снятие)';
    groups[5].result = '+:- (снятие)';
    assertDistribution(t, teamsDistribution.distribute(groups),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         B2  B
         C1  B
         
         C2  C
         C3  C`);
});

test('в случае равенства показателей, например неявка обеих команд, выше должна быть та, которая была выше в прошлом туре', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[3].result = '+:- (неявка)';
    groups[4].result = '+:- (неявка)';
    groups.splice(5, 1);
    const actual = teamsDistribution.distribute(groups, mockDistribution.getAllRecords());
    assertDistribution(t, actual,
        `A1  A
         A2  A
         B1  A
         
         A3  B
         C1  B
         C2  B
         
         B3! C
         B3! C
         C3  C`);
    t.like(actual[6], {team: 'reca5NQVSKm3gmn8C', group: 'B', place: 3});
    t.like(actual[7], {team: 'rectlFHt9jokhoEon', group: 'B', place: 3});
});

test('турнир группы B не состоялся', t => {
    const groups = mockResults.getGroups(['A', 'B', 'C']);
    groups[3].result = '-:- (неявка)';
    groups[3].winner = null;
    groups[3].loser = 'Команда1';
    groups[4].result = '-:- (неявка)';
    groups[4].winner = null;
    groups[4].loser = 'Команда2';
    groups[5].result = '-:- (неявка)';
    groups[5].winner = null;
    groups[5].loser = 'Команда3';
    const actual = teamsDistribution.distribute(groups, [
        {team: 'Команда1', group: 'A'},
        {team: 'Команда2', group: 'B'},
        {team: 'Команда3', group: 'C'},
    ]);
    assertDistribution(t, actual,
        `A1  A
         A2  A
         A3  A
         
         C1  B
         C2  B
         C3  B
         
         B3! C
         B3! C
         B3! C`);
    t.like(actual[6], {team: 'Команда1', group: 'B', place: 3});
    t.like(actual[7], {team: 'Команда2', group: 'B', place: 3});
    t.like(actual[8], {team: 'Команда3', group: 'B', place: 3});
});

test('полная группа и одна новая команда', t => {
    const groups = mockResults.getGroups(['A']);
    assertDistribution(t, teamsDistribution.distribute(groups, [], ['Команда1']),
        `A1  A
         A2  A
         +1  A
         
         A3  B`);
});

test('полная группа и несколько новых команд', t => {
    const groups = mockResults.getGroups(['A']);
    assertDistribution(t, teamsDistribution.distribute(groups, [],
        ['Команда1', 'Команда2', 'Команда3', 'Команда4', 'Команда5']),
        `A1  A
         A2  A
         +1  A
         
         A3  B
         +2  B
         +3  B
         
         +4  C
         +5  C`);
});

test('группа из двух команд и одна новая команда', t => {
    const groups = mockResults.getGroup('O').splice(2, 1);
    const actual = teamsDistribution.distribute(groups, [], ['recG8VvrEOgzMe8yD']);
    assertDistribution(t, actual,
        `O1  A
         O2  A
         +1  A`);
    t.like(actual[2], {team: 'recG8VvrEOgzMe8yD'})
});

test('группа из двух команд и несколько новых команд', t => {
    const groups = mockResults.getGroup('O').splice(2, 1);
    assertDistribution(t, teamsDistribution.distribute(groups, [],
        ['Команда1', 'Команда2', 'Команда3', 'Команда4', 'Команда5']),
        `O1  A
         O2  A
         +1  A
         
         +2  B
         +3  B         
         +4  B
         
         +5  C`);
});

test('в последней группе снятие и 2 новые команды', t => {
    const groups = mockResults.getGroups(['A', 'B']);
    groups[4].result = '+:- (снятие)';
    groups[5].result = '+:- (снятие)';
    assertDistribution(t, teamsDistribution.distribute(groups, [], ['Команда1', 'Команда2']),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         B2  B
         +1  B
         
         +2  C`);
});

test('в последней группе неявка и 2 новые команды', t => {
    const groups = mockResults.getGroups(['A', 'B']);
    groups[4].result = '+:- (неявка)';
    groups[5].result = '+:- (неявка)';
    assertDistribution(t, teamsDistribution.distribute(groups, [], ['Команда1', 'Команда2']),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         B2  B
         +1  B
         
         B3! C
         +2  C`);
});

test('в последней группе 2 неявки и 2 новые команды', t => {
    const groups = mockResults.getGroups(['A', 'B']);
    groups[3].result = '+:- (неявка)';
    groups[4].result = '+:- (неявка)';
    groups.splice(5, 1);
    assertDistribution(t, teamsDistribution.distribute(groups, [], ['Команда1', 'Команда2']),
        `A1  A
         A2  A
         B1  A
         
         A3  B
         +1  B
         +2  B
         
         B3! C
         B3! C`);
});

test('обычные группы - ротация третьих и первых мест, команда А3 сыграла, но снялась', t => {
    assertDistribution(t, teamsDistribution.distribute(mockResults.getGroups(['A', 'B', 'C']), [], [],
        ['recwdXiTwfieWJ2zl']),
        `A1 A
         A2 A
         B1 A
         
         B2 B
         C1 B
         B3 B
         
         C2 C
         C3 C`);
});

test('команда одновременно в новых и в снявшихся командах - ошибка', t => {
    t.throws(() => teamsDistribution.distribute(mockResults.getGroups(['A', 'B', 'C']), [],
        ['teamId'],
        ['teamId']));
});

test('команда несколько раз в новых командах - ошибка', t => {
    t.throws(() => teamsDistribution.distribute(mockResults.getGroups(['A', 'B', 'C']), [],
        ['duplicateTeamId', 'uniqueTeamId', 'duplicateTeamId']));
});

test('весь тур', t => {
    assertDistribution(t, teamsDistribution.distribute(mockResults.getAllRecords(), [], ['recM6djz83jZzezYJ']),
        "A1 A\n   A2 A\n    B1 A\n" +
        "A3 B\n   B2 B\n    C1 B\n" +
        "B3 C\n   C2 C\n    D1 C\n" +
        "C3 D\n   D2 D\n    E1 D\n" +
        "D3 E\n   E2 E\n    F1 E\n" +
        "E3 F\n   F2 F\n    G1 F\n" +
        "F3 G\n   G2 G\n    H1 G\n" +
        "G3 H\n   H2 H\n    I1 H\n" +
        "H3 I\n   I2 I\n    J1 I\n" +
        "I3 J\n   J2 J\n    K1 J\n" +
        "J3 K\n   L1 K\n    L2 K\n" +
        "K3! L\n  M1 L\n    M2 L\n" +
        "N1 M\n   M3 M\n    N2 M\n" +
        "O1 N\n   N3 N\n    O2 N\n" +
        "P1 O\n   P2 O\n    P3 O\n" +
        "+1 P\n   Q3! P\n   Q3! P\n" +
        "Q3! Q\n");
});
