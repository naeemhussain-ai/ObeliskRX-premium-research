<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: messages.php'); exit(); }

$db   = getDB();
$stmt = $db->prepare("SELECT * FROM contact_messages WHERE id = ?");
$stmt->execute([$id]);
$msg = $stmt->fetch();
if (!$msg) { header('Location: messages.php'); exit(); }

// Auto-mark as read
if ($msg['status'] === 'new') {
    $db->prepare("UPDATE contact_messages SET status = 'read' WHERE id = ?")->execute([$id]);
    $msg['status'] = 'read';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message from <?= htmlspecialchars($msg['name']) ?>   Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <div>
                <a href="messages.php" class="back-link">← Back to Messages</a>
                <h1>Message from <?= htmlspecialchars($msg['name']) ?></h1>
            </div>
        </div>

        <div class="card">
            <dl class="message-meta">
                <dt>From</dt>
                <dd><?= htmlspecialchars($msg['name']) ?> &lt;<a href="mailto:<?= htmlspecialchars($msg['email']) ?>"><?= htmlspecialchars($msg['email']) ?></a>&gt;</dd>
                <dt>Subject</dt>
                <dd><?= htmlspecialchars($msg['subject'] ?: '(No Subject)') ?></dd>
                <dt>Date</dt>
                <dd><?= date('M d, Y H:i', strtotime($msg['created_at'])) ?></dd>
            </dl>

            <div class="message-body">
                <p><?= nl2br(htmlspecialchars($msg['message'])) ?></p>
            </div>

            <div class="message-actions">
                <a href="mailto:<?= htmlspecialchars($msg['email']) ?>?subject=Re:+<?= urlencode($msg['subject'] ?: 'Your Message') ?>"
                   class="btn btn-primary">✉️ Reply via Email</a>

                <?php if ($msg['status'] !== 'replied'): ?>
                <form method="POST" action="action-message.php" style="display:inline">
                    <input type="hidden" name="message_id" value="<?= $id ?>">
                    <input type="hidden" name="action" value="replied">
                    <button type="submit" class="btn btn-outline">✓ Mark as Replied</button>
                </form>
                <?php endif; ?>
            </div>
        </div>

    </div><!-- /.main-content -->
</body>
</html>
