<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
requireAdmin();

// ── Legacy toggle-product behavior (backward compat) ──
// If no action param but product_id + is_active are present, handle toggle
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['action'])) {
    $productId = (int)($_POST['product_id'] ?? 0);
    $isActive  = (int)($_POST['is_active'] ?? 0);
    if ($productId && in_array($isActive, [0, 1])) {
        $db = getDB();
        $db->prepare("UPDATE products SET is_active = ? WHERE id = ?")->execute([$isActive, $productId]);
    }
    header('Location: products.php?success=toggled');
    exit();
}

// ── Require POST ──────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: products.php');
    exit();
}

$action = $_POST['action'] ?? '';
$db     = getDB();

// ─────────────────────────────────────────────────────
// ADD PRODUCT
// ─────────────────────────────────────────────────────
if ($action === 'add') {
    $name        = trim($_POST['name'] ?? '');
    $slug        = trim($_POST['slug'] ?? '');
    $series      = trim($_POST['series'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price       = (float)($_POST['price'] ?? 0);
    $priceMax    = !empty($_POST['price_max'])  ? (float)$_POST['price_max']  : null;
    $oldPrice    = !empty($_POST['old_price'])  ? (float)$_POST['old_price']  : null;
    $discount    = (int)($_POST['discount'] ?? 0);
    $sizesRaw    = trim($_POST['sizes'] ?? '');
    $specsJson   = trim($_POST['specs_json'] ?? '[]');
    $isActive    = isset($_POST['is_active']) ? 1 : 0;

    // Validate required fields
    if (!$name || !$slug || !$sizesRaw || $price <= 0) {
        header('Location: product-add.php?error=' . urlencode('Name, slug, price, and sizes are required.'));
        exit();
    }

    // Check slug uniqueness
    $slugCheck = $db->prepare("SELECT id FROM products WHERE slug = ?");
    $slugCheck->execute([$slug]);
    if ($slugCheck->fetch()) {
        header('Location: product-add.php?error=' . urlencode('Slug already exists. Choose a different slug.'));
        exit();
    }

    // Convert sizes to JSON array
    $sizesArray = array_filter(array_map('trim', explode(',', $sizesRaw)));
    $sizesJson  = json_encode(array_values($sizesArray));

    // Validate specs JSON
    $decoded = json_decode($specsJson, true);
    if (!is_array($decoded)) $specsJson = '[]';

    // Handle image upload
    $imageFilename = null;
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageFilename = handleImageUpload($_FILES['image'], 'products');
        if ($imageFilename === false) {
            header('Location: product-add.php?error=' . urlencode('Invalid image file. Only JPEG, PNG, WebP, GIF allowed.'));
            exit();
        }
    }

    $stmt = $db->prepare("
        INSERT INTO products (slug, name, series, description, price, price_max, old_price, discount, sizes, specs, image_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $slug, $name, $series, $description,
        $price, $priceMax, $oldPrice, $discount,
        $sizesJson, $specsJson, $imageFilename, $isActive
    ]);

    // ── COA Handling (optional on add) ───────────────────
    $coaPurity = trim($_POST['coa_purity'] ?? '');
    $coaLot    = trim($_POST['coa_lot']    ?? '');
    $coaTested = trim($_POST['coa_tested'] ?? '');
    $hasCoaData = $coaPurity || $coaLot || $coaTested || !empty($_FILES['coa_files']['name'][0]);

    if ($hasCoaData) {
        $db->prepare("INSERT INTO product_coa (product_slug, purity, lot_number, tested_date) VALUES (?,?,?,?)")
           ->execute([$slug, $coaPurity, $coaLot, $coaTested]);
        $coaId = $db->lastInsertId();

        if (!empty($_FILES['coa_files']['name'][0])) {
            $coaDir = __DIR__ . '/../images/coa/';
            if (!is_dir($coaDir)) mkdir($coaDir, 0755, true);
            $allowedCoa = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
            $count = count($_FILES['coa_files']['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($_FILES['coa_files']['error'][$i] !== UPLOAD_ERR_OK) continue;
                $tmpName  = $_FILES['coa_files']['tmp_name'][$i];
                $origName = basename($_FILES['coa_files']['name'][$i]);
                $mimeType = mime_content_type($tmpName);
                if (!in_array($mimeType, $allowedCoa, true)) continue;
                $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION)) ?: 'bin';
                $filename = uniqid('coa_') . '.' . $ext;
                if (move_uploaded_file($tmpName, $coaDir . $filename)) {
                    $db->prepare("INSERT INTO product_coa_files (coa_id, file_path, original_name, file_type) VALUES (?,?,?,?)")
                       ->execute([$coaId, $filename, $origName, $mimeType]);
                }
            }
        }
    }

    header('Location: products.php?success=added');

    exit();
}

