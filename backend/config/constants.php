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
    define('PAYMENT_PROOF_BASE_URL', 'https://axistechstaging.com/obeliskrx/backend/images/payment_proofs/');

    // 'local' = is server ke apne Exim/sendmail se bhejo (koi mailbox/password nahi chahiye).
    // 'smtp'  = neeche wali SMTP_* mailbox se bhejo - sirf tab use karo jab ye mailbox
    //           waqai axistechstaging.com cPanel par bani ho aur SMTP_PASS sahi ho.
    define('MAIL_METHOD', 'local');

    define('SMTP_HOST',   'mail.axistechstaging.com');
    define('SMTP_PORT',   465);
    define('SMTP_SECURE', 'ssl');
    define('SMTP_USER',   'orders@axistechstaging.com');
    define('SMTP_PASS',   'CHANGE_THIS_EMAIL_PASSWORD');
    define('FROM_EMAIL',  'orders@axistechstaging.com');
    define('FROM_NAME',   'ObeliskRX');
    define('OWNER_EMAIL', 'Contact@Obeliskrx.com');
    define('OWNER_NAME',  'ObeliskRX Admin');

    // ── Abandoned cart reminder ─────────────────────
    // Default (helpers/abandoned_cart.php): 1st reminder cart ke 60 min baad,
    // 2nd (aakhri) reminder 1st ke 1440 min (24 ghante) baad. Jaldi test karna ho to:
    //   define('CART_REMINDER_MINUTES', 5);
    //   define('CART_SECOND_REMINDER_MINUTES', 5);
}
