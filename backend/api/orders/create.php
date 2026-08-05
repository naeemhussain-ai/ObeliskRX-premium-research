<?php
// POST /api/orders/create.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';

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

// Validate each item (product_id optional — slug se lookup hoga)
foreach ($body['items'] as $item) {
    if (empty($item['product_name']) || empty($item['quantity']) || !isset($item['unit_price'])) {
        error('Invalid item data in order.', 422);
    }
}

$db = getDB();

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
            order_number, first_name, last_name, email, phone,
            address_line1, address_line2, city, state, zip, country,
            special_notes, items, subtotal, shipping_fee, total, payment_method, status
        ) VALUES (
            :order_number, :first_name, :last_name, :email, :phone,
            :address_line1, :address_line2, :city, :state, :zip, :country,
            :special_notes, :items, :subtotal, :shipping_fee, :total, :payment_method, 'approved'
        )
    ");

    $stmt->execute([
        ':order_number'  => $orderNumber,
        ':first_name'    => sanitizeString($body['first_name']),
        ':last_name'     => sanitizeString($body['last_name']),
        ':email'         => strtolower(trim($body['email'])),
        ':phone'         => sanitizeString($body['phone'] ?? ''),
        ':address_line1' => sanitizeString($body['address_line1']),
        ':address_line2' => sanitizeString($body['address_line2'] ?? ''),
        ':city'          => sanitizeString($body['city']),
        ':state'         => sanitizeString($body['state']),
        ':zip'           => sanitizeString($body['zip']),
        ':country'       => sanitizeString($body['country']),
        ':special_notes' => sanitizeString($body['special_notes'] ?? ''),
        ':items'         => json_encode($body['items']),
        ':subtotal'      => sanitizeFloat($body['subtotal'] ?? $body['total']),
        ':shipping_fee'  => sanitizeFloat($body['shipping_fee'] ?? 0),
        ':total'         => sanitizeFloat($body['total']),
        ':payment_method'=> sanitizeString($body['payment_method'] ?? 'alipay'),
    ]);

    $orderId = (int)$db->lastInsertId();

    // order_items insert — slug se product_id dhundho
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

    $db->commit();

    success([
        'order_id'     => $orderId,
        'order_number' => $orderNumber,
    ], 'Order placed successfully!', 201);

} catch (Exception $e) {
    $db->rollBack();
    error('Order could not be placed. Please try again.', 500);
}
