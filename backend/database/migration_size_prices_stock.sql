-- ================================================
--  ObeliskRX - Per-size Pricing + Inventory Migration
--  Run this in phpMyAdmin (database pehle se select karo)
--  Note: admin panel / order API pehli dafa chalne par ye columns
--  khud bhi bana dete hain (helpers/product_fields.php)
-- ================================================

ALTER TABLE products
    ADD COLUMN size_prices JSON NULL AFTER sizes,
    ADD COLUMN stock INT NULL DEFAULT NULL AFTER size_prices;

-- stock NULL = abhi set nahi hua (order block nahi hota).
-- Admin > Products > Edit se har product ka stock set karo.
