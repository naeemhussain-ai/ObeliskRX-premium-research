<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db     = getDB();
$filter = $_GET['status'] ?? 'new';
$where  = $filter !== 'all' ? "WHERE status = " . $db->quote($filter) : '';

$messages = $db->query("SELECT * FROM contact_messages $where ORDER BY created_at DESC")->fetchAll();

// Count per status
$statusCounts = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM contact_messages GROUP BY status")->fetchAll() as $r)
    $statusCounts[$r['status']] = (int)$r['cnt'];
$totalMessages = array_sum($statusCounts);
$newCount      = $statusCounts['new'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages   ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Contact Messages <?php if ($newCount > 0): ?>
                <span class="badge badge-yellow"><?= $newCount ?> new</span>
            <?php endif; ?></h1>
        </div>

        <div class="filter-tabs">
            <?php
            $tabs = [
                'new'     => ['New',     $statusCounts['new']     ?? 0],
                'read'    => ['Read',    $statusCounts['read']    ?? 0],
                'replied' => ['Replied', $statusCounts['replied'] ?? 0],
                'all'     => ['All',     $totalMessages],
            ];
            foreach ($tabs as $key => [$label, $count]):
            ?>
                <a href="?status=<?= $key ?>" class="tab <?= $filter === $key ? 'active' : '' ?>">
                    <?= $label ?>
                    <?php if ($count > 0): ?>
                        <span class="tab-count <?= $key === 'new' ? 'tab-count-warn' : '' ?>"><?= $count ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($messages)): ?>
            <div class="empty-state">No messages found.</div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>Subject</th>
                        <th>Preview</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($messages as $msg):
                        $statusClass = ['new' => 'badge-yellow', 'read' => 'badge-blue', 'replied' => 'badge-green'][$msg['status']] ?? '';
                    ?>
                    <tr class="<?= $msg['status'] === 'new' ? 'row-new' : '' ?>">
                        <td>
                            <strong><?= htmlspecialchars($msg['name']) ?></strong><br>
                            <small class="text-muted"><?= htmlspecialchars($msg['email']) ?></small>
                        </td>
                        <td><?= htmlspecialchars($msg['subject'] ?: '(No Subject)') ?></td>
                        <td><?= htmlspecialchars(mb_substr($msg['message'], 0, 70)) ?>...</td>
                        <td><span class="badge <?= $statusClass ?>"><?= ucfirst($msg['status']) ?></span></td>
                        <td><?= date('M d, Y', strtotime($msg['created_at'])) ?></td>
                        <td>
                            <a href="message-detail.php?id=<?= $msg['id'] ?>" class="btn btn-sm btn-outline">View</a>
                            <a href="mailto:<?= htmlspecialchars($msg['email']) ?>?subject=Re:+<?= urlencode($msg['subject'] ?: 'Your Message') ?>"
                               class="btn btn-sm btn-primary">Reply</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

    </div><!-- /.main-content -->
</body>
</html>
