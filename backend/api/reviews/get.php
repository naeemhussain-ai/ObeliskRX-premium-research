<?php
// GET /api/reviews/get.php?slug=bpc-157

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) error('Product slug is required.', 422);

$db = getDB();

$stmt = $db->prepare("
    SELECT name, rating, review_text, created_at
    FROM reviews
    WHERE product_slug = ? AND status = 'approved'
    ORDER BY created_at DESC
");
$stmt->execute([$slug]);
$reviews = $stmt->fetchAll();

$countStmt = $db->prepare("SELECT COUNT(*) FROM reviews WHERE product_slug = ? AND status = 'approved'");
$countStmt->execute([$slug]);
$count = (int)$countStmt->fetchColumn();

success([
    'reviews' => $reviews,
    'count'   => $count,
]);
