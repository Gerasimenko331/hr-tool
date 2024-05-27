import {BASE_URL} from '../consts';

export function isUserAuthorized() {
    const authToken = localStorage.getItem('authToken');
    return authToken !== null;
}

export async function LoginUser(username: string, password: string) {
    const url = `${BASE_URL}/ru/data/v3/testmethods/docs/login`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const body = JSON.stringify({ username, password });

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
    });

    const results = await response.json();
    const token = results.data.token;
    localStorage.setItem('authToken', token);
    return results.error_code;
}

export function logout() {
    localStorage.removeItem('authToken');
}
