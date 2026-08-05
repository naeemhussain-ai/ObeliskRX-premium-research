<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db     = getDB();
$filter = $_GET['status'] ?? 'pending';
$where  = "WHERE status = " . $db->quote($filter);

$reviews = $db->query("SELECT * FROM reviews $where ORDER BY created_at DESC")->fetchAll();
$pendingCount = (int)$db->query("SELECT COUNT(*) FROM reviews WHERE status = 'pending'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reviews   ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Reviews <?php if ($pendingCount > 0): ?>
                <span class="badge badge-yellow"><?= $pendingCount ?> pending</span>
            <?php endif; ?></h1>
        </div>

        <div class="filter-tabs">
            <?php foreach (['pending' => 'Pending', 'approved' => 'Approved', 'rejected' => 'Rejected'] as $key => $label): ?>
                <a href="?status=<?= $key ?>" class="tab <?= $filter === $key ? 'active' : '' ?>"><?= $label ?></a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($reviews)): ?>
            <div class="empty-state">No <?= $filter ?> reviews.</div>
        <?php else: ?>
        <div class="reviews-list">
            <?php foreach ($reviews as $r): ?>
            <div class="review-card card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="avatar"><?= strtoupper(substr($r['name'], 0, 1)) ?></div>
                        <div>
                            <strong><?= htmlspecialchars($r['name']) ?></strong>
                            <small><?= htmlspecialchars($r['email']) ?></small>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="stars">
                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                <span class="<?= $i <= $r['rating'] ? 'star-filled' : 'star-empty' ?>">★</span>
                            <?php endfor; ?>
                        </div>
                        <small><?= htmlspecialchars($r['product_slug']) ?> &bull; <?= date('M d, Y', strtotime($r['created_at'])) ?></small>
                    </div>
                </div>

                <p class="review-text"><?= htmlspecialchars($r['review_text']) ?></p>

                <?php if ($r['status'] === 'pending'): ?>
                <div class="review-actions">
                    <form method="POST" action="action-review.php" style="display:inline">
                        <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
                        <input type="hidden" name="action" value="approved">
                        <button type="submit" class="btn btn-success btn-sm">✅ Approve</button>
                    </form>
                    <form method="POST" action="action-review.php" style="display:inline">
                        <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
                        <input type="hidden" name="action" value="rejected">
                        <button type="submit" class="btn btn-danger btn-sm">❌ Reject</button>
                    </form>
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

    </div><!-- /.main-content -->
</body>
</html>
