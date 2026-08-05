<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db       = getDB();
$products = $db->query("SELECT * FROM products ORDER BY series, name")->fetchAll();

// Group by series
$grouped = [];
foreach ($products as $p) {
    $grouped[$p['series']][] = $p;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products   ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Products <span class="badge badge-gray"><?= count($products) ?></span></h1>
        </div>

        <?php foreach ($grouped as $series => $items): ?>
        <div class="card" style="margin-bottom:16px;">
            <h2><?= htmlspecialchars($series) ?></h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Sizes</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $p):
                        $sizes = json_decode($p['sizes'], true);
                    ?>
                    <tr>
                        <td>
                            <strong><?= htmlspecialchars($p['name']) ?></strong><br>
                            <small class="text-muted"><?= htmlspecialchars($p['slug']) ?></small>
                        </td>
                        <td>
                            $<?= number_format($p['price'], 2) ?>
                            <?php if ($p['price_max']): ?>
                                  $<?= number_format($p['price_max'], 2) ?>
                            <?php endif; ?>
                        </td>
                        <td><?= implode(', ', $sizes) ?></td>
                        <td>
                            <span class="badge <?= $p['is_active'] ? 'badge-green' : 'badge-red' ?>">
                                <?= $p['is_active'] ? 'Active' : 'Inactive' ?>
                            </span>
                        </td>
                        <td>
                            <form method="POST" action="toggle-product.php" style="display:inline">
                                <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                <input type="hidden" name="is_active" value="<?= $p['is_active'] ? 0 : 1 ?>">
                                <button type="submit" class="btn btn-sm btn-outline">
                                    <?= $p['is_active'] ? 'Deactivate' : 'Activate' ?>
                                </button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endforeach; ?>

    </div><!-- /.main-content -->
</body>
</html>
