-- ================================================
--  ObeliskRX - Coupon Usage Limit Migration
--  Run this in phpMyAdmin after migration_coupons.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

ALTER TABLE coupons
    ADD COLUMN max_uses   INT NOT NULL DEFAULT 1 AFTER discount_percent,
    ADD COLUMN used_count INT NOT NULL DEFAULT 0 AFTER max_uses;
