<?php
// POST /api/auth/forgot-password.php   { email }
// Customer ko password reset link email karta hai

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/password_reset.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();
$required = validateRequired($body, ['email']);
if ($required) error($required, 422);
if (!validateEmail($body['email'])) error('Invalid email address.', 422);

$db = getDB();
ensurePasswordResetColumns($db);
$email = strtolower(trim($body['email']));

$stmt = $db->prepare("SELECT * FROM customers WHERE email = ?");
$stmt->execute([$email]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

// Email enumeration se bachne ke liye hamesha same generic jawab do
$genericMessage = "If an account exists for that email, we've sent a link to reset your password. Please check your inbox (and spam folder).";

// Cooldown par bhi wahi jawab - "wait" bolne se pata chal jata ke account maujood hai
if (!$customer || passwordResetOnCooldown($customer)) success([], $genericMessage);

sendPasswordResetLink($db, $customer);

success([], $genericMessage);
