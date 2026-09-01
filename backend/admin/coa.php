<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
requireAdmin();

$db = getDB();

// Fetch all products with their COA status (LEFT JOIN)
$products = $db->query("
    SELECT
        p.id,
        p.slug,
        p.name,
        p.series,
        p.image_url,
        c.id          AS coa_id,
        c.purity,
        c.lot_number,
        c.tested_date
    FROM products p
    LEFT JOIN product_coa c ON c.product_slug = p.slug
    ORDER BY p.series, p.name
")->fetchAll();

// Flash messages
$successMsg = '';
$errorMsg   = '';
if (!empty($_GET['success'])) {
    $map = [
        'saved'   => 'COA saved successfully.',
        'deleted' => 'COA deleted successfully.',
    ];
    $successMsg = $map[$_GET['success']] ?? 'Done.';
}
if (!empty($_GET['error'])) {
    $errorMsg = htmlspecialchars($_GET['error']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COA Management - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <!-- Flash messages -->
        <?php if ($successMsg): ?>
            <div class="alert" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
                ✅ <?= $successMsg ?>
            </div>
        <?php endif; ?>
        <?php if ($errorMsg): ?>
            <div class="alert alert-error">⚠️ <?= $errorMsg ?></div>
        <?php endif; ?>

        <!-- Page Header -->
        <div class="page-header">
            <h1>Certificate of Analysis <span class="badge badge-gray"><?= count($products) ?></span></h1>
        </div>

        <!-- COA Table -->
        <?php if (empty($products)): ?>
            <div class="empty-state">
                <p>No products found. Add products first before managing COAs.</p>
            </div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Series</th>
                        <th>COA Status</th>
                        <th>Purity</th>
                        <th>Lot #</th>
                        <th>Test Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                    <tr>
                        <!-- Product thumbnail + name -->
                        <td>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <?php if (!empty($p['image_url'])): ?>
                                    <img src="<?= IMAGES_BASE_URL . htmlspecialchars($p['image_url']) ?>"
                                         alt="<?= htmlspecialchars($p['name']) ?>"
                                         style="width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid var(--border);flex-shrink:0;">
                                <?php else: ?>
                                    <div style="width:36px;height:36px;background:#f1f5f9;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">📦</div>
                                <?php endif; ?>
                                <div>
                                    <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                                    <small class="text-muted"><?= htmlspecialchars($p['slug']) ?></small>
                                </div>
                            </div>
                        </td>

                        <!-- Series -->
                        <td><?= htmlspecialchars($p['series']) ?></td>

                        <!-- COA Status -->
                        <td>
                            <?php if ($p['coa_id']): ?>
                                <span class="badge badge-green">Uploaded</span>
                            <?php else: ?>
                                <span class="badge badge-gray">None</span>
                            <?php endif; ?>
                        </td>

                        <!-- Purity -->
                        <td><?= $p['purity'] ? htmlspecialchars($p['purity']) : '<span class="text-muted">—</span>' ?></td>

                        <!-- Lot Number -->
                        <td><?= $p['lot_number'] ? htmlspecialchars($p['lot_number']) : '<span class="text-muted">—</span>' ?></td>

                        <!-- Test Date -->
                        <td><?= $p['tested_date'] ? htmlspecialchars($p['tested_date']) : '<span class="text-muted">—</span>' ?></td>

                        <!-- Actions -->
                        <td>
                            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                                <?php if ($p['coa_id']): ?>
                                    <!-- Edit COA -->
                                    <a href="coa-edit.php?slug=<?= urlencode($p['slug']) ?>" class="btn btn-sm btn-outline">Edit</a>
                                    <!-- Delete COA -->
                                    <form method="POST" action="action-coa.php" style="display:inline;margin:0;"
                                          onsubmit="return confirm('Delete COA for \'<?= addslashes(htmlspecialchars($p['name'])) ?>\'?');">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="product_slug" value="<?= htmlspecialchars($p['slug']) ?>">
                                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                                    </form>
                                <?php else: ?>
                                    <!-- Upload COA -->
                                    <a href="coa-edit.php?slug=<?= urlencode($p['slug']) ?>" class="btn btn-sm btn-primary">Upload COA</a>
                                <?php endif; ?>
                            </div>
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
