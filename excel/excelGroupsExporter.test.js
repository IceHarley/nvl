import test from 'ava';
import ExcelGroupsExporter from "./excelGroupsExporter.js";
import MockDistributionRepository from "../mock/mockDistribution.js";
import MockTeamsRepository from "../mock/mockTeams.js";

const groupsExporter = new ExcelGroupsExporter(true);
const mockDistribution = new MockDistributionRepository();
const mockTeams = new MockTeamsRepository();

test('экспорт групп в файл ./test-output/groups.xlsx', async t => {
    await groupsExporter.export({tournamentName: 'Весна 2022', fileName: './test-output/groups.xlsx'},
        mockDistribution.getByTournamentAndTourDirect('recTBtRUiBwh3avjf', 3),
        mockTeams.getActiveTeams()
    )
    t.pass();
});
