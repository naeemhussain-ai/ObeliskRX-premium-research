<?php
// POST /api/auth/register.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

$required = validateRequired($body, ['name', 'email', 'password']);
if ($required) error($required, 422);
if (!validateEmail($body['email'])) error('Invalid email address.', 422);
if (strlen($body['password']) < 8) error('Password must be at least 8 characters.', 422);
if (strlen(trim($body['name'])) < 2) error('Name must be at least 2 characters.', 422);

$db = getDB();
$email = strtolower(trim($body['email']));

$check = $db->prepare("SELECT id FROM customers WHERE email = ?");
$check->execute([$email]);
if ($check->fetch()) error('An account with this email already exists.', 409);

$hash = password_hash($body['password'], PASSWORD_DEFAULT);
$stmt = $db->prepare("INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([sanitizeString($body['name']), $email, $hash]);
$customerId = (int)$db->lastInsertId();

$token   = generateToken();
$expires = date('Y-m-d H:i:s', strtotime('+30 days'));
$db->prepare("INSERT INTO customer_sessions (customer_id, token, expires_at) VALUES (?, ?, ?)")
   ->execute([$customerId, $token, $expires]);

success([
    'token'    => $token,
    'customer' => ['id' => $customerId, 'name' => sanitizeString($body['name']), 'email' => $email],
], 'Account created successfully!', 201);
