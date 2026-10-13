<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();
$csrf = adminCsrfToken();

$db     = getDB();
$filter = $_GET['status'] ?? 'all';
$where  = $filter !== 'all' ? "WHERE status = " . $db->quote($filter) : '';

// Customers page se ek customer ke orders dekhne ke liye (?customer=ID)
$customerFilter = (int)($_GET['customer'] ?? 0);
$customerEmail  = '';
if ($customerFilter > 0) {
    $where .= ($where ? ' AND ' : 'WHERE ') . 'customer_id = ' . $customerFilter;
    $ce = $db->prepare("SELECT email FROM customers WHERE id = ?");
    $ce->execute([$customerFilter]);
    $customerEmail = (string)$ce->fetchColumn();
}

$orders = $db->query("SELECT * FROM orders $where ORDER BY created_at DESC")->fetchAll();

// Count per status
$statusCounts = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status")->fetchAll() as $r)
    $statusCounts[$r['status']] = (int)$r['cnt'];
$totalOrders  = array_sum($statusCounts);
$pendingCount = $statusCounts['pending'] ?? 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="assets/favicon.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Orders <?php if ($pendingCount > 0): ?>
                <span class="badge badge-yellow"><?= $pendingCount ?> new</span>
            <?php endif; ?></h1>
        </div>

        <?php if (($_GET['success'] ?? '') === 'deleted'): ?>
        <div style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            🗑 Order deleted.
        </div>
        <?php elseif (!empty($_GET['error'])): ?>
        <div style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            <?= ($_GET['error'] === 'csrf') ? 'Your session expired. Please try again.' : 'Order not found.' ?>
        </div>
        <?php endif; ?>

        <?php if ($customerFilter > 0): ?>
        <div style="background:#e0f2fe;color:#075985;border:1px solid #bae6fd;padding:10px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            Showing orders for <strong><?= htmlspecialchars($customerEmail ?: 'customer #' . $customerFilter) ?></strong>
            &nbsp;·&nbsp; <a href="orders.php">Show all orders</a>
        </div>
        <?php endif; ?>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <?php
            $tabs = [
                'all'       => ['All',               $totalOrders],
                'pending'   => ['Awaiting Payment',   $statusCounts['pending']   ?? 0],
                'approved'  => ['Payment Confirmed',  $statusCounts['approved']  ?? 0],
                'shipped'   => ['Shipped',            $statusCounts['shipped']   ?? 0],
                'delivered' => ['Delivered',          $statusCounts['delivered'] ?? 0],
                'rejected'  => ['Cancelled',          $statusCounts['rejected']  ?? 0],
            ];
            foreach ($tabs as $key => [$label, $count]):
            ?>
                <a href="?status=<?= $key ?><?= $customerFilter ? '&customer=' . $customerFilter : '' ?>" class="tab <?= $filter === $key ? 'active' : '' ?>">
                    <?= $label ?>
                    <?php if ($count > 0): ?>
                        <span class="tab-count"><?= $count ?></span>
                    <?php endif; ?>
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
                        <td>
                            <?= htmlspecialchars(ucfirst($order['payment_method'] ?? '-')) ?><br>
                            <?php if (!empty($order['payment_proof_file'])): ?>
                                <span class="badge badge-green" style="font-size:10px">Proof uploaded</span>
                            <?php else: ?>
                                <span class="badge badge-yellow" style="font-size:10px">No proof yet</span>
                            <?php endif; ?>
                        </td>
                        <td><span class="badge <?= $statusClass ?>"><?= ucfirst($order['status']) ?></span></td>
                        <td><?= date('M d, Y', strtotime($order['created_at'])) ?></td>
                        <td>
                            <a href="order-detail.php?id=<?= $order['id'] ?>" class="btn btn-sm btn-outline">View</a>
                            <form method="POST" action="delete-order.php" style="display:inline;margin:0;">
                                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                                <input type="hidden" name="order_id" value="<?= (int)$order['id'] ?>">
                                <input type="hidden" name="return_status" value="<?= htmlspecialchars($filter) ?>">
                                <button type="submit" class="btn btn-sm btn-danger"
                                    onclick="return confirm('Delete order <?= htmlspecialchars($order['order_number'], ENT_QUOTES) ?> permanently? This cannot be undone.')">Delete</button>
                            </form>
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