// ─────────────────────────────────────────────────────
// EDIT PRODUCT
// ─────────────────────────────────────────────────────
if ($action === 'edit') {
    $productId   = (int)($_POST['product_id'] ?? 0);
    $name        = trim($_POST['name'] ?? '');
    $slug        = trim($_POST['slug'] ?? '');
    $series      = trim($_POST['series'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price       = (float)($_POST['price'] ?? 0);
    $priceMax    = !empty($_POST['price_max'])  ? (float)$_POST['price_max']  : null;
    $oldPrice    = !empty($_POST['old_price'])  ? (float)$_POST['old_price']  : null;
    $discount    = (int)($_POST['discount'] ?? 0);
    $sizesRaw    = trim($_POST['sizes'] ?? '');
    $specsJson   = trim($_POST['specs_json'] ?? '[]');
    $isActive    = isset($_POST['is_active']) ? 1 : 0;

    if (!$productId || !$name || !$slug || !$sizesRaw || $price <= 0) {
        header("Location: product-edit.php?id=$productId&error=" . urlencode('Name, slug, price, and sizes are required.'));
        exit();
    }

    // Fetch existing product
    $existing = $db->prepare("SELECT * FROM products WHERE id = ?");
    $existing->execute([$productId]);
    $existing = $existing->fetch();
    if (!$existing) {
        header('Location: products.php?error=Product+not+found');
        exit();
    }

    // Check slug uniqueness (exclude current product)
    $slugCheck = $db->prepare("SELECT id FROM products WHERE slug = ? AND id != ?");
    $slugCheck->execute([$slug, $productId]);
    if ($slugCheck->fetch()) {
        header("Location: product-edit.php?id=$productId&error=" . urlencode('Slug already in use by another product.'));
        exit();
    }

    // Convert sizes to JSON array
    $sizesArray = array_filter(array_map('trim', explode(',', $sizesRaw)));
    $sizesJson  = json_encode(array_values($sizesArray));

    // Validate specs JSON
    $decoded = json_decode($specsJson, true);
    if (!is_array($decoded)) $specsJson = '[]';

    // Handle image upload (optional replacement)
    $imageFilename = $existing['image_url']; // keep existing by default

    // Remove current image if checkbox checked
    $removeImage = isset($_POST['remove_image']) && $_POST['remove_image'] === '1';
    if ($removeImage && !empty($existing['image_url'])) {
        $oldFile = __DIR__ . '/../images/products/' . $existing['image_url'];
        if (file_exists($oldFile)) @unlink($oldFile);
        // Direct NULL update to avoid PDO null binding issues
        $db->prepare("UPDATE products SET image_url = NULL WHERE id = ?")->execute([$productId]);
        $imageFilename = null;
    }

    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $newFilename = handleImageUpload($_FILES['image'], 'products');
        if ($newFilename === false) {
            header("Location: product-edit.php?id=$productId&error=" . urlencode('Invalid image. Only JPEG, PNG, WebP, GIF allowed.'));
            exit();
        }
        // Delete old image file if it exists
        if (!empty($existing['image_url'])) {
            $oldFile = __DIR__ . '/../images/products/' . $existing['image_url'];
            if (file_exists($oldFile)) {
                @unlink($oldFile);
            }
        }
        $imageFilename = $newFilename;
    }

    $stmt = $db->prepare("
        UPDATE products
        SET slug=?, name=?, series=?, description=?, price=?, price_max=?, old_price=?,
            discount=?, sizes=?, specs=?, image_url=?, is_active=?
        WHERE id=?
    ");
    $stmt->execute([
        $slug, $name, $series, $description,
        $price, $priceMax, $oldPrice, $discount,
        $sizesJson, $specsJson, $imageFilename, $isActive,
        $productId
    ]);

    // ── COA Handling ─────────────────────────────────────
    $coaPurity  = trim($_POST['coa_purity']  ?? '');
    $coaLot     = trim($_POST['coa_lot']     ?? '');
    $coaTested  = trim($_POST['coa_tested']  ?? '');
    $hasCoaData = $coaPurity || $coaLot || $coaTested || !empty($_FILES['coa_files']['name'][0]);

    // Always fetch existing COA record (needed for file deletion)
    $coaCheck = $db->prepare("SELECT id FROM product_coa WHERE product_slug = ?");
    $coaCheck->execute([$slug]);
    $coaRow = $coaCheck->fetch();
    $coaId  = $coaRow ? (int)$coaRow['id'] : null;

    // Delete marked COA files (runs regardless of hasCoaData)
    $deletedFiles = $_POST['coa_deleted_files'] ?? [];
    foreach ($deletedFiles as $fileId) {
        $fStmt = $db->prepare("SELECT file_path FROM product_coa_files WHERE id = ?" . ($coaId ? " AND coa_id = $coaId" : ""));
        $fStmt->execute([(int)$fileId]);
        $fRow = $fStmt->fetch();
        if ($fRow) {
            @unlink(__DIR__ . '/../images/coa/' . $fRow['file_path']);
            $db->prepare("DELETE FROM product_coa_files WHERE id = ?")->execute([(int)$fileId]);
        }
    }

    if ($hasCoaData) {
        if ($coaRow) {
            $db->prepare("UPDATE product_coa SET purity=?, lot_number=?, tested_date=? WHERE id=?")
               ->execute([$coaPurity, $coaLot, $coaTested, $coaId]);
        } else {
            $db->prepare("INSERT INTO product_coa (product_slug, purity, lot_number, tested_date) VALUES (?,?,?,?)")
               ->execute([$slug, $coaPurity, $coaLot, $coaTested]);
            $coaId = (int)$db->lastInsertId();
        }

        // Upload new COA files
        if (!empty($_FILES['coa_files']['name'][0])) {
            $coaDir = __DIR__ . '/../images/coa/';
            if (!is_dir($coaDir) && !mkdir($coaDir, 0755, true)) {
                header("Location: product-edit.php?id=$productId&error=" . urlencode('COA metadata saved but file upload failed: could not create upload directory. Set backend/images/coa/ permissions to 755 on the server.'));
                exit();
            }
            if (!is_writable($coaDir)) {
                header("Location: product-edit.php?id=$productId&error=" . urlencode('COA metadata saved but file upload failed: upload directory is not writable. Set backend/images/coa/ permissions to 755 on the server.'));
                exit();
            }

            $allowedCoa = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
            $uploadFailed = 0;

            $count = count($_FILES['coa_files']['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($_FILES['coa_files']['error'][$i] !== UPLOAD_ERR_OK) { $uploadFailed++; continue; }
                $tmpName  = $_FILES['coa_files']['tmp_name'][$i];
                $origName = basename($_FILES['coa_files']['name'][$i]);
                $mimeType = mime_content_type($tmpName);
                if (!in_array($mimeType, $allowedCoa, true)) { $uploadFailed++; continue; }

                $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION)) ?: 'bin';
                $filename = uniqid('coa_') . '.' . $ext;
                if (move_uploaded_file($tmpName, $coaDir . $filename)) {
                    $db->prepare("INSERT INTO product_coa_files (coa_id, file_path, original_name, file_type) VALUES (?,?,?,?)")
                       ->execute([$coaId, $filename, $origName, $mimeType]);
                } else {
                    $uploadFailed++;
                }
            }

            if ($uploadFailed > 0) {
                header("Location: product-edit.php?id=$productId&error=" . urlencode("COA metadata saved but $uploadFailed file(s) failed to upload. Check server upload settings."));
                exit();
            }
        }
    }

    header('Location: products.php?success=updated');
    exit();
}

// ─────────────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────────────
if ($action === 'delete') {
    $productId = (int)($_POST['product_id'] ?? 0);
    if (!$productId) {
        header('Location: products.php?error=Invalid+product');
        exit();
    }

    // Fetch product to get image filename
    $stmt = $db->prepare("SELECT image_url FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $row = $stmt->fetch();

    if ($row) {
        // Delete image file from disk
        if (!empty($row['image_url'])) {
            $imagePath = __DIR__ . '/../images/products/' . $row['image_url'];
            if (file_exists($imagePath)) {
                @unlink($imagePath);
            }
        }
        // Delete the product record
        $db->prepare("DELETE FROM products WHERE id = ?")->execute([$productId]);
    }

    header('Location: products.php?success=deleted');
    exit();
}

// Unknown action   redirect back
header('Location: products.php');
exit();

// ─────────────────────────────────────────────────────
// Helper: handle image upload, return filename or false
// ─────────────────────────────────────────────────────
function handleImageUpload(array $file, string $subdir)
{
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $mimeType     = mime_content_type($file['tmp_name']);
    if (!in_array($mimeType, $allowedTypes, true)) {
        return false;
    }

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    // Fallback extension from mime type
    if (empty($ext)) {
        $extMap = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
        $ext = $extMap[$mimeType] ?? 'jpg';
    }
    $filename   = uniqid('prod_') . '.' . strtolower($ext);
    $uploadDir  = __DIR__ . '/../images/' . $subdir . '/';

    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
        return false;
    }
    return $filename;
}
