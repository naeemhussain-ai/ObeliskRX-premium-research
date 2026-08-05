<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$messageId = (int)($_POST['message_id'] ?? 0);
$action    = $_POST['action'] ?? '';

if (!$messageId || !in_array($action, ['read', 'replied'])) {
    header('Location: messages.php');
    exit();
}

$db = getDB();
$db->prepare("UPDATE contact_messages SET status = ? WHERE id = ?")
   ->execute([$action, $messageId]);

header("Location: message-detail.php?id=$messageId");
exit();
