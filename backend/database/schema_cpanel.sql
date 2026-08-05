-- ================================================
--  ObeliskRX Database Schema — cPanel Version
--  CREATE DATABASE/USE lines removed (cPanel handles this)
-- ================================================

CREATE TABLE IF NOT EXISTS products (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    slug              VARCHAR(255) UNIQUE NOT NULL,
    name              VARCHAR(255) NOT NULL,
    series            VARCHAR(100) NOT NULL,
    description       TEXT,
    price             DECIMAL(10,2) NOT NULL,
    price_max         DECIMAL(10,2) DEFAULT NULL,
    old_price         DECIMAL(10,2) DEFAULT NULL,
    discount          INT DEFAULT 0,
    sizes             JSON NOT NULL,
    specs             JSON,
    image_url         VARCHAR(500) DEFAULT NULL,
    is_active         TINYINT(1) DEFAULT 1,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_series  (series),
    INDEX idx_active  (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    order_number     VARCHAR(50) UNIQUE NOT NULL,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(50) DEFAULT NULL,
    address_line1    VARCHAR(255) NOT NULL,
    address_line2    VARCHAR(255) DEFAULT NULL,
    city             VARCHAR(100) NOT NULL,
    state            VARCHAR(100) NOT NULL,
    zip              VARCHAR(20) NOT NULL,
    country          VARCHAR(100) NOT NULL DEFAULT 'United States',
    special_notes    TEXT DEFAULT NULL,
    items            JSON NOT NULL,
    subtotal         DECIMAL(10,2) NOT NULL,
    shipping_fee     DECIMAL(10,2) DEFAULT 0.00,
    total            DECIMAL(10,2) NOT NULL,
    payment_method   VARCHAR(100) DEFAULT 'alipay',
    status           ENUM('pending','approved','rejected','shipped','delivered') DEFAULT 'approved',
    rejection_reason TEXT DEFAULT NULL,
    admin_notes      TEXT DEFAULT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email  (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    order_id     INT NOT NULL,
    product_id   INT NULL,
    product_name VARCHAR(255) NOT NULL,
    size         VARCHAR(50) DEFAULT NULL,
    quantity     INT NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL,
    subtotal     DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_id   INT NULL,
    product_slug VARCHAR(255) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text  TEXT NOT NULL,
    status       ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug_status (product_slug, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(255) DEFAULT NULL,
    message    TEXT NOT NULL,
    status     ENUM('new','read','replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_logs (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    type      VARCHAR(100) NOT NULL,
    sent_to   VARCHAR(255) NOT NULL,
    subject   VARCHAR(255),
    status    ENUM('sent','failed') DEFAULT 'sent',
    error_msg TEXT DEFAULT NULL,
    sent_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
