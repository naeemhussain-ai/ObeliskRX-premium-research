<?php
// helpers/email.php — PHPMailer wrapper

require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ── Core mailer factory ──────────────────────────────
function makeMailer(): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->Timeout    = 5;
    $mail->CharSet    = 'UTF-8';
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

// ────────────────────────────────────────────────────
// 1. Admin ko — Naya order aaya
// ────────────────────────────────────────────────────
function sendNewOrderEmail(array $order): void {
    $subject = 'New Order #' . $order['order_number'] . ' — ' . SITE_NAME;
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
    $phone    = htmlspecialchars($order['phone'] ?? '—');
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
// 2. Customer ko — Order ship ho gaya
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
// 3. Customer ko — Order cancel ho gaya
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
// 4. Admin ko — Contact form message aaya
// ────────────────────────────────────────────────────
function sendContactNotificationEmail(array $msg): void {
    $subject     = 'New Contact Message: ' . ($msg['subject'] ?: 'No Subject');
    $senderName  = htmlspecialchars($msg['name']);
    $senderEmail = htmlspecialchars($msg['email']);
    $msgSubject  = htmlspecialchars($msg['subject'] ?: '—');
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

// ── Internal send function ───────────────────────────
function _send(string $toEmail, string $toName, string $subject, string $bodyHtml, string $type): void {
    $html = emailLayout($subject, $bodyHtml);
    try {
        $mail = makeMailer();
        $mail->addAddress($toEmail, $toName);
        $mail->Subject = $subject;
        $mail->Body    = $html;
        $mail->AltBody = strip_tags($bodyHtml);
        $mail->send();
        logEmail($type, $toEmail, $subject, true);
    } catch (\Exception $e) {
        logEmail($type, $toEmail, $subject, false, $e->getMessage());
    }
}
