-- ============================================================
--  Password reset (forgot password + admin "Send reset link")
--  phpMyAdmin -> database select karo -> SQL tab -> paste -> Go
--  (Code ye columns khud bhi bana leta hai agar na hon)
-- ============================================================

ALTER TABLE customers
    ADD COLUMN reset_token   VARCHAR(64) NULL DEFAULT NULL,
    ADD COLUMN reset_sent_at DATETIME    NULL DEFAULT NULL;
