<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db     = getDB();
$filter = $_GET['status'] ?? 'pending';
$where  = ($filter !== 'all') ? "WHERE r.status = " . $db->quote($filter) : '';

// Count per status
$statusCounts = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM reviews GROUP BY status")->fetchAll() as $r)
    $statusCounts[$r['status']] = (int)$r['cnt'];
$totalReviews = array_sum($statusCounts);

// Fetch reviews
$reviews = $db->query("
    SELECT r.*,
           (SELECT COUNT(*) FROM orders o WHERE o.email = r.email) AS order_count
    FROM reviews r
    $where
    ORDER BY r.created_at DESC
")->fetchAll();

// Check if customer_id column exists (might not on production)
$hasCustomerCol = false;
try {
    $db->query("SELECT customer_id FROM reviews LIMIT 1");
    $hasCustomerCol = true;
} catch (Exception $e) {}

// Attach customer info via email lookup
if ($hasCustomerCol) {
    foreach ($reviews as &$r) {
        if (!empty($r['customer_id'])) {
            $c = $db->prepare("SELECT id FROM customers WHERE id = ?");
            $c->execute([$r['customer_id']]);
            $r['cust_id'] = $c->fetchColumn() ?: null;
        } else {
            $r['cust_id'] = null;
        }
    }
    unset($r);
} else {
    foreach ($reviews as &$r) {
        $r['cust_id'] = null;
    }
    unset($r);
}

$pendingCount = (int)$db->query("SELECT COUNT(*) FROM reviews WHERE status = 'pending'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reviews - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .review-card { margin-bottom: 16px; }
        .review-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .reviewer-info { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
        .reviewer-info strong { display: block; font-size: 14px; }
        .reviewer-info small { color: var(--muted); font-size: 12px; }
        .review-meta { text-align: right; }
        .stars .star-filled { color: #f59e0b; }
        .stars .star-empty  { color: #d1d5db; }
        .review-text { margin: 12px 0 0; font-size: 14px; line-height: 1.6; color: var(--text); }
        .review-actions { margin-top: 12px; display: flex; gap: 8px; }
        .customer-info { margin-top: 10px; padding: 10px 12px; background: var(--surface); border-radius: 8px; border: 1px solid var(--border); font-size: 12px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .customer-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
        .badge-verified { background: #d1fae5; color: #065f46; }
        .badge-registered { background: #dbeafe; color: #1e40af; }
        .badge-guest { background: #f3f4f6; color: #6b7280; }
        .order-count { font-weight: 700; color: var(--primary); }
        .product-slug-tag { font-family: monospace; background: var(--surface); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 11px; }
        .reviews-list { display: flex; flex-direction: column; gap: 0; }
        .admin-reply-box { margin-top: 12px; padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 13px; }
        .admin-reply-box .reply-label { font-size: 11px; font-weight: 700; color: #1d4ed8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; }
        .admin-reply-box p { margin: 0; color: #1e3a8a; line-height: 1.5; }
        .reply-form { margin-top: 12px; }
        .reply-form textarea { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; resize: vertical; min-height: 70px; font-family: inherit; background: var(--bg); color: var(--text); box-sizing: border-box; }
        .reply-form textarea:focus { outline: none; border-color: var(--primary); }
        .reply-toggle { background: none; border: 1px solid #3b82f6; color: #3b82f6; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .reply-toggle:hover { background: #eff6ff; }
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <?php
        $successMessages = [
            'approved'     => '✅ Review approved.',
            'rejected'     => '❌ Review rejected.',
            'replied'      => '💬 Reply sent successfully.',
            'reply_deleted'=> 'Reply deleted.',
            'deleted'      => '🗑 Review deleted permanently.',
        ];
        if (!empty($_GET['success']) && isset($successMessages[$_GET['success']])): ?>
        <div style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            <?= $successMessages[$_GET['success']] ?>
        </div>
        <?php endif; ?>

        <div class="page-header">
            <h1>Reviews <?php if ($pendingCount > 0): ?>
                <span class="badge badge-yellow"><?= $pendingCount ?> pending</span>
            <?php endif; ?></h1>
        </div>

        <div class="filter-tabs">
            <?php
            $tabs = [
                'pending'  => ['Pending',  $statusCounts['pending']  ?? 0],
                'approved' => ['Approved', $statusCounts['approved'] ?? 0],
                'rejected' => ['Rejected', $statusCounts['rejected'] ?? 0],
                'all'      => ['All',      $totalReviews],
            ];
            foreach ($tabs as $key => [$label, $count]):
                $isActive = ($filter === $key) || ($key === 'all' && $filter === 'all');
            ?>
                <a href="reviews.php?status=<?= $key !== 'all' ? $key : 'all' ?>"
                   class="tab <?= $filter === $key ? 'active' : '' ?>">
                    <?= $label ?>
                    <?php if ($count > 0): ?>
                        <span class="tab-count <?= $key === 'pending' ? 'tab-count-warn' : '' ?>"><?= $count ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($reviews)): ?>
            <div class="empty-state">No <?= htmlspecialchars($filter) ?> reviews.</div>
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
                        <small>
                            <span class="product-slug-tag"><?= htmlspecialchars($r['product_slug']) ?></span>
                            &bull; <?= date('M d, Y · h:i A', strtotime($r['created_at'])) ?>
                        </small>
                    </div>
                </div>

                <p class="review-text">"<?= htmlspecialchars($r['review_text']) ?>"</p>

                <!-- Customer context for admin -->
                <div class="customer-info">
                    <?php if ($r['cust_id']): ?>
                        <span class="customer-badge badge-registered">🔵 Registered Customer</span>
                    <?php else: ?>
                        <span class="customer-badge badge-guest">👤 Guest</span>
                    <?php endif; ?>

                    <?php if ($r['order_count'] > 0): ?>
                        <span>
                            🛍️ <span class="order-count"><?= (int)$r['order_count'] ?></span>
                            total order<?= $r['order_count'] > 1 ? 's' : '' ?>
                        </span>
                        <a href="orders.php?search=<?= urlencode($r['email']) ?>" style="font-size:11px;color:var(--primary);">
                            View orders →
                        </a>
                    <?php else: ?>
                        <span style="color:var(--muted);">No orders on record</span>
                    <?php endif; ?>
                </div>

                <!-- Admin Reply -->
                <?php if (!empty($r['admin_reply'])): ?>
                <div class="admin-reply-box">
                    <div class="reply-label">💬 Your Reply</div>
                    <p><?= htmlspecialchars($r['admin_reply']) ?></p>
                    <div style="margin-top:8px;display:flex;align-items:center;gap:12px;">
                        <small style="color:var(--muted);">Replied: <?= date('M d, Y', strtotime($r['admin_reply_at'])) ?></small>
                        <form method="POST" action="action-review.php" style="display:inline;margin:0;">
                            <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
                            <input type="hidden" name="action" value="delete_reply">
                            <button type="submit" class="btn btn-sm btn-danger" style="padding:2px 10px;font-size:11px;" onclick="return confirm('Delete this reply?')">Delete Reply</button>
                        </form>
                    </div>
                </div>
                <?php else: ?>
                <div class="reply-form" id="reply-wrap-<?= $r['id'] ?>" style="display:none;">
                    <form method="POST" action="action-review.php">
                        <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
                        <input type="hidden" name="action" value="reply">
                        <textarea name="reply_text" placeholder="Write your reply to this review..." required></textarea>
                        <div style="margin-top:6px;display:flex;gap:8px;">
                            <button type="submit" class="btn btn-primary btn-sm">Send Reply</button>
                            <button type="button" class="btn btn-sm btn-outline" onclick="document.getElementById('reply-wrap-<?= $r['id'] ?>').style.display='none';">Cancel</button>
                        </div>
                    </form>
                </div>
                <?php endif; ?>

                <div class="review-actions" style="margin-top:10px;">
                    <?php if ($r['status'] === 'pending'): ?>
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
                    <?php endif; ?>
                    <?php if (empty($r['admin_reply'])): ?>
                    <button type="button" class="reply-toggle"
                        onclick="var w=document.getElementById('reply-wrap-<?= $r['id'] ?>');w.style.display=w.style.display==='none'?'block':'none';">
                        💬 Reply
                    </button>
                    <?php endif; ?>
                    <form method="POST" action="action-review.php" style="display:inline;margin:0;"
                          onsubmit="return confirm('Delete this review permanently?')">
                        <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
                        <input type="hidden" name="action" value="delete">
                        <button type="submit" class="btn btn-sm btn-danger">🗑 Delete</button>
                    </form>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

    </div><!-- /.main-content -->
</body>
</html>
