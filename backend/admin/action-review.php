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

if (!$reviewId) {
    header('Location: reviews.php?error=invalid');
    exit();
}

$db = getDB();

if ($action === 'reply') {
    $replyText = trim($_POST['reply_text'] ?? '');
    if ($replyText === '') {
        header('Location: reviews.php?error=empty_reply');
        exit();
    }
    $db->prepare("UPDATE reviews SET admin_reply = ?, admin_reply_at = NOW() WHERE id = ?")
       ->execute([$replyText, $reviewId]);
    header('Location: reviews.php?status=all&success=replied');
    exit();
}

if ($action === 'delete_reply') {
    $db->prepare("UPDATE reviews SET admin_reply = NULL, admin_reply_at = NULL WHERE id = ?")
       ->execute([$reviewId]);
    header('Location: reviews.php?status=all&success=reply_deleted');
    exit();
}

if ($action === 'delete') {
    $db->prepare("DELETE FROM reviews WHERE id = ?")->execute([$reviewId]);
    header('Location: reviews.php?status=all&success=deleted');
    exit();
}

if (!in_array($action, ['approved', 'rejected'])) {
    header('Location: reviews.php?error=invalid');
    exit();
}

$db->prepare("UPDATE reviews SET status = ? WHERE id = ?")
   ->execute([$action, $reviewId]);

header('Location: reviews.php?status=pending&success=' . $action);
exit();
