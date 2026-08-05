<?php
// ── Admin User Create Script ─────────────────────────
// STEP 1: Browser mein kholو: yourdomain.com/seed_admin.php
// STEP 2: Admin create hone ka message dekho
// STEP 3: Yeh file DELETE karo server se (security!)

require_once __DIR__ . '/../config/database.php';

$name     = 'Admin';
$email    = 'admin@obeliskrx.com';   // Change karo
$password = 'ObeliskAdmin2024!';      // Change karo   strong password daalo

$db   = getDB();
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Check if already exists
$check = $db->prepare("SELECT id FROM admin_users WHERE email = ?");
$check->execute([$email]);

if ($check->fetch()) {
    echo "<p style='color:orange'>Admin already exists with email: $email</p>";
} else {
    $stmt = $db->prepare("INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hash]);
    echo "<p style='color:green'>✅ Admin created!</p>";
    echo "<p>Email: <strong>$email</strong></p>";
    echo "<p>Password: <strong>$password</strong></p>";
    echo "<p style='color:red'><strong>⚠️ DELETE this file immediately from server!</strong></p>";
}
