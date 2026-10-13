<?php

function startAdminSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_name('obelisk_admin');
        session_start();
    }
}

function requireAdmin(): void {
    startAdminSession();
    if (empty($_SESSION['admin_id'])) {
        header('Location: ' . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/admin') . '/admin/index.php');
        exit();
    }
}

function isLoggedIn(): bool {
    startAdminSession();
    return !empty($_SESSION['admin_id']);
}

function adminName(): string {
    return $_SESSION['admin_name'] ?? 'Admin';
}

// CSRF token - password badalne wale admin forms mein lagta hai, taake koi doosri
// website logged-in admin ke browser se ye form submit na karwa sake
function adminCsrfToken(): string {
    startAdminSession();
    if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}

function adminCsrfValid(): bool {
    startAdminSession();
    return !empty($_SESSION['csrf_token'])
        && is_string($_POST['csrf_token'] ?? null)
        && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token']);
}
