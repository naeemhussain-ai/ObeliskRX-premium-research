<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/coupon_fields.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: coupons.php');
    exit();
}

$db     = getDB();
ensureCouponColumns($db);
$action = $_POST['action'] ?? '';

if ($action === 'generate') {
    $code            = strtoupper(trim($_POST['code'] ?? ''));
    $discountPercent = (float)($_POST['discount_percent'] ?? 0);
    $maxUses         = (int)($_POST['max_uses'] ?? 0);
    $expiresDate     = trim($_POST['expires_at'] ?? '');

    if (!preg_match('/^[A-Z0-9_-]{3,' . COUPON_CODE_MAX . '}$/', $code)) {
        header('Location: coupons.php?error=invalid_code');
        exit();
    }
    if ($discountPercent <= 0 || $discountPercent > 100 || $maxUses <= 0) {
        header('Location: coupons.php?error=invalid_discount');
        exit();
    }
    // End date ke din ke aakhir (23:59:59) tak coupon chalega
    $expiry = DateTime::createFromFormat('!Y-m-d', $expiresDate);
    if (!$expiry || $expiry->format('Y-m-d') !== $expiresDate || $expiresDate < date('Y-m-d')) {
        header('Location: coupons.php?error=invalid_expiry');
        exit();
    }

    $exists = $db->prepare("SELECT id FROM coupons WHERE code = ?");
    $exists->execute([$code]);
    if ($exists->fetch()) {
        header('Location: coupons.php?error=code_exists');
        exit();
    }

    $db->prepare("INSERT INTO coupons (code, discount_percent, max_uses, expires_at) VALUES (?, ?, ?, ?)")
       ->execute([$code, $discountPercent, $maxUses, $expiresDate . ' 23:59:59']);

    header('Location: coupons.php?success=generated');
    exit();
}

if ($action === 'delete') {
    $couponId = (int)($_POST['coupon_id'] ?? 0);
    if ($couponId) {
        $db->prepare("DELETE FROM coupons WHERE id = ?")->execute([$couponId]);
    }
    header('Location: coupons.php?success=deleted');
    exit();
}

header('Location: coupons.php');
exit();
