<?php

function validateRequired(array $data, array $fields): ?string {
    foreach ($fields as $field) {
        $val = $data[$field] ?? null;
        $empty = $val === null
              || (is_array($val) && count($val) === 0)
              || (!is_array($val) && trim((string)$val) === '');
        if ($empty) {
            return ucfirst(str_replace('_', ' ', $field)) . ' is required.';
        }
    }
    return null;
}

function validateEmail(string $email): bool {
    return (bool) filter_var(trim($email), FILTER_VALIDATE_EMAIL);
}

function sanitizeString(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function sanitizeInt($value): int {
    return (int) filter_var($value, FILTER_SANITIZE_NUMBER_INT);
}

function sanitizeFloat($value): float {
    return (float) filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function generateOrderNumber(): string {
    return 'OBX-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));
}
