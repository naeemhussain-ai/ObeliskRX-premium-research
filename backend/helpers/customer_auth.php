<?php

function generateToken(): string {
    return bin2hex(random_bytes(32)); // 64-char hex token
}

function getAuthHeader(): string {
    // Apache sometimes strips HTTP_AUTHORIZATION - try multiple sources
    if (!empty($_SERVER['HTTP_AUTHORIZATION']))          return $_SERVER['HTTP_AUTHORIZATION'];
    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $key => $val) {
            if (strtolower($key) === 'authorization') return $val;
        }
    }
    return '';
}

function getCustomerFromRequest(PDO $db): ?array {
    $header = getAuthHeader();
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) return null;
    $token = trim($matches[1]);

    $stmt = $db->prepare("
        SELECT c.id, c.name, c.email
        FROM customer_sessions cs
        JOIN customers c ON cs.customer_id = c.id
        WHERE cs.token = ? AND cs.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([$token]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

function getCustomerIdFromRequest(PDO $db): ?int {
    $customer = getCustomerFromRequest($db);
    return $customer ? (int)$customer['id'] : null;
}
