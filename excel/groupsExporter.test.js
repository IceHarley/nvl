import test from 'ava';
import GroupsExporter from "./groupsExporter.js";
import MockDistributionRepository from "../mock/mockDistribution.js";
import MockTeamsRepository from "../mock/mockTeams.js";

const groupsExporter = new GroupsExporter();
const mockDistribution = new MockDistributionRepository();
const mockTeams = new MockTeamsRepository();

test('экспорт групп в файл', async t => {
    await groupsExporter.export({tournamentName: 'Весна 2022', fileName: './test-output/groups.xlsx'},
        mockDistribution.getByTournamentAndTourDirect('recTBtRUiBwh3avjf', 3),
        mockTeams.getActiveTeams()
    )
    t.pass();
});
