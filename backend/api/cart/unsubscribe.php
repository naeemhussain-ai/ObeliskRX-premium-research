<?php
// GET /api/cart/unsubscribe.php?token=... - cart reminder emails band karo (email ke footer ka link)

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/abandoned_cart.php';

header('Content-Type: text/html; charset=utf-8');

$token = trim($_GET['token'] ?? '');
$ok    = false;

if ($token !== '' && preg_match('/^[a-f0-9]{64}$/', $token)) {
    try {
        $db = getDB();
        ensureAbandonedCartsTable($db);
        $stmt = $db->prepare("UPDATE abandoned_carts SET opted_out = 1 WHERE unsubscribe_token = ?");
        $stmt->execute([$token]);
        $check = $db->prepare("SELECT id FROM abandoned_carts WHERE unsubscribe_token = ?");
        $check->execute([$token]);
        $ok = (bool)$check->fetch();
    } catch (\Exception $e) {}
}

$siteName = htmlspecialchars(SITE_NAME);
$siteUrl  = htmlspecialchars(SITE_URL);
$title    = $ok ? "You've been unsubscribed" : 'Invalid link';
$message  = $ok
    ? "You won't receive any more cart reminder emails from $siteName. Order and account emails are not affected."
    : 'This unsubscribe link is invalid or has expired.';
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $title ?> - <?= $siteName ?></title>
  <style>
    body { margin:0; padding:16px; background:#f4f4f4; font-family:Arial, sans-serif; }
    .wrap { max-width:480px; margin:60px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:center; }
    .header { background:#0f172a; padding:20px; color:#e2c97e; font-size:20px; letter-spacing:1px; font-weight:bold; }
    .content { padding:28px; color:#333; font-size:15px; line-height:1.6; }
    h2 { margin-top:0; color:#0f172a; }
    .btn { display:inline-block; background:#e2c97e; color:#0f172a; padding:10px 24px; border-radius:50px; text-decoration:none; font-weight:bold; font-size:14px; margin-top:12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header"><?= $siteName ?></div>
    <div class="content">
      <h2><?= $title ?></h2>
      <p><?= $message ?></p>
      <a class="btn" href="<?= $siteUrl ?>">Back to <?= $siteName ?></a>
    </div>
  </div>
</body>
</html>
