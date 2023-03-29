import test from 'ava';
import ExcelSaver from "./excelSaver.js";
import {TEST_RATING_DATA} from "../csv/csvRatingSaver.test.js";

const excelSaver = new ExcelSaver(true);

test('сохранение в файл ./test-output/rating.xlsx', async t => {
    await excelSaver.save({tournamentName: 'Весна 2022', fileName: './test-output/rating.xlsx'}, TEST_RATING_DATA
    )
    t.pass();
});


