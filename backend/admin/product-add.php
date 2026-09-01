<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
requireAdmin();

$seriesList = [
    'Metabolic Series',
    'Recovery Series',
    'Growth Series',
    'Longevity Series',
    'Neuro Series',
    'Signature Blends',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product - ObeliskRX Admin</title>
    <link rel="stylesheet" href="assets/admin.css">
    <style>
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .spec-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
        .spec-row input { flex: 1; }
        .image-preview { margin-top: 8px; }
        .image-preview img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); display: none; }
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
    </style>
</head>
<body class="admin-layout">
    <?php include 'partials/sidebar.php'; ?>

        <!-- Page Header -->
        <div class="page-header">
            <div>
                <a href="products.php" class="back-link">← Back to Products</a>
                <h1>Add Product</h1>
            </div>
        </div>

        <div class="card">
            <form method="POST" action="action-product.php" enctype="multipart/form-data" novalidate onsubmit="updateSpecsJson()">
                <input type="hidden" name="action" value="add">
                <!-- Hidden field populated by JS before submit -->
                <input type="hidden" name="specs_json" id="specs_json">

                <!-- Basic Info -->
                <div class="section-label">Basic Information</div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Name <span class="required">*</span></label>
                        <input type="text" id="name" name="name" class="form-control" required
                               oninput="autoSlug(this.value)" placeholder="e.g. Tirzepatide">
                    </div>
                    <div class="form-group">
                        <label for="slug">Slug <span class="required">*</span></label>
                        <input type="text" id="slug" name="slug" class="form-control" required
                               placeholder="auto-generated from name">
                    </div>
                </div>

                <div class="form-group">
                    <label for="series">Series</label>
                    <select id="series" name="series" class="form-control">
                        <?php foreach ($seriesList as $s): ?>
                            <option value="<?= htmlspecialchars($s) ?>"><?= htmlspecialchars($s) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" rows="4"
                              placeholder="Product description..."></textarea>
                </div>

                <!-- Pricing -->
                <div class="section-label">Pricing</div>

                <div class="form-row-3">
                    <div class="form-group">
                        <label for="price">Price ($) <span class="required">*</span></label>
                        <input type="number" id="price" name="price" class="form-control"
                               step="0.01" min="0" required placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label for="price_max">Price Max ($)</label>
                        <input type="number" id="price_max" name="price_max" class="form-control"
                               step="0.01" min="0" placeholder="Leave blank if single size">
                    </div>
                    <div class="form-group">
                        <label for="old_price">Old Price ($)</label>
                        <input type="number" id="old_price" name="old_price" class="form-control"
                               step="0.01" min="0" placeholder="Leave blank if no discount display">
                    </div>
                </div>

                <div class="form-group" style="max-width:200px;">
                    <label for="discount">Discount (%)</label>
                    <input type="number" id="discount" name="discount" class="form-control"
                           min="0" max="100" value="0" placeholder="0">
                </div>

                <!-- Sizes -->
                <div class="section-label">Sizes &amp; Variants</div>

                <div class="form-group">
                    <label for="sizes">Sizes <span class="required">*</span></label>
                    <input type="text" id="sizes" name="sizes" class="form-control" required
                           placeholder="e.g. 10mg, 20mg, 30mg  (comma separated)">
                    <small class="text-muted">Enter comma-separated size options.</small>
                </div>

                <!-- Specs -->
                <div class="section-label">Specifications</div>

                <div id="specs-container">
                    <!-- Spec rows added dynamically -->
                </div>
                <button type="button" class="btn btn-outline btn-sm" onclick="addSpec()">+ Add Spec</button>

                <!-- Image -->
                <div class="section-label">Product Image</div>

                <div class="form-group">
                    <label for="image">Image File (JPEG, PNG, WebP, GIF)</label>
                    <input type="file" id="image" name="image" class="form-control"
                           accept="image/jpeg,image/png,image/webp,image/gif"
                           onchange="previewImage(this)">
                    <div class="image-preview" id="image-preview-wrap" style="display:none;margin-top:8px;display:none;align-items:center;gap:10px;">
                        <img id="image-preview-img" src="" alt="Preview" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border);">
                        <button type="button" onclick="clearImage()" class="btn btn-sm btn-danger">✕ Remove</button>
                    </div>
                </div>

                <!-- Status -->
                <div class="section-label">Status</div>

                <div class="form-group">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                        <input type="checkbox" id="is_active" name="is_active" value="1" checked
                               style="width:16px;height:16px;">
                        <span>Active (visible on store)</span>
                    </label>
                </div>

                <!-- COA -->
                <div class="section-label">Certificate of Analysis (COA) <span style="font-weight:400;text-transform:none;font-size:11px;">(optional)</span></div>

                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label for="purity">Purity %</label>
                        <input type="text" id="purity" name="coa_purity" class="form-control" placeholder="e.g. 99.5%">
                    </div>
                    <div class="form-group">
                        <label for="lot_number">Lot Number</label>
                        <input type="text" id="lot_number" name="coa_lot" class="form-control" placeholder="e.g. RT20">
                    </div>
                    <div class="form-group">
                        <label for="tested_date">Test Date</label>
                        <input type="text" id="tested_date" name="coa_tested" class="form-control" placeholder="e.g. Jul 30, 2026">
                    </div>
                </div>

                <div class="form-group">
                    <label for="coa_files">Upload COA Files (images or PDF)</label>
                    <input type="file" id="coa_files" name="coa_files[]" class="form-control"
                           multiple accept="image/*,application/pdf"
                           onchange="updateCoaFileList(this)">
                    <small class="text-muted">You can select multiple files at once.</small>
                    <div id="coa-file-list" style="margin-top:8px;display:flex;flex-direction:column;gap:6px;"></div>
                </div>

                <!-- Submit -->
                <div style="display:flex;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
                    <button type="submit" class="btn btn-primary">Add Product</button>
                    <a href="products.php" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>

    </div><!-- /.main-content -->

