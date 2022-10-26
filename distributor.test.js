import test from 'ava';
import Distributor from "./distributor.js";
import MockResultsRepository from "./mock/mockResults.js";
import MockDistributionRepository from "./mock/mockDistribution.js";
import MockTournamentsRepository from "./mock/mockTournaments.js";
import {assertDistribution} from "./utils.js";
import MockDistributionParamsRepository from "./mock/mockDistributionParams.js";
import DataLoader from "./dataLoader.js";

const mockParamsRepository = new MockDistributionParamsRepository();
const mockDistributionRepository = new MockDistributionRepository();
const mockResultsRepository = new MockResultsRepository();
const mockTournamentsRepository = new MockTournamentsRepository();

const dataLoader = new DataLoader({
    params: mockParamsRepository,
    results: mockResultsRepository,
    distribution: mockDistributionRepository,
    tournaments: mockTournamentsRepository,
});

const distributor = new Distributor(dataLoader, mockDistributionRepository, {saveData: data => data});

test.serial('запуск: ', async t => {
    assertDistribution(t, await distributor.distribute('recqUk1lPBnwz4s41'),
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