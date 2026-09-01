<?php
// GET /api/products/
// Params: ?series=Recovery&min_price=50&max_price=200&page=1

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();

$series   = $_GET['series']    ?? null;
$minPrice = $_GET['min_price'] ?? null;
$maxPrice = $_GET['max_price'] ?? null;
$page     = max(1, (int)($_GET['page'] ?? 1));
$limit    = (int)($_GET['limit'] ?? 12);
$limit    = min($limit, 200); // max 200 per page
$offset   = ($page - 1) * $limit;

$where  = ['p.is_active = 1'];
$params = [];

if ($series) {
    $where[]  = 'p.series = :series';
    $params[':series'] = $series;
}
if ($minPrice !== null) {
    $where[]  = 'p.price >= :min_price';
    $params[':min_price'] = (float)$minPrice;
}
if ($maxPrice !== null) {
    $where[]  = 'p.price <= :max_price';
    $params[':max_price'] = (float)$maxPrice;
}

$whereClause = 'WHERE ' . implode(' AND ', $where);

// Count total
$countSql  = "SELECT COUNT(*) FROM products p $whereClause";
$countStmt = $db->prepare($countSql);
foreach ($params as $k => $v) $countStmt->bindValue($k, $v);
$countStmt->execute();
$total = (int)$countStmt->fetchColumn();

// Fetch products
$sql  = "SELECT * FROM products p $whereClause ORDER BY p.id ASC LIMIT :limit OFFSET :offset";
$stmt = $db->prepare($sql);
foreach ($params as $k => $v) $stmt->bindValue($k, $v);
$stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$products = $stmt->fetchAll();

// Decode JSON fields & build image URL
foreach ($products as &$p) {
    $p['sizes'] = json_decode($p['sizes'], true);
    $p['specs'] = json_decode($p['specs'] ?? '[]', true);
    $p['image_url'] = IMAGES_BASE_URL . ($p['image_url'] ?? '');
    unset($p['is_active'], $p['updated_at']); // clean response
}

success([
    'products'    => $products,
    'total'       => $total,
    'page'        => $page,
    'per_page'    => $limit,
    'total_pages' => (int)ceil($total / $limit),
]);
