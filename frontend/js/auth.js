function saveToken(token) {
    localStorage.setItem('token', token);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function isAuthenticated() {
    return !!getToken();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
