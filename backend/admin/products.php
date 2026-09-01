<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
requireAdmin();

$db = getDB();

$products = $db->query("SELECT * FROM products ORDER BY id ASC")->fetchAll();

// Stats
$totalCount    = count($products);
$activeCount   = 0;
$inactiveCount = 0;
foreach ($products as $p) {
    if ($p['is_active']) $activeCount++;
    else $inactiveCount++;
}

// Flash messages
$successMsg = '';
$errorMsg   = '';
if (!empty($_GET['success'])) {
    $map = [
        'added'   => 'Product added successfully.',
        'updated' => 'Product updated successfully.',
        'deleted' => 'Product deleted successfully.',
        'toggled' => 'Product status updated.',
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
    <title>Products - ObeliskRX Admin</title>
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
            <h1>Products <span class="badge badge-gray"><?= $totalCount ?></span></h1>
            <a href="product-add.php" class="btn btn-primary">+ Add Product</a>
        </div>

        <!-- Stats Row -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px;">
            <div class="card" style="padding:16px 20px;">
                <div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Total Products</div>
                <div style="font-size:28px;font-weight:700;color:var(--text);"><?= $totalCount ?></div>
            </div>
            <div class="card" style="padding:16px 20px;">
                <div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Active</div>
                <div style="font-size:28px;font-weight:700;color:var(--success);"><?= $activeCount ?></div>
            </div>
            <div class="card" style="padding:16px 20px;">
                <div style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Inactive</div>
                <div style="font-size:28px;font-weight:700;color:var(--danger);"><?= $inactiveCount ?></div>
            </div>
        </div>

        <!-- Products Table -->
        <?php if (empty($products)): ?>
            <div class="empty-state">
                <p style="font-size:16px;margin-bottom:8px;">No products yet.</p>
                <a href="product-add.php" class="btn btn-primary" style="margin-top:12px;">Add Your First Product</a>
            </div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name / Slug</th>
                        <th>Series</th>
                        <th>Price</th>
                        <th>Sizes</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p):
                        $sizes = json_decode($p['sizes'], true) ?: [];
                    ?>
                    <tr>
                        <!-- Thumbnail -->
                        <td>
                            <?php if (!empty($p['image_url'])): ?>
                                <img src="<?= IMAGES_BASE_URL . htmlspecialchars($p['image_url']) ?>"
                                     alt="<?= htmlspecialchars($p['name']) ?>"
                                     style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid var(--border);">
                            <?php else: ?>
                                <div style="width:40px;height:40px;background:#f1f5f9;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:18px;">📦</div>
                            <?php endif; ?>
                        </td>

                        <!-- Name + Slug -->
                        <td>
                            <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                            <small class="text-muted"><?= htmlspecialchars($p['slug']) ?></small>
                        </td>

                        <!-- Series -->
                        <td><?= htmlspecialchars($p['series']) ?></td>

                        <!-- Price -->
                        <td>
                            <?php if (!empty($p['old_price']) && $p['old_price'] > 0): ?>
                                <span style="text-decoration:line-through;color:var(--muted);font-size:12px;">$<?= number_format($p['old_price'], 2) ?></span><br>
                            <?php endif; ?>
                            <strong>$<?= number_format($p['price'], 2) ?></strong>
                            <?php if (!empty($p['price_max']) && $p['price_max'] > 0): ?>
                                <span class="text-muted"> – $<?= number_format($p['price_max'], 2) ?></span>
                            <?php endif; ?>
                        </td>

                        <!-- Sizes -->
                        <td>
                            <?php if (!empty($sizes)): ?>
                                <?= htmlspecialchars(implode(', ', $sizes)) ?>
                            <?php else: ?>
                                <span class="text-muted">—</span>
                            <?php endif; ?>
                        </td>

                        <!-- Status -->
                        <td>
                            <span class="badge <?= $p['is_active'] ? 'badge-green' : 'badge-red' ?>">
                                <?= $p['is_active'] ? 'Active' : 'Inactive' ?>
                            </span>
                        </td>

                        <!-- Actions -->
                        <td>
                            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                                <!-- Edit -->
                                <a href="product-edit.php?id=<?= $p['id'] ?>" class="btn btn-sm btn-outline">Edit</a>

                                <!-- Toggle Active/Inactive -->
                                <form method="POST" action="toggle-product.php" style="display:inline;margin:0;">
                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                    <input type="hidden" name="is_active" value="<?= $p['is_active'] ? 0 : 1 ?>">
                                    <button type="submit" class="btn btn-sm btn-outline">
                                        <?= $p['is_active'] ? 'Deactivate' : 'Activate' ?>
                                    </button>
                                </form>

                                <!-- Delete -->
                                <form method="POST" action="action-product.php" style="display:inline;margin:0;"
                                      onsubmit="return confirm('Delete \'<?= addslashes(htmlspecialchars($p['name'])) ?>\'? This cannot be undone.');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                    <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                                </form>
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
