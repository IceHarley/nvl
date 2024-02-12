import AsyncAirtable from "asyncairtable";
import {ACCESS_TOKEN, BASE_ID, CONFIG} from "../config.js";

export const asyncAirtable = new AsyncAirtable(ACCESS_TOKEN, BASE_ID, {...CONFIG});