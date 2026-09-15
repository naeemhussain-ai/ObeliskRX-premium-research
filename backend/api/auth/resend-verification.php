<?php
// POST /api/auth/resend-verification.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';
require_once __DIR__ . '/../../helpers/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();
$required = validateRequired($body, ['email']);
if ($required) error($required, 422);
if (!validateEmail($body['email'])) error('Invalid email address.', 422);

$db    = getDB();
$email = strtolower(trim($body['email']));

$stmt = $db->prepare("SELECT * FROM customers WHERE email = ?");
$stmt->execute([$email]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

// Email enumeration se bachne ke liye hamesha generic success dikhao
if (!$customer || $customer['email_verified_at']) {
    success([], 'If an account exists and needs verification, a new link has been sent.');
}

// Spam se bachao - 60 second mein ek se zyada baar resend na ho
if ($customer['verification_sent_at'] && strtotime($customer['verification_sent_at']) > strtotime('-60 seconds')) {
    error('Please wait a minute before requesting another verification email.', 429);
}

$verificationToken = generateToken();
$db->prepare("UPDATE customers SET verification_token = ?, verification_sent_at = ? WHERE id = ?")
   ->execute([$verificationToken, date('Y-m-d H:i:s'), $customer['id']]);

sendVerificationEmail($email, $customer['name'], $verificationToken);

success([], 'If an account exists and needs verification, a new link has been sent.');
