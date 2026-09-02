# ObeliskRX Portal — Developer Reference

Full context for developers or AI agents continuing work on this project.

---

## What Is This Project

ObeliskRX is a **research peptide e-commerce storefront** with:
- A React SPA (frontend) served as static files
- A PHP backend for the admin panel, REST API, and order handling
- Hosted on **cPanel shared hosting** at `axistechstaging.com/obeliskrx`

The project is **NOT a typical Node.js server app** — the React app is compiled to static HTML/JS/CSS and the backend is plain PHP running under Apache on cPanel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, Radix UI, Lucide icons |
| Routing | Custom SPA router (`src/lib/router.tsx`) — no React Router or TanStack Router in use |
| State | React useState + localStorage (no Redux, no Zustand) |
| Backend | PHP 8+, PDO MySQL, no framework |
| Admin panel | Plain PHP + custom CSS (no React) |
| Email | PHPMailer (`backend/vendor/phpmailer/`) |
| DB | MySQL/MariaDB |
| Hosting | cPanel shared hosting (Apache + PHP) |
| Dev server | XAMPP (Windows) |

---

## Repository Structure

```
obeliskrx-portal/
├── src/                        # React frontend source
│   ├── App.tsx                 # Root component + SPA route table
│   ├── main.tsx                # React entry point
│   ├── styles.css              # Global Tailwind + custom CSS
│   ├── routes/                 # One file per page
│   │   ├── index.tsx           # Home page
│   │   ├── catalog.tsx         # Products listing
│   │   ├── product.$slug.tsx   # Product detail
│   │   ├── coa.tsx             # Certificate of Analysis page
│   │   ├── about.tsx           # About / Who We Are
│   │   ├── cart.tsx            # Shopping cart
│   │   ├── account.tsx         # Customer account
│   │   ├── login.tsx           # Login page
│   │   ├── contact.tsx         # Contact form
│   │   ├── faq.tsx             # FAQ
│   │   ├── research-articles.tsx
│   │   ├── refund-policy.tsx
│   │   ├── terms.tsx
│   │   ├── privacy.tsx
│   │   └── $.tsx               # 404 catch-all
│   ├── components/             # Shared UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CoaDialog.tsx       # COA image/PDF viewer modal
│   │   ├── CustomerReviews.tsx
│   │   └── ui/                 # Radix UI shadcn components
│   ├── lib/                    # Core logic
│   │   ├── products.ts         # Products data + API sync + useProducts hook
│   │   ├── coa.ts              # COA data + API sync + getCoa() function
│   │   ├── cart.tsx            # Cart state (Context + localStorage)
│   │   ├── auth.tsx            # Customer auth (Context + localStorage)
│   │   └── router.tsx          # Custom SPA router (navigateTo, useCurrentPath)
│   ├── hooks/
│   │   ├── useScrollAnimation.ts
│   │   └── useToast.tsx
│   └── assets/                 # Images, product photos, certificates
│       ├── certificates/       # Static bundled COA images (fallback)
│       └── products/           # Static product images
│
├── backend/                    # PHP backend
│   ├── config/
│   │   ├── database.php        # DB connection (loads local.php if exists)
│   │   ├── constants.php       # Production URL/email constants
│   │   ├── cors.php            # CORS headers for API
│   │   └── local.php           # LOCAL ONLY — never upload to cPanel
│   ├── admin/                  # PHP admin panel (no React)
│   │   ├── index.php           # Admin dashboard
│   │   ├── products.php        # Product list
│   │   ├── product-add.php     # Add product form
│   │   ├── product-edit.php    # Edit product + COA form
│   │   ├── action-product.php  # POST handler for add/edit/delete product
│   │   ├── coa.php             # COA management list
│   │   ├── coa-edit.php        # COA edit form
│   │   ├── action-coa.php      # POST handler for COA save/delete
│   │   ├── orders.php          # Orders list
│   │   ├── order-detail.php
│   │   ├── action-order.php
│   │   ├── messages.php        # Contact messages
│   │   ├── reviews.php         # Customer reviews
│   │   ├── action-review.php
│   │   ├── logout.php
│   │   └── partials/sidebar.php # Admin layout sidebar
│   ├── api/                    # REST API endpoints (called by React frontend)
│   │   ├── products/index.php  # GET /api/products/
│   │   ├── coa/index.php       # GET /api/coa/
│   │   ├── orders/index.php    # POST /api/orders/
│   │   ├── auth/               # Customer login/register/logout
│   │   ├── account/            # Customer account endpoints
│   │   ├── reviews/            # Product reviews
│   │   └── contact/            # Contact form
│   ├── helpers/
│   │   ├── auth.php            # Admin session auth (requireAdmin())
│   │   ├── customer_auth.php   # Customer JWT/session auth
│   │   ├── response.php        # success() / error() JSON helpers
│   │   ├── email.php           # PHPMailer email helper
│   │   └── validator.php       # Input validation
│   ├── database/
│   │   ├── schema.sql          # Main DB schema (run first)
│   │   ├── schema_cpanel.sql   # cPanel-specific schema variant
│   │   ├── seed_products.sql   # Product seed data
│   │   ├── migration_coa.sql   # COA tables migration
│   │   ├── migration_customers.sql
│   │   ├── migration_reviews_reply.sql
│   │   ├── fix_coa_defaults.sql # ALTER TABLE to fix COA column defaults
│   │   ├── reset_admin.php     # Script to create/reset admin user
│   │   └── seed_admin.php
│   ├── images/
│   │   ├── products/           # Uploaded product images (.gitkeep exists)
│   │   └── coa/                # Uploaded COA files (.gitkeep exists)
│   ├── vendor/                 # PHPMailer (committed, not .gitignored)
│   ├── templates/              # Email HTML templates
│   └── .htaccess               # API routing rules
│
├── .env.local                  # Local dev environment vars (not committed)
├── .env.production             # Production environment vars (committed)
├── vite.config.ts              # Vite config — base URL, proxy
├── index.html                  # HTML shell for Vite
└── public/                     # Static public files
    └── .htaccess               # React SPA fallback routing
```

