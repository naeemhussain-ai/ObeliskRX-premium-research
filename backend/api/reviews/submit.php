<?php
// POST /api/reviews/submit.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

$slug   = sanitizeString($body['product_slug'] ?? '');
$name   = sanitizeString($body['name'] ?? '');
$email  = strtolower(trim($body['email'] ?? ''));
$rating = (int)($body['rating'] ?? 0);
$text   = sanitizeString($body['review_text'] ?? '');

if (empty($slug))  error('Product slug is required.', 422);
if (empty($name))  error('Name is required.', 422);
if (empty($email) || !validateEmail($email)) error('Valid email is required.', 422);
if ($rating < 1 || $rating > 5) error('Rating must be between 1 and 5.', 422);
if (strlen(strip_tags($text)) < 10) error('Review must be at least 10 characters.', 422);

$db = getDB();

// Product lookup - optional, FK removed
$prod = $db->prepare("SELECT id FROM products WHERE slug = ? AND is_active = 1");
$prod->execute([$slug]);
$product = $prod->fetch();
$productId = $product ? (int)$product['id'] : null;

// Duplicate: same email + same product within 24h
$dup = $db->prepare("
    SELECT id FROM reviews
    WHERE product_slug = ? AND email = ?
    AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
");
$dup->execute([$slug, $email]);
if ($dup->fetch()) {
    error('You have already submitted a review for this product recently.', 429);
}

$stmt = $db->prepare("
    INSERT INTO reviews (product_id, product_slug, name, email, rating, review_text, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
");
$stmt->execute([$productId, $slug, $name, $email, $rating, $text]);

success([], 'Your review has been submitted and is pending approval. Thank you!');
