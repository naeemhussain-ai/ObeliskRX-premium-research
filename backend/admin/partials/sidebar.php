<?php require_once __DIR__ . '/../../helpers/auth.php'; ?>
<div class="sidebar">
    <div class="sidebar-header">
        <img src="assets/logo.png" alt="ObeliskRX" style="width:100%;max-width:180px;display:block;margin:0 auto 8px;">
        <p>Admin Panel</p>
    </div>
    <nav class="sidebar-nav">
        <a href="orders.php"   class="<?= basename($_SERVER['PHP_SELF']) === 'orders.php'   ? 'active' : '' ?>">
            📦 Orders
        </a>
        <a href="reviews.php"  class="<?= basename($_SERVER['PHP_SELF']) === 'reviews.php'  ? 'active' : '' ?>">
            ⭐ Reviews
        </a>
        <a href="messages.php" class="<?= basename($_SERVER['PHP_SELF']) === 'messages.php' ? 'active' : '' ?>">
            ✉️ Messages
        </a>
    </nav>
    <div class="sidebar-footer">
        <span>👤 <?= htmlspecialchars(adminName()) ?></span>
        <a href="logout.php" class="logout-link">Logout</a>
    </div>
</div>
<div class="main-content">
