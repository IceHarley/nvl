import test from 'ava';
import CsvGroupsExporter from "./csvGroupsExporter.js";
import MockDistributionRepository from "../mock/mockDistribution.js";
import MockTeamsRepository from "../mock/mockTeams.js";

const groupsExporter = new CsvGroupsExporter(true);
const mockDistribution = new MockDistributionRepository();
const mockTeams = new MockTeamsRepository();

test('экспорт групп в файл ./test-output/groups.csv', async t => {
    await groupsExporter.export({tournamentName: 'Весна 2022', fileName: './test-output/groups.csv'},
        mockDistribution.getByTournamentAndTourDirect('recTBtRUiBwh3avjf', 3),
        mockTeams.getActiveTeams()
    )
    t.pass();
});
