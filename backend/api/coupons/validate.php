<?php
// POST /api/coupons/validate.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();
$code = strtoupper(trim($body['code'] ?? ''));

if ($code === '') error('Please enter a coupon code.', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT code, discount_percent, max_uses, used_count FROM coupons WHERE code = ?");
$stmt->execute([$code]);
$coupon = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$coupon) error('Invalid coupon code.', 404);
if ((int)$coupon['used_count'] >= (int)$coupon['max_uses']) {
    error('This coupon has reached its usage limit.', 410);
}

success([
    'code'             => $coupon['code'],
    'discount_percent' => (float)$coupon['discount_percent'],
], 'Coupon applied!');
