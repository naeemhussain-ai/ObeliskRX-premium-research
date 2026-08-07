<?php
// POST /api/auth/logout.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
    $token = trim($matches[1]);
    getDB()->prepare("DELETE FROM customer_sessions WHERE token = ?")->execute([$token]);
}

success([], 'Logged out successfully.');
