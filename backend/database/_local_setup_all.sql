-- ============================================================
--  ObeliskRX — LOCAL FULL SETUP (XAMPP / phpMyAdmin)
--  phpMyAdmin → database "obeliskrx_db" select karo → SQL tab
--  → yeh poori file paste karo → Go
--  (DB name "obeliskrx_db" hona zaroori hai — local.php isi ko dhoondta hai)
-- ============================================================

USE obeliskrx_db;

-- ============================================================
--  1) MAIN SCHEMA
-- ============================================================

-- ── Products ────────────────────────────────────────
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

-- ── Admin Users ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Orders ──────────────────────────────────────────
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

-- ── Order Items ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    order_id     INT NOT NULL,
    product_id   INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    size         VARCHAR(50) DEFAULT NULL,
    quantity     INT NOT NULL,
    unit_price   DECIMAL(10,2) NOT NULL,
    subtotal     DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reviews ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_id   INT NOT NULL,
    product_slug VARCHAR(255) NOT NULL,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text  TEXT NOT NULL,
    status       ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY  (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_slug_status (product_slug, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact Messages ────────────────────────────────
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

-- ── Email Logs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    type      VARCHAR(100) NOT NULL,
    sent_to   VARCHAR(255) NOT NULL,
    subject   VARCHAR(255),
    status    ENUM('sent','failed') DEFAULT 'sent',
    error_msg TEXT DEFAULT NULL,
    sent_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  2) COA TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_coa (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    product_slug VARCHAR(255) NOT NULL UNIQUE,
    purity       VARCHAR(50)  NOT NULL DEFAULT '',
    lot_number   VARCHAR(100) NOT NULL DEFAULT '',
    tested_date  VARCHAR(100) NOT NULL DEFAULT '',
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


-- ============================================================
--  3) CUSTOMER ACCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(50)  NULL,
    address_line1 VARCHAR(255) NULL,
    address_line2 VARCHAR(255) NULL,
    city          VARCHAR(100) NULL,
    state         VARCHAR(100) NULL,
    zip           VARCHAR(20)  NULL,
    country       VARCHAR(100) NULL DEFAULT 'United States',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_sessions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    token       VARCHAR(64) UNIQUE NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Link orders to customers (guest orders = NULL)
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS customer_id INT NULL AFTER id,
    ADD INDEX idx_customer_id (customer_id),
    ADD CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;


-- ============================================================
--  4) REVIEWS — admin reply columns
-- ============================================================
ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS customer_id     INT NULL AFTER id,
    ADD COLUMN IF NOT EXISTS admin_reply     TEXT NULL AFTER review_text,
    ADD COLUMN IF NOT EXISTS admin_reply_at  TIMESTAMP NULL AFTER admin_reply;


-- ============================================================
--  5) COA column defaults fix
-- ============================================================
ALTER TABLE product_coa
    MODIFY COLUMN purity      VARCHAR(50)  NOT NULL DEFAULT '',
    MODIFY COLUMN lot_number  VARCHAR(100) NOT NULL DEFAULT '',
    MODIFY COLUMN tested_date VARCHAR(100) NOT NULL DEFAULT '';


