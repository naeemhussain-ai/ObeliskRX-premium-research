<?php
// POST /api/orders/create.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = getJsonBody();

// ── Validation ──────────────────────────────────────
$requiredMsg = validateRequired($body, [
    'first_name', 'last_name', 'email', 'phone',
    'address_line1', 'city', 'state', 'zip', 'country',
    'items', 'total'
]);
if ($requiredMsg) error($requiredMsg, 422);

if (!validateEmail($body['email'])) error('Invalid email address.', 422);
if (empty($body['items']) || !is_array($body['items'])) error('Order must have at least one item.', 422);
if ((float)$body['total'] <= 0) error('Invalid order total.', 422);

// Validate each item (product_id optional - slug se lookup hoga)
foreach ($body['items'] as $item) {
    if (empty($item['product_name']) || empty($item['quantity']) || !isset($item['unit_price'])) {
        error('Invalid item data in order.', 422);
    }
}

$db = getDB();

// ── Order ke liye login zaroori hai (guest checkout allowed nahi) ──
$customer = getCustomerFromRequest($db);
if (!$customer) error('Please log in to place an order.', 401);
$customerId = (int)$customer['id'];

// ── Research info (checkout popup) ──────────────────
$allowedUsage = ['Academic Research', 'Lab/Institutional Research', 'Clinical Research Professional', 'Graduate/PhD Student'];
$legalName = sanitizeString($body['legal_name'] ?? '');
$usageType = sanitizeString($body['usage_type'] ?? '');
if ($legalName === '') error('Please enter your full legal name or company name.', 422);
if (!in_array($usageType, $allowedUsage, true)) error('Please select how you are using ObeliskRX.', 422);

// orders table mein columns na hon to khud bana do (migration_research_info.sql ka kaam)
$hasResearchCols = false;
try {
    foreach (['legal_name' => 'VARCHAR(200) NULL', 'usage_type' => 'VARCHAR(100) NULL'] as $col => $def) {
        if (!$db->query("SHOW COLUMNS FROM orders LIKE '$col'")->fetch()) {
            $db->exec("ALTER TABLE orders ADD COLUMN $col $def");
        }
    }
    $hasResearchCols = true;
} catch (\Exception $e) {}

// ── Coupon (optional) - discount hamesha server par verify/calculate hota hai,
// client se aaya hua total kabhi trust nahi karte ──
$couponCode      = strtoupper(trim($body['coupon_code'] ?? ''));
$discountPercent = 0.0;
$subtotal        = sanitizeFloat($body['subtotal'] ?? $body['total']);
$shippingFee     = sanitizeFloat($body['shipping_fee'] ?? 0);

if ($couponCode !== '') {
    $couponStmt = $db->prepare("SELECT discount_percent, max_uses, used_count FROM coupons WHERE code = ?");
    $couponStmt->execute([$couponCode]);
    $couponRow = $couponStmt->fetch(PDO::FETCH_ASSOC);
    if (!$couponRow) error('Invalid coupon code.', 422);
    if ((int)$couponRow['used_count'] >= (int)$couponRow['max_uses']) {
        error('This coupon has reached its usage limit.', 422);
    }
    $discountPercent = (float)$couponRow['discount_percent'];
}

$discountAmount = round($subtotal * $discountPercent / 100, 2);
$total          = round($subtotal - $discountAmount + $shippingFee, 2);
if ($total <= 0) error('Invalid order total.', 422);

// ── Generate unique order number ────────────────────
do {
    $orderNumber = generateOrderNumber();
    $exists = $db->prepare("SELECT id FROM orders WHERE order_number = ?");
    $exists->execute([$orderNumber]);
} while ($exists->fetch());

