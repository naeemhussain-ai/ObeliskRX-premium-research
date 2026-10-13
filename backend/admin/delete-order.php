<?php
// Admin - order hamesha ke liye delete karo (orders list ki safai ke liye)
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: orders.php');
    exit();
}

if (!adminCsrfValid()) {
    header('Location: orders.php?error=csrf');
    exit();
}

$orderId = (int)($_POST['order_id'] ?? 0);
$db      = getDB();

$stmt = $db->prepare("SELECT id, status, payment_proof_file FROM orders WHERE id = ?");
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    header('Location: orders.php?error=not_found');
    exit();
}

$db->beginTransaction();

// Pending/approved order ka stock abhi kata hua hai (maal gaya nahi) - delete par wapas karo.
// Rejected ka stock pehle hi wapas ho chuka, shipped/delivered ka maal ja chuka.
if (in_array($order['status'], ['pending', 'approved'], true)) {
    require_once __DIR__ . '/../helpers/product_fields.php';
    ensureProductColumns($db);
    $items = $db->prepare("SELECT product_id, size, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL");
    $items->execute([$orderId]);
    $qtyByProduct = [];
    foreach ($items->fetchAll() as $it) {
        $size = html_entity_decode($it['size'] ?? '', ENT_QUOTES, 'UTF-8');
        $qtyByProduct[$it['product_id']][$size] = ($qtyByProduct[$it['product_id']][$size] ?? 0) + (int)$it['quantity'];
    }
    foreach ($qtyByProduct as $productId => $qtyBySize) {
        adjustProductStock($db, (int)$productId, $qtyBySize, 1);
    }
}

// Pehle items, phir order
$db->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);
$db->prepare("DELETE FROM orders WHERE id = ?")->execute([$orderId]);
$db->commit();

// Customer ka payment proof screenshot bhi server se hata do
if (!empty($order['payment_proof_file'])) {
    $file = __DIR__ . '/../images/payment_proofs/' . basename($order['payment_proof_file']);
    if (is_file($file)) @unlink($file);
}

$back = $_POST['return_status'] ?? 'all';
header('Location: orders.php?status=' . urlencode(preg_replace('/[^a-z]/', '', $back) ?: 'all') . '&success=deleted');
exit();
