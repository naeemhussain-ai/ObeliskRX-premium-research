# Deploy Instructions   cPanel

## Step 1   Database Setup

1. cPanel → MySQL Databases
   - Database banao: `obeliskrx_db`
   - User banao: `obeliskrx_user`
   - Strong password daalo
   - User ko database pe ALL PRIVILEGES do

2. cPanel → phpMyAdmin → `obeliskrx_db` select karo
   - Import → `database/schema.sql` upload karo → Go
   - Import → `database/seed_products.sql` upload karo → Go

## Step 2   Config Update

`config/database.php` mein apna password daalo:
```php
define('DB_USER', 'obeliskrx_user');
define('DB_PASS', 'APNA_PASSWORD_YAHAN');
```

`config/constants.php` mein:
```php
define('SITE_URL', 'https://staging.yourdomain.com');
// Email details Phase 3 mein daalne honge
```

## Step 3   Files Upload

cPanel → File Manager → public_html/

```
public_html/
├── backend/          ← yeh poora folder upload karo
│   ├── api/
│   ├── admin/
│   ├── config/
│   ├── helpers/
│   └── .htaccess
└── images/
    └── products/     ← product images yahan upload karo
```

**Note:** `database/` folder ko `public_html` ke BAHAR rakho (security ke liye).

## Step 4   Admin User Create

Browser mein kholو: `https://staging.yourdomain.com/backend/database/seed_admin.php`

- Admin create hone ka message aayega
- **Immediately is file ko DELETE karo server se!**

## Step 5   Test

1. `https://staging.yourdomain.com/backend/api/products/` → JSON milna chahiye
2. `https://staging.yourdomain.com/backend/admin/` → Login page dikhna chahiye

## Step 6   React Frontend Update (Phase 1 complete hone ke baad)

`src/lib/api.ts` (naya file banana hoga):
```typescript
export const API_BASE = 'https://staging.yourdomain.com/backend/api';
```

## PHPMailer (SSH nahi hai toh manual install)

1. Download: https://github.com/PHPMailer/PHPMailer/releases
2. `PHPMailer-6.x.x.zip` extract karo
3. `src/` folder ko rename karo → `PHPMailer/`
4. Upload karo: `public_html/backend/vendor/PHPMailer/`

File structure:
```
backend/
└── vendor/
    └── PHPMailer/
        ├── PHPMailer.php
        ├── SMTP.php
        └── Exception.php
```

Phir `helpers/email.php` mein:
```php
require_once __DIR__ . '/../vendor/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../vendor/PHPMailer/SMTP.php';
require_once __DIR__ . '/../vendor/PHPMailer/Exception.php';
```
