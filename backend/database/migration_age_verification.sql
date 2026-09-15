-- ================================================
--  ObeliskRX - Age Verification Migration
--  Run this in phpMyAdmin after migration_email_verification.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

ALTER TABLE customers
    ADD COLUMN age SMALLINT UNSIGNED NULL AFTER name;
