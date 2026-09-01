<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/constants.php';
requireAdmin();

$slug = trim($_GET['slug'] ?? '');
if (!$slug) {
    header('Location: coa.php');
    exit();
}

$db = getDB();

// Load product by slug
$stmt = $db->prepare("SELECT * FROM products WHERE slug = ?");
$stmt->execute([$slug]);
$product = $stmt->fetch();

if (!$product) {
    header('Location: coa.php?error=' . urlencode('Product not found.'));
    exit();
}

// Load existing COA (if any)
$stmt = $db->prepare("SELECT * FROM product_coa WHERE product_slug = ?");
$stmt->execute([$slug]);
$coa = $stmt->fetch();

// Load existing COA files (if COA exists)
$coaFiles = [];
if ($coa) {
    $stmt = $db->prepare("SELECT * FROM product_coa_files WHERE coa_id = ?");
    $stmt->execute([$coa['id']]);
    $coaFiles = $stmt->fetchAll();
}

// COA base URL for display
$coaBaseUrl = defined('COA_BASE_URL') ? COA_BASE_URL : str_replace('/products/', '/coa/', IMAGES_BASE_URL);

// Flash error from redirect
$errorMsg = '';
if (!empty($_GET['error'])) {
    $errorMsg = htmlspecialchars($_GET['error']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $coa ? 'Edit' : 'Upload' ?> COA - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .section-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 20px 0 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--border);
        }
        .coa-file-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            background: #f8fafc;
            border: 1px solid var(--border);
            border-radius: 6px;
            margin-bottom: 6px;
        }
        .coa-file-row a { color: var(--info); text-decoration: none; font-size: 13px; flex: 1; }
        .coa-file-row a:hover { text-decoration: underline; }
        .coa-file-type { font-size: 11px; color: var(--muted); }
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <!-- Page Header -->
        <div class="page-header">
            <div>
                <a href="coa.php" class="back-link">← Back to COA Management</a>
                <h1><?= $coa ? 'Edit' : 'Upload' ?> COA — <?= htmlspecialchars($product['name']) ?></h1>
            </div>
        </div>

        <?php if ($errorMsg): ?>
            <div class="alert alert-error">⚠️ <?= $errorMsg ?></div>
        <?php endif; ?>

        <div class="card">
            <form method="POST" action="action-coa.php" enctype="multipart/form-data">
                <input type="hidden" name="action" value="save">
                <input type="hidden" name="product_slug" value="<?= htmlspecialchars($slug) ?>">
                <?php if ($coa): ?>
                    <input type="hidden" name="coa_id" value="<?= $coa['id'] ?>">
                <?php endif; ?>

                <!-- COA Details -->
                <div class="section-label">COA Details</div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label for="purity">Purity %</label>
                        <input type="text" id="purity" name="purity" class="form-control"
                               value="<?= htmlspecialchars($coa['purity'] ?? '') ?>"
                               placeholder="e.g. 99.5%">
                    </div>
                    <div class="form-group">
                        <label for="lot_number">Lot Number</label>
                        <input type="text" id="lot_number" name="lot_number" class="form-control"
                               value="<?= htmlspecialchars($coa['lot_number'] ?? '') ?>"
                               placeholder="e.g. RT20">
                    </div>
                    <div class="form-group">
                        <label for="tested_date">Test Date</label>
                        <input type="text" id="tested_date" name="tested_date" class="form-control"
                               value="<?= htmlspecialchars($coa['tested_date'] ?? '') ?>"
                               placeholder="e.g. Jul 30, 2026">
                    </div>
                </div>

                <!-- Existing Files -->
                <?php if (!empty($coaFiles)): ?>
                <div class="section-label">Existing Files</div>
                <p style="font-size:12px;color:var(--muted);margin-bottom:8px;">
                    Check the box next to a file to delete it on save.
                </p>
                <?php foreach ($coaFiles as $file): ?>
                    <div class="coa-file-row">
                        <input type="checkbox" name="deleted_files[]" value="<?= $file['id'] ?>"
                               id="del-file-<?= $file['id'] ?>"
                               style="width:16px;height:16px;flex-shrink:0;">
                        <label for="del-file-<?= $file['id'] ?>" style="cursor:pointer;flex:1;display:flex;align-items:center;gap:8px;">
                            <?php
                            $isImage = strpos($file['file_type'], 'image/') === 0;
                            echo $isImage ? '🖼️' : '📄';
                            ?>
                            <a href="<?= $coaBaseUrl . htmlspecialchars($file['file_path']) ?>"
                               target="_blank" rel="noopener">
                                <?= htmlspecialchars($file['original_name']) ?>
                            </a>
                            <span class="coa-file-type">(<?= htmlspecialchars($file['file_type']) ?>)</span>
                        </label>
                        <small style="color:var(--danger);font-size:11px;">✓ = delete</small>
                    </div>
                <?php endforeach; ?>
                <?php endif; ?>

                <!-- New File Uploads -->
                <div class="section-label">
                    <?= empty($coaFiles) ? 'Upload Files' : 'Add More Files' ?>
                </div>

                <div class="form-group">
                    <label for="coa_files">Files (images or PDF, multiple allowed)</label>
                    <input type="file" id="coa_files" name="coa_files[]" class="form-control"
                           multiple accept="image/*,application/pdf">
                    <small class="text-muted">You can select multiple files at once.</small>
                </div>

                <!-- Submit -->
                <div style="display:flex;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
                    <button type="submit" class="btn btn-primary">Save COA</button>
                    <a href="coa.php" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>

    </div><!-- /.main-content -->
</body>
</html>
