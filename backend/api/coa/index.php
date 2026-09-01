<?php
// GET /api/coa/  — returns all published COA entries with file URLs

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();

$coaBaseUrl = defined('COA_BASE_URL') ? COA_BASE_URL : '';

// Fetch all COA records joined with their files
$stmt = $db->query("
    SELECT c.product_slug, c.purity, c.lot_number, c.tested_date,
           f.id AS file_id, f.file_path, f.original_name, f.file_type
    FROM product_coa c
    LEFT JOIN product_coa_files f ON f.coa_id = c.id
    ORDER BY c.product_slug, f.id
");
$rows = $stmt->fetchAll();

// Group by slug
$coa = [];
foreach ($rows as $row) {
    $slug = $row['product_slug'];
    if (!isset($coa[$slug])) {
        $coa[$slug] = [
            'purity' => $row['purity'],
            'lot'    => $row['lot_number'],
            'tested' => $row['tested_date'],
            'files'  => [],
        ];
    }
    if ($row['file_path']) {
        $coa[$slug]['files'][] = [
            'url'  => $coaBaseUrl . $row['file_path'],
            'type' => $row['file_type'],
            'name' => $row['original_name'],
        ];
    }
}

success(['coa' => $coa]);
