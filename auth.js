// ====================================================
// MSI Auth Module — Email + Password
// Einbinden: <script src="auth.js"></script>
// ====================================================

const API = 'https://msi-backend-test.onrender.com';

// ---- Session helpers ----
function getSession() {
    try { return JSON.parse(localStorage.getItem('msi_user') || 'null'); } catch { return null; }
}
function setSession(user, token) {
    localStorage.setItem('msi_user', JSON.stringify({ ...user, token }));
}
function clearSession() {
    localStorage.removeItem('msi_user');
}

// ---- Auth state ----
function isLoggedIn() { return !!getSession(); }

// ---- Logout ----
function msiLogout() {
    clearSession();
    window.location.href = 'index.html';
}

// ---- Update nav UI ----
function updateNavAuth() {
    const session = getSession();
    // Inject auth nav item if placeholder exists
    const placeholder = document.getElementById('navAuthItem');
    if (!placeholder) return;
    if (session) {
        placeholder.innerHTML = `
            <span class="nav-user-badge">👤 ${session.platformUsername}</span>
            <button class="nav-logout-btn" onclick="msiLogout()">Abmelden</button>`;
    } else {
        placeholder.innerHTML = `<a href="profile.html" class="nav-link"><span class="nav-icon">🔑</span>Login</a>`;
    }
}

// ---- Require login (redirect if not) ----
function requireLogin(redirectTo) {
    if (!isLoggedIn()) {
        sessionStorage.setItem('msi_redirect', redirectTo || window.location.href);
        window.location.href = 'profile.html';
        return false;
    }
    return true;
}

// ---- API helpers ----
async function apiPost(path, body) {
    const res = await fetch(API + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}
async function apiGet(path) {
    const res = await fetch(API + path);
    return res.json();
}
async function apiPut(path, body) {
    const res = await fetch(API + path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

document.addEventListener('DOMContentLoaded', updateNavAuth);