---

## Environment Variables

### `.env.local` (local dev — do NOT commit)
```
VITE_API_URL=http://localhost/obeliskrx/backend/api
VITE_BASE_URL=/obeliskrx/
```

### `.env.production` (production — committed to repo)
```
VITE_API_URL=https://axistechstaging.com/obeliskrx/backend/api
VITE_BASE_URL=/obeliskrx/
```

Vite automatically picks up `.env.production` when you run `npm run build`.

---

## Database

### Production (cPanel)
| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Database | `axistechstaging_obeliskrx` |
| Username | `axistechstaging_obeliskrx` |
| Password | _stored on the server only — see `backend/config/local.php` / hosting panel_ |

### Local (XAMPP)
| Setting | Value |
|---------|-------|
| Host | `127.0.0.1` |
| Database | `obeliskrx_db` |
| Username | `root` |
| Password | *(empty)* |

### Config override (credentials never live in the repo)
`backend/config/database.php` checks if `backend/config/local.php` exists:
- If it **exists** → loads `local.php` (its `DB_*` / SMTP defines win)
- If it **doesn't exist** → falls back to the values in `database.php`, where
  `DB_PASS` comes from the `OBELISK_DB_PASS` env var or a placeholder

`backend/config/local.php` is git-ignored. Put the **real credentials** there —
local dev creds on your machine, production creds in the copy that lives on the
server. Never commit real passwords.

**CRITICAL:** never upload your **local machine's** `local.php` (root / empty
password) to cPanel — it will break the production DB connection. The server
keeps its **own** `local.php` with production credentials. The `deploy.zip`
script excludes `local.php` so your local copy can't clobber the server's.

### Database setup order (production)
Run these SQL files in phpMyAdmin in this order:
1. `backend/database/schema.sql` — main tables
2. `backend/database/seed_products.sql` — product data
3. `backend/database/migration_coa.sql` — COA tables
4. `backend/database/migration_customers.sql` — customer accounts
5. `backend/database/migration_reviews_reply.sql` — review replies
6. `backend/database/fix_coa_defaults.sql` — fix COA column defaults

Then create admin user by visiting:
```
https://axistechstaging.com/obeliskrx/backend/database/reset_admin.php
```
Delete `reset_admin.php` from the server afterwards.

---

## How to Run Locally (XAMPP)

1. Install XAMPP. Put project at `C:\xampp\htdocs\obeliskrx\`
2. Start Apache + MySQL in XAMPP Control Panel
3. Open phpMyAdmin → Create database `obeliskrx_db`
4. Import SQL files in order listed above
5. Ensure `backend/config/local.php` exists with correct local settings
6. For frontend dev: run `npm install` then `npm run dev`
7. Admin panel: `http://localhost/obeliskrx/backend/admin/`

**Known local issue:** XAMPP MySQL sometimes gets Aria storage engine corruption. If MySQL won't start or connect, copy `C:\xampp\mysql\backup\` contents to `C:\xampp\mysql\data\` then reimport schema.

---

## How to Build Frontend

```bash
npm run build
```

This reads `.env.production` automatically and outputs to `dist/`.

The build produces:
- `dist/index.html` — HTML shell
- `dist/assets/` — hashed JS, CSS, and image files

---

## How to Create the Deploy Zip

Run this in PowerShell from the project root. It packages frontend build + PHP backend, **excluding `local.php`**:

