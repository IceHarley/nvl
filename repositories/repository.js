import {asyncAirtable} from "../config.js";

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
        return asyncAirtable.select(this.table, params)
    };
}