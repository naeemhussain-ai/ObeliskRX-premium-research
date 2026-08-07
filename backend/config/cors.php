<?php
$allowedOrigins = [
    'http://obeliskrx.test',             // Laragon local
    'http://localhost:5173',             // Vite dev server
    'http://localhost:3000',             // alt dev port
    'http://axistechstaging.com',        // staging http
    'https://axistechstaging.com',       // staging https
    'http://www.axistechstaging.com',    // staging www http
    'https://www.axistechstaging.com',   // staging www https
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Allow any localhost port for local development
$isLocalhost = preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin);

if ($isLocalhost || in_array($origin, $allowedOrigins)) {
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
