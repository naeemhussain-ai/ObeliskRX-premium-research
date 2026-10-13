<?php
// Customer password reset helpers (forgot-password API + admin "Send reset link")
//
// DB mein sirf token ka sha256 hash save hota hai - agar DB leak bhi ho jaye to
// usse koi password reset nahi kar sakta. Link 1 ghante ke liye valid hai.

require_once __DIR__ . '/customer_auth.php';

const PASSWORD_RESET_MINUTES  = 60;
const PASSWORD_RESET_COOLDOWN = 60; // seconds - ek email par itni der mein dobara link nahi

// customers table mein reset columns na hon to khud bana do (migration_password_reset.sql ka kaam)
function ensurePasswordResetColumns(PDO $db): void {
    static $done = false;
    if ($done) return;
    $cols = [
        'reset_token'      => 'VARCHAR(64) NULL DEFAULT NULL',
        'reset_sent_at'    => 'DATETIME NULL DEFAULT NULL',
    ];
    foreach ($cols as $col => $def) {
        if (!$db->query("SHOW COLUMNS FROM customers LIKE '$col'")->fetch()) {
            $db->exec("ALTER TABLE customers ADD COLUMN $col $def");
        }
    }
    $done = true;
}

function hashResetToken(string $token): string {
    return hash('sha256', $token);
}

// Link abhi abhi bheja gaya tha? (spam/abuse se bachao)
function passwordResetOnCooldown(array $customer): bool {
    return !empty($customer['reset_sent_at'])
        && strtotime($customer['reset_sent_at']) > time() - PASSWORD_RESET_COOLDOWN;
}

// Naya token banao, save karo aur customer ko reset email bhejo
function sendPasswordResetLink(PDO $db, array $customer): bool {
    require_once __DIR__ . '/email.php';
    ensurePasswordResetColumns($db);

    $token = generateToken();
    // PHP ka time use karo (MySQL NOW() nahi) - expiry check bhi PHP time se hota hai
    $db->prepare("UPDATE customers SET reset_token = ?, reset_sent_at = ? WHERE id = ?")
       ->execute([hashResetToken($token), date('Y-m-d H:i:s'), $customer['id']]);

    $sent = sendPasswordResetEmail($customer['email'], html_entity_decode($customer['name'], ENT_QUOTES, 'UTF-8'), $token);
    if (!$sent) {
        // Email gayi hi nahi - "link bheja" record mat rakho, warna 1 minute ka cooldown
        // dobara koshish rok deta hai aur admin ko ghalat "Reset link sent" dikhta hai
        $db->prepare("UPDATE customers SET reset_token = NULL, reset_sent_at = NULL WHERE id = ?")
           ->execute([$customer['id']]);
    }
    return $sent;
}

// Token valid ho to customer row do, warna null
function findCustomerByResetToken(PDO $db, string $token): ?array {
    ensurePasswordResetColumns($db);
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) return null;

    $stmt = $db->prepare("SELECT * FROM customers WHERE reset_token = ? LIMIT 1");
    $stmt->execute([hashResetToken($token)]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$customer) return null;

    if (empty($customer['reset_sent_at'])
        || strtotime($customer['reset_sent_at']) < time() - PASSWORD_RESET_MINUTES * 60) {
        return null;
    }
    return $customer;
}

// Naya password save karo, token khatam karo aur saare purane logins band karo.
// Reset link email par aata hai, is liye email bhi verified maan lo.
function setCustomerPassword(PDO $db, int $customerId, string $password): void {
    ensurePasswordResetColumns($db);
    $db->prepare("
        UPDATE customers
        SET password_hash = ?, reset_token = NULL, reset_sent_at = NULL,
            email_verified_at = COALESCE(email_verified_at, ?), verification_token = NULL
        WHERE id = ?
    ")->execute([password_hash($password, PASSWORD_DEFAULT), date('Y-m-d H:i:s'), $customerId]);

    $db->prepare("DELETE FROM customer_sessions WHERE customer_id = ?")->execute([$customerId]);
}
