<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/password_reset.php';
requireAdmin();

$db = getDB();
ensurePasswordResetColumns($db);

$search = trim($_GET['q'] ?? '');
$where  = '';
$params = [];
if ($search !== '') {
    $where  = 'WHERE c.name LIKE ? OR c.email LIKE ?';
    $params = ["%$search%", "%$search%"];
}

$stmt = $db->prepare("
    SELECT c.id, c.name, c.email, c.email_verified_at, c.reset_sent_at, c.created_at,
           (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count,
           (SELECT MAX(cs.created_at) FROM customer_sessions cs WHERE cs.customer_id = c.id) AS last_login
    FROM customers c
    $where
    ORDER BY c.created_at DESC
    LIMIT 500
");
$stmt->execute($params);
$customers = $stmt->fetchAll();

$totalCustomers = (int)$db->query("SELECT COUNT(*) FROM customers")->fetchColumn();
$csrf = adminCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="assets/favicon.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customers - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .search-form { display: flex; gap: 8px; margin-bottom: 16px; max-width: 460px; }
        .customer-actions { display: flex; flex-direction: column; gap: 6px; min-width: 230px; }
        .customer-actions form { margin: 0; }
        .inline-pass { display: flex; gap: 6px; }
        .inline-pass .form-control { padding: 6px 10px; font-size: 12px; }
        details summary { cursor: pointer; font-size: 12px; font-weight: 600; color: var(--primary, #0B1F3A); }
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <?php
        $successMessages = [
            'reset_sent'   => '✅ Password reset link sent to the customer.',
            'password_set' => '✅ New password saved. The customer has been signed out everywhere and can sign in with the new password.',
            'verified'     => '✅ Email marked as verified. The customer can now sign in.',
            'deleted'      => '🗑 Customer deleted. Their past orders are still kept in Orders.',
        ];
        if (!empty($_GET['success']) && isset($successMessages[$_GET['success']])): ?>
        <div style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            <?= $successMessages[$_GET['success']] ?>
        </div>
        <?php endif; ?>

        <?php
        $errorMessages = [
            'short_password' => 'Password must be at least 8 characters.',
            'cooldown'       => 'A reset link was sent less than a minute ago. Please wait a moment.',
            'send_failed'    => 'The reset email could not be sent. Please check the email settings, or set a new password directly.',
            'not_found'      => 'Customer not found.',
            'csrf'           => 'Your session expired. Please try again.',
        ];
        if (!empty($_GET['error'])): ?>
        <div style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            <?= htmlspecialchars($errorMessages[$_GET['error']] ?? 'Something went wrong. Please try again.') ?>
        </div>
        <?php endif; ?>

        <div class="page-header">
            <h1>Customers <span class="badge badge-gray"><?= $totalCustomers ?></span></h1>
        </div>

        <form method="GET" class="search-form">
            <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Search by name or email" class="form-control">
            <button type="submit" class="btn btn-primary">Search</button>
            <?php if ($search !== ''): ?><a href="customers.php" class="btn btn-outline">Clear</a><?php endif; ?>
        </form>

        <?php if (empty($customers)): ?>
            <div class="empty-state">No customers found.</div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Email Status</th>
                        <th>Orders</th>
                        <th>Last Sign-in</th>
                        <th>Joined</th>
                        <th>Account Access</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($customers as $c): ?>
                    <tr>
                        <td>
                            <strong><?= htmlspecialchars(html_entity_decode($c['name'], ENT_QUOTES, 'UTF-8')) ?></strong><br>
                            <small class="text-muted"><?= htmlspecialchars($c['email']) ?></small>
                        </td>
                        <td>
                            <?php if ($c['email_verified_at']): ?>
                                <span class="badge badge-green">Verified</span>
                            <?php else: ?>
                                <span class="badge badge-yellow">Not verified</span>
                            <?php endif; ?>
                            <?php if ($c['reset_sent_at']): ?>
                                <br><small class="text-muted">Reset link sent <?= date('M d, g:i A', strtotime($c['reset_sent_at'])) ?></small>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ((int)$c['order_count'] > 0): ?>
                                <a href="orders.php?customer=<?= (int)$c['id'] ?>"><?= (int)$c['order_count'] ?></a>
                            <?php else: ?>0<?php endif; ?>
                        </td>
                        <td><?= $c['last_login'] ? date('M d, Y', strtotime($c['last_login'])) : '<span class="text-muted">Never</span>' ?></td>
                        <td><?= date('M d, Y', strtotime($c['created_at'])) ?></td>
                        <td>
                            <div class="customer-actions">
                                <form method="POST" action="action-customer.php">
                                    <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                                    <input type="hidden" name="customer_id" value="<?= (int)$c['id'] ?>">
                                    <input type="hidden" name="action" value="send_reset">
                                    <button type="submit" class="btn btn-sm btn-outline"
                                        onclick="return confirm('Send a password reset link to <?= htmlspecialchars($c['email'], ENT_QUOTES) ?>?')">
                                        ✉️ Send reset link
                                    </button>
                                </form>
                                <?php if (!$c['email_verified_at']): ?>
                                <form method="POST" action="action-customer.php">
                                    <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                                    <input type="hidden" name="customer_id" value="<?= (int)$c['id'] ?>">
                                    <input type="hidden" name="action" value="verify">
                                    <button type="submit" class="btn btn-sm btn-outline"
                                        onclick="return confirm('Mark this email as verified so the customer can sign in?')">
                                        ✅ Mark email verified
                                    </button>
                                </form>
                                <?php endif; ?>
                                <details>
                                    <summary>🔑 Set new password</summary>
                                    <form method="POST" action="action-customer.php" class="inline-pass" style="margin-top:6px;">
                                        <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                                        <input type="hidden" name="customer_id" value="<?= (int)$c['id'] ?>">
                                        <input type="hidden" name="action" value="set_password">
                                        <input type="text" name="new_password" minlength="8" required autocomplete="off"
                                            placeholder="Min. 8 characters" class="form-control">
                                        <button type="submit" class="btn btn-sm btn-primary"
                                            onclick="return confirm('Set this as the new password? The customer will be signed out everywhere.')">Save</button>
                                    </form>
                                </details>
                                <form method="POST" action="action-customer.php">
                                    <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                                    <input type="hidden" name="customer_id" value="<?= (int)$c['id'] ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <button type="submit" class="btn btn-sm btn-danger"
                                        onclick="return confirm('Delete the account <?= htmlspecialchars($c['email'], ENT_QUOTES) ?> permanently?<?= (int)$c['order_count'] > 0 ? '\n\nTheir ' . (int)$c['order_count'] . ' order(s) will be kept in Orders.' : '' ?>\n\nThis cannot be undone.')">
                                        🗑 Delete customer
                                    </button>
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
