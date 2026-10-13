<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/product_fields.php';
requireAdmin();

// Product page ka "Independently Tested · 99%+ Purity" label ON/OFF
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: products.php');
    exit();
}
if (!adminCsrfValid()) {
    header('Location: products.php?error=csrf');
    exit();
}

$productId = (int)($_POST['product_id'] ?? 0);
$show      = (int)($_POST['show_purity_badge'] ?? 0);

if ($productId && in_array($show, [0, 1])) {
    $db = getDB();
    ensureProductColumns($db);
    $db->prepare("UPDATE products SET show_purity_badge = ? WHERE id = ?")->execute([$show, $productId]);
}

header('Location: products.php?success=badge');
exit();
