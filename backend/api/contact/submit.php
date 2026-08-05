<?php
// POST /api/contact/submit.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

$name    = sanitizeString($body['name'] ?? '');
$email   = strtolower(trim($body['email'] ?? ''));
$subject = sanitizeString($body['subject'] ?? '');
$message = sanitizeString($body['message'] ?? '');

if (empty($name))    error('Name is required.', 422);
if (empty($email) || !validateEmail($email)) error('Valid email is required.', 422);
if (strlen(strip_tags($message)) < 10) error('Message must be at least 10 characters.', 422);

$db = getDB();

// Rate limit: same email, 5 minutes mein ek baar
$rate = $db->prepare("
    SELECT id FROM contact_messages
    WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
");
$rate->execute([$email]);
if ($rate->fetch()) {
    error('Please wait a few minutes before sending another message.', 429);
}

$stmt = $db->prepare("
    INSERT INTO contact_messages (name, email, subject, message, status)
    VALUES (?, ?, ?, ?, 'new')
");
$stmt->execute([$name, $email, $subject ?: null, $message]);

// Admin ko email bhejo
try {
    require_once __DIR__ . '/../../helpers/email.php';
    sendContactNotificationEmail([
        'name'    => $name,
        'email'   => $email,
        'subject' => $subject,
        'message' => $message,
    ]);
} catch (\Exception $e) {}

success([], 'Your message has been sent! We will get back to you within 1-2 business days.');
