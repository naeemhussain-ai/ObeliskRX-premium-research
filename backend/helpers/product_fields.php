<?php
// Per-size pricing + per-size inventory helpers (products table)
//
// size_prices = [{"size":"10mg","price":69.99,"stock":12}, ...]
// products.stock = sab sizes ke stock ka total (list/filter ke liye).
// stock NULL = abhi set nahi hua (purane products) - order block nahi hota.

// products table mein size_prices / stock columns na hon to khud bana do
// (migration_size_prices_stock.sql ka kaam)
function ensureProductColumns(PDO $db): void {
    static $done = false;
    if ($done) return;
    $cols = [
        'size_prices' => 'JSON NULL AFTER sizes',
        'stock'       => 'INT NULL DEFAULT NULL AFTER size_prices',
    ];
    foreach ($cols as $col => $def) {
        if (!$db->query("SHOW COLUMNS FROM products LIKE '$col'")->fetch()) {
            $db->exec("ALTER TABLE products ADD COLUMN $col $def");
        }
    }
    $done = true;
}

// Admin form ke size_name[] / size_price[] / size_stock[] rows se
// [{size, price, stock}, ...] banao. Stock khali ho to null aata hai - caller reject karta hai.
function parseSizePrices(array $post): array {
    $names  = $post['size_name']  ?? [];
    $prices = $post['size_price'] ?? [];
    $stocks = $post['size_stock'] ?? [];
    $rows   = [];
    $seen   = [];
    foreach ($names as $i => $name) {
        $name  = trim((string)$name);
        $price = isset($prices[$i]) && $prices[$i] !== '' ? round((float)$prices[$i], 2) : null;
        if ($name === '' || $price === null || $price <= 0) continue;
        if (isset($seen[strtolower($name)])) continue;
        $seen[strtolower($name)] = true;
        $rows[] = ['size' => $name, 'price' => $price, 'stock' => parseStock($stocks[$i] ?? '')];
    }
    return $rows;
}

// Edit page ke liye: size_prices na ho to purane price/price_max se rows bana do
// (frontend ka purana rule: last size = price_max, baqi sab = price)
function sizePriceRowsFor(array $product): array {
    $rows = json_decode($product['size_prices'] ?? '', true);
    if (is_array($rows) && $rows) {
        return array_map(fn($r) => $r + ['stock' => null], $rows);
    }

    $sizes = json_decode($product['sizes'] ?? '[]', true) ?: [];
    $last  = count($sizes) - 1;
    $rows  = [];
    foreach ($sizes as $i => $size) {
        $price = ($i === $last && !empty($product['price_max'])) ? $product['price_max'] : $product['price'];
        $rows[] = ['size' => $size, 'price' => (float)$price, 'stock' => null];
    }
    return $rows;
}

// "12" -> 12, "" -> null
function parseStock($raw): ?int {
    $raw = trim((string)$raw);
    if ($raw === '' || !is_numeric($raw)) return null;
    return max(0, (int)$raw);
}

// Sab sizes ka total stock; koi size track nahi hota to null
function totalStock(array $rows): ?int {
    $stocks = array_filter(array_column($rows, 'stock'), fn($s) => $s !== null);
    return $stocks ? (int)array_sum($stocks) : null;
}

// Product ke sizes ka stock badlo. $qtyBySize = ['10mg' => 2, ...]
// $sign -1 = order (stock kaato), +1 = wapas (order reject).
// $strict par stock kam ho to kuch nahi badalta, false return hota hai aur $error set hota hai;
// warna stock 0 se neeche nahi jata. Row lock (FOR UPDATE) ke liye transaction ke andar call karo.
function adjustProductStock(PDO $db, int $productId, array $qtyBySize, int $sign, bool $strict = false, ?string &$error = null): bool {
    $stmt = $db->prepare("SELECT name, size_prices, stock FROM products WHERE id = ? FOR UPDATE");
    $stmt->execute([$productId]);
    $p = $stmt->fetch();
    if (!$p) return true;

    $rows = json_decode($p['size_prices'] ?? '', true) ?: [];
    if (totalStock($rows) === null) {
        // Per-size stock set nahi - purana product-level stock (agar ho) use karo
        if ($p['stock'] === null) return true;
        $qty = array_sum($qtyBySize);
        if ($strict && $sign < 0 && (int)$p['stock'] < $qty) {
            $error = stockError($p['name'], null, (int)$p['stock']);
            return false;
        }
        $db->prepare("UPDATE products SET stock = GREATEST(stock + ?, 0) WHERE id = ?")->execute([$sign * $qty, $productId]);
        return true;
    }

    foreach ($qtyBySize as $size => $qty) {
        foreach ($rows as &$r) {
            if (strcasecmp($r['size'], (string)$size) !== 0 || ($r['stock'] ?? null) === null) continue;
            if ($strict && $sign < 0 && $r['stock'] < $qty) {
                $error = stockError($p['name'], $r['size'], (int)$r['stock']);
                return false;
            }
            $r['stock'] = max(0, (int)$r['stock'] + $sign * $qty);
        }
        unset($r);
    }

    $db->prepare("UPDATE products SET size_prices = ?, stock = ? WHERE id = ?")
       ->execute([json_encode($rows), totalStock($rows), $productId]);
    return true;
}

function stockError(string $name, ?string $size, int $left): string {
    $label = $size ? "$name ($size)" : $name;
    return $left <= 0
        ? "$label is out of stock. Please remove it from your cart."
        : "Only $left of $label left in stock. Please reduce the quantity.";
}