-- ============================================================
--  6) PRODUCT SEED DATA (17 products)
-- ============================================================
INSERT INTO products (slug, name, series, description, price, price_max, old_price, discount, sizes, specs, image_url) VALUES
('2t-peptide','2(T) Peptide','Metabolic Series','A 39-amino-acid synthetic peptide functioning as a dual agonist at the GIP and GLP-1 receptors, studied for its role in glycemic and metabolic research.',130.00, NULL, 199.99, 35,'["20mg"]','[{"label":"CAS Number","value":"2023788-19-2"},{"label":"Molecular Formula","value":"C225H348N48O68"},{"label":"Molecular Weight","value":"4,813.45 g/mol"},{"label":"Amino Acids","value":"39"}]','2T-Peptide-20mg.jpg'),
('3r-peptide','3(R) Peptide','Metabolic Series','A 39-amino-acid synthetic peptide engineered as a triple agonist at the GIP, GLP-1, and glucagon receptors, studied for its role in metabolic and glucose-regulation research.',70.00, 130.00, NULL, 35,'["10mg","20mg"]','[{"label":"CAS Number","value":"2381089-83-2"},{"label":"Molecular Formula","value":"C221H342N46O68"},{"label":"Molecular Weight","value":"4,731.33 g/mol"},{"label":"Amino Acids","value":"39"}]','3R-Peptide-10mg.jpg'),
('igf-lr3','IGF-LR3','Metabolic Series','',69.00, NULL, 107.99, 36,'["1mg"]','[]','IGF-LR3-1mg.jpg'),
('ipamorelin','Ipamorelin','Metabolic Series','',56.00, NULL, 85.99, 35,'["5mg"]','[]','Ipamorelin-5mg.jpg'),
('bpc-157','BPC-157','Recovery Series','A 15-amino-acid synthetic peptide fragment studied in laboratory models for its role in angiogenesis, tissue signaling, and cellular repair processes.',99.00, NULL, 122.99, 20,'["10mg"]','[{"label":"CAS Number","value":"137525-51-0"},{"label":"Amino Acids","value":"15"},{"label":"Type","value":"Synthetic pentadecapeptide"}]','BPC-157-10mg.jpg'),
('tb-500','TB-500','Recovery Series','A 43-amino-acid peptide corresponding to Thymosin Beta-4, studied for its role in actin regulation, cellular migration, and tissue repair signaling in laboratory models.',49.99, NULL, 76.99, 35,'["10mg"]','[{"label":"CAS Number","value":"77591-33-4"},{"label":"Molecular Formula","value":"C212H350N56O78S"},{"label":"Molecular Weight","value":"4,963.44 g/mol"},{"label":"Amino Acids","value":"43"}]','TB-500-10mg.jpg'),
('bpc-157-tb-500-blend','BPC-157 / TB-500 Blend','Recovery Series','A combined formulation of BPC-157 and TB-500 in equal proportion, supplied for laboratory research examining their overlapping roles in tissue repair and cellular signaling pathways.',129.99, NULL, 199.99, 35,'["20mg"]','[{"label":"Composition","value":"BPC-157 (CAS 137525-51-0) + TB-500 (CAS 77591-33-4)"},{"label":"Ratio","value":"1:1"}]','BPC-157-TB500-10mg.jpg'),
('nad','NAD+','Longevity Series','A naturally occurring coenzyme central to cellular energy metabolism and redox reactions, studied in laboratory research for its role in mitochondrial function and cellular aging pathways. Available in 500mg and 1000mg.',69.99, 100.00, NULL, 35,'["500mg","1000mg"]','[{"label":"CAS Number","value":"53-84-9"},{"label":"Molecular Formula","value":"C21H27N7O14P2"},{"label":"Molecular Weight","value":"663.43 g/mol"},{"label":"Vial Size","value":"10mL"}]','NAD-500mg.jpg'),
('epithalon','Epithalon','Longevity Series','A synthetic tetrapeptide modeled on the amino acid composition of epithalamin, studied for its role in telomerase activity and cellular aging research.',149.99, NULL, 230.99, 35,'["50mg"]','[{"label":"CAS Number","value":"307297-39-8"},{"label":"Sequence","value":"Ala-Glu-Asp-Gly"},{"label":"Molecular Formula","value":"C14H22N4O9"},{"label":"Molecular Weight","value":"390.34 g/mol"}]','Epithalon-50mg.jpg'),
('ghk-cu','GHK-Cu','Longevity Series','A naturally occurring copper-binding tripeptide, studied in laboratory research for its role in collagen synthesis, tissue remodeling, and cellular signaling.',49.99, NULL, 76.99, 35,'["50mg"]','[{"label":"CAS Number","value":"89030-95-5 (copper complex)"},{"label":"Sequence","value":"Gly-His-Lys"},{"label":"Molecular Weight","value":"340.38 g/mol (tripeptide)"}]','GHK-Cu-50mg.jpg'),
('cjc-1295-no-dac','CJC-1295 No DAC','Growth Series','A 29-amino-acid synthetic analog of growth hormone-releasing hormone (Mod GRF 1-29), studied for its role in growth hormone signaling research.',49.99, NULL, 76.99, 35,'["5mg"]','[{"label":"Molecular Formula","value":"C152H252N44O42"},{"label":"Molecular Weight","value":"~3,367 g/mol"},{"label":"Amino Acids","value":"29"}]','CJC-1295-NO-DAC-5mg.jpg'),
('tesamorelin','Tesamorelin','Growth Series','A 44-amino-acid synthetic analog of growth hormone-releasing hormone, modified for enhanced stability, studied for its role in growth hormone secretion research.',69.99, NULL, 107.99, 35,'["10mg"]','[{"label":"CAS Number","value":"218949-48-5"},{"label":"Amino Acids","value":"44"}]','Tesamorelin-10mg.jpg'),
('mots-c','MOTS-c','Growth Series','A 16-amino-acid mitochondrial-derived peptide, studied in laboratory research for its role in cellular energy regulation and metabolic signaling.',80.99, NULL, 122.99, 34,'["20mg"]','[{"label":"Molecular Formula","value":"C101H152N28O22S2"},{"label":"Molecular Weight","value":"2,174.64 g/mol"},{"label":"Amino Acids","value":"16"}]','MOTSC-20mg.jpg'),
('selank','Selank','Neuro Series','A synthetic heptapeptide analog of tuftsin, studied in laboratory research for its role in neurochemical and behavioral signaling pathways.',29.99, 59.99, NULL, 35,'["10mg","20mg"]','[{"label":"CAS Number","value":"129954-34-3"},{"label":"Sequence","value":"Thr-Lys-Pro-Arg-Pro-Gly-Pro"},{"label":"Molecular Formula","value":"C33H57N11O9"},{"label":"Molecular Weight","value":"751.87 g/mol"},{"label":"Amino Acids","value":"7"}]','Selank-10mg.jpg'),
('semax','Semax','Neuro Series','A synthetic heptapeptide derived from ACTH(4-10), studied in laboratory research for its role in neurotrophic factor expression and cognitive signaling pathways.',29.99, NULL, 45.99, 35,'["10mg"]','[{"label":"CAS Number","value":"80714-61-0"},{"label":"Molecular Formula","value":"C37H51N9O10S"},{"label":"Molecular Weight","value":"813.93 g/mol"},{"label":"Amino Acids","value":"7"}]','Semax-10mg.jpg'),
('klow-blend','KLOW Blend','Signature Blends','A four-compound research formulation combining GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg), supplied for laboratory studies examining tissue repair, cellular signaling, and regenerative research pathways.',100.99, NULL, 153.99, 34,'["80mg"]','[{"label":"Composition","value":"GHK-Cu (CAS 89030-95-5) + BPC-157 (CAS 137525-51-0) + TB-500 (CAS 77591-33-4) + KPV (CAS 75435-82-2)"},{"label":"Total","value":"80mg"}]','KLOW-80mg.jpg');


-- ============================================================
--  7) ADMIN USER
-- ============================================================
-- Admin user SQL se nahi ban raha — bcrypt hash PHP hi bana sakta hai.
-- Apache start hone ke baad ek baar yeh URL kholo:
--     http://localhost/obeliskrx/backend/database/reset_admin.php
-- Woh admin bana dega →  admin@obeliskrx.com  /  ObeliskAdmin2024!
-- Phir reset_admin.php file delete kar dena (production pe kabhi upload mat karna).
