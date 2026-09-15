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

// Known temporary/disposable email providers - demo/fake accounts ke liye commonly use hote hain
const DISPOSABLE_EMAIL_DOMAINS = [
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.biz',
    'sharklasers.com', 'grr.la', 'yopmail.com', 'yopmail.net', 'temp-mail.org',
    'tempmail.com', 'tempmail.net', '10minutemail.com', '10minutemail.net',
    'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'getnada.com',
    'fakeinbox.com', 'dispostable.com', 'maildrop.cc', 'mailnesia.com',
    'mintemail.com', 'moakt.com', 'mohmal.com', 'emailondeck.com',
    'discard.email', 'discardmail.com', 'spamgourmet.com', 'mail-temporaire.fr',
    'test.com', 'example.com', 'fake.com', 'demo.com', 'sample.com',
];

function isDisposableEmail(string $email): bool {
    $domain = strtolower(substr(strrchr($email, '@'), 1));
    return in_array($domain, DISPOSABLE_EMAIL_DOMAINS, true);
}

// Domain ka mail server (MX ya fallback A/AAAA) exist karta hai ya nahi - fake/typo domains reject karne ke liye
function emailDomainIsReachable(string $email): bool {
    $domain = trim(strtolower(substr(strrchr($email, '@'), 1)), '.');
    if ($domain === '') return false;
    if (checkdnsrr($domain, 'MX')) return true;
    // Kuch domains MX record nahi rakhte, mail seedha A/AAAA record par accept karte hain (RFC 5321)
    return checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA');
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
