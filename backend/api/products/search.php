<?php
// GET /api/products/search.php?q=bpc

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$q = trim($_GET['q'] ?? '');
if (strlen($q) < 2) error('Search query must be at least 2 characters', 422);

$db   = getDB();
$term = '%' . $q . '%';

$stmt = $db->prepare("
    SELECT id, slug, name, series, price, price_max, discount, sizes, image_url
    FROM products
    WHERE is_active = 1
      AND (name LIKE :q1 OR series LIKE :q2 OR description LIKE :q3)
    ORDER BY
        CASE WHEN name LIKE :q4 THEN 0 ELSE 1 END,
        name ASC
    LIMIT 10
");
$stmt->execute([':q1' => $term, ':q2' => $term, ':q3' => $term, ':q4' => $term]);
$results = $stmt->fetchAll();

foreach ($results as &$r) {
    $r['sizes']     = json_decode($r['sizes'], true);
    $r['image_url'] = IMAGES_BASE_URL . ($r['image_url'] ?? '');
}

success([
    'results' => $results,
    'count'   => count($results),
    'query'   => $q,
]);
