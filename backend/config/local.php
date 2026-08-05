<?php
// ── Local Development Overrides ──────────────────────
// Yeh file sirf local machine pe hogi   cPanel pe upload MAT karna

// Database (Laragon default)
define('DB_HOST', 'localhost');
define('DB_NAME', 'obeliskrx_db');
define('DB_USER', 'root');
define('DB_PASS', '');           // Laragon mein default password empty hota hai

// Site URL (local)
define('SITE_URL',        'http://obeliskrx.test');
define('IMAGES_BASE_URL', 'http://obeliskrx.test/images/products/');
define('ADMIN_PATH',      'http://obeliskrx.test/admin');

// Email (local mein fake   sirf log karega)
define('SMTP_HOST',   'localhost');
define('SMTP_PORT',   25);
define('SMTP_SECURE', '');
define('SMTP_USER',   '');
define('SMTP_PASS',   '');
define('FROM_EMAIL',  'test@obeliskrx.test');
define('FROM_NAME',   'ObeliskRX Local');
define('OWNER_EMAIL', 'admin@obeliskrx.test');
define('OWNER_NAME',  'ObeliskRX Admin');
define('SITE_NAME',   'ObeliskRX');
