-- ================================================
--  ObeliskRX - Email Verification Migration
--  Run this in phpMyAdmin after migration_customers.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

ALTER TABLE customers
    ADD COLUMN email_verified_at   DATETIME NULL AFTER password_hash,
    ADD COLUMN verification_token  VARCHAR(64) NULL AFTER email_verified_at,
    ADD COLUMN verification_sent_at DATETIME NULL AFTER verification_token,
    ADD INDEX idx_verification_token (verification_token);

-- Pehle se bane hue accounts ko verified maan lo (taake purane customers lock na ho jayein)
UPDATE customers SET email_verified_at = created_at WHERE email_verified_at IS NULL;
