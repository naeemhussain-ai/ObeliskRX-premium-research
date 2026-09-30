-- ================================================
--  ObeliskRX - Coupon End Date + Custom Code Migration
--  Run this in phpMyAdmin after migration_coupon_usage_limit.sql
--  Note: admin panel pehli dafa chalne par ye khud bhi ho jata hai
--  (helpers/coupon_fields.php)
-- ================================================

ALTER TABLE coupons
    MODIFY code VARCHAR(30) NOT NULL,
    ADD COLUMN expires_at DATETIME NULL DEFAULT NULL AFTER used_count;

ALTER TABLE orders
    MODIFY coupon_code VARCHAR(30) NULL;

-- expires_at NULL = purane coupons, kabhi expire nahi hote
