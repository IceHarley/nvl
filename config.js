import AsyncAirtable from 'asyncairtable';

const API_KEY = 'keyi6O4VLNsG6uRKr';
const BASE_ID = 'app1MljghZX5136lh';
const CONFIG = {
    maxRetry: 120000
}

export const DEFAULT_RATING_INCREASE = [
    ['A', 6, 5, 4, 1],
    ['B', 5, 4, 3, 0],
    ['F', 4, 3, 2, 0],
    ['J', 3, 2, 1, 0],
    ['Z', 0, 0, 0, 0]
];

export const asyncAirtable = new AsyncAirtable(API_KEY, BASE_ID, {...CONFIG});
