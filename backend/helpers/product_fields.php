<?php
// Per-size pricing + inventory helpers (products table)

// products table mein size_prices / stock columns na hon to khud bana do
// (migration_size_prices_stock.sql ka kaam)
function ensureProductColumns(PDO $db): void {
    static $done = false;
    if ($done) return;
    $cols = [
        'size_prices' => 'JSON NULL AFTER sizes',
        // NULL = stock abhi set nahi hua (purane products) - order block nahi hota
        'stock'       => 'INT NULL DEFAULT NULL AFTER size_prices',
    ];
    foreach ($cols as $col => $def) {
        if (!$db->query("SHOW COLUMNS FROM products LIKE '$col'")->fetch()) {
            $db->exec("ALTER TABLE products ADD COLUMN $col $def");
        }
    }
    $done = true;
}

// Admin form ke size_name[] / size_price[] rows se [{size, price}, ...] banao
function parseSizePrices(array $post): array {
    $names  = $post['size_name']  ?? [];
    $prices = $post['size_price'] ?? [];
    $rows   = [];
    $seen   = [];
    foreach ($names as $i => $name) {
        $name  = trim((string)$name);
        $price = isset($prices[$i]) && $prices[$i] !== '' ? round((float)$prices[$i], 2) : null;
        if ($name === '' || $price === null || $price <= 0) continue;
        if (isset($seen[strtolower($name)])) continue;
        $seen[strtolower($name)] = true;
        $rows[] = ['size' => $name, 'price' => $price];
    }
    return $rows;
}

// Edit page ke liye: size_prices na ho to purane price/price_max se rows bana do
// (frontend ka purana rule: last size = price_max, baqi sab = price)
function sizePriceRowsFor(array $product): array {
    $rows = json_decode($product['size_prices'] ?? '', true);
    if (is_array($rows) && $rows) return $rows;

    $sizes = json_decode($product['sizes'] ?? '[]', true) ?: [];
    $last  = count($sizes) - 1;
    $rows  = [];
    foreach ($sizes as $i => $size) {
        $price = ($i === $last && !empty($product['price_max'])) ? $product['price_max'] : $product['price'];
        $rows[] = ['size' => $size, 'price' => (float)$price];
    }
    return $rows;
}

// "12" -> 12, "" -> null (form validation alag se hoti hai)
function parseStock($raw): ?int {
    $raw = trim((string)$raw);
    if ($raw === '' || !is_numeric($raw)) return null;
    return max(0, (int)$raw);
}
