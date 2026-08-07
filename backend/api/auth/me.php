<?php
// GET /api/auth/me.php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/customer_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db  = getDB();
$raw = getCustomerFromRequest($db);
if (!$raw) error('Unauthorized.', 401);

// Fetch full profile including saved address
$stmt = $db->prepare("
    SELECT id, name, email, phone,
           address_line1, address_line2, city, state, zip, country
    FROM customers WHERE id = ?
");
$stmt->execute([$raw['id']]);
$customer = $stmt->fetch(PDO::FETCH_ASSOC);

success(['customer' => $customer]);
