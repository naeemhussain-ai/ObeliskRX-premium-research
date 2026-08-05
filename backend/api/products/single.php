<?php
// GET /api/products/single.php?slug=bpc-157

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) error('Product slug is required', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$slug]);
$product = $stmt->fetch();

if (!$product) error('Product not found', 404);

$product['sizes']     = json_decode($product['sizes'], true);
$product['specs']     = json_decode($product['specs'] ?? '[]', true);
$product['image_url'] = IMAGES_BASE_URL . ($product['image_url'] ?? '');
unset($product['is_active'], $product['updated_at']);

// Related products (same series, exclude current)
$related = $db->prepare("
    SELECT id, slug, name, series, price, price_max, old_price, discount, sizes, image_url
    FROM products
    WHERE series = ? AND slug != ? AND is_active = 1
    ORDER BY id ASC LIMIT 5
");
$related->execute([$product['series'], $slug]);
$relatedProducts = $related->fetchAll();

foreach ($relatedProducts as &$r) {
    $r['sizes']     = json_decode($r['sizes'], true);
    $r['image_url'] = IMAGES_BASE_URL . ($r['image_url'] ?? '');
}

success([
    'product' => $product,
    'related' => $relatedProducts,
]);
