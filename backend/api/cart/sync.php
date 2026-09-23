<?php
// GET  /api/cart/sync.php  - logged-in customer ka saved cart wapas do (login par restore)
// POST /api/cart/sync.php  - browser cart server par save karo (abandoned cart reminder ke liye)

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';
require_once __DIR__ . '/../../helpers/abandoned_cart.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST') error('Method not allowed', 405);

$db = getDB();

$customer = getCustomerFromRequest($db);
if (!$customer) error('Unauthorized', 401);
$customerId = (int)$customer['id'];

ensureAbandonedCartsTable($db);

// ── GET: saved cart (sirf agar abhi tak order nahi hua) ──
if ($method === 'GET') {
    $stmt = $db->prepare("
        SELECT cart_items FROM abandoned_carts
        WHERE customer_id = ? AND status IN ('active','reminded')
    ");
    $stmt->execute([$customerId]);
    $row = $stmt->fetch();
    success(['items' => $row ? (json_decode($row['cart_items'], true) ?: []) : []]);
}

// ── POST: cart save karo ──
$body  = getJsonBody();
$items = $body['items'] ?? null;
if (!is_array($items)) error('Items must be an array.', 422);
if (count($items) > 50) error('Too many items in cart.', 422);

// Raw text save karo (sanitizeString HTML-escape karta hai, jo restore par React mein
// "&amp;" dikhata) - email mein output ke waqt escape hota hai
function cleanText($value, int $max): string {
    return mb_substr(trim(strip_tags((string)$value)), 0, $max);
}

$clean    = [];
$subtotal = 0.0;
foreach ($items as $item) {
    if (!is_array($item)) continue;
    $slug = cleanText($item['slug'] ?? '', 150);
    $name = cleanText($item['name'] ?? '', 200);
    $qty  = max(0, min(999, (int)($item['qty'] ?? 0)));
    if ($slug === '' || $name === '' || $qty === 0) continue;

    $image = trim((string)($item['image'] ?? ''));
    if (strlen($image) > 500 || strpos($image, 'data:') === 0) $image = '';

    $price = max(0, round((float)($item['price'] ?? 0), 2));
    $clean[] = [
        'slug'  => $slug,
        'name'  => $name,
        'size'  => cleanText($item['size'] ?? '', 50),
        'price' => $price,
        'image' => $image,
        'qty'   => $qty,
    ];
    $subtotal += $price * $qty;
}

// Khali cart - reminder ki zaroorat nahi. Order ke baad browser cart khali karta hai,
// us waqt 'ordered' status rehne do (taake pata rahe reminder ke baad order aaya)
if (!$clean) {
    $db->prepare("
        UPDATE abandoned_carts
        SET status = IF(status = 'ordered', 'ordered', 'empty'), cart_items = '[]', subtotal = 0
        WHERE customer_id = ?
    ")
       ->execute([$customerId]);
    success([], 'Cart synced');
}

// Cart badla to idle timer dobara shuru. Reminder count wahi rehta hai (ek cart par
// zyada se zyada 2 reminders) - sirf naya cart (order ya khali hone ke baad) 0 se shuru hota hai.
// Note: MySQL assignments left-to-right chalata hai, is liye status wali line sab se aakhir mein hai
$db->prepare("
    INSERT INTO abandoned_carts (customer_id, email, name, cart_items, subtotal, status, reminder_sent, unsubscribe_token)
    VALUES (?, ?, ?, ?, ?, 'active', 0, ?)
    ON DUPLICATE KEY UPDATE
        email         = VALUES(email),
        name          = VALUES(name),
        cart_items    = VALUES(cart_items),
        subtotal      = VALUES(subtotal),
        reminder_count   = IF(status IN ('ordered','empty'), 0, reminder_count),
        reminder_sent_at = IF(status IN ('ordered','empty'), NULL, reminder_sent_at),
        status        = 'active',
        reminder_sent = 0,
        unsubscribe_token = COALESCE(unsubscribe_token, VALUES(unsubscribe_token)),
        updated_at    = NOW()
")->execute([
    $customerId,
    $customer['email'],
    $customer['name'],
    json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    round($subtotal, 2),
    bin2hex(random_bytes(32)),
]);

success([], 'Cart synced');
