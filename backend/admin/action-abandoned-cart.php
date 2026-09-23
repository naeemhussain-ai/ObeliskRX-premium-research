<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../helpers/abandoned_cart.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || ($_POST['action'] ?? '') !== 'run') {
    header('Location: abandoned-carts.php');
    exit();
}

// Wohi check jo cron chalati hai - foran test karne ke liye
$r = runAbandonedCartReminders(getDB(), 'admin');

$msg = "{$r['checked']} due, {$r['sent']} sent, {$r['failed']} failed";
header('Location: abandoned-carts.php?ran=' . urlencode($msg));
exit();
