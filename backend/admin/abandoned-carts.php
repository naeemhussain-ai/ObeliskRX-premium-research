<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../helpers/abandoned_cart.php';
requireAdmin();

$db = getDB();
ensureAbandonedCartsTable($db);

$minutes = max(1, (int)CART_REMINDER_MINUTES);
$second  = max(1, (int)CART_SECOND_REMINDER_MINUTES);
$maxRem  = CART_MAX_REMINDERS;
$filter  = $_GET['status'] ?? 'all';
$allowed = ['all', 'active', 'reminded', 'ordered', 'recovered', 'empty'];
if (!in_array($filter, $allowed, true)) $filter = 'all';

$where = [
    'all'       => "ac.status <> 'empty'",
    'active'    => "ac.status = 'active'",
    'reminded'  => "ac.status = 'reminded'",
    'ordered'   => "ac.status = 'ordered'",
    'recovered' => "ac.status = 'ordered' AND ac.reminder_sent_at IS NOT NULL",
    'empty'     => "ac.status = 'empty'",
][$filter];

$carts = $db->query("
    SELECT ac.*, c.email_verified_at,
           IF(ac.reminder_count = 0,
              ac.updated_at + INTERVAL $minutes MINUTE,
              GREATEST(ac.reminder_sent_at + INTERVAL $second MINUTE, ac.updated_at + INTERVAL $minutes MINUTE)) AS due_at,
           (ac.updated_at < NOW() - INTERVAL 48 HOUR) AS too_old,
           (SELECT el.status    FROM email_logs el WHERE el.type = 'abandoned_cart' AND el.sent_to = ac.email ORDER BY el.id DESC LIMIT 1) AS last_email_status,
           (SELECT el.error_msg FROM email_logs el WHERE el.type = 'abandoned_cart' AND el.sent_to = ac.email ORDER BY el.id DESC LIMIT 1) AS last_email_error
    FROM abandoned_carts ac
    JOIN customers c ON c.id = ac.customer_id
    WHERE $where
    ORDER BY ac.updated_at DESC
    LIMIT 200
")->fetchAll();

// Count per status
$counts = ['active' => 0, 'reminded' => 0, 'ordered' => 0, 'empty' => 0];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM abandoned_carts GROUP BY status")->fetchAll() as $r)
    $counts[$r['status']] = (int)$r['cnt'];
$recovered = (int)$db->query("SELECT COUNT(*) FROM abandoned_carts WHERE status = 'ordered' AND reminder_sent_at IS NOT NULL")->fetchColumn();

$emailStats = ['sent' => 0, 'failed' => 0];
foreach ($db->query("SELECT status, COUNT(*) AS cnt FROM email_logs WHERE type = 'abandoned_cart' GROUP BY status")->fetchAll() as $r)
    $emailStats[$r['status']] = (int)$r['cnt'];

$recentEmails = $db->query("
    SELECT sent_to, subject, status, error_msg, sent_at
    FROM email_logs WHERE type = 'abandoned_cart'
    ORDER BY id DESC LIMIT 15
")->fetchAll();

// Last reminder run (cron ya "Run check now") - log file ki aakhri line
$lastRun = null;
$logFile = abandonedCartLogFile();
if (is_file($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $last  = $lines ? end($lines) : '';
    // ts = unix time (cron wali CLI PHP aur web PHP ka timezone alag ho sakta hai)
    if (preg_match('/^\[(.+?)\] (?:ts=(\d+) )?(?:source=(\w+) )?checked=(\d+) sent=(\d+) failed=(\d+)/', $last, $m)) {
        $ts = $m[2] !== '' ? (int)$m[2] : strtotime($m[1]);
        $lastRun = [
            'time'    => date('Y-m-d H:i:s', $ts),
            'source'  => $m[3] ?: 'cron',
            'checked' => (int)$m[4],
            'sent'    => (int)$m[5],
            'failed'  => (int)$m[6],
            'ago'     => max(0, (int)round((time() - $ts) / 60)),
        ];
    }
}
// Cron zyada se zyada har 30 minute chalti hai - us se zyada der ho to warning
$cronStale = !$lastRun || $lastRun['ago'] > 35;

$flash = $_GET['ran'] ?? null;

function fmtTime(?string $t): string {
    return $t ? date('M d, h:i A', strtotime($t)) : '-';
}
function fmtDelay(int $m): string {
    if ($m % 60 === 0) return ($m / 60) . ' hour' . ($m === 60 ? '' : 's');
    return $m . ' minutes';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="assets/favicon.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abandoned Carts   ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .ac-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px; }
        .ac-stat { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px 16px; }
        .ac-stat .num { font-size:24px; font-weight:700; }
        .ac-stat .lbl { font-size:12px; color:var(--muted); margin-top:2px; }
        .ac-run { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
        .ac-run p { margin:2px 0; font-size:13px; }
        .ac-items { margin:0; padding-left:16px; font-size:12px; }
        .ac-note { font-size:11px; color:var(--muted); display:block; margin-top:3px; }
        .ac-err { font-size:11px; color:#991b1b; display:block; margin-top:3px; max-width:240px; word-break:break-word; }
        .alert-success { background:#dcfce7; color:#166534; border:1px solid #bbf7d0; }
        .alert-warn { background:#fef3c7; color:#92400e; border:1px solid #fde68a; }
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <div class="page-header">
            <h1>Abandoned Carts</h1>
        </div>

        <?php if ($flash !== null): ?>
            <div class="alert alert-success">
                Reminder check finished: <?= htmlspecialchars($flash) ?>
            </div>
        <?php endif; ?>

        <?php if ($cronStale): ?>
            <div class="alert alert-warn">
                <?= $lastRun
                    ? 'The reminder cron job last ran ' . $lastRun['ago'] . ' minutes ago.'
                    : 'The reminder cron job has not run yet.' ?>
                Check the command path in cPanel → Cron Jobs.
            </div>
        <?php endif; ?>

        <div class="card ac-run">
            <div>
                <p><strong>1st reminder:</strong> <?= fmtDelay($minutes) ?> after the customer's last cart change</p>
                <p><strong>2nd (final) reminder:</strong> <?= fmtDelay($second) ?> after the 1st, if there is still no order</p>
                <p><strong>Last check:</strong>
                    <?php if ($lastRun): ?>
                        <?= htmlspecialchars(fmtTime($lastRun['time'])) ?>
                        (<?= $lastRun['ago'] ?> min ago, <?= htmlspecialchars($lastRun['source']) ?>):
                        <?= $lastRun['checked'] ?> due, <?= $lastRun['sent'] ?> sent, <?= $lastRun['failed'] ?> failed
                    <?php else: ?>
                        Never
                    <?php endif; ?>
                </p>
            </div>
            <form method="POST" action="action-abandoned-cart.php">
                <input type="hidden" name="action" value="run">
                <button type="submit" class="btn btn-primary">Run check now</button>
            </form>
        </div>

        <div class="ac-stats">
            <div class="ac-stat"><div class="num"><?= $counts['active'] ?></div><div class="lbl">Waiting for reminder</div></div>
            <div class="ac-stat"><div class="num"><?= $counts['reminded'] ?></div><div class="lbl">Reminded, not ordered yet</div></div>
            <div class="ac-stat"><div class="num"><?= $recovered ?></div><div class="lbl">Ordered after reminder</div></div>
            <div class="ac-stat"><div class="num"><?= $emailStats['sent'] ?></div><div class="lbl">Reminder emails sent</div></div>
            <div class="ac-stat"><div class="num" style="<?= $emailStats['failed'] ? 'color:#dc2626' : '' ?>"><?= $emailStats['failed'] ?></div><div class="lbl">Reminder emails failed</div></div>
        </div>

        <div class="filter-tabs">
            <?php
            $tabs = [
                'all'       => ['All (excluding empty)', $counts['active'] + $counts['reminded'] + $counts['ordered']],
                'active'    => ['Waiting',   $counts['active']],
                'reminded'  => ['Reminded',  $counts['reminded']],
                'recovered' => ['Ordered after reminder', $recovered],
                'ordered'   => ['All ordered', $counts['ordered']],
                'empty'     => ['Emptied',   $counts['empty']],
            ];
            foreach ($tabs as $key => [$label, $count]):
            ?>
                <a href="?status=<?= $key ?>" class="tab <?= $filter === $key ? 'active' : '' ?>">
                    <?= $label ?>
                    <?php if ($count > 0): ?><span class="tab-count"><?= $count ?></span><?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>

        <?php if (empty($carts)): ?>
            <div class="empty-state">No carts found.</div>
        <?php else: ?>
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Subtotal</th>
                        <th>Status</th>
                        <th>Last cart change</th>
                        <th>Reminder email</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($carts as $c):
                        $items = json_decode($c['cart_items'], true) ?: [];
                        $isRecovered = $c['status'] === 'ordered' && $c['reminder_sent_at'];
                        [$badgeClass, $badgeLabel] = [
                            'active'   => ['badge-yellow', 'Waiting'],
                            'reminded' => ['badge-blue',   'Reminded'],
                            'ordered'  => ['badge-green',  $isRecovered ? 'Ordered after reminder' : 'Ordered'],
                            'empty'    => ['badge-gray',   'Emptied'],
                        ][$c['status']] ?? ['badge-gray', ucfirst($c['status'])];

                        // Agli email kab jayegi / kyun nahi jayegi
                        $count = (int)$c['reminder_count'];
                        $note  = '';
                        if (in_array($c['status'], ['active', 'reminded'], true)) {
                            if ($c['opted_out'])                        $note = 'No email: customer unsubscribed';
                            elseif ($count >= $maxRem)                  $note = 'All reminders sent';
                            elseif (!$c['email_verified_at'])           $note = 'No email: email address not verified';
                            elseif ($count === 0 && $c['too_old'])      $note = 'No email: cart is older than 48 hours';
                            else $note = ($count === 0 ? '1st' : '2nd') . ' reminder due around ' . fmtTime($c['due_at']);
                        } elseif ($c['opted_out']) {
                            $note = 'Unsubscribed from reminders';
                        }
                    ?>
                    <tr>
                        <td>
                            <strong><?= htmlspecialchars($c['name'] ?: '-') ?></strong><br>
                            <small class="text-muted"><?= htmlspecialchars($c['email']) ?></small>
                        </td>
                        <td>
                            <?php if ($items): ?>
                                <ul class="ac-items">
                                    <?php foreach ($items as $it): ?>
                                        <li><?= htmlspecialchars($it['name']) ?> <?= htmlspecialchars($it['size'] ?? '') ?> × <?= (int)$it['qty'] ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php else: ?>
                                <span class="text-muted">-</span>
                            <?php endif; ?>
                        </td>
                        <td>$<?= number_format((float)$c['subtotal'], 2) ?></td>
                        <td>
                            <span class="badge <?= $badgeClass ?>"><?= $badgeLabel ?></span>
                            <?php if ($note): ?><span class="ac-note"><?= htmlspecialchars($note) ?></span><?php endif; ?>
                        </td>
                        <td><?= fmtTime($c['updated_at']) ?></td>
                        <td>
                            <?php if ($c['reminder_sent_at']): ?>
                                <strong><?= max(1, (int)$c['reminder_count']) ?> of <?= $maxRem ?> sent</strong><br>
                                <small class="text-muted">Last: <?= fmtTime($c['reminder_sent_at']) ?></small><br>
                                <?php if ($c['last_email_status'] === 'failed'): ?>
                                    <span class="badge badge-red">Failed</span>
                                    <span class="ac-err"><?= htmlspecialchars($c['last_email_error'] ?? '') ?></span>
                                <?php elseif ($c['last_email_status'] === 'sent'): ?>
                                    <span class="badge badge-green">Sent</span>
                                <?php endif; ?>
                            <?php else: ?>
                                <span class="text-muted">Not sent</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>

        <div class="card mt-4">
            <h2>Recent reminder emails</h2>
            <?php if (empty($recentEmails)): ?>
                <p class="text-muted">No reminder emails have been sent yet.</p>
            <?php else: ?>
            <div class="table-wrap">
                <table class="data-table">
                    <thead><tr><th>Sent to</th><th>Subject</th><th>Result</th><th>Time</th></tr></thead>
                    <tbody>
                        <?php foreach ($recentEmails as $e): ?>
                        <tr>
                            <td><?= htmlspecialchars($e['sent_to']) ?></td>
                            <td><?= htmlspecialchars($e['subject'] ?? '') ?></td>
                            <td>
                                <?php if ($e['status'] === 'sent'): ?>
                                    <span class="badge badge-green">Sent</span>
                                <?php else: ?>
                                    <span class="badge badge-red">Failed</span>
                                    <span class="ac-err"><?= htmlspecialchars($e['error_msg'] ?? '') ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?= fmtTime($e['sent_at']) ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>

    </div><!-- /.main-content -->
</body>
</html>
