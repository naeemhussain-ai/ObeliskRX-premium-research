-- ================================================
--  ObeliskRX - Abandoned Cart Reminder Migration
--  Run this in phpMyAdmin after migration_customers.sql
--  (Database pehle se select karo - USE line ki zaroorat nahi)
--  Note: api/cart/sync.php yeh table khud bhi bana deta hai agar missing ho.
-- ================================================

CREATE TABLE IF NOT EXISTS abandoned_carts (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    customer_id       INT NOT NULL UNIQUE,
    email             VARCHAR(150) NOT NULL,
    name              VARCHAR(100) NULL,
    cart_items        JSON NOT NULL,
    subtotal          DECIMAL(10,2) NOT NULL DEFAULT 0,
    status            ENUM('active','ordered','reminded','empty') NOT NULL DEFAULT 'active',
    reminder_sent     TINYINT(1) NOT NULL DEFAULT 0,
    reminder_count    TINYINT NOT NULL DEFAULT 0,
    reminder_sent_at  DATETIME NULL,
    opted_out         TINYINT(1) NOT NULL DEFAULT 0,
    unsubscribe_token VARCHAR(64) NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_status_updated (status, reminder_sent, updated_at),
    INDEX idx_unsubscribe_token (unsubscribe_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