// ── Insert Order ────────────────────────────────────
try {
    $db->beginTransaction();

    $stmt = $db->prepare("
        INSERT INTO orders (
            customer_id, order_number, first_name, last_name, email, phone,
            address_line1, address_line2, city, state, zip, country,
            special_notes, items, subtotal, shipping_fee, total, payment_method,
            coupon_code, discount_percent, discount_amount, status
        ) VALUES (
            :customer_id, :order_number, :first_name, :last_name, :email, :phone,
            :address_line1, :address_line2, :city, :state, :zip, :country,
            :special_notes, :items, :subtotal, :shipping_fee, :total, :payment_method,
            :coupon_code, :discount_percent, :discount_amount, 'pending'
        )
    ");

    $params = [
        ':customer_id'      => $customerId,
        ':order_number'     => $orderNumber,
        ':first_name'       => sanitizeString($body['first_name']),
        ':last_name'        => sanitizeString($body['last_name']),
        ':email'            => strtolower(trim($body['email'])),
        ':phone'            => sanitizeString($body['phone'] ?? ''),
        ':address_line1'    => sanitizeString($body['address_line1']),
        ':address_line2'    => sanitizeString($body['address_line2'] ?? ''),
        ':city'             => sanitizeString($body['city']),
        ':state'            => sanitizeString($body['state']),
        ':zip'              => sanitizeString($body['zip']),
        ':country'          => sanitizeString($body['country']),
        ':special_notes'    => sanitizeString($body['special_notes'] ?? ''),
        ':items'            => json_encode($body['items']),
        ':subtotal'         => $subtotal,
        ':shipping_fee'     => $shippingFee,
        ':total'            => $total,
        ':payment_method'   => sanitizeString($body['payment_method'] ?? 'alipay'),
        ':coupon_code'      => $couponCode !== '' ? $couponCode : null,
        ':discount_percent' => $discountPercent,
        ':discount_amount'  => $discountAmount,
    ];
    $stmt->execute($params);

    $orderId = (int)$db->lastInsertId();
    if ($hasResearchCols) {
        $db->prepare("UPDATE orders SET legal_name = ?, usage_type = ? WHERE id = ?")
           ->execute([$legalName, $usageType, $orderId]);
    }

    // order_items insert - slug se product_id dhundho
    $itemStmt = $db->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, size, quantity, unit_price, subtotal)
        VALUES (:order_id, :product_id, :product_name, :size, :quantity, :unit_price, :subtotal)
    ");

    foreach ($body['items'] as $item) {
        // Slug se product_id lookup karo
        $productId = null;
        $slug = sanitizeString($item['slug'] ?? '');
        if ($slug) {
            $lookup = $db->prepare("SELECT id FROM products WHERE slug = ?");
            $lookup->execute([$slug]);
            $row = $lookup->fetch();
            if ($row) $productId = (int)$row['id'];
        }

        $itemStmt->execute([
            ':order_id'     => $orderId,
            ':product_id'   => $productId,
            ':product_name' => sanitizeString($item['product_name']),
            ':size'         => sanitizeString($item['size'] ?? ''),
            ':quantity'     => (int)$item['quantity'],
            ':unit_price'   => (float)$item['unit_price'],
            ':subtotal'     => (float)$item['quantity'] * (float)$item['unit_price'],
        ]);
    }

    // Coupon slot atomically claim karo - agar isi waqt koi aur order isay use kar
    // chuka ho aur limit poori ho gayi ho, to poora order rollback kar do
    if ($couponCode !== '') {
        $claim = $db->prepare("UPDATE coupons SET used_count = used_count + 1 WHERE code = ? AND used_count < max_uses");
        $claim->execute([$couponCode]);
        if ($claim->rowCount() === 0) {
            $db->rollBack();
            error('This coupon just reached its usage limit. Please remove it and try again.', 422);
        }
    }

    $db->commit();

    // Logged-in customer ka address save karo
    if ($customerId) {
        try {
            $db->prepare("
                UPDATE customers SET
                    phone         = ?,
                    address_line1 = ?,
                    address_line2 = ?,
                    city          = ?,
                    state         = ?,
                    zip           = ?,
                    country       = ?
                WHERE id = ?
            ")->execute([
                sanitizeString($body['phone'] ?? ''),
                sanitizeString($body['address_line1']),
                sanitizeString($body['address_line2'] ?? ''),
                sanitizeString($body['city']),
                sanitizeString($body['state']),
                sanitizeString($body['zip']),
                sanitizeString($body['country']),
                $customerId,
            ]);
        } catch (\Exception $e) {}
    }

    // Admin ko email bhejo - naya order
    try {
        require_once __DIR__ . '/../../helpers/email.php';
        $newOrder = $db->query("SELECT * FROM orders WHERE id = $orderId")->fetch();
        sendNewOrderEmail($newOrder);
    } catch (\Exception $e) {}

    success([
        'order_id'     => $orderId,
        'order_number' => $orderNumber,
    ], 'Order placed successfully!', 201);

} catch (Exception $e) {
    $db->rollBack();
    error('Order could not be placed. Please try again.', 500);
}
