-- Fix: Add DEFAULT '' to product_coa columns so empty values never fail
-- Run this once on production in phpMyAdmin
ALTER TABLE product_coa
    MODIFY COLUMN purity      VARCHAR(50)  NOT NULL DEFAULT '',
    MODIFY COLUMN lot_number  VARCHAR(100) NOT NULL DEFAULT '',
    MODIFY COLUMN tested_date VARCHAR(100) NOT NULL DEFAULT '';
