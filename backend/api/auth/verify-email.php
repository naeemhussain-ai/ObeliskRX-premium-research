<?php
// POST /api/auth/verify-email.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();
$required = validateRequired($body, ['token']);
if ($required) error($required, 422);

$db    = getDB();
$token = trim($body['token']);

$stmt = $db->prepare("SELECT * FROM customers WHERE verification_token = ?");
$stmt->execute([$token]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$customer) error('Invalid or expired verification link.', 404);

// Verification link 24 ghante ke liye valid hai
if ($customer['verification_sent_at'] && strtotime($customer['verification_sent_at']) < strtotime('-24 hours')) {
    error('This verification link has expired. Please request a new one.', 410, ['code' => 'TOKEN_EXPIRED']);
}

$db->prepare("
    UPDATE customers
    SET email_verified_at = ?, verification_token = NULL
    WHERE id = ?
")->execute([date('Y-m-d H:i:s'), $customer['id']]);

// Verify hote hi seedha login kar do
$sessionToken = generateToken();
$expires      = date('Y-m-d H:i:s', strtotime('+30 days'));
$db->prepare("INSERT INTO customer_sessions (customer_id, token, expires_at) VALUES (?, ?, ?)")
   ->execute([$customer['id'], $sessionToken, $expires]);

success([
    'token'    => $sessionToken,
    'customer' => ['id' => $customer['id'], 'name' => $customer['name'], 'email' => $customer['email']],
], 'Email verified successfully!');
