<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: coupons.php');
    exit();
}

$db     = getDB();
$action = $_POST['action'] ?? '';

if ($action === 'generate') {
    $discountPercent = (float)($_POST['discount_percent'] ?? 0);
    $maxUses         = (int)($_POST['max_uses'] ?? 0);
    if ($discountPercent <= 0 || $discountPercent > 100 || $maxUses <= 0) {
        header('Location: coupons.php?error=invalid_discount');
        exit();
    }

    // 3 random letters + 3 random digits - dobara try karo agar code already exist kare
    do {
        $letters = '';
        for ($i = 0; $i < 3; $i++) $letters .= chr(random_int(65, 90));
        $digits = '';
        for ($i = 0; $i < 3; $i++) $digits .= (string) random_int(0, 9);
        $code = $letters . $digits;

        $exists = $db->prepare("SELECT id FROM coupons WHERE code = ?");
        $exists->execute([$code]);
    } while ($exists->fetch());

    $db->prepare("INSERT INTO coupons (code, discount_percent, max_uses) VALUES (?, ?, ?)")
       ->execute([$code, $discountPercent, $maxUses]);

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
