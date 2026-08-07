# ObeliskRX Portal — Project Progress

## Project Info
- **Live Staging:** https://axistechstaging.com/obeliskrx/
- **Admin Panel:** https://axistechstaging.com/obeliskrx/backend/admin/
- **Admin Login:** admin@obeliskrx.com / ObeliskAdmin2024!
- **Stack:** React 19 + TypeScript + Vite (Frontend) | PHP + MySQL (Backend) | cPanel Hosting

---

## Phase 1 — Frontend (Complete)
- React 19 + TypeScript + Vite + Tailwind CSS setup
- Custom routing system (no Next.js)
- Pages: Home, Catalog, Product Detail, Cart, About, FAQ, Refund Policy, Research Articles, Contact, 404
- Product catalog with filtering (by series), sorting, pagination
- Shopping cart with localStorage persistence
- Age verification modal (21+)
- Wishlist functionality
- Mobile-responsive design with hamburger navigation
- Trust badges, hero video section, featured products
- Toast notifications system

---

## Phase 2 — Backend Integration (Complete)
- PHP vanilla backend (no framework)
- MySQL database with 7 tables: products, admin_users, orders, order_items, reviews, contact_messages, email_logs
- RESTful API endpoints:
  - `GET  /api/products/` — list with filters/pagination
  - `GET  /api/products/{slug}` — single product
  - `GET  /api/products/search` — search
  - `POST /api/orders/create` — place order
  - `GET  /api/orders/detail` — order details
  - `POST /api/reviews/submit` — submit review
  - `GET  /api/reviews/get` — approved reviews
  - `POST /api/contact/submit` — contact form (5-min rate limit)
- Admin Panel (`/backend/admin/`):
  - Session-based authentication
  - Orders management (approve, reject, ship, deliver)
  - Reviews approve/reject
  - Contact messages management
- Security: prepared statements, XSS prevention, input validation, .htaccess file blocks

---

## Phase 3 — Email System (Complete)
- PHPMailer integration (SMTP SSL port 465)
- Email on new order → admin notify
- Email on contact form submission
- SMTP: mail.axistechstaging.com

---

## Phase 4 — UI Improvements (Complete)

### Product Images Updated
- 20 naye product images replace kiye (Downloads folder se)
- Clean file names: `BPC-157-10mg.jpg`, `Selank-10mg.jpg`, etc. (pehle price + metadata names the)
- BPC-157/TB-500 Blend ka apna dedicated image add kiya
- New images: 3R-Peptide-20mg, NAD-1000mg, Bacteriostatic-Water (future use)

### Hero Section Text Visibility
- "The highest quality peptides..." paragraph
- `text-gray-800` → `text-white font-semibold` + `drop-shadow` (video background pe visible)

### Product Card Navy Blue Bottom
- Name/price section background: `#1B3A5C` (deep navy blue)
- Hover: `#163251` (darker navy)
- Text: white, muted white/60 for series, primary color on hover

---

## Phase 5 — Customer Account System (Complete)

### Database — New Tables
```sql
customers         — id, name, email, password_hash, phone, address fields, created_at
customer_sessions — id, customer_id, token (64-char), expires_at
orders.customer_id — nullable FK (guest orders = NULL)
```

### Backend — New API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register.php` | POST | Account banao, token return |
| `/api/auth/login.php` | POST | Login, token return |
| `/api/auth/logout.php` | POST | Token invalidate |
| `/api/auth/me.php` | GET | Profile + saved address |
| `/api/account/orders.php` | GET | Past + upcoming orders |

### Backend — Updated Files
- `api/orders/create.php` — logged-in order customer se link hoti hai + address auto-save
- `config/cors.php` — sab localhost ports allow (local dev ke liye)
- `helpers/customer_auth.php` — Apache Authorization header fix (getallheaders fallback)
- `admin/orders.php` — Registered / Guest badge orders mein

### Frontend — New Files
| File | Description |
|------|-------------|
| `src/lib/auth.tsx` | AuthContext — synchronous localStorage init, login/logout |
| `src/routes/login.tsx` | Sign In + Create Account tabs |
| `src/routes/account.tsx` | Dashboard: Upcoming Orders, History, Cart, Wishlist |

### Frontend — Updated Files
- `src/App.tsx` — AuthProvider wrap, `/login` + `/account` routes
- `src/components/Header.tsx` — Account icon (initial letter + green dot when logged in)
- `src/routes/cart.tsx` — Auth step (guest vs login), logged-in to skip auth step, form auto-fill, address pre-fill

### Account Dashboard Features
- Upcoming Orders (pending/approved/shipped) — expandable cards with items
- Order History (delivered/cancelled)
- My Cart — live cart items with total
- Wishlist — saved products
- Sign Out button

### Checkout Improvements
- Logged in → Auth step skip, seedha checkout
- Not logged in → "Sign In / Create Account" vs "Continue as Guest" choice
- Form auto-fill: name, email from profile
- After first order: phone + full address account mein save
- Second checkout onwards: poora form pre-filled

---

## Deployment — Staging (Complete)

### cPanel Setup
- Hosting: axistechstaging.com
- Path: public_html/obeliskrx/
- Database: axistechstaging_obeliskrx

### Deploy Process
1. `npm run build` → dist/ folder
2. ZIP banao (dist/ + updated backend files)
3. cPanel File Manager → obeliskrx/ folder mein upload + extract
4. phpMyAdmin → migration_customers.sql import (USE statement nahi hona chahiye)

### Environment
- `.env.production`:
  ```
  VITE_API_URL=https://axistechstaging.com/obeliskrx/backend/api
  VITE_BASE_URL=/obeliskrx/
  ```

---

## Known Notes
- Payment: Alipay (manual approval, no gateway integration)
- Products: 17 peptides hardcoded in `src/lib/products.ts`
- Auth tokens: 30-day expiry, stored in localStorage
- CORS: all localhost ports allowed for dev, staging domains for production
- Apache fix: Authorization header `getallheaders()` fallback in `customer_auth.php`
- MariaDB (cPanel): `ADD COLUMN IF NOT EXISTS` aur `ADD CONSTRAINT IF NOT EXISTS` support nahi — plain syntax use karo migrations mein
