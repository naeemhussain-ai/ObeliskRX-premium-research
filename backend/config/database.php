<?php
// Local config load karo agar exist kare (cPanel pe nahi hogi)
$localConfig = __DIR__ . '/local.php';
if (file_exists($localConfig)) {
    require_once $localConfig;
} else {
    // ── Production (cPanel) Credentials ─────────────
    // Real values live only on the server. Keep them in an untracked
    // backend/config/local.php (git-ignored) so they never enter the repo.
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'axistechstaging_obeliskrx');
    define('DB_USER', 'axistechstaging_obeliskrx');
    define('DB_PASS', getenv('OBELISK_DB_PASS') ?: 'SET_IN_local.php_OR_ENV');
}

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
