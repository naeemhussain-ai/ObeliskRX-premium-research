<?php
$allowedOrigins = [
    'http://obeliskrx.test',           // Laragon local
    'http://localhost:5173',            // Vite dev server
    'http://localhost:3000',            // alt dev port
    'https://staging.yourdomain.com',   // staging (baad mein update karo)
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
