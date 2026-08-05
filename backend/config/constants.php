<?php
// Local config pehle load hogi agar exist kare
$localConfig = __DIR__ . '/local.php';
if (!file_exists($localConfig)) {
    // ── Production (cPanel) Constants ───────────────
    define('SITE_NAME',       'ObeliskRX');
    define('SITE_URL',        'https://staging.yourdomain.com');
    define('ADMIN_PATH',      'https://staging.yourdomain.com/admin');
    define('IMAGES_BASE_URL', 'https://staging.yourdomain.com/images/products/');

    define('SMTP_HOST',   'mail.yourdomain.com');
    define('SMTP_PORT',   465);
    define('SMTP_SECURE', 'ssl');
    define('SMTP_USER',   'orders@yourdomain.com');
    define('SMTP_PASS',   'CHANGE_THIS_EMAIL_PASSWORD');
    define('FROM_EMAIL',  'orders@yourdomain.com');
    define('FROM_NAME',   'ObeliskRX');
    define('OWNER_EMAIL', 'Contact@Obeliskrx.com');
    define('OWNER_NAME',  'ObeliskRX Admin');
}
