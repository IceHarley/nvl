import dotenv from 'dotenv';

dotenv.config({path: '.env', override: true});
dotenv.config({path: '.local.env', override: true});

// API_ENV: develop | test | prod — по умолчанию prod, для отладки задавать явно develop/test
export const apiEnv = (process.env.API_ENV || 'prod').toLowerCase();
const baseUrl = (
    process.env[`API_BASE_URL_${apiEnv.toUpperCase()}`] ||
    process.env.API_BASE_URL ||
    'http://127.0.0.1:8000/api'
).replace(/\/$/, '');
const token = (
    process.env[`DATA_API_TOKEN_${apiEnv.toUpperCase()}`] ||
    process.env.DATA_API_TOKEN ||
    process.env.API_TOKEN
);

export const buildUrl = (path, params = {}) => {
    const pathStr = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(`${baseUrl}/${pathStr}`);
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
    return url.toString();
};

const headers = () => {
    const h = {'Content-Type': 'application/json'};
    if (token) {
        h['X-Api-Token'] = token;
    }
    return h;
};

const apiError = async (res, method, url, body) => {
    const text = await res.text();
    let msg = `API ${res.status} ${method} ${url}`;
    if (text) {
        const excerpt = text.slice(0, 1500);
        const laravelMsg = text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1] || text.match(/<title>([^<]+)<\/title>/)?.[1];
        if (laravelMsg) msg += `\nОшибка: ${laravelMsg}`;
        msg += `\nОтвет: ${excerpt}${text.length > 1500 ? '...' : ''}`;
    }
    if (body != null) msg += `\nЗапрос: ${JSON.stringify(body).slice(0, 500)}`;
    throw new Error(msg);
};

export const apiGet = async (path, params = {}) => {
    const url = buildUrl(path, params);
    const res = await fetch(url, {headers: headers()});
    if (!res.ok) await apiError(res, 'GET', url);
    return res.json();
};

export const apiPost = async (path, body) => {
    const url = buildUrl(path);
    const res = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
    });
    if (!res.ok) await apiError(res, 'POST', url, body);
    return res.json();
};

export const apiPut = async (path, body) => {
    const url = buildUrl(path);
    const res = await fetch(url, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(body),
    });
    if (!res.ok) await apiError(res, 'PUT', url, body);
    return res.json();
};

export const apiDelete = async (path, body) => {
    const url = buildUrl(path);
    const res = await fetch(url, {
        method: 'DELETE',
        headers: headers(),
        body: JSON.stringify(body),
    });
    if (!res.ok) await apiError(res, 'DELETE', url, body);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
};
