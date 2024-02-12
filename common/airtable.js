import AsyncAirtable from "asyncairtable";
import dotenv from 'dotenv';

dotenv.config({path: '.env', override: true})
dotenv.config({path: '.local.env', override: true})

export const asyncAirtable = new AsyncAirtable(process.env.ACCESS_TOKEN, process.env.BASE_ID, {maxRetry: process.env.MAX_RETRY});