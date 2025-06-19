const apiUrl = 'https://localhost:7240/api'; // подставь свой адрес

function getToken() {
    return localStorage.getItem('token');
}

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${apiUrl}/${endpoint}`, options);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Ошибка запроса');
    }
    if (response.status !== 204) return await response.json();
}
