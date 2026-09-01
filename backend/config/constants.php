<?php
// Local config pehle load hogi agar exist kare
$localConfig = __DIR__ . '/local.php';
if (!file_exists($localConfig)) {
    // ── Production (cPanel) Constants ───────────────
    define('SITE_NAME',       'ObeliskRX');
    define('SITE_URL',        'https://axistechstaging.com/obeliskrx');
    define('ADMIN_PATH',      'https://axistechstaging.com/obeliskrx/backend/admin');
    define('IMAGES_BASE_URL', 'https://axistechstaging.com/obeliskrx/backend/images/products/');
    define('COA_BASE_URL',   'https://axistechstaging.com/obeliskrx/backend/images/coa/');

    define('SMTP_HOST',   'mail.axistechstaging.com');
    define('SMTP_PORT',   465);
    define('SMTP_SECURE', 'ssl');
    define('SMTP_USER',   'orders@obeliskrx.com');
    define('SMTP_PASS',   'CHANGE_THIS_EMAIL_PASSWORD');
    define('FROM_EMAIL',  'orders@obeliskrx.com');
    define('FROM_NAME',   'ObeliskRX');
    define('OWNER_EMAIL', 'Contact@Obeliskrx.com');
    define('OWNER_NAME',  'ObeliskRX Admin');
}
