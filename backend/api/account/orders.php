<?php
// GET /api/account/orders.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db       = getDB();
$customer = getCustomerFromRequest($db);
if (!$customer) error('Unauthorized.', 401);

$stmt = $db->prepare("
    SELECT id, order_number, first_name, last_name, email,
           items, subtotal, total, payment_method, status, created_at
    FROM orders
    WHERE email = ?
    ORDER BY created_at DESC
");
$stmt->execute([$customer['email']]);
$all = $stmt->fetchAll(PDO::FETCH_ASSOC);

$past     = [];
$upcoming = [];

foreach ($all as $order) {
    $order['items'] = json_decode($order['items'], true) ?? [];
    if (in_array($order['status'], ['delivered', 'shipped', 'rejected'])) {
        $past[] = $order;
    } else {
        $upcoming[] = $order;
    }
}

success(['past' => $past, 'upcoming' => $upcoming]);