```powershell
Set-Location "C:\Users\Administrator\Desktop\TechGenics\obeliskrx-portal"
Add-Type -Assembly "System.IO.Compression.FileSystem"
$zipPath = "C:\Users\Administrator\Desktop\TechGenics\obeliskrx-portal\deploy.zip"
if (Test-Path $zipPath) { [System.IO.File]::Delete($zipPath) }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

# Frontend build (dist/* goes to root of zip)
Get-ChildItem -Path ".\dist" -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $entry = $_.FullName.Substring($_.FullName.IndexOf("\dist\") + 6)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry, 'Optimal') | Out-Null
}

# PHP backend (goes to backend/ folder in zip) — local.php excluded!
Get-ChildItem -Path ".\backend" -Recurse | Where-Object {
    (-not $_.PSIsContainer) -and ($_.FullName -notlike "*\config\local.php")
} | ForEach-Object {
    $entry = "backend\" + $_.FullName.Substring($_.FullName.IndexOf("\backend\") + 9)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entry, 'Optimal') | Out-Null
}

$zip.Dispose()
Write-Host "deploy.zip ready"
```

---

## How to Deploy to cPanel

1. **Build:** `npm run build`
2. **Create zip:** Run the PowerShell script above → `deploy.zip`
3. **Upload:** cPanel File Manager → navigate to `/public_html/obeliskrx/` → Upload → `deploy.zip`
4. **Extract:** Right-click `deploy.zip` → Extract → extract here (into `obeliskrx/`)
5. **Verify:** Check `backend/config/local.php` does NOT exist on server. If it does, delete it immediately — it will break production DB connection.
6. **Permissions:** `backend/images/coa/` and `backend/images/products/` must be `755` (writable by PHP)

### What the zip contains (relative to `obeliskrx/` folder after extraction)
```
index.html                  ← React app entry point
assets/                     ← Compiled JS, CSS, images
backend/
  admin/                    ← PHP admin panel
  api/                      ← REST API endpoints
  config/
    constants.php            ← Production constants (no local.php!)
    database.php
    cors.php
  database/                 ← SQL migration files
  helpers/
  images/
    coa/                    ← Uploaded COA files (must be 755)
    products/               ← Uploaded product images (must be 755)
  vendor/                   ← PHPMailer
  .htaccess
```

---

## How the Frontend Gets Data

The React SPA is fully static after build. Data is loaded at runtime:

### Products
- `src/lib/products.ts` contains hardcoded static product data as fallback
- On page load, `useProducts()` hook calls `syncProductsFromAPI()` → fetches `/api/products/`
- API data is stored in `localStorage` key `obeliskrx-products`
- Static fallback is used if API fails or localStorage is empty

### COA (Certificate of Analysis)
- `src/lib/coa.ts` contains static COA data (bundled certificate images) as fallback
- On page load, `syncCoaFromAPI()` fetches `/api/coa/`
- API data stored in localStorage key `obeliskrx-api-coa`
- `getCoa(slug)` checks: API cache → React admin localStorage → static bundled data

### COA data priority
```
1. PHP admin saved data  (API cache in localStorage)
2. React admin uploads   (base64 images in localStorage — legacy)
3. Static bundled images (compiled into JS bundle — fallback)
```

---

## Admin Panel

URL: `https://axistechstaging.com/obeliskrx/backend/admin/`

Default credentials set by `reset_admin.php` — check that file for current password.

### Admin features
- Products: add, edit, delete, toggle active/inactive
- COA: manage certificates per product (from both COA page and product-edit page)
- Orders: view and update order status
- Messages: view contact form submissions
- Reviews: view and reply to customer reviews

### COA from product-edit
When admin edits a product, the form includes COA fields (purity, lot, tested date, file upload). These save directly to `product_coa` and `product_coa_files` tables via `action-product.php`.

### Important: Nested forms bug (fixed)
HTML does not allow `<form>` inside `<form>`. The COA file delete buttons previously used nested forms which caused the main "Save Changes" button to not work. This was fixed — delete buttons now use JavaScript `deleteCoaFile()` which creates a dynamic form on click.

---

## Key Files for COA Flow

| File | Role |
|------|------|
| `backend/admin/product-edit.php` | Admin form to edit product + COA metadata + upload files |
| `backend/admin/action-product.php` | Saves product edits + COA to DB + uploads files to `backend/images/coa/` |
| `backend/admin/coa.php` | Standalone COA management page |
| `backend/admin/action-coa.php` | POST handler for standalone COA saves |
| `backend/api/coa/index.php` | GET API — returns all COA data as JSON to frontend |
| `src/lib/coa.ts` | getCoa(), syncCoaFromAPI(), localStorage cache management |
| `src/routes/coa.tsx` | Frontend COA page — lists products with COA |
| `src/components/CoaDialog.tsx` | Modal to view COA images/PDFs |

---

## Known Issues & Fixes Applied

