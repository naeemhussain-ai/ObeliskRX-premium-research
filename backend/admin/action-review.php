<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: reviews.php');
    exit();
}

$reviewId = (int)($_POST['review_id'] ?? 0);
$action   = $_POST['action'] ?? '';

if (!$reviewId || !in_array($action, ['approved', 'rejected'])) {
    header('Location: reviews.php?error=invalid');
    exit();
}

$db = getDB();
$db->prepare("UPDATE reviews SET status = ? WHERE id = ?")
   ->execute([$action, $reviewId]);

header('Location: reviews.php?status=pending&success=' . $action);
exit();
