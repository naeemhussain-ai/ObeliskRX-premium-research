-- ================================================
--  ObeliskRX - Coupons Migration
--  Run this in phpMyAdmin after migration_order_pending_default.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

CREATE TABLE IF NOT EXISTS coupons (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    code             VARCHAR(10) UNIQUE NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE orders
    ADD COLUMN coupon_code      VARCHAR(10) NULL AFTER payment_method,
    ADD COLUMN discount_percent DECIMAL(5,2) NULL DEFAULT 0 AFTER coupon_code,
    ADD COLUMN discount_amount  DECIMAL(10,2) NULL DEFAULT 0 AFTER discount_percent;