### 1. `local.php` on production → HTTP 500
**Problem:** `local.php` was included in a zip and uploaded to cPanel, overriding production DB credentials with local ones (root, empty password).
**Fix:** The deploy zip script now explicitly excludes `backend/config/local.php`.
**Action required:** If 500 error occurs, check if `backend/config/local.php` exists on cPanel and delete it.

### 2. Nested forms → Save Changes button not working
**Problem:** `product-edit.php` had `<form action="action-coa.php">` inside the main `<form action="action-product.php">`. HTML removes the outer form's submit button association.
**Fix:** Replaced nested forms with a JS function `deleteCoaFile()` that creates a dynamic form.

### 3. COA not appearing on frontend after admin save
**Problem:** `getCoa()` required at least one of purity/lot/tested to be non-empty. If admin uploaded only files with no text metadata, the entry was invisible.
**Fix:** Updated condition to also return entry when `files.length > 0`.

### 4. COA file upload silent failure
**Problem:** If `backend/images/coa/` directory was missing or not writable, files silently failed with no feedback to admin.
**Fix:** Added writable check and redirect with error message back to product-edit page.

### 5. COA table columns had no DEFAULT value
**Problem:** `purity`, `lot_number`, `tested_date` were `NOT NULL` with no `DEFAULT ''`, which could cause issues in strict MySQL mode.
**Fix:** `fix_coa_defaults.sql` — run once on production to ALTER TABLE and add `DEFAULT ''`.

### 6. XAMPP MySQL data corruption
**Problem:** Local MariaDB Aria storage engine corruption prevented any connections.
**Fix:** Copy `C:\xampp\mysql\backup\` contents to `C:\xampp\mysql\data\` to reset, then reimport schema.

---

## API Endpoints

All under `https://axistechstaging.com/obeliskrx/backend/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List active products |
| GET | `/api/coa/` | All COA records with file URLs |
| POST | `/api/orders/` | Place an order |
| POST | `/api/auth/login` | Customer login |
| POST | `/api/auth/register` | Customer register |
| POST | `/api/auth/logout` | Customer logout |
| GET | `/api/account/` | Customer account info |
| POST | `/api/contact/` | Submit contact form |
| GET | `/api/reviews/` | Product reviews |

---

## Frontend Pages & Routes

| URL | Component | Notes |
|-----|-----------|-------|
| `/obeliskrx/` | `HomePage` | Hero, featured products |
| `/obeliskrx/catalog` | `CatalogPage` | All products, filter by series |
| `/obeliskrx/product/:slug` | `ProductDetailPage` | Single product + reviews |
| `/obeliskrx/coa` | `CoaPage` | COA lookup table |
| `/obeliskrx/about` | `AboutPage` | About us + shop CTA |
| `/obeliskrx/cart` | `CartPage` | Shopping cart |
| `/obeliskrx/login` | `LoginPage` | Customer login/register |
| `/obeliskrx/account` | `AccountPage` | Customer orders/profile |
| `/obeliskrx/contact` | `ContactPage` | Contact form |
| `/obeliskrx/faq` | `FaqPage` | FAQ accordion |
| `/obeliskrx/research-articles` | `ResearchArticlesPage` | Articles |
| `/obeliskrx/terms` | `TermsPage` | Terms of Service |
| `/obeliskrx/privacy-policy` | `PrivacyPolicyPage` | Privacy Policy |
| `/obeliskrx/refund-policy` | `RefundPolicyPage` | Refund Policy |

---

## SPA Routing

The project uses a **custom router** (`src/lib/router.tsx`), not React Router or TanStack Router.

Navigation: `navigateTo("/catalog")` — pushes to history and updates current path state.

The SPA needs Apache to redirect all non-asset URLs to `index.html`. This is done via `.htaccess` in `public/`.

---

## Deployment Checklist

Before every deploy:
- [ ] Run `npm run build`
- [ ] Create fresh `deploy.zip` using the PowerShell script
- [ ] Confirm `local.php` is NOT inside the zip (`unzip -l deploy.zip | grep local`)
- [ ] Upload and extract on cPanel
- [ ] Verify `backend/images/coa/` has `755` permissions
- [ ] Verify `backend/images/products/` has `755` permissions
- [ ] If new migration SQL files exist, run them in phpMyAdmin

---

## Contact & Credentials

| Item | Value |
|------|-------|
| Production URL | `https://axistechstaging.com/obeliskrx` |
| Admin panel | `https://axistechstaging.com/obeliskrx/backend/admin/` |
| cPanel host | `axistechstaging.com` |
| DB name | `axistechstaging_obeliskrx` |
| DB user | `axistechstaging_obeliskrx` |
| Orders email | `orders@obeliskrx.com` |
| Owner email | `Contact@Obeliskrx.com` |
