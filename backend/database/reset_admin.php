<?php
require_once __DIR__ . '/../config/database.php';

$email    = 'admin@obeliskrx.com';
$password = 'ObeliskAdmin2024!';
$hash     = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$db = getDB();

// Delete existing and re-insert with fresh hash
$db->prepare("DELETE FROM admin_users WHERE email = ?")->execute([$email]);
$db->prepare("INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)")
   ->execute(['Admin', $email, $hash]);

echo "<h2 style='color:green'>✅ Admin password reset!</h2>";
echo "<p><strong>Email:</strong> $email</p>";
echo "<p><strong>Password:</strong> $password</p>";
echo "<p style='color:red'><strong>⚠️ DELETE this file from server now!</strong></p>";
