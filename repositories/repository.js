import {asyncAirtable} from "../config.js";

const minifyRecord = record => ({
    id: record.id,
    fields: record.fields,
})

export default class Repository {
    constructor(table, defaultView) {
        this.table = table;
        this.defaultView = defaultView;
    }

    getAllRecords = async (params = {view: this.defaultView}) => {
        params = {
            ...params,
            view: params.view || this.defaultView,
        }
        return await asyncAirtable.select(this.table, params)
    };
}