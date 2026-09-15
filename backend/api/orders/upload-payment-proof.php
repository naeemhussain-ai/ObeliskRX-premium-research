<?php
// POST /api/orders/upload-payment-proof.php (multipart/form-data)

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validator.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$orderNumber = sanitizeString($_POST['order_number'] ?? '');
$fullName    = sanitizeString($_POST['full_name'] ?? '');

if ($orderNumber === '') error('Order number is required.', 422);
if ($fullName === '')    error('Full name is required.', 422);
if (empty($_FILES['proof']['name']) || $_FILES['proof']['error'] !== UPLOAD_ERR_OK) {
    error('Please attach a screenshot or photo of your payment.', 422);
}

$db = getDB();

// Order sirf apne login wale customer ka hi hona chahiye
$customer = getCustomerFromRequest($db);
if (!$customer) error('Please log in to submit payment proof.', 401);

$stmt = $db->prepare("SELECT id FROM orders WHERE order_number = ? AND customer_id = ?");
$stmt->execute([$orderNumber, $customer['id']]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$order) error('We could not find that order on your account.', 404);

$file = $_FILES['proof'];
if ($file['size'] > 8 * 1024 * 1024) error('File is too large. Maximum size is 8MB.', 422);

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    'application/pdf' => 'pdf',
];
$mimeType = mime_content_type($file['tmp_name']);
if (!isset($allowedTypes[$mimeType])) {
    error('Unsupported file type. Please upload a screenshot (JPG, PNG, WEBP) or PDF.', 422);
}

$uploadDir = __DIR__ . '/../../images/payment_proofs/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
if (!is_writable($uploadDir)) {
    error('Upload failed: server storage is not writable. Please contact support.', 500);
}

$filename = uniqid('proof_') . '.' . $allowedTypes[$mimeType];
if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
    error('Could not save the uploaded file. Please try again.', 500);
}

$db->prepare("
    UPDATE orders
    SET payment_proof_file = ?, payment_proof_original = ?, payment_proof_name = ?, payment_proof_submitted_at = NOW()
    WHERE id = ?
")->execute([
    $filename,
    basename($file['name']),
    $fullName,
    $order['id'],
]);

try {
    require_once __DIR__ . '/../../helpers/email.php';
    $updatedOrder = $db->query("SELECT * FROM orders WHERE id = {$order['id']}")->fetch();
    sendPaymentProofEmail($updatedOrder);
} catch (\Exception $e) {}

success([], "Thanks! Your order is pending - we'll confirm your payment and then approve your order.", 201);
