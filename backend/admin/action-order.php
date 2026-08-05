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

$validActions = ['rejected', 'shipped', 'delivered'];

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
    if ($action === 'shipped')  sendOrderShippedEmail($updatedOrder);
    if ($action === 'rejected') sendOrderCancelledEmail($updatedOrder);
} catch (\Exception $e) {}

header("Location: order-detail.php?id=$orderId&success=$action");
exit();
