-- ================================================
--  ObeliskRX - Research Info (checkout popup) Migration
--  Optional: create.php yeh columns khud bhi bana leta hai agar missing hon.
--  Database pehle se select karo - USE line ki zaroorat nahi
-- ================================================

ALTER TABLE orders
    ADD COLUMN legal_name VARCHAR(200) NULL AFTER special_notes,
    ADD COLUMN usage_type VARCHAR(100) NULL AFTER legal_name;
