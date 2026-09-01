<?php
// ── Local Development Overrides ──────────────────────
// Yeh file sirf local machine pe hogi — cPanel pe upload MAT karna

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'obeliskrx_db');
define('DB_USER', 'root');
define('DB_PASS', '');

define('SITE_NAME',       'ObeliskRX');
define('SITE_URL',        'http://localhost/obeliskrx');
define('ADMIN_PATH',      'http://localhost/obeliskrx/backend/admin');
define('IMAGES_BASE_URL', 'http://localhost/obeliskrx/backend/images/products/');
define('COA_BASE_URL',   'http://localhost/obeliskrx/backend/images/coa/');

// Local mein email nahi jaegi — bas log hogi
define('SMTP_HOST',   'localhost');
define('SMTP_PORT',   25);
define('SMTP_SECURE', '');
define('SMTP_USER',   '');
define('SMTP_PASS',   '');
define('FROM_EMAIL',  'noreply@obeliskrx.local');
define('FROM_NAME',   'ObeliskRX');
define('OWNER_EMAIL', 'admin@obeliskrx.local');
define('OWNER_NAME',  'ObeliskRX Admin');
