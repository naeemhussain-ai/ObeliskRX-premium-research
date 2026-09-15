-- ================================================
--  ObeliskRX - Payment Proof Migration
--  Run this in phpMyAdmin after migration_age_verification.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

ALTER TABLE orders
    ADD COLUMN payment_proof_file        VARCHAR(255) NULL AFTER payment_method,
    ADD COLUMN payment_proof_original    VARCHAR(255) NULL AFTER payment_proof_file,
    ADD COLUMN payment_proof_name        VARCHAR(150) NULL AFTER payment_proof_original,
    ADD COLUMN payment_proof_submitted_at DATETIME NULL AFTER payment_proof_name;
