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
