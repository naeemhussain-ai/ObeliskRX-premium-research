<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: orders.php'); exit(); }

$db   = getDB();
$stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$id]);
$order = $stmt->fetch();
if (!$order) { header('Location: orders.php'); exit(); }

$items = json_decode($order['items'], true);

$statusClass = [
    'pending'   => 'badge-yellow',
    'approved'  => 'badge-green',
    'rejected'  => 'badge-red',
    'shipped'   => 'badge-blue',
    'delivered' => 'badge-gray',
][$order['status']] ?? 'badge-gray';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order <?= htmlspecialchars($order['order_number']) ?>   Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <div>
                <a href="orders.php" class="back-link">← Back to Orders</a>
                <h1><?= htmlspecialchars($order['order_number']) ?></h1>
            </div>
            <span class="badge <?= $statusClass ?>"><?= ucfirst($order['status']) ?></span>
        </div>

        <div class="detail-grid">

            <!-- Customer Info -->
            <div class="card">
                <h2>Customer</h2>
                <dl>
                    <dt>Name</dt>
                    <dd><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></dd>
                    <dt>Email</dt>
                    <dd><a href="mailto:<?= htmlspecialchars($order['email']) ?>"><?= htmlspecialchars($order['email']) ?></a></dd>
                    <dt>Phone</dt>
                    <dd><?= htmlspecialchars($order['phone'] ?: ' ') ?></dd>
                    <dt>Payment</dt>
                    <dd><?= htmlspecialchars(ucfirst($order['payment_method'] ?? ' ')) ?></dd>
                    <dt>Order Date</dt>
                    <dd><?= date('M d, Y H:i', strtotime($order['created_at'])) ?></dd>
                </dl>
            </div>

            <!-- Shipping Address -->
            <div class="card">
                <h2>Shipping Address</h2>
                <address>
                    <?= htmlspecialchars($order['address_line1']) ?><br>
                    <?php if ($order['address_line2']): ?>
                        <?= htmlspecialchars($order['address_line2']) ?><br>
                    <?php endif; ?>
                    <?= htmlspecialchars($order['city']) ?>, <?= htmlspecialchars($order['state']) ?> <?= htmlspecialchars($order['zip']) ?><br>
                    <?= htmlspecialchars($order['country']) ?>
                </address>
                <?php if ($order['special_notes']): ?>
                    <div class="notes-box">
                        <strong>Special Notes:</strong>
                        <p><?= htmlspecialchars($order['special_notes']) ?></p>
                    </div>
                <?php endif; ?>
            </div>

        </div>

        <!-- Order Items -->
        <div class="card mt-4">
            <h2>Items Ordered</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $item): ?>
                    <tr>
                        <td><?= htmlspecialchars($item['product_name']) ?></td>
                        <td><?= htmlspecialchars($item['size'] ?? ' ') ?></td>
                        <td><?= (int)$item['quantity'] ?></td>
                        <td>$<?= number_format($item['unit_price'], 2) ?></td>
                        <td>$<?= number_format($item['quantity'] * $item['unit_price'], 2) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
                        <td>$<?= number_format($order['subtotal'], 2) ?></td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-right"><strong>Shipping:</strong></td>
                        <td><?= $order['shipping_fee'] > 0 ? '$' . number_format($order['shipping_fee'], 2) : 'Free' ?></td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="4" class="text-right"><strong>Total:</strong></td>
                        <td><strong>$<?= number_format($order['total'], 2) ?></strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Actions -->
        <?php if ($order['status'] === 'approved'): ?>
        <div class="card mt-4 actions-card">
            <h2>Actions</h2>
            <div class="action-buttons">
                <form method="POST" action="action-order.php">
                    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                    <input type="hidden" name="action" value="shipped">
                    <button type="submit" class="btn btn-primary btn-lg"
                        onclick="return confirm('Mark as shipped?')">
                        📦 Mark as Shipped
                    </button>
                </form>
                <form method="POST" action="action-order.php" class="action-form">
                    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                    <input type="hidden" name="action" value="rejected">
                    <div class="form-group">
                        <label>Cancel Reason <span class="required">*</span></label>
                        <textarea name="rejection_reason" rows="2"
                            placeholder="e.g. Out of stock, customer request..."
                            class="form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-danger"
                        onclick="return confirm('Cancel this order?')">
                        ❌ Cancel Order
                    </button>
                </form>
            </div>
        </div>

        <?php elseif ($order['status'] === 'shipped'): ?>
        <div class="card mt-4 actions-card">
            <form method="POST" action="action-order.php">
                <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
                <input type="hidden" name="action" value="delivered">
                <button type="submit" class="btn btn-success"
                    onclick="return confirm('Mark as delivered?')">
                    ✅ Mark as Delivered
                </button>
            </form>
        </div>

        <?php elseif ($order['status'] === 'rejected'): ?>
        <div class="card mt-4">
            <h2>Rejection Reason</h2>
            <div class="alert alert-error"><?= htmlspecialchars($order['rejection_reason'] ?? '') ?></div>
        </div>
        <?php endif; ?>

    </div><!-- /.main-content -->
</body>
</html>
