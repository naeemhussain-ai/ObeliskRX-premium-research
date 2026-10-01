<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: orders.php');
    exit();
}

$orderId = (int)($_POST['order_id'] ?? 0);
$action  = $_POST['action'] ?? '';
$reason  = trim($_POST['rejection_reason'] ?? '');

$validActions = ['approved', 'rejected', 'shipped', 'delivered'];

if (!$orderId || !in_array($action, $validActions)) {
    header('Location: orders.php?error=invalid');
    exit();
}

if ($action === 'rejected' && empty($reason)) {
    header("Location: order-detail.php?id=$orderId&error=reason_required");
    exit();
}

$db = getDB();

// Order fetch karo
$stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    header('Location: orders.php?error=not_found');
    exit();
}

// Order reject hua to har size ka stock wapas karo; rejected se wapas approve hua to dobara kaato
$wasRejected = $order['status'] === 'rejected';
$isRejected  = $action === 'rejected';
if ($wasRejected !== $isRejected) {
    require_once __DIR__ . '/../helpers/product_fields.php';
    ensureProductColumns($db);
    $items = $db->prepare("SELECT product_id, size, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL");
    $items->execute([$orderId]);
    $qtyByProduct = [];
    foreach ($items->fetchAll() as $it) {
        $size = html_entity_decode($it['size'] ?? '', ENT_QUOTES, 'UTF-8');
        $qtyByProduct[$it['product_id']][$size] = ($qtyByProduct[$it['product_id']][$size] ?? 0) + (int)$it['quantity'];
    }
    $db->beginTransaction();
    foreach ($qtyByProduct as $productId => $qtyBySize) {
        adjustProductStock($db, (int)$productId, $qtyBySize, $isRejected ? 1 : -1);
    }
    $db->commit();
}

// Status update
$update = $db->prepare("
    UPDATE orders
    SET status = ?, rejection_reason = ?, updated_at = NOW()
    WHERE id = ?
");
$update->execute([$action, $action === 'rejected' ? $reason : null, $orderId]);

// Customer ko email bhejo
try {
    require_once __DIR__ . '/../helpers/email.php';
    $updatedOrder = $db->query("SELECT * FROM orders WHERE id = $orderId")->fetch();
    if ($action === 'approved') sendOrderApprovedEmail($updatedOrder);
    if ($action === 'shipped')  sendOrderShippedEmail($updatedOrder);
    if ($action === 'rejected') sendOrderCancelledEmail($updatedOrder);
} catch (\Exception $e) {}

header("Location: order-detail.php?id=$orderId&success=$action");
exit();
