-- ================================================
--  ObeliskRX - Orders Start Pending Until Payment Confirmed
--  Run this in phpMyAdmin after migration_payment_proof.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
-- ================================================

-- Naye orders ab 'approved' ki jagah 'pending' se shuru hote hain -
-- admin payment proof verify karne ke baad manually 'approved' karega.
ALTER TABLE orders
    MODIFY COLUMN status ENUM('pending','approved','rejected','shipped','delivered') DEFAULT 'pending';
