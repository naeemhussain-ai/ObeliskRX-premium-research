<?php
// POST /api/auth/register.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';
require_once __DIR__ . '/../../helpers/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

$required = validateRequired($body, ['name', 'email', 'password', 'age']);
if ($required) error($required, 422);
if (!validateEmail($body['email'])) error('Invalid email address.', 422);
if (strlen($body['password']) < 8) error('Password must be at least 8 characters.', 422);
if (strlen(trim($body['name'])) < 2) error('Name must be at least 2 characters.', 422);
if (!is_numeric($body['age']) || sanitizeInt($body['age']) < 21) {
    error('You must be at least 21 years old to create an account.', 422);
}
$age = sanitizeInt($body['age']);

$db = getDB();
$email = strtolower(trim($body['email']));

// ── Fake/demo/disposable emails yahin reject kar do ──
if (isDisposableEmail($email)) {
    error('Temporary or disposable email addresses are not allowed. Please use your real email address.', 422);
}
if (!emailDomainIsReachable($email)) {
    error('This email address does not appear to be valid. Please check and enter a real, working email address.', 422);
}

$check = $db->prepare("SELECT id, email_verified_at, verification_sent_at FROM customers WHERE email = ?");
$check->execute([$email]);
$existing = $check->fetch(PDO::FETCH_ASSOC);

// Pehle se verified/active account - yehi asli "already exists" case hai
if ($existing && $existing['email_verified_at']) {
    error('An account with this email already exists. Please sign in instead.', 409);
}

// Unverified pending account - kabhi verify hi nahi hua (link nahi mila, spam mein gaya, etc.)
// Isay dobara "already exists" bol kar block karna galat hai - naya link resend kar do
if ($existing && $existing['verification_sent_at'] && strtotime($existing['verification_sent_at']) > strtotime('-60 seconds')) {
    error('A verification link was already sent recently. Please check your inbox (and spam folder), or wait a minute before trying again.', 429);
}

$hash             = password_hash($body['password'], PASSWORD_DEFAULT);
$verificationToken = generateToken();
// PHP ka time use karo, MySQL ka NOW() nahi - server timezones alag ho sakte hain
// aur baad mein rate-limit / expiry checks isi PHP time se strtotime() se hote hain
$sentAt = date('Y-m-d H:i:s');

if ($existing) {
    // Naya naam/password se overwrite kar do - account abhi tak use hi nahi hua
    $db->prepare("
        UPDATE customers
        SET name = ?, age = ?, password_hash = ?, verification_token = ?, verification_sent_at = ?
        WHERE id = ?
    ")->execute([sanitizeString($body['name']), $age, $hash, $verificationToken, $sentAt, $existing['id']]);
} else {
    $db->prepare("
        INSERT INTO customers (name, age, email, password_hash, verification_token, verification_sent_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ")->execute([sanitizeString($body['name']), $age, $email, $hash, $verificationToken, $sentAt]);
}

sendVerificationEmail($email, sanitizeString($body['name']), $verificationToken);

success([
    'email' => $email,
], 'Almost done! We sent a verification link to your email. Your account is NOT active and you cannot sign in until you click that link.', 201);
