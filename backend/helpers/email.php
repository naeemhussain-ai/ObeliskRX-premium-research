<?php
// helpers/email.php - PHPMailer wrapper

require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ── Core mailer factory ──────────────────────────────
// MAIL_METHOD = 'local' -> server ka apna mail transport (Exim/sendmail) use karo,
// kisi bahar ki SMTP mailbox/password ki zaroorat nahi. Shared cPanel hosting par
// ye hamesha available hota hai. MAIL_METHOD = 'smtp' -> external authenticated
// SMTP (SMTP_HOST/USER/PASS constants se) - sirf tab use karo jab wo mailbox
// waqai us hosting account par exist karti ho.
function makeMailer(): PHPMailer {
    $mail = new PHPMailer(true);

    if (defined('MAIL_METHOD') && MAIL_METHOD === 'smtp') {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        $mail->Timeout    = 5;
    } else {
        $mail->isMail();
    }

    $mail->CharSet = 'UTF-8';
    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    $mail->isHTML(true);
    return $mail;
}

// ── Email log ────────────────────────────────────────
function logEmail(string $type, string $sentTo, string $subject, bool $sent, string $error = ''): void {
    try {
        $db = getDB();
        $db->prepare("
            INSERT INTO email_logs (type, sent_to, subject, status, error_msg)
            VALUES (?, ?, ?, ?, ?)
        ")->execute([$type, $sentTo, $subject, $sent ? 'sent' : 'failed', $error ?: null]);
    } catch (Exception $e) {}
}

// ── HTML wrapper ─────────────────────────────────────
function emailLayout(string $title, string $body): string {
    $siteName = SITE_NAME;
    $siteUrl  = SITE_URL;
    return <<<HTML
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif; }
        .wrap { max-width:600px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .header { background:#0f172a; padding:24px 32px; }
        .header h1 { margin:0; color:#e2c97e; font-size:22px; letter-spacing:1px; }
        .content { padding:32px; color:#333; font-size:15px; line-height:1.6; }
        .content h2 { margin-top:0; color:#0f172a; }
        .info-box { background:#f8f8f8; border-left:4px solid #e2c97e; padding:16px 20px; border-radius:4px; margin:20px 0; }
        .info-box p { margin:6px 0; }
        table.items { width:100%; border-collapse:collapse; margin:20px 0; }
        table.items th { background:#0f172a; color:#e2c97e; padding:10px 12px; text-align:left; font-size:13px; }
        table.items td { padding:10px 12px; border-bottom:1px solid #eee; font-size:14px; }
        .total-row td { font-weight:bold; background:#f8f8f8; }
        .btn { display:inline-block; background:#e2c97e; color:#0f172a; padding:12px 28px; border-radius:50px; text-decoration:none; font-weight:bold; font-size:14px; margin-top:20px; }
        .footer { background:#f8f8f8; padding:16px 32px; text-align:center; font-size:12px; color:#999; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="header"><h1>$siteName</h1></div>
        <div class="content">
          <h2>$title</h2>
          $body
        </div>
        <div class="footer">&copy; {$siteName} &mdash; <a href="$siteUrl" style="color:#999">$siteUrl</a></div>
      </div>
    </body>
    </html>
    HTML;
}

// ── Branded customer email (client ki designs: email/*.jpg) ─────────────
// Static hissay (header, headline + photo, icons) backend/images/email/ ki
// images hain jo designs se crop ki gayi hain; naam, order no., products aur
// totals live HTML hain. Sab tables + inline styles taake Gmail/Outlook mein na toote.
const EMAIL_FONT   = "'Poppins', Arial, Helvetica, sans-serif";
const EMAIL_NAVY   = '#0B1F3A';
const EMAIL_INK    = '#0E1821';
const EMAIL_ORANGE = '#F2591F';
const EMAIL_CREAM  = '#F9F6F1';
const EMAIL_LINE   = '#A3A6B1';
const BRANDED_CART_COLS = [['PRODUCT', 198, 'left'], ['SIZE', 74, 'center'], ['QTY', 74, 'center'], ['PRICE', 74, 'center'], ['SUBTOTAL', 92, 'center']];

function emailAsset(string $file): string {
    return htmlspecialchars(SITE_URL . '/backend/images/email/' . $file);
}

function emailMoney(float $amount): string {
    return '$' . number_format($amount, 2);
}

// Headline image (static) + uske neeche photo background par live greeting text
function brandedHero(string $key, string $alt, string $textHtml, string $padding, string $link = ''): string {
    $top  = emailAsset("hero-$key-top.jpg");
    $bg   = emailAsset("hero-$key-bg.jpg");
    $font = EMAIL_FONT;
    $ink  = EMAIL_INK;
    $cream = EMAIL_CREAM;
    $img  = "<img src=\"$top\" width=\"600\" alt=\"$alt\" style=\"display:block; width:100%; max-width:600px; height:auto; border:0; font-family:$font; font-size:28px; line-height:34px; font-weight:bold; color:$ink;\">";
    if ($link !== '') $img = "<a href=\"$link\" style=\"text-decoration:none;\">$img</a>";
    return <<<HTML
    <tr><td style="padding:0; font-size:0; line-height:0;">$img</td></tr>
    <tr><td class="hero-text" background="$bg" bgcolor="$cream" valign="top" style="background:$cream url('$bg') no-repeat center top; background-size:cover; padding:$padding; font-family:$font; color:$ink;">
      $textHtml
    </td></tr>
    HTML;
}

// Orange "Complete my order" button
function brandedButton(string $url, string $label): string {
    $font = EMAIL_FONT;
    $navy = EMAIL_NAVY;
    return <<<HTML
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
      <td align="center" style="border-radius:12px; border:2px solid #E8692D; background:#F07436; background-image:linear-gradient(180deg,#EC6E34,#F37A38);">
        <a href="$url" style="display:inline-block; width:223px; padding:14px 0; font-family:$font; font-size:16px; line-height:20px; font-weight:600; color:$navy; text-decoration:none; text-align:center; border-radius:12px;">$label</a>
      </td>
    </tr></table>
    HTML;
}

// Order items mein image save nahi hoti - slug se product ki image lo (slug => url)
function orderItemImages(array $items): array {
    require_once __DIR__ . '/abandoned_cart.php';
    $images = [];
    $slugs  = array_values(array_unique(array_filter(array_map(fn($i) => (string)($i['slug'] ?? ''), $items))));
    if ($slugs) {
        try {
            $stmt = getDB()->prepare('SELECT slug, image_url FROM products WHERE slug IN (' . implode(',', array_fill(0, count($slugs), '?')) . ')');
            $stmt->execute($slugs);
            foreach ($stmt->fetchAll() as $p) $images[$p['slug']] = absoluteImageUrl((string)($p['image_url'] ?? ''));
        } catch (\Exception $e) {}
    }
    foreach ($items as $i) {
        $slug = (string)($i['slug'] ?? '');
        if (empty($images[$slug]) && !empty($i['image'])) $images[$slug] = absoluteImageUrl((string)$i['image']);
    }
    return $images;
}

// Product image cell (product name ke sath)
function brandedProductCell(string $name, string $image, string $link = ''): string {
    $font = EMAIL_FONT;
    $ink  = EMAIL_INK;
    $img  = $image !== ''
        ? '<img src="' . htmlspecialchars($image) . '" width="62" height="62" alt="" style="display:block; width:62px; height:62px; border:0; border-radius:6px; object-fit:cover;">'
        : '';
    $label = htmlspecialchars($name);
    if ($link !== '') $label = '<a href="' . htmlspecialchars($link) . '" style="color:' . $ink . '; text-decoration:none;">' . $label . '</a>';
    return <<<HTML
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="62" style="width:62px; padding:0 12px 0 0;">$img</td>
      <td style="font-family:$font; font-size:13px; line-height:16px; font-weight:500; letter-spacing:0.5px; color:$ink;">$label</td>
    </tr></table>
    HTML;
}

// Products table - $cols = [[label, width, align], ...], $rows = [[cellHtml, ...], ...]
// $footRows = totals [label, value] (sirf order confirmation mein)
function brandedItemsTable(array $cols, array $rows, array $footRows = []): string {
    $font  = EMAIL_FONT;
    $ink   = EMAIL_INK;
    $navy  = EMAIL_NAVY;
    $line  = EMAIL_LINE;
    $cream = EMAIL_CREAM;
    $last  = count($cols) - 1;

    $head = '';
    foreach ($cols as $i => [$label, $width, $align]) {
        $radius = $i === 0 ? 'border-top-left-radius:11px;' : ($i === $last ? 'border-top-right-radius:11px;' : '');
        $pad    = $i === 0 ? 'padding:8px 10px 7px 18px;' : ($i === $last && $align === 'right' ? 'padding:8px 22px 7px 6px;' : 'padding:8px 6px 7px;');
        $head  .= "<th width=\"$width\" align=\"$align\" style=\"width:{$width}px; $pad $radius background:$navy; font-family:$font; font-size:12px; line-height:15px; font-weight:600; letter-spacing:0.4px; color:#FFFFFF; text-align:$align;\">$label</th>";
    }

    $body = '';
    $n    = count($rows);
    foreach ($rows as $r => $cells) {
        $body .= '<tr>';
        foreach ($cells as $i => $cell) {
            [, , $align] = $cols[$i];
            $borderL = $i > 0 ? "border-left:1px solid $line;" : '';
            $borderB = ($r < $n - 1 || $footRows) ? "border-bottom:1px solid $line;" : '';
            $pad     = $i === 0 ? 'padding:12px 8px 12px 18px;' : ($i === $last && $align === 'right' ? 'padding:12px 22px 12px 6px;' : 'padding:12px 6px;');
            $body   .= "<td align=\"$align\" valign=\"middle\" style=\"$pad $borderL $borderB font-family:$font; font-size:13px; line-height:16px; font-weight:500; color:$ink; text-align:$align;\">$cell</td>";
        }
        $body .= '</tr>';
    }

    $foot = '';
    $span = count($cols) - 1;
    $nf   = count($footRows);
    foreach ($footRows as $f => [$label, $value]) {
        $borderB = $f < $nf - 1 ? "border-bottom:1px solid $line;" : '';
        $padT    = $f === 0 ? 13 : 7;
        $padB    = $f === $nf - 1 ? 18 : 7;
        $weight  = $f === $nf - 1 ? 600 : 500;
        $foot   .= "<tr>
          <td colspan=\"$span\" align=\"right\" style=\"padding:{$padT}px 22px {$padB}px; $borderB font-family:$font; font-size:12px; line-height:15px; font-weight:$weight; letter-spacing:0.3px; color:$ink; text-align:right;\">$label</td>
          <td align=\"right\" style=\"padding:{$padT}px 22px {$padB}px 6px; border-left:1px solid $line; $borderB font-family:$font; font-size:13px; line-height:15px; font-weight:600; color:$ink; text-align:right;\">$value</td>
        </tr>";
    }

    return <<<HTML
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid $line; border-top-color:$navy; border-radius:12px; background:$cream;">
      <tr>$head</tr>
      $body
      $foot
    </table>
    HTML;
}

// Footer: "The ObeliskRX team", logo + company info, disclaimer, unsubscribe
function brandedFooter(string $note, string $unsubUrl = ''): string {
    $font  = EMAIL_FONT;
    $ink   = EMAIL_INK;
    $line  = EMAIL_LINE;
    $logo  = emailAsset('logo-color.png');
    $site  = htmlspecialchars(SITE_URL);
    $unsub = $unsubUrl !== ''
        ? "<p style=\"margin:16px 0 0; font-family:$font; font-size:12px; line-height:15px;\"><a href=\"$unsubUrl\" style=\"color:#1A4F7A; text-decoration:underline;\">Unsubscribe</a></p>"
        : '';
    $note  = str_replace('ObeliskRX.com', "<a href=\"$site\" style=\"color:#1A4F7A; text-decoration:underline;\">ObeliskRX.com</a>", $note);
    return <<<HTML
    <tr><td class="px" style="padding:0 44px 26px;">
      <p style="margin:0 0 7px; font-family:$font; font-size:15px; line-height:19px; font-weight:600; color:$ink;">The ObeliskRX team</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid $line;">
        <tr>
          <td width="168" valign="middle" style="width:168px; padding:16px 0 0;"><img src="$logo" width="130" alt="ObeliskRX" style="display:block; width:130px; height:auto; border:0;"></td>
          <td width="1" valign="middle" style="width:1px; padding:16px 0 0;"><div style="width:1px; height:52px; background:$line; font-size:0; line-height:0;">&nbsp;</div></td>
          <td valign="middle" style="padding:16px 0 0 27px; font-family:$font; font-size:11px; line-height:14px; color:$ink;">
            <strong style="font-weight:600;">ObeliskRX LLC</strong><br>
            1489 W. Palmetto Park Rd., Suite 500, Boca Raton, FL 33486<br>
            Phone: <a href="tel:+15615718899" style="color:$ink; text-decoration:none;">(561) 571-8899</a><br>
            Email: <a href="mailto:Contact@ObeliskRX.com" style="color:$ink; text-decoration:none;">Contact@ObeliskRX.com</a>
          </td>
        </tr>
      </table>
      <p style="margin:18px 0 0; font-family:$font; font-size:11.5px; line-height:14px; color:$ink;">All ObeliskRX products are sold strictly for laboratory research use only. Not for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Purchasers must be 21 or older.</p>
      <p style="margin:14px 0 0; font-family:$font; font-size:11.5px; line-height:14px; color:$ink;">$note</p>
      $unsub
    </td></tr>
    HTML;
}

// Poora email document: header logo band, orange line, $rows, orange line + navy band
function brandedLayout(string $title, string $preheader, string $rows, string $pageBg): string {
    $header = emailAsset('header.jpg');
    $navy   = EMAIL_NAVY;
    $title  = htmlspecialchars($title);
    $pre    = htmlspecialchars($preheader);
    $site   = htmlspecialchars(SITE_URL);
    return <<<HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title>$title</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
        img { -ms-interpolation-mode:bicubic; }
        @media only screen and (max-width:620px) {
          .wrap { width:100% !important; }
          .px { padding-left:16px !important; padding-right:16px !important; }
          .hero-text { padding-left:16px !important; padding-right:16px !important; }
          .stack { display:block !important; width:100% !important; padding:0 0 12px !important; }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background:#ECE9E4;">
      <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">$pre</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ECE9E4;">
        <tr><td align="center" style="padding:24px 0;">
          <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:$pageBg;">
            <tr><td style="padding:0; font-size:0; line-height:0; background:$navy;"><a href="$site" style="text-decoration:none;"><img src="$header" width="600" alt="ObeliskRX" style="display:block; width:100%; max-width:600px; height:auto; border:0; color:#FFFFFF; font-family:Arial, sans-serif; font-size:24px; font-weight:bold;"></a></td></tr>
            <tr><td height="3" style="height:3px; background:#F37A35; font-size:0; line-height:0;">&nbsp;</td></tr>
            $rows
            <tr><td height="3" style="height:3px; background:#F37A35; font-size:0; line-height:0;">&nbsp;</td></tr>
            <tr><td height="15" style="height:15px; background:$navy; font-size:0; line-height:0;">&nbsp;</td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    HTML;
}

// ────────────────────────────────────────────────────
// 1. Admin ko - Naya order aaya
// ────────────────────────────────────────────────────
function sendNewOrderEmail(array $order): void {
    $subject = 'New Order #' . $order['order_number'] . ' - ' . SITE_NAME;
    $items   = is_string($order['items']) ? json_decode($order['items'], true) : $order['items'];

    $rows = '';
    foreach ($items as $item) {
        $sub   = number_format($item['quantity'] * $item['unit_price'], 2);
        $rows .= "<tr>
            <td>{$item['product_name']}</td>
            <td>{$item['size']}</td>
            <td>{$item['quantity']}</td>
            <td>\${$item['unit_price']}</td>
            <td>\${$sub}</td>
        </tr>";
    }

    $total    = number_format($order['total'], 2);
    $name     = htmlspecialchars($order['first_name'] . ' ' . $order['last_name']);
    $email    = htmlspecialchars($order['email']);
    $phone    = htmlspecialchars($order['phone'] ?? '-');
    $address  = htmlspecialchars($order['address_line1'] . ', ' . $order['city'] . ', ' . $order['state'] . ' ' . $order['zip'] . ', ' . $order['country']);
    $adminUrl = ADMIN_PATH . '/order-detail.php?id=' . $order['id'];

    $body = <<<HTML
    <p>A new order has been placed on <strong>{$order['order_number']}</strong>.</p>

    <div class="info-box">
      <p><strong>Customer:</strong> $name</p>
      <p><strong>Email:</strong> $email</p>
      <p><strong>Phone:</strong> $phone</p>
      <p><strong>Address:</strong> $address</p>
    </div>

    <table class="items">
      <thead><tr><th>Product</th><th>Size</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
      <tbody>$rows</tbody>
      <tfoot><tr class="total-row"><td colspan="4" align="right">Total</td><td>\$$total</td></tr></tfoot>
    </table>

    <a href="$adminUrl" class="btn">View Order in Admin</a>
    HTML;

    _send(OWNER_EMAIL, OWNER_NAME, $subject, $body, 'new_order');
}

// ────────────────────────────────────────────────────
// 2b. Customer ko - Payment confirm ho gayi, order approved
// ────────────────────────────────────────────────────
function buildOrderApprovedEmail(array $order): array {
    require_once __DIR__ . '/abandoned_cart.php';

    $orderNo   = htmlspecialchars($order['order_number']);
    $subject   = 'Your order #' . $order['order_number'] . ' is confirmed!';
    $firstName = trim((string)($order['first_name'] ?? ''));
    $safeFirst = htmlspecialchars($firstName !== '' ? $firstName : 'there');
    $font      = EMAIL_FONT;
    $ink       = EMAIL_INK;
    $orange    = EMAIL_ORANGE;
    $cream     = EMAIL_CREAM;

    $items = is_string($order['items']) ? json_decode($order['items'], true) : ($order['items'] ?? []);
    $items = $items ?: [];

    $images = orderItemImages($items);

    $rows = [];
    $text = '';
    foreach ($items as $item) {
        $qty    = (int)($item['quantity'] ?? 0);
        $amount = $qty * (float)($item['unit_price'] ?? 0);
        $rows[] = [
            brandedProductCell((string)($item['product_name'] ?? ''), $images[$item['slug'] ?? ''] ?? ''),
            htmlspecialchars(strtoupper((string)($item['size'] ?? ''))),
            $qty,
            emailMoney($amount),
        ];
        $text .= "- {$item['product_name']} {$item['size']} x$qty: " . emailMoney($amount) . "\n";
    }

    $discount = (float)($order['discount_amount'] ?? 0);
    $shipping = (float)($order['shipping_fee'] ?? 0);
    $foot     = [['SUBTOTAL', emailMoney((float)($order['subtotal'] ?? $order['total']))]];
    if ($discount > 0) {
        $code   = htmlspecialchars($order['coupon_code'] ?? '');
        $foot[] = ['DISCOUNT' . ($code ? " ($code)" : ''), '-' . emailMoney($discount)];
    }
    $foot[] = ['SHIPPING', $shipping > 0 ? emailMoney($shipping) : 'FREE'];
    $foot[] = ['TOTAL PAID', emailMoney((float)$order['total'])];

    $hero = brandedHero('confirm', 'Your order is confirmed!', <<<HTML
      <p style="margin:0 0 8px; font-family:$font; font-size:19px; line-height:23px; font-weight:300; color:$ink;">Hi $safeFirst</p>
      <p style="margin:0; font-family:$font; font-size:15px; line-height:19px; color:$ink;">Great news! We've received your<br>payment and your order<br><strong style="color:$orange; font-weight:600;">#$orderNo</strong> is now <strong style="color:$orange; font-weight:600;">confirmed.</strong><br>Thank you for choosing ObeliskRX!</p>
    HTML, '9px 260px 2px 46px');

    $table = brandedItemsTable(
        [['PRODUCT', 194, 'left'], ['SIZE', 110, 'center'], ['QTY', 106, 'center'], ['AMOUNT', 102, 'right']],
        $rows,
        $foot
    );

    $rowsHtml = $hero . <<<HTML
    <tr><td class="px" style="padding:16px 44px 0; background:#FFFFFF;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:$cream; border-radius:12px; box-shadow:0 2px 10px rgba(11,31,58,0.12);">
        <tr><td style="padding:14px 20px 14px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="3" style="width:3px; background:$orange; font-size:0; line-height:0;">&nbsp;</td>
            <td style="padding:0 0 0 15px; font-family:$font; font-size:15px; line-height:19px; color:$ink;">
              <strong style="color:$orange; font-weight:600;">Your order will be shipped within 2 business days.</strong><br>
              Our team is now carefully preparing and packing your order. As soon as it's on its way, we'll send you another email with the shipping details
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
    <tr><td class="px" style="padding:24px 44px 12px 51px; font-family:$font; font-size:21px; line-height:26px; font-weight:300; color:$ink;">Order Summary</td></tr>
    <tr><td class="px" style="padding:0 44px 32px;">$table</td></tr>
    HTML;
    $rowsHtml .= brandedFooter("You're receiving this because you placed an order at ObeliskRX.com.");

    $html = brandedLayout($subject, "Great news! Your order #$orderNo is confirmed and will ship within 2 business days.", $rowsHtml, '#FFFFFF');
    $alt  = "Hi $firstName,\n\nGreat news! We've received your payment and your order #{$order['order_number']} is now confirmed. Thank you for choosing ObeliskRX!\n\n"
          . "Your order will be shipped within 2 business days. As soon as it's on its way, we'll send you another email with the shipping details.\n\n"
          . "Order Summary\n$text\n" . implode("\n", array_map(fn($f) => html_entity_decode($f[0]) . ': ' . $f[1], $foot))
          . "\n\nThe ObeliskRX team\nContact@ObeliskRX.com | (561) 571-8899";

    return [$subject, $html, $alt];
}

function sendOrderApprovedEmail(array $order): void {
    [$subject, $html, $alt] = buildOrderApprovedEmail($order);
    _sendHtml($order['email'], $order['first_name'] . ' ' . $order['last_name'], $subject, $html, $alt, 'order_approved');
}

// "Review the documentation before you order" design (email/before_your_order.jpg) -
// 24 ghante wala abandoned cart reminder
function brandedBeforeOrderHtml(string $safeFirst, array $rows, string $ctaUrl, string $subject, string $preheader, string $unsubUrl = ''): string {
    $faqUrl = htmlspecialchars(SITE_URL . '/faq');
    $font   = EMAIL_FONT;
    $ink    = EMAIL_INK;
    $navy   = EMAIL_NAVY;
    $cream  = EMAIL_CREAM;

    $hero = brandedHero('before', 'Review the documentation before you order', <<<HTML
      <p style="margin:0; font-family:$font; font-size:18px; line-height:19px; font-weight:300; color:$ink;">Hi $safeFirst</p>
      <p style="margin:0 0 19px; font-family:$font; font-size:15px; line-height:19px; color:$ink;">Your cart is still saved. Before you decide,<br>we want you to see the standard behind it.</p>
      <p style="margin:0; font-family:$font; font-size:15px; line-height:19px; color:$ink;">Every ObeliskRX product page includes the<br>certificate of analysis for its current batch,<br>showing identity, purity and lot number.</p>
    HTML, '8px 230px 14px 46px');

    $table  = brandedItemsTable(BRANDED_CART_COLS, $rows);
    $button = brandedButton($ctaUrl, 'Complete my order');
    $truck  = emailAsset('icon-truck-line.png');
    $box    = emailAsset('icon-box-line.png');
    $label  = "font-family:$font; font-size:12.5px; line-height:15px; font-weight:600; color:#F37A35; margin:5px 0 0;";
    $copy   = "font-family:$font; font-size:13px; line-height:15px; color:$ink; margin:0;";

    $rowsHtml = $hero . <<<HTML
    <tr><td class="px" style="padding:0 44px;">$table</td></tr>
    <tr><td align="center" style="padding:22px 44px 0;">$button</td></tr>
    <tr><td align="center" style="padding:18px 44px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td align="center" style="border:1px solid #4A5A75; border-radius:14px; background:$cream;">
          <a href="$faqUrl" style="display:inline-block; width:258px; padding:15px 0; font-family:$font; font-size:17px; line-height:22px; font-weight:600; color:#1A4F7A; text-decoration:underline; text-align:center;">Quick Answers</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td class="px" style="padding:26px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:$cream; border-radius:12px; box-shadow:0 2px 10px rgba(11,31,58,0.12);">
        <tr><td colspan="3" style="padding:12px 18px 2px; font-family:$font; font-size:15px; line-height:19px; font-weight:600; color:$navy;">Quick Answers</td></tr>
        <tr>
          <td class="stack" width="222" valign="top" style="width:222px; padding:4px 0 14px 18px;">
            <img src="$truck" width="36" height="25" alt="" style="display:block; width:36px; height:25px; border:0;">
            <p style="$label">SHIPPING:</p>
            <p style="$copy">Orders ship from Florida within<br>1-2 business days.</p>
          </td>
          <td width="1" valign="middle" style="width:1px; padding:0 0 10px;"><div style="width:1px; height:78px; background:#1A4F7A; font-size:0; line-height:0;">&nbsp;</div></td>
          <td class="stack" valign="top" style="padding:4px 8px 14px 22px;">
            <img src="$box" width="30" height="28" alt="" style="display:block; width:30px; height:28px; border:0;">
            <p style="$label margin-top:2px;">PACKING:</p>
            <p style="$copy">Lyophilized powder in sealed vials,<br>packed to arrive intact.</p>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="height:33px; font-size:0; line-height:0;">&nbsp;</td></tr>
    HTML;
    $rowsHtml .= brandedFooter("You're receiving this because you started a checkout at ObeliskRX.com and opted in to emails.", $unsubUrl);

    return brandedLayout($subject, $preheader, $rowsHtml, $cream);
}

function brandedBeforeOrderAlt(string $firstName, string $itemsText, string $ctaUrl): string {
    return "Hi $firstName,\n\nYour cart is still saved. Before you decide, we want you to see the standard behind it.\n\n"
         . "Every ObeliskRX product page includes the certificate of analysis for its current batch, showing identity, purity and lot number.\n\n"
         . $itemsText . "\nComplete my order: $ctaUrl\nQuick Answers: " . SITE_URL . "/faq\n\n"
         . "Shipping: Orders ship from Florida within 1-2 business days.\nPacking: Lyophilized powder in sealed vials, packed to arrive intact.\n\nThe ObeliskRX team";
}

// ────────────────────────────────────────────────────
// 2. Customer ko - Order ship ho gaya
// ────────────────────────────────────────────────────
function sendOrderShippedEmail(array $order): void {
    $subject  = 'Your Order #' . $order['order_number'] . ' Has Been Shipped!';
    $name     = htmlspecialchars($order['first_name']);
    $orderNo  = htmlspecialchars($order['order_number']);
    $siteName = SITE_NAME;

    $body = <<<HTML
    <p>Hi <strong>$name</strong>,</p>
    <p>Great news! Your order <strong>#$orderNo</strong> has been shipped and is on its way to you.</p>

    <div class="info-box">
      <p><strong>Order Number:</strong> $orderNo</p>
      <p><strong>Estimated Delivery:</strong> 7–14 business days</p>
    </div>

    <p>If you have any questions about your shipment, please don't hesitate to contact us.</p>
    <p>Thank you for choosing <strong>$siteName</strong>!</p>
    HTML;

    _send($order['email'], $order['first_name'] . ' ' . $order['last_name'], $subject, $body, 'order_shipped');
}

// ────────────────────────────────────────────────────
// 3. Customer ko - Order cancel ho gaya
// ────────────────────────────────────────────────────
function sendOrderCancelledEmail(array $order): void {
    $subject   = 'Your Order #' . $order['order_number'] . ' Has Been Cancelled';
    $name      = htmlspecialchars($order['first_name']);
    $orderNo   = htmlspecialchars($order['order_number']);
    $reason    = htmlspecialchars($order['rejection_reason'] ?? 'No reason provided.');
    $fromEmail = FROM_EMAIL;

    $body = <<<HTML
    <p>Hi <strong>$name</strong>,</p>
    <p>We're sorry to inform you that your order <strong>#$orderNo</strong> has been cancelled.</p>

    <div class="info-box">
      <p><strong>Order Number:</strong> $orderNo</p>
      <p><strong>Reason:</strong> $reason</p>
    </div>

    <p>If you have any questions or would like to place a new order, please contact us at <a href="mailto:$fromEmail">$fromEmail</a>.</p>
    HTML;

    _send($order['email'], $order['first_name'] . ' ' . $order['last_name'], $subject, $body, 'order_cancelled');
}

// ────────────────────────────────────────────────────
// 4. Admin ko - Contact form message aaya
// ────────────────────────────────────────────────────
function sendContactNotificationEmail(array $msg): void {
    $subject     = 'New Contact Message: ' . ($msg['subject'] ?: 'No Subject');
    $senderName  = htmlspecialchars($msg['name']);
    $senderEmail = htmlspecialchars($msg['email']);
    $msgSubject  = htmlspecialchars($msg['subject'] ?: '-');
    $msgBody     = nl2br(htmlspecialchars($msg['message']));
    $siteName    = SITE_NAME;

    $body = <<<HTML
    <p>You received a new contact form message on <strong>$siteName</strong>.</p>

    <div class="info-box">
      <p><strong>From:</strong> $senderName ($senderEmail)</p>
      <p><strong>Subject:</strong> $msgSubject</p>
    </div>

    <p><strong>Message:</strong><br>$msgBody</p>

    <a href="mailto:$senderEmail" class="btn">Reply to $senderName</a>
    HTML;

    _send(OWNER_EMAIL, OWNER_NAME, $subject, $body, 'contact_message');
}

// ────────────────────────────────────────────────────
// 5. Admin ko - Payment proof upload hua
// ────────────────────────────────────────────────────
function sendPaymentProofEmail(array $order): void {
    $subject  = 'Payment Proof Submitted - Order #' . $order['order_number'];
    $orderNo  = htmlspecialchars($order['order_number']);
    $name     = htmlspecialchars($order['payment_proof_name'] ?? ($order['first_name'] . ' ' . $order['last_name']));
    $total    = number_format($order['total'], 2);
    $adminUrl = ADMIN_PATH . '/order-detail.php?id=' . $order['id'];

    $body = <<<HTML
    <p>A customer submitted payment proof for order <strong>#$orderNo</strong>.</p>

    <div class="info-box">
      <p><strong>Name on Payment:</strong> $name</p>
      <p><strong>Order Total:</strong> \$$total</p>
    </div>

    <p>Please review the uploaded proof in the admin panel before shipping this order.</p>

    <a href="$adminUrl" class="btn">View Order in Admin</a>
    HTML;

    _send(OWNER_EMAIL, OWNER_NAME, $subject, $body, 'payment_proof');
}

// ────────────────────────────────────────────────────
// 6. Customer ko - Email verify karo (naya account)
// ────────────────────────────────────────────────────
function sendVerificationEmail(string $email, string $name, string $token): void {
    $subject  = 'Verify Your Email - ' . SITE_NAME;
    $safeName = htmlspecialchars($name);
    $verifyUrl = SITE_URL . '/verify-email?token=' . urlencode($token);
    $siteName  = SITE_NAME;

    $body = <<<HTML
    <p>Hi <strong>$safeName</strong>,</p>
    <p>Thanks for creating an account with <strong>$siteName</strong>. Please confirm this is your real email address to activate your account.</p>

    <a href="$verifyUrl" class="btn">Verify My Email</a>

    <p style="margin-top:24px; font-size:13px; color:#777;">Or copy and paste this link into your browser:<br>
    <a href="$verifyUrl">$verifyUrl</a></p>

    <p style="margin-top:24px; font-size:13px; color:#777;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
    HTML;

    _send($email, $name, $subject, $body, 'email_verification');
}

// ────────────────────────────────────────────────────
// 7. Customer ko - Cart mein items chhor diye (abandoned cart reminder)
//    $stage 1 = pehla reminder (1 ghante baad)  - email/left_product_in_cart.jpg
//    $stage 2 = aakhri reminder (24 ghante baad) - email/before_your_order.jpg
// ────────────────────────────────────────────────────
function buildAbandonedCartEmail(array $cart, int $stage = 1): array {
    require_once __DIR__ . '/abandoned_cart.php';

    $items     = json_decode($cart['cart_items'], true) ?: [];
    $firstName = trim(explode(' ', trim($cart['name'] ?? ''))[0]);
    $safeFirst = htmlspecialchars($firstName !== '' ? $firstName : 'there');
    $cartUrl   = htmlspecialchars(SITE_URL . '/cart');
    $unsubUrl  = htmlspecialchars(SITE_URL . '/backend/api/cart/unsubscribe.php?token=' . urlencode($cart['unsubscribe_token'] ?? ''));
    $font      = EMAIL_FONT;
    $ink       = EMAIL_INK;
    $navy      = EMAIL_NAVY;
    $cream     = EMAIL_CREAM;
    $line      = EMAIL_LINE;

    $count = 0;
    foreach ($items as $i) $count += (int)$i['qty'];
    $itemsText = $count === 1 ? 'an item' : 'a few items';

    if ($stage >= 2) {
        $subject   = ($firstName !== '' ? "$firstName, still" : 'Still') . ' thinking it over?';
        $preheader = 'Your cart is still saved. Review the certificate of analysis for each product before you order.';
    } else {
        $subject   = ($firstName !== '' ? "$firstName, your" : 'Your') . ' cart is waiting for you';
        $preheader = "We saved $itemsText in your cart. Pick up right where you left off.";
    }

    $rows = [];
    $text = '';
    foreach ($items as $item) {
        $qty    = (int)$item['qty'];
        $price  = (float)$item['price'];
        $rows[] = [
            brandedProductCell((string)$item['name'], absoluteImageUrl((string)($item['image'] ?? '')), SITE_URL . '/product/' . rawurlencode($item['slug'] ?? '')),
            htmlspecialchars(strtoupper((string)($item['size'] ?? ''))),
            $qty,
            emailMoney($price),
            emailMoney($price * $qty),
        ];
        $text .= "- {$item['name']} {$item['size']} x$qty: " . emailMoney($price * $qty) . "\n";
    }

    // 24 ghante wala reminder: "before your order" design, cart ke products ke sath
    if ($stage >= 2) {
        $html = brandedBeforeOrderHtml($safeFirst, $rows, $cartUrl, $subject, $preheader, $unsubUrl);
        $alt  = brandedBeforeOrderAlt($firstName, $text, SITE_URL . '/cart') . "\n\nUnsubscribe: " . html_entity_decode($unsubUrl);
        return [$subject, $html, $alt];
    }

    $hero = brandedHero('cart', 'Your cart is saved', <<<HTML
      <p style="margin:0; font-family:$font; font-size:15px; line-height:19px; color:$ink;">Hi $safeFirst<br>You left something in your cart.<br>We've held it for you, so you can<br>pick up exactly where you left off.</p>
    HTML, '7px 260px 28px 46px');

    $table  = brandedItemsTable(BRANDED_CART_COLS, $rows);
    $button = brandedButton($cartUrl, 'Complete my order');

    $badge = function (string $icon, string $label) use ($font, $ink, $cream): string {
        $src = emailAsset($icon);
        return "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background:$cream; border-radius:12px; box-shadow:0 2px 10px rgba(11,31,58,0.13);\">
          <tr><td align=\"center\" style=\"padding:10px 6px 12px; font-family:$font; font-size:12.5px; line-height:15px; color:$ink; text-align:center;\">
            <img src=\"$src\" width=\"54\" height=\"54\" alt=\"\" style=\"display:block; margin:0 auto 6px; width:54px; height:54px; border:0;\">$label
          </td></tr>
        </table>";
    };
    $b1 = $badge('icon-coa.png', 'Batch-specific<br>certificate of analysis');
    $b2 = $badge('icon-secure.png', 'Encrypted,<br>secure checkout');
    $b3 = $badge('icon-shipping.png', 'Ships from<br>Florida, USA');

    $rowsHtml = $hero . <<<HTML
    <tr><td class="px" style="padding:0 44px;">$table</td></tr>
    <tr><td align="center" style="padding:20px 44px 0;">$button</td></tr>
    <tr><td class="px" style="padding:22px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack" width="154" valign="top" style="width:154px;">$b1</td>
        <td class="stack" width="25" style="width:25px; font-size:0; line-height:0;">&nbsp;</td>
        <td class="stack" width="154" valign="top" style="width:154px;">$b2</td>
        <td class="stack" width="25" style="width:25px; font-size:0; line-height:0;">&nbsp;</td>
        <td class="stack" width="154" valign="top" style="width:154px;">$b3</td>
      </tr></table>
    </td></tr>
    <tr><td class="px" style="padding:25px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid $line;"><tr><td style="padding:10px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:$navy; border-radius:12px;"><tr>
          <td align="center" style="padding:8px 14px 9px; font-family:$font; font-size:12.5px; line-height:17px; color:#FFFFFF; text-align:center;">
            Questions about an item or your order? Reply to this email or write to<br>
            <a href="mailto:Contact@ObeliskRX.com" style="color:#FFFFFF; text-decoration:underline; font-size:13px; font-weight:500; letter-spacing:1.5px;">Contact@ObeliskRX.com</a>
          </td>
        </tr></table>
      </td></tr></table>
    </td></tr>
    <tr><td style="height:36px; font-size:0; line-height:0;">&nbsp;</td></tr>
    HTML;
    $rowsHtml .= brandedFooter("You're receiving this because you started a checkout at ObeliskRX.com and opted in to emails.", $unsubUrl);

    $html = brandedLayout($subject, $preheader, $rowsHtml, $cream);
    $alt  = "Hi $firstName,\n\nYou left something in your cart. We've held it for you, so you can pick up exactly where you left off.\n\n"
          . $text . "\nComplete my order: " . SITE_URL . "/cart\n\n"
          . "Questions? Reply to this email or write to Contact@ObeliskRX.com\n\nThe ObeliskRX team\n\nUnsubscribe: " . html_entity_decode($unsubUrl);

    return [$subject, $html, $alt];
}

function sendAbandonedCartEmail(array $cart, int $stage = 1): bool {
    [$subject, $html, $alt] = buildAbandonedCartEmail($cart, $stage);
    return _sendHtml($cart['email'], $cart['name'] ?: '', $subject, $html, $alt, 'abandoned_cart');
}

// ── Internal send function ───────────────────────────
function _send(string $toEmail, string $toName, string $subject, string $bodyHtml, string $type, ?string $heading = null): bool {
    return _sendHtml($toEmail, $toName, $subject, emailLayout($heading ?? $subject, $bodyHtml), strip_tags($bodyHtml), $type);
}

// Poora tayyar HTML document bhejo (branded emails apna layout khud banati hain)
function _sendHtml(string $toEmail, string $toName, string $subject, string $html, string $altText, string $type): bool {
    try {
        $mail = makeMailer();
        $mail->addAddress($toEmail, $toName);
        $mail->Subject = $subject;
        $mail->Body    = $html;
        $mail->AltBody = $altText;
        $mail->send();
        logEmail($type, $toEmail, $subject, true);
        return true;
    } catch (\Exception $e) {
        logEmail($type, $toEmail, $subject, false, $e->getMessage());
        return false;
    }
}
