<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$productId = (int)($_POST['product_id'] ?? 0);
$isActive  = (int)($_POST['is_active'] ?? 0);

if ($productId && in_array($isActive, [0, 1])) {
    $db = getDB();
    $db->prepare("UPDATE products SET is_active = ? WHERE id = ?")
       ->execute([$isActive, $productId]);
}

header('Location: products.php');
exit();
