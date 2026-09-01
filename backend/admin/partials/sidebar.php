<?php
require_once __DIR__ . '/../../helpers/auth.php';
require_once __DIR__ . '/../../config/database.php';

$db = getDB();

// ── Badge counts ─────────────────────────────────────
$pendingOrders  = (int)$db->query("SELECT COUNT(*) FROM orders  WHERE status IN ('pending','approved')")->fetchColumn();
$pendingReviews = (int)$db->query("SELECT COUNT(*) FROM reviews WHERE status = 'pending'")->fetchColumn();
$newMessages    = (int)$db->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'new'")->fetchColumn();
$totalNotifs    = $pendingOrders + $pendingReviews + $newMessages;

// ── Status breakdowns ────────────────────────────────
$orderStats = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM orders GROUP BY status")->fetchAll() as $r)
    $orderStats[$r['status']] = (int)$r['cnt'];

$reviewStats = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM reviews GROUP BY status")->fetchAll() as $r)
    $reviewStats[$r['status']] = (int)$r['cnt'];

$msgStats = [];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM contact_messages GROUP BY status")->fetchAll() as $r)
    $msgStats[$r['status']] = (int)$r['cnt'];

// ── Recent items for panel ───────────────────────────
$recentOrders   = $db->query("SELECT id, order_number, first_name, last_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 6")->fetchAll();
$recentReviews  = $db->query("SELECT name, product_slug, rating, status, created_at FROM reviews WHERE status='pending' ORDER BY created_at DESC LIMIT 5")->fetchAll();
$recentMessages = $db->query("SELECT name, subject, status, created_at FROM contact_messages WHERE status='new' ORDER BY created_at DESC LIMIT 5")->fetchAll();

$currentPage = basename($_SERVER['PHP_SELF']);
?>

<div class="sidebar">
    <div class="sidebar-header">
        <img src="assets/logo.png" alt="ObeliskRX" style="width:100%;max-width:160px;display:block;margin:0 auto 6px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
            <p style="margin:0;">Admin Panel</p>
            <button class="notif-bell" onclick="toggleNotifPanel()" title="Notifications">
                🔔
                <?php if ($totalNotifs > 0): ?>
                    <span class="notif-total-badge"><?= $totalNotifs > 99 ? '99+' : $totalNotifs ?></span>
                <?php endif; ?>
            </button>
        </div>
    </div>

    <nav class="sidebar-nav">
        <a href="orders.php" class="<?= in_array($currentPage, ['orders.php','order-detail.php','action-order.php']) ? 'active' : '' ?>">
            📦 Orders
            <?php if ($pendingOrders > 0): ?>
                <span class="nav-badge"><?= $pendingOrders ?></span>
            <?php endif; ?>
        </a>
        <a href="reviews.php" class="<?= in_array($currentPage, ['reviews.php']) ? 'active' : '' ?>">
            ⭐ Reviews
            <?php if ($pendingReviews > 0): ?>
                <span class="nav-badge"><?= $pendingReviews ?></span>
            <?php endif; ?>
        </a>
        <a href="messages.php" class="<?= in_array($currentPage, ['messages.php','message-detail.php']) ? 'active' : '' ?>">
            ✉️ Messages
            <?php if ($newMessages > 0): ?>
                <span class="nav-badge"><?= $newMessages ?></span>
            <?php endif; ?>
        </a>
        <a href="products.php" class="<?= in_array($currentPage, ['products.php','product-add.php','product-edit.php']) ? 'active' : '' ?>">
            🧪 Products
        </a>
    </nav>

    <div class="sidebar-footer">
        <span>👤 <?= htmlspecialchars(adminName()) ?></span>
        <a href="logout.php" class="logout-link">Logout</a>
    </div>
</div>

