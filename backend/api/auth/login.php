<?php
// POST /api/auth/login.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

$required = validateRequired($body, ['email', 'password']);
if ($required) error($required, 422);

$db    = getDB();
$email = strtolower(trim($body['email']));

$stmt = $db->prepare("SELECT * FROM customers WHERE email = ?");
$stmt->execute([$email]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$customer || !password_verify($body['password'], $customer['password_hash'])) {
    error('Invalid email or password.', 401);
}

$token   = generateToken();
$expires = date('Y-m-d H:i:s', strtotime('+30 days'));
$db->prepare("INSERT INTO customer_sessions (customer_id, token, expires_at) VALUES (?, ?, ?)")
   ->execute([$customer['id'], $token, $expires]);

success([
    'token'    => $token,
    'customer' => ['id' => $customer['id'], 'name' => $customer['name'], 'email' => $customer['email']],
], 'Login successful!');
