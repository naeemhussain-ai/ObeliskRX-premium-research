-- ── COA Tables Migration ─────────────────────────────────────────────────────
-- Run this migration to add Certificate of Analysis support.
-- Safe to run multiple times (uses IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS product_coa (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_slug VARCHAR(255) NOT NULL UNIQUE,
    purity       VARCHAR(50)  NOT NULL,
    lot_number   VARCHAR(100) NOT NULL,
    tested_date  VARCHAR(100) NOT NULL,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (product_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_coa_files (
    id            INT          AUTO_INCREMENT PRIMARY KEY,
    coa_id        INT          NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    file_type     VARCHAR(100) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (coa_id) REFERENCES product_coa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
