import AsyncAirtable from 'asyncairtable';

const ACCESS_TOKEN = 'patLIKG73bLwZeBIj.ebd59d1c414989c299cefc42082b70f1a1664ba628d493050d2a01d4094b510a';
const BASE_ID = 'app1MljghZX5136lh'; //Основная База
// const BASE_ID = 'appMrRjGBAqVWdwoA';// для тестов НВЛ (September 27, 2023)
const CONFIG = {
    maxRetry: 120000
}
export const GENERATED_PATH = 'd:\\Users\\levin\\Documents\\NVL\\2024 весна\\';

export const asyncAirtable = new AsyncAirtable(ACCESS_TOKEN, BASE_ID, {...CONFIG});
