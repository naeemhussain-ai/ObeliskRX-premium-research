<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/password_reset.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: customers.php');
    exit();
}

if (!adminCsrfValid()) {
    header('Location: customers.php?error=csrf');
    exit();
}

$db = getDB();
ensurePasswordResetColumns($db);

$customerId = (int)($_POST['customer_id'] ?? 0);
$action     = $_POST['action'] ?? '';

$stmt = $db->prepare("SELECT * FROM customers WHERE id = ?");
$stmt->execute([$customerId]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$customer) {
    header('Location: customers.php?error=not_found');
    exit();
}

// Customer ko reset link email karo - customer khud naya password rakhega
if ($action === 'send_reset') {
    if (passwordResetOnCooldown($customer)) {
        header('Location: customers.php?error=cooldown');
        exit();
    }
    $sent = sendPasswordResetLink($db, $customer);
    header('Location: customers.php?' . ($sent ? 'success=reset_sent' : 'error=send_failed'));
    exit();
}

// Admin khud naya password rakh de (customer ko phone/email par bata de)
if ($action === 'set_password') {
    $password = (string)($_POST['new_password'] ?? '');
    if (strlen($password) < 8) {
        header('Location: customers.php?error=short_password');
        exit();
    }
    setCustomerPassword($db, $customerId, $password);
    header('Location: customers.php?success=password_set');
    exit();
}

// Bekaar/test account delete karo. Orders delete NAHI hote (sales record) - sirf account se
// alag ho jate hain. Login sessions aur abandoned cart account ke sath khatam.
if ($action === 'delete') {
    $db->beginTransaction();
    $db->prepare("UPDATE orders SET customer_id = NULL WHERE customer_id = ?")->execute([$customerId]);
    $db->prepare("UPDATE reviews SET customer_id = NULL WHERE customer_id = ?")->execute([$customerId]);
    $db->prepare("DELETE FROM customer_sessions WHERE customer_id = ?")->execute([$customerId]);
    try {
        $db->prepare("DELETE FROM abandoned_carts WHERE customer_id = ?")->execute([$customerId]);
    } catch (\Exception $e) {} // purane DB mein ye table na ho
    $db->prepare("DELETE FROM customers WHERE id = ?")->execute([$customerId]);
    $db->commit();
    header('Location: customers.php?success=deleted');
    exit();
}

// Verification email nahi mili - admin khud verify kar de
if ($action === 'verify') {
    $db->prepare("UPDATE customers SET email_verified_at = COALESCE(email_verified_at, ?), verification_token = NULL WHERE id = ?")
       ->execute([date('Y-m-d H:i:s'), $customerId]);
    header('Location: customers.php?success=verified');
    exit();
}

header('Location: customers.php');
exit();
