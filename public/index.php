<?php
// Website ka entry point (cPanel par). .htaccess har page ka address yahan bhejta hai.
// Ye index.html (React app) hi bhejta hai, lekin pehle check karta hai ke page asli hai:
// ghalat address par 404 status jata hai, taake Google use "not found" samjhe.
// Page wahi React ka "Page Not Found" dikhata hai.

$html = @file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    http_response_code(500);
    exit('Site files are missing.');
}

// Site root mein ho ya kisi folder (e.g. /obeliskrx) mein - dono mein chale
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
if ($base !== '' && strpos($path, $base) === 0) $path = substr($path, strlen($base));
$path = '/' . trim($path, '/');
if ($path === '/index.php' || $path === '/index.html') $path = '/';

// src/App.tsx ke routes - wahan naya page add ho to yahan bhi add karna
$pages = [
    '/', '/about', '/catalog', '/contact', '/faq', '/refund-policy', '/research-articles',
    '/coa', '/cart', '/login', '/verify-email', '/reset-password', '/account',
    '/terms', '/privacy-policy',
];

function productExists(string $slug): bool {
    try {
        require_once __DIR__ . '/backend/config/database.php';
        $stmt = getDB()->prepare('SELECT 1 FROM products WHERE slug = ? AND is_active = 1 LIMIT 1');
        $stmt->execute([$slug]);
        return (bool)$stmt->fetchColumn();
    } catch (\Throwable $e) {
        return true; // Database na mile to page normal chalne do (ghalat 404 se behtar)
    }
}

$found = in_array($path, $pages, true)
    || (preg_match('#^/product/([^/]+)$#', $path, $m) && productExists($m[1]));

http_response_code($found ? 200 : 404);
header('Content-Type: text/html; charset=utf-8');
// HTML har baar taaza aaye - naya deploy hote hi purani JS/CSS files na khulen
header('Cache-Control: no-cache, must-revalidate');

if (!$found) {
    $html = preg_replace('/<head>/i', "<head>\n    <meta name=\"robots\" content=\"noindex\">", $html, 1);
}

echo $html;
