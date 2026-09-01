-- Run this in phpMyAdmin on production DB
ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS admin_reply     TEXT NULL AFTER review_text,
    ADD COLUMN IF NOT EXISTS admin_reply_at  TIMESTAMP NULL AFTER admin_reply,
    ADD COLUMN IF NOT EXISTS customer_id     INT NULL AFTER id;
