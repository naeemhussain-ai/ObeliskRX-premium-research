-- ================================================
--  ObeliskRX — Customer Accounts Migration
--  Run this in phpMyAdmin after main schema.sql
--  (Database pehle se select karo — USE line ki zaroorat nahi)
-- ================================================

-- ── Customers ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Customer Sessions ───────────────────────────────
CREATE TABLE IF NOT EXISTS customer_sessions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    token       VARCHAR(64) UNIQUE NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Saved address fields on customer profile ───────────────────
ALTER TABLE customers
    ADD COLUMN phone         VARCHAR(50)  NULL AFTER email,
    ADD COLUMN address_line1 VARCHAR(255) NULL,
    ADD COLUMN address_line2 VARCHAR(255) NULL,
    ADD COLUMN city          VARCHAR(100) NULL,
    ADD COLUMN state         VARCHAR(100) NULL,
    ADD COLUMN zip           VARCHAR(20)  NULL,
    ADD COLUMN country       VARCHAR(100) NULL DEFAULT 'United States';

-- ── Link orders to customers (nullable — guest orders stay NULL) ─
ALTER TABLE orders
    ADD COLUMN customer_id INT NULL AFTER id,
    ADD INDEX idx_customer_id (customer_id),
    ADD CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
