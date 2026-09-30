<?php
// Coupon expiry + custom code helpers

const COUPON_CODE_MAX = 30;

// coupons.expires_at na ho to khud bana do, aur code columns 30 chars tak lambe karo
// (migration_coupon_expiry.sql ka kaam)
function ensureCouponColumns(PDO $db): void {
    static $done = false;
    if ($done) return;
    if (!$db->query("SHOW COLUMNS FROM coupons LIKE 'expires_at'")->fetch()) {
        $db->exec("ALTER TABLE coupons ADD COLUMN expires_at DATETIME NULL DEFAULT NULL AFTER used_count");
    }
    $col = $db->query("SHOW COLUMNS FROM coupons LIKE 'code'")->fetch();
    if ($col && stripos($col['Type'], 'varchar(' . COUPON_CODE_MAX . ')') === false) {
        $db->exec("ALTER TABLE coupons MODIFY code VARCHAR(" . COUPON_CODE_MAX . ") NOT NULL");
        $db->exec("ALTER TABLE orders MODIFY coupon_code VARCHAR(" . COUPON_CODE_MAX . ") NULL");
    }
    $done = true;
}

// NULL expiry = kabhi expire nahi (purane coupons)
function couponIsExpired(array $coupon): bool {
    return !empty($coupon['expires_at']) && strtotime($coupon['expires_at']) < time();
}
