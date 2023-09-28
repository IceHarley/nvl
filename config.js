import AsyncAirtable from 'asyncairtable';

const API_KEY = 'keyi6O4VLNsG6uRKr';
// const BASE_ID = 'app1MljghZX5136lh'; //Основная База
const BASE_ID = 'appMrRjGBAqVWdwoA';// для тестов НВЛ (September 27, 2023)
const CONFIG = {
    maxRetry: 120000
}
export const GENERATED_PATH = 'd:\\Users\\levin\\Documents\\NVL\\2023 осень\\';

export const asyncAirtable = new AsyncAirtable(API_KEY, BASE_ID, {...CONFIG});
