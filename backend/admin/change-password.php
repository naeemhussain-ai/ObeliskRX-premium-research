<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$db      = getDB();
$error   = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current = (string)($_POST['current_password'] ?? '');
    $new     = (string)($_POST['new_password'] ?? '');
    $confirm = (string)($_POST['confirm_password'] ?? '');

    $stmt = $db->prepare("SELECT * FROM admin_users WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $admin = $stmt->fetch();

    if (!adminCsrfValid()) {
        $error = 'Your session expired. Please try again.';
    } elseif (!$admin || !password_verify($current, $admin['password_hash'])) {
        $error = 'Your current password is incorrect.';
    } elseif (strlen($new) < 10) {
        $error = 'The new password must be at least 10 characters.';
    } elseif ($new !== $confirm) {
        $error = 'The new passwords do not match.';
    } elseif ($new === $current) {
        $error = 'The new password must be different from the current one.';
    } else {
        $db->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?")
           ->execute([password_hash($new, PASSWORD_BCRYPT, ['cost' => 12]), $admin['id']]);
        session_regenerate_id(true);
        $success = true;
    }
}

$csrf = adminCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="assets/favicon.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Change Password</h1>
        </div>

        <?php if ($success): ?>
        <div style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;">
            ✅ Your password has been changed. Use the new password next time you sign in.
        </div>
        <?php endif; ?>

        <?php if ($error): ?>
        <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <div class="card" style="max-width:460px;">
            <form method="POST" autocomplete="off">
                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                <div class="form-group">
                    <label>Current Password <span class="required">*</span></label>
                    <input type="password" name="current_password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>New Password <span class="required">*</span></label>
                    <input type="password" name="new_password" class="form-control" minlength="10" required placeholder="At least 10 characters">
                </div>
                <div class="form-group">
                    <label>Confirm New Password <span class="required">*</span></label>
                    <input type="password" name="confirm_password" class="form-control" minlength="10" required>
                </div>
                <button type="submit" class="btn btn-primary">Change Password</button>
            </form>
        </div>

    </div><!-- /.main-content -->
</body>
</html>
