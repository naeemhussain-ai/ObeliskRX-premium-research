<?php
// POST /api/auth/reset-password.php   { token, password }
// Reset link wale token se naya password set karta hai

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/password_reset.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();
$required = validateRequired($body, ['token', 'password']);
if ($required) error($required, 422);

$password = (string)$body['password'];
if (strlen($password) < 8) error('Password must be at least 8 characters.', 422);

$db       = getDB();
$customer = findCustomerByResetToken($db, trim((string)$body['token']));

if (!$customer) {
    error('This reset link is invalid or has expired. Please request a new one.', 410, ['code' => 'TOKEN_INVALID']);
}

setCustomerPassword($db, (int)$customer['id'], $password);

success(['email' => $customer['email']], 'Your password has been updated. You can now sign in with your new password.');
