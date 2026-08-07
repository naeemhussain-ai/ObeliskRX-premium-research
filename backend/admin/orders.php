<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db     = getDB();
$filter = $_GET['status'] ?? 'all';
$where  = $filter !== 'all' ? "WHERE status = " . $db->quote($filter) : '';

$orders = $db->query("SELECT * FROM orders $where ORDER BY created_at DESC")->fetchAll();

// New orders count for badge
$pendingCount = (int)$db->query("SELECT COUNT(*) FROM orders WHERE status = 'approved'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders — ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Orders <?php if ($pendingCount > 0): ?>
                <span class="badge badge-yellow"><?= $pendingCount ?> new</span>
            <?php endif; ?></h1>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <?php
            $tabs = ['all' => 'All', 'approved' => 'New Orders', 'shipped' => 'Shipped', 'delivered' => 'Delivered', 'rejected' => 'Cancelled'];
            foreach ($tabs as $key => $label):
            ?>
                <a href="?status=<?= $key ?>" class="tab <?= $filter === $key ? 'active' : '' ?>">
                    <?= $label ?>
                </a>
            <?php endforeach; ?>
        </div>

        <!-- Orders Table -->
        <?php if (empty($orders)): ?>
            <div class="empty-state">No orders found.</div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($orders as $order):
                        $items = json_decode($order['items'], true);
                        $statusClass = [
                            'pending'   => 'badge-yellow',
                            'approved'  => 'badge-green',
                            'rejected'  => 'badge-red',
                            'shipped'   => 'badge-blue',
                            'delivered' => 'badge-gray',
                        ][$order['status']] ?? 'badge-gray';
                    ?>
                    <tr>
                        <td><strong><?= htmlspecialchars($order['order_number']) ?></strong></td>
                        <td>
                            <?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?><br>
                            <small class="text-muted"><?= htmlspecialchars($order['email']) ?></small><br>
                            <?php if (!empty($order['customer_id'])): ?>
                                <span class="badge badge-blue" style="font-size:10px">Registered</span>
                            <?php else: ?>
                                <span class="badge badge-gray" style="font-size:10px">Guest</span>
                            <?php endif; ?>
                        </td>
                        <td><?= count($items) ?> item(s)</td>
                        <td><strong>$<?= number_format($order['total'], 2) ?></strong></td>
                        <td><?= htmlspecialchars(ucfirst($order['payment_method'] ?? '—')) ?></td>
                        <td><span class="badge <?= $statusClass ?>"><?= ucfirst($order['status']) ?></span></td>
                        <td><?= date('M d, Y', strtotime($order['created_at'])) ?></td>
                        <td>
                            <a href="order-detail.php?id=<?= $order['id'] ?>" class="btn btn-sm btn-outline">View</a>
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
