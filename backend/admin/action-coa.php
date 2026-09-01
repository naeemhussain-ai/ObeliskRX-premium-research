<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: coa.php');
    exit();
}

$action = $_POST['action'] ?? '';
$db     = getDB();

// COA files stored here
$coaUploadDir = __DIR__ . '/../images/coa/';
$coaBaseUrl   = defined('COA_BASE_URL') ? COA_BASE_URL : str_replace('/products/', '/coa/', IMAGES_BASE_URL);

// ─────────────────────────────────────────────────────
// SAVE COA (insert or update)
// ─────────────────────────────────────────────────────
if ($action === 'save') {
    $productSlug = trim($_POST['product_slug'] ?? '');
    $coaId       = !empty($_POST['coa_id']) ? (int)$_POST['coa_id'] : null;
    $purity      = trim($_POST['purity']      ?? '');
    $lotNumber   = trim($_POST['lot_number']  ?? '');
    $testedDate  = trim($_POST['tested_date'] ?? '');
    $deletedFiles = $_POST['deleted_files'] ?? [];

    if (!$productSlug) {
        header('Location: coa.php?error=' . urlencode('Invalid product.'));
        exit();
    }

    // Upsert: update if coa_id exists, else insert
    if ($coaId) {
        // Verify this COA belongs to the given slug
        $check = $db->prepare("SELECT id FROM product_coa WHERE id = ? AND product_slug = ?");
        $check->execute([$coaId, $productSlug]);
        if (!$check->fetch()) {
            header('Location: coa.php?error=' . urlencode('COA not found.'));
            exit();
        }

        $db->prepare("
            UPDATE product_coa
            SET purity = ?, lot_number = ?, tested_date = ?
            WHERE id = ?
        ")->execute([$purity, $lotNumber, $testedDate, $coaId]);

    } else {
        $db->prepare("
            INSERT INTO product_coa (product_slug, purity, lot_number, tested_date)
            VALUES (?, ?, ?, ?)
        ")->execute([$productSlug, $purity, $lotNumber, $testedDate]);

        $coaId = (int)$db->lastInsertId();
    }

    // Handle deleted files
    if (!empty($deletedFiles)) {
        $deletedIds = array_map('intval', $deletedFiles);

        // Fetch paths before deleting
        $placeholders = implode(',', array_fill(0, count($deletedIds), '?'));
        $fileStmt = $db->prepare("SELECT id, file_path FROM product_coa_files WHERE id IN ($placeholders) AND coa_id = ?");
        $fileStmt->execute(array_merge($deletedIds, [$coaId]));
        $filesToDelete = $fileStmt->fetchAll();

        foreach ($filesToDelete as $f) {
            $filePath = $coaUploadDir . $f['file_path'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        // Remove from DB
        $delStmt = $db->prepare("DELETE FROM product_coa_files WHERE id IN ($placeholders) AND coa_id = ?");
        $delStmt->execute(array_merge($deletedIds, [$coaId]));
    }

    // Handle new file uploads
    if (!empty($_FILES['coa_files']['name'][0])) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

        // Create directory if needed
        if (!is_dir($coaUploadDir) && !mkdir($coaUploadDir, 0755, true)) {
            header('Location: coa.php?error=' . urlencode('Could not create upload directory. Check server permissions.'));
            exit();
        }

        $fileCount = count($_FILES['coa_files']['name']);
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['coa_files']['error'][$i] !== UPLOAD_ERR_OK) continue;

            $tmpName      = $_FILES['coa_files']['tmp_name'][$i];
            $originalName = $_FILES['coa_files']['name'][$i];
            $mimeType     = mime_content_type($tmpName);

            if (!in_array($mimeType, $allowedTypes, true)) continue;

            $ext      = pathinfo($originalName, PATHINFO_EXTENSION);
            $filename = uniqid('coa_') . '.' . strtolower($ext);

            if (move_uploaded_file($tmpName, $coaUploadDir . $filename)) {
                $db->prepare("
                    INSERT INTO product_coa_files (coa_id, file_path, file_type, original_name)
                    VALUES (?, ?, ?, ?)
                ")->execute([$coaId, $filename, $mimeType, $originalName]);
            }
        }
    }

    header('Location: coa.php?success=saved');
    exit();
}

// ─────────────────────────────────────────────────────
// DELETE COA (all files + record)
// ─────────────────────────────────────────────────────
if ($action === 'delete') {
    $productSlug = trim($_POST['product_slug'] ?? '');

    if (!$productSlug) {
        header('Location: coa.php?error=' . urlencode('Invalid product.'));
        exit();
    }

    // Get COA record
    $stmt = $db->prepare("SELECT id FROM product_coa WHERE product_slug = ?");
    $stmt->execute([$productSlug]);
    $coa = $stmt->fetch();

    if ($coa) {
        $coaId = (int)$coa['id'];

        // Get all files for this COA
        $fileStmt = $db->prepare("SELECT file_path FROM product_coa_files WHERE coa_id = ?");
        $fileStmt->execute([$coaId]);
        $files = $fileStmt->fetchAll();

        // Delete files from disk
        foreach ($files as $f) {
            $filePath = $coaUploadDir . $f['file_path'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }

        // Delete product_coa record (cascade deletes product_coa_files via FK)
        $db->prepare("DELETE FROM product_coa WHERE id = ?")->execute([$coaId]);
    }

    header('Location: coa.php?success=deleted');
    exit();
}

// ─────────────────────────────────────────────────────
// DELETE SINGLE COA FILE (from product-edit.php)
// ─────────────────────────────────────────────────────
if ($action === 'delete_file') {
    $fileId    = (int)($_POST['file_id']    ?? 0);
    $productId = (int)($_POST['product_id'] ?? 0);

    if ($fileId) {
        $stmt = $db->prepare("SELECT file_path FROM product_coa_files WHERE id = ?");
        $stmt->execute([$fileId]);
        $row = $stmt->fetch();
        if ($row) {
            @unlink($coaUploadDir . $row['file_path']);
            $db->prepare("DELETE FROM product_coa_files WHERE id = ?")->execute([$fileId]);
        }
    }

    $redirect = $productId ? "product-edit.php?id=$productId&success=coa_file_deleted" : "coa.php";
    header("Location: $redirect");
    exit();
}

// Unknown action
header('Location: coa.php');
exit();
