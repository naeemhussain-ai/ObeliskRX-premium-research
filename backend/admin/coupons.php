<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db      = getDB();
$coupons = $db->query("SELECT * FROM coupons ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coupons - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .coupon-form { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
        .coupon-form .form-group { margin: 0; }
        .coupon-code-tag { font-family: monospace; font-size: 15px; font-weight: 700; letter-spacing: 1px; background: var(--surface); border: 1px solid var(--border); padding: 4px 10px; border-radius: 6px; }
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <?php
        $successMessages = [
            'generated' => '✅ Coupon generated.',
            'deleted'   => '🗑 Coupon deleted.',
        ];
        if (!empty($_GET['success']) && isset($successMessages[$_GET['success']])): ?>
        <div style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            <?= $successMessages[$_GET['success']] ?>
        </div>
        <?php endif; ?>

        <?php if (!empty($_GET['error'])): ?>
        <div style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            Could not generate coupon. Please enter a valid discount percentage (1-100) and number of uses (1 or more).
        </div>
        <?php endif; ?>

        <div class="page-header">
            <h1>Coupons</h1>
        </div>

        <!-- Generate Coupon -->
        <div class="card">
            <h2>Generate New Coupon</h2>
            <form method="POST" action="action-coupon.php" class="coupon-form">
                <input type="hidden" name="action" value="generate">
                <div class="form-group">
                    <label>Discount Percentage <span class="required">*</span></label>
                    <input type="number" name="discount_percent" min="1" max="100" step="1"
                        placeholder="e.g. 15" class="form-control" required style="width:140px;">
                </div>
                <div class="form-group">
                    <label>Number of Uses <span class="required">*</span></label>
                    <input type="number" name="max_uses" min="1" step="1"
                        placeholder="e.g. 5" class="form-control" required style="width:140px;">
                </div>
                <button type="submit" class="btn btn-primary">🎟 Generate Coupon</button>
            </form>
        </div>

        <!-- Coupons List -->
        <div class="card mt-4">
            <h2>All Coupons</h2>
            <?php if (empty($coupons)): ?>
                <div class="empty-state">No coupons generated yet.</div>
            <?php else: ?>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Uses</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($coupons as $c): $exhausted = (int)$c['used_count'] >= (int)$c['max_uses']; ?>
                    <tr>
                        <td><span class="coupon-code-tag"><?= htmlspecialchars($c['code']) ?></span></td>
                        <td><strong><?= rtrim(rtrim(number_format($c['discount_percent'], 2), '0'), '.') ?>%</strong></td>
                        <td><?= (int)$c['used_count'] ?> / <?= (int)$c['max_uses'] ?></td>
                        <td>
                            <?php if ($exhausted): ?>
                                <span class="badge badge-red">Expired</span>
                            <?php else: ?>
                                <span class="badge badge-green">Active</span>
                            <?php endif; ?>
                        </td>
                        <td><?= date('M d, Y H:i', strtotime($c['created_at'])) ?></td>
                        <td>
                            <form method="POST" action="action-coupon.php" style="display:inline;margin:0;"
                                  onsubmit="return confirm('Delete coupon <?= htmlspecialchars($c['code']) ?>? It will no longer work at checkout.')">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="coupon_id" value="<?= $c['id'] ?>">
                                <button type="submit" class="btn btn-sm btn-danger">🗑 Delete</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </div>

    </div><!-- /.main-content -->
</body>
</html>
