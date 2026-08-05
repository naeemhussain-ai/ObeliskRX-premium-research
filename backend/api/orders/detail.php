<?php
// GET /api/orders/detail.php?order_number=OBX-2024-ABC123&email=client@email.com
// Client apna order track kar sakta hai order number + email se

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$orderNumber = trim($_GET['order_number'] ?? '');
$email       = strtolower(trim($_GET['email'] ?? ''));

if (empty($orderNumber) || empty($email)) {
    error('Order number and email are required.', 422);
}

$db   = getDB();
$stmt = $db->prepare("
    SELECT id, order_number, first_name, last_name, email, phone,
           address_line1, address_line2, city, state, zip, country,
           items, subtotal, shipping_fee, total, payment_method,
           status, rejection_reason, created_at
    FROM orders
    WHERE order_number = ? AND email = ?
    LIMIT 1
");
$stmt->execute([$orderNumber, $email]);
$order = $stmt->fetch();

if (!$order) error('Order not found. Please check your order number and email.', 404);

$order['items'] = json_decode($order['items'], true);

success(['order' => $order]);