<script>
// ── Slug auto-generation ──────────────────────────────
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function autoSlug(value) {
    var slugField = document.getElementById('slug');
    // Only auto-fill if user hasn't manually edited the slug
    if (!slugField.dataset.manual) {
        slugField.value = slugify(value);
    }
}

// Mark as manually edited once user types in slug field
document.getElementById('slug').addEventListener('input', function() {
    this.dataset.manual = 'true';
});

// ── Specs management ──────────────────────────────────
var specCount = 0;

function addSpec(label, value) {
    specCount++;
    var container = document.getElementById('specs-container');
    var row = document.createElement('div');
    row.className = 'spec-row';
    row.id = 'spec-row-' + specCount;
    row.innerHTML =
        '<input type="text" class="form-control spec-label" placeholder="Label (e.g. Purity)" value="' + (label || '') + '">' +
        '<input type="text" class="form-control spec-value" placeholder="Value (e.g. 99%)" value="' + (value || '') + '">' +
        '<button type="button" class="btn btn-sm btn-danger" onclick="removeSpec(this)" style="flex-shrink:0;">✕</button>';
    container.appendChild(row);
}

function removeSpec(btn) {
    btn.closest('.spec-row').remove();
}

function updateSpecsJson() {
    var rows = document.querySelectorAll('.spec-row');
    var specs = [];
    rows.forEach(function(row) {
        var label = row.querySelector('.spec-label').value.trim();
        var value = row.querySelector('.spec-value').value.trim();
        if (label || value) {
            specs.push({ label: label, value: value });
        }
    });
    document.getElementById('specs_json').value = JSON.stringify(specs);
}

// ── Image preview + clear ─────────────────────────────
function previewImage(input) {
    var wrap = document.getElementById('image-preview-wrap');
    var img  = document.getElementById('image-preview-img');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            wrap.style.display = 'flex';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        wrap.style.display = 'none';
    }
}

function clearImage() {
    document.getElementById('image').value = '';
    document.getElementById('image-preview-img').src = '';
    document.getElementById('image-preview-wrap').style.display = 'none';
}

// ── COA file list with remove ─────────────────────────
var coaFiles = [];

function updateCoaFileList(input) {
    var newFiles = Array.from(input.files);
    newFiles.forEach(function(f) { coaFiles.push(f); });
    renderCoaList();
    input.value = '';
}

function removeCoaFile(idx) {
    coaFiles.splice(idx, 1);
    renderCoaList();
}

function renderCoaList() {
    var list = document.getElementById('coa-file-list');
    list.innerHTML = '';
    coaFiles.forEach(function(f, i) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f8fafc;border:1px solid var(--border);border-radius:6px;font-size:13px;';
        row.innerHTML = '<span style="flex:1;">📄 ' + f.name + ' <span style="color:var(--muted);font-size:11px;">(' + (f.size/1024).toFixed(0) + ' KB)</span></span>' +
            '<button type="button" onclick="removeCoaFile(' + i + ')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;line-height:1;">✕</button>';
        list.appendChild(row);
    });
    rebuildCoaInput();
}

function rebuildCoaInput() {
    var input = document.getElementById('coa_files');
    var dt = new DataTransfer();
    coaFiles.forEach(function(f) { dt.items.add(f); });
    input.files = dt.files;
}
</script>
</body>
</html>
