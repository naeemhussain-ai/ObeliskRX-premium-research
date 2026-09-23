<?php
// helpers/abandoned_cart.php - Abandoned cart reminder ke shared helpers

// Reminder timing (constants.php / local.php mein override kar sakte ho):
// 1st reminder: cart ki aakhri change ke itne minute baad
if (!defined('CART_REMINDER_MINUTES')) define('CART_REMINDER_MINUTES', 60);
// 2nd (aakhri) reminder: 1st reminder ke itne minute baad, agar tab bhi order nahi hua
if (!defined('CART_SECOND_REMINDER_MINUTES')) define('CART_SECOND_REMINDER_MINUTES', 1440);
// Ek cart par zyada se zyada itne reminders
define('CART_MAX_REMINDERS', 2);

// Table missing ho to khud bana do (migration_abandoned_carts.sql ka kaam) - taake
// deploy par phpMyAdmin mein SQL chalana bhool bhi jayein to feature toote nahi
function ensureAbandonedCartsTable(PDO $db): void {
    static $done = false;
    if ($done) return;
    $db->exec(file_get_contents(__DIR__ . '/../database/migration_abandoned_carts.sql'));
    // Purani table (pehle deploy) mein reminder_count column nahi tha
    if (!$db->query("SHOW COLUMNS FROM abandoned_carts LIKE 'reminder_count'")->fetch()) {
        $db->exec("ALTER TABLE abandoned_carts ADD COLUMN reminder_count TINYINT NOT NULL DEFAULT 0 AFTER reminder_sent");
        $db->exec("UPDATE abandoned_carts SET reminder_count = 1 WHERE reminder_sent_at IS NOT NULL AND status IN ('active','reminded')");
    }
    $done = true;
}

// Cart item ki image ko email ke liye absolute URL banao
function absoluteImageUrl(string $image): string {
    if ($image === '' || strpos($image, 'data:') === 0) return '';
    if (preg_match('#^https?://#i', $image)) return $image;
    if (strpos($image, '/') === 0) {
        $parts = parse_url(SITE_URL);
        $port  = isset($parts['port']) ? ':' . $parts['port'] : '';
        return $parts['scheme'] . '://' . $parts['host'] . $port . $image;
    }
    return IMAGES_BASE_URL . $image;
}

// Log file jahan har reminder run ki ek line likhi jati hai (admin panel yahin se "last run" dikhata hai)
function abandonedCartLogFile(): string {
    return __DIR__ . '/../cron/logs/abandoned-cart.log';
}

// Reminder emails bhejo - cron aur admin panel ka "Run check now" dono yahi chalate hain
//   1st reminder: cart CART_REMINDER_MINUTES se idle, abhi tak koi reminder nahi
//   2nd reminder: 1st reminder ko CART_SECOND_REMINDER_MINUTES ho gaye, tab bhi order nahi
// Dono ke liye: customer verified, unsubscribe nahi kiya, cart abhi bhi idle, aur
// cart ki aakhri change ke baad koi order nahi hua
function runAbandonedCartReminders(PDO $db, string $source = 'cron'): array {
    require_once __DIR__ . '/email.php';
    ensureAbandonedCartsTable($db);

    $first  = max(1, (int)CART_REMINDER_MINUTES);
    $second = max(1, (int)CART_SECOND_REMINDER_MINUTES);

    $stmt = $db->prepare("
        SELECT ac.*
        FROM abandoned_carts ac
        JOIN customers c ON c.id = ac.customer_id
        WHERE ac.opted_out = 0
          AND c.email_verified_at IS NOT NULL
          AND ac.updated_at <= NOW() - INTERVAL $first MINUTE
          AND (
                (ac.reminder_count = 0 AND ac.status = 'active'
                 AND ac.updated_at >= NOW() - INTERVAL 48 HOUR)
             OR (ac.reminder_count = 1 AND ac.status IN ('active','reminded')
                 AND ac.reminder_sent_at <= NOW() - INTERVAL $second MINUTE
                 AND ac.reminder_sent_at >= NOW() - INTERVAL ($second + 1440) MINUTE)
          )
          AND NOT EXISTS (
              SELECT 1 FROM orders o
              WHERE o.customer_id = ac.customer_id AND o.created_at >= ac.updated_at
          )
        ORDER BY ac.updated_at ASC
        LIMIT 50
    ");
    $stmt->execute();
    $carts = $stmt->fetchAll();

    $mark = $db->prepare("
        UPDATE abandoned_carts
        SET reminder_sent = 1, reminder_count = reminder_count + 1, reminder_sent_at = NOW(),
            status = 'reminded', updated_at = updated_at
        WHERE id = ?
    ");
    $token = $db->prepare("UPDATE abandoned_carts SET unsubscribe_token = ?, updated_at = updated_at WHERE id = ?");

    $sent = 0;
    $failed = 0;
    foreach ($carts as $cart) {
        if (empty($cart['unsubscribe_token'])) {
            $cart['unsubscribe_token'] = bin2hex(random_bytes(32));
            $token->execute([$cart['unsubscribe_token'], $cart['id']]);
        }

        // Fail hone par bhi mark karo taake har run par same email retry na ho
        // (error email_logs table mein save hai, admin panel par dikhta hai)
        $stage = (int)$cart['reminder_count'] + 1;
        if (sendAbandonedCartEmail($cart, $stage)) $sent++;
        else $failed++;
        $mark->execute([$cart['id']]);
    }

    $result = ['checked' => count($carts), 'sent' => $sent, 'failed' => $failed];

    $logDir = dirname(abandonedCartLogFile());
    if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
    @file_put_contents(
        abandonedCartLogFile(),
        sprintf("[%s] ts=%d source=%s checked=%d sent=%d failed=%d\n", date('Y-m-d H:i:s'), time(), $source, $result['checked'], $sent, $failed),
        FILE_APPEND
    );

    return $result;
}
