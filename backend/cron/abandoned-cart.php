<?php
// cron/abandoned-cart.php - Abandoned cart reminder emails bhejta hai
//
// cPanel -> Cron Jobs (har 30 minute; testing ke waqt har 5 minute */5):
//   */30 * * * * /usr/local/bin/php /home/USERNAME/public_html/obeliskrx/backend/cron/abandoned-cart.php >/dev/null 2>&1
//
// Local test:  php backend/cron/abandoned-cart.php
// Asal logic: helpers/abandoned_cart.php -> runAbandonedCartReminders()

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../helpers/abandoned_cart.php';

$r = runAbandonedCartReminders(getDB(), 'cron');

echo "Abandoned cart reminders: checked={$r['checked']} sent={$r['sent']} failed={$r['failed']}\n";