<!-- ── Notification Panel ────────────────────────── -->
<div class="notif-overlay" id="notifOverlay" onclick="toggleNotifPanel()"></div>
<div class="notif-panel" id="notifPanel">
    <div class="notif-panel-header">
        <span>🔔 Notifications</span>
        <button onclick="toggleNotifPanel()" class="notif-close">✕</button>
    </div>

    <!-- Orders Section -->
    <div class="notif-section">
        <div class="notif-section-title">
            📦 Orders
            <?php if ($pendingOrders > 0): ?>
                <span class="notif-count-badge"><?= $pendingOrders ?> need action</span>
            <?php endif; ?>
        </div>

        <!-- Status breakdown -->
        <div class="notif-status-row">
            <?php
            $orderStatusLabels = ['pending'=>['⏳','#d97706'],'approved'=>['✅','#2563eb'],'shipped'=>['🚚','#7c3aed'],'delivered'=>['📬','#16a34a'],'rejected'=>['❌','#dc2626']];
            foreach ($orderStatusLabels as $st => [$icon, $color]):
                $cnt = $orderStats[$st] ?? 0;
                if (!$cnt) continue;
            ?>
            <a href="orders.php?status=<?= $st ?>" class="notif-stat-chip" style="border-color:<?= $color ?>20;color:<?= $color ?>">
                <?= $icon ?> <?= ucfirst($st) ?> <strong><?= $cnt ?></strong>
            </a>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($recentOrders)): ?>
        <div class="notif-items">
            <?php foreach ($recentOrders as $o): ?>
            <a href="order-detail.php?id=<?= $o['id'] ?>" class="notif-item">
                <div class="notif-item-main">
                    <span class="notif-item-title"><?= htmlspecialchars($o['order_number']) ?></span>
                    <span class="notif-item-sub"><?= htmlspecialchars($o['first_name'] . ' ' . $o['last_name']) ?></span>
                </div>
                <div class="notif-item-right">
                    <span class="notif-item-amount">$<?= number_format($o['total'], 2) ?></span>
                    <span class="notif-status-dot status-<?= $o['status'] ?>"></span>
                </div>
            </a>
            <?php endforeach; ?>
            <a href="orders.php" class="notif-view-all">View all orders →</a>
        </div>
        <?php endif; ?>
    </div>

    <!-- Reviews Section -->
    <div class="notif-section">
        <div class="notif-section-title">
            ⭐ Reviews
            <?php if ($pendingReviews > 0): ?>
                <span class="notif-count-badge notif-count-yellow"><?= $pendingReviews ?> pending</span>
            <?php endif; ?>
        </div>

        <div class="notif-status-row">
            <?php
            $reviewStatusLabels = ['pending'=>['⏳','#d97706'],'approved'=>['✅','#16a34a'],'rejected'=>['❌','#dc2626']];
            foreach ($reviewStatusLabels as $st => [$icon, $color]):
                $cnt = $reviewStats[$st] ?? 0;
                if (!$cnt) continue;
            ?>
            <a href="reviews.php?status=<?= $st ?>" class="notif-stat-chip" style="border-color:<?= $color ?>20;color:<?= $color ?>">
                <?= $icon ?> <?= ucfirst($st) ?> <strong><?= $cnt ?></strong>
            </a>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($recentReviews)): ?>
        <div class="notif-items">
            <?php foreach ($recentReviews as $rv): ?>
            <a href="reviews.php?status=pending" class="notif-item">
                <div class="notif-item-main">
                    <span class="notif-item-title"><?= htmlspecialchars($rv['name']) ?></span>
                    <span class="notif-item-sub"><?= htmlspecialchars($rv['product_slug']) ?></span>
                </div>
                <div class="notif-item-right">
                    <span style="color:#f59e0b;font-size:12px;"><?= str_repeat('★', (int)$rv['rating']) ?><?= str_repeat('☆', 5 - (int)$rv['rating']) ?></span>
                </div>
            </a>
            <?php endforeach; ?>
            <a href="reviews.php?status=pending" class="notif-view-all">Review all →</a>
        </div>
        <?php elseif ($pendingReviews === 0): ?>
            <p class="notif-empty">No pending reviews</p>
        <?php endif; ?>
    </div>

    <!-- Messages Section -->
    <div class="notif-section" style="border-bottom:none;">
        <div class="notif-section-title">
            ✉️ Messages
            <?php if ($newMessages > 0): ?>
                <span class="notif-count-badge notif-count-blue"><?= $newMessages ?> new</span>
            <?php endif; ?>
        </div>

        <div class="notif-status-row">
            <?php
            $msgStatusLabels = ['new'=>['🆕','#2563eb'],'read'=>['👁️','#64748b'],'replied'=>['↩️','#16a34a']];
            foreach ($msgStatusLabels as $st => [$icon, $color]):
                $cnt = $msgStats[$st] ?? 0;
                if (!$cnt) continue;
            ?>
            <a href="messages.php?status=<?= $st ?>" class="notif-stat-chip" style="border-color:<?= $color ?>20;color:<?= $color ?>">
                <?= $icon ?> <?= ucfirst($st) ?> <strong><?= $cnt ?></strong>
            </a>
            <?php endforeach; ?>
        </div>

        <?php if (!empty($recentMessages)): ?>
        <div class="notif-items">
            <?php foreach ($recentMessages as $msg): ?>
            <a href="messages.php" class="notif-item">
                <div class="notif-item-main">
                    <span class="notif-item-title"><?= htmlspecialchars($msg['name']) ?></span>
                    <span class="notif-item-sub"><?= htmlspecialchars($msg['subject'] ?? 'No subject') ?></span>
                </div>
                <div class="notif-item-right">
                    <span style="font-size:10px;color:var(--muted);"><?= date('M d', strtotime($msg['created_at'])) ?></span>
                </div>
            </a>
            <?php endforeach; ?>
            <a href="messages.php" class="notif-view-all">View all messages →</a>
        </div>
        <?php elseif ($newMessages === 0): ?>
            <p class="notif-empty">No new messages</p>
        <?php endif; ?>
    </div>
</div>

<div class="main-content">

<script>
function toggleNotifPanel() {
    var panel   = document.getElementById('notifPanel');
    var overlay = document.getElementById('notifOverlay');
    var open    = panel.classList.toggle('open');
    overlay.classList.toggle('open', open);
}
</script>
