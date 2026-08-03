# ObeliskRX Portal

# OBELISK RX   Premium Peptides E-Commerce Website

Build a modern, responsive React e-commerce website for "OBELISK RX"   a premium research peptides supplier. Use React 18+, React Router DOM, Tailwind CSS, and Lucide React icons. Do NOT generate or use any AI images. Use placeholder divs with gradient backgrounds or gray boxes for all images, and clearly label where custom images/video should be inserted later.

---

## BRAND IDENTITY

- **Primary Color:** `#E91E63` (Pink/Magenta)   use for buttons, badges, links, active states, CTAs
- **Secondary Color:** `#1A1A1A` (Near Black)   footer, notice section backgrounds
- **Background:** `#FFFFFF` (white) main content, `#F8F9FA` (light gray) for subtle sections
- **Text Primary:** `#111827` (gray-900)
- **Text Secondary:** `#6B7280` (gray-500)
- **Font:** Inter or system sans-serif
- **Border Radius:** `8px` for cards, `9999px` for pills/badges/buttons
- **Shadows:** `shadow-sm` for cards, `shadow-md` on hover

---

## GLOBAL COMPONENTS

### Header/Navbar (Sticky)
- **Height:** 70px, white background, bottom border `border-b border-gray-100`
- **Left:** Logo "OBELISK RX"   "OBELISK" in bold black, "RX" in primary pink with a small square icon before text
- **Center Nav Links:** Home | Catalog | Contact | Research Articles (active page underlined in pink)
- **Right:** 
  - Search icon + "Search" text
  - User icon + "Login / Register"
  - Shopping cart icon with badge showing item count + "$0.00" (updates dynamically)
- **Mobile:** Hamburger menu that slides in from right

### Footer (Shared across all pages)
Background: `#1A1A1A`, text white/gray-400, padding 60px top, 30px bottom.

**Layout:** 4 columns on desktop, stacked on mobile.

- **Column 1   Brand:**
  - Logo "OBELISK RX" (white version)
  - Tagline: "Research-grade peptides, verified for precision and integrity."
  - Social icons: Facebook, Instagram, TikTok (circular gray bg icons)
  - Payment icons row: VISA, Stripe, PayPal, G Pay, Apple Pay (text badges or simple icons)

- **Column 2   Quick Links:**
  - Title: "Quick Links"
  - Links: Home, About, Catalogue, Research, Contact Us

- **Column 3   Useful Links:**
  - Title: "Useful Links"
  - Links: FAQ, Refund & Returns, Privacy Policy, Terms of Service

- **Column 4   Contact Info:**
  - Title: "Contact Info"
  - Email: Contact@ObeliskRX.com
  - Business Hours: Monday - Friday 9:00 AM - 5:00 PM EST

- **Bottom Bar:** "Copyright 2026 OBELISK" centered, text-gray-500, border-t border-gray-800

### Notice Section (Shared   appears directly above Footer on EVERY page)
Background: `#1A1A1A`, text white/gray-300, padding 40px, font-size 12px, line-height 1.6.

**Content:**
- **Title:** "Notice" (bold, white, mb-4)
- **Paragraph 1:** "All peptides sold on this site are intended exclusively for laboratory and research use. Products may not be used as a cosmetic, food additive, chemical, drug, or for any application not classified as such in this notice. The listing of a material on this site does not constitute a license to use it in infringement of any patent."
- **Paragraph 2:** "By purchasing, each customer represents and warrants that they have independently reviewed and are fully informed of:"
  - Bullet 1: "Government regulations governing the use of, and exposure to, these products"
  - Bullet 2: "The health and safety hazards associated with handling the products purchased"
  - Bullet 3: "The necessity of providing adequate warning of those health and safety hazards to any other party who may handle the product"
- **Paragraph 3:** "ObeliskRX reserves the right to cancel any order if there is reason to believe the products are being purchased for a use other than the research purpose for which they are sold."
- **Paragraph 4:** "ObeliskRX's products are intended solely for laboratory research use and are not to be used for in vitro diagnostic purposes, or in food, drugs, medical devices, or cosmetics for humans or animals, or for any commercial purpose. The purchaser acknowledges that these products have not been tested by ObeliskRX for safety or efficacy in any food, drug, medical device, cosmetic, commercial, or other application."
- **Paragraph 5:** "The purchaser expressly represents and warrants to ObeliskRX that they will test, use, manufacture, and market any products purchased   and any materials produced using them   in accordance with the practices of a reasonably prudent person experienced in the field, and in strict compliance with all applicable laws and regulations, now in effect or hereinafter enacted."

---

## PAGE 1: HOME PAGE (Route: `/`)

### Section 1   Hero
- **Background:** Full-width, min-height 500px. USE A PLACEHOLDER DIV with a dark gradient overlay (`bg-gradient-to-r from-black/60 to-black/40`). **USER WILL REPLACE THIS WITH A BACKGROUND VIDEO LATER**   add a comment: `&lt;!-- INSERT HERO VIDEO HERE --&gt;`
- **Content centered vertically & horizontally:**
  - **Badge:** Pill shape, bg-pink-500/20, text-pink-500, border border-pink-500. Text: "TRUSTED BY THOUSANDS"
  - **H1:** "Premium Peptides" (white, text-5xl, font-bold)
  - **H2:** "You Can Trust" (primary pink, text-5xl, font-bold)
  - **Subtitle:** "The highest quality peptides, backed by science. Every batch is independently tested and verified to 99%+ purity before it ever reaches you." (white/gray-200, max-w-2xl, text-center)
  - **Trust Cards Row:** 3 cards in a row (glassmorphism style: bg-white/10, backdrop-blur, border border-white/20, rounded-lg, p-4)
    1. Shield icon + "99%+ Purity" + "Lab Verified"
    2. CheckCircle icon + "Independently Tested" + "COA Verified"
    3. Truck icon + "Fast USA Shipping" + "Same Day Shipping"
  - **CTA Button:** "Shop Now"   bg-primary pink, white text, rounded-full, px-8 py-3, hover:bg-pink-600. Include a right arrow icon.

### Section 2   Featured Products
- **Container:** max-w-7xl, mx-auto, py-16, px-4
- **Header:** Flex between
  - Left: "Featured Products" (text-2xl, font-bold)
  - Right: "More Products →" (text-sm, gray-500, hover:text-pink-500)
- **Grid:** 4 columns desktop, 2 tablet, 1 mobile, gap-6

**Product Card Component (reusable):**
- White bg, rounded-lg, border border-gray-100, overflow-hidden, hover:shadow-lg transition
- **Top:** Relative container
  - Discount badge absolute top-left: bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg (e.g., "-35%")
  - Heart icon absolute top-right: bg-white rounded-full p-1.5 shadow-sm, hover:text-pink-500
  - **Image area:** aspect-square, bg-gray-100 (PLACEHOLDER   user will add product image). Add label: "PRODUCT IMAGE"
- **Bottom:** p-4
  - Title: text-sm font-semibold text-gray-900
  - Series: text-xs text-gray-500 (e.g., "Metabolic Series")
  - Price: text-sm font-bold text-gray-900. Old price: text-xs text-gray-400 line-through (e.g., "$199.99")
  - If price range: "$70.00   $130.00"

**Home Featured Products Data:**
1. 2(T) Peptide | Metabolic Series | ~~$199.99~~ $130.00 | -35%
2. 3(R) Peptide | Metabolic Series | $70.00   $130.00 | -35%
3. BPC-157 | Recovery Series | ~~$122.99~~ $99.00 | -20%
4. CJC-1295 No DAC | Growth Series | ~~$76.99~~ $49.99 | -36%
5. Epithalon | Longevity Series | ~~$230.99~~ $149.99 | -35%
6. GHK-Cu | Longevity Series | ~~$76.99~~ $49.99 | -35%
7. IGF-LR3 | Metabolic Series | ~~$107.99~~ $69.00 | -36%

### Section 3   About Us
- **Container:** max-w-7xl, mx-auto, py-16, px-4
- **Layout:** 2 columns (60/40), gap-12, items-center
- **Left Content:**
  - Badge: "About Us"   bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full
  - H2: "About ObeliskRX" (text-3xl, font-bold, mb-6)
  - Paragraphs (text-gray-600, leading-relaxed, space-y-4):
    - "ObeliskRX was built on a simple premise: researchers deserve to know exactly what they're working with."
    - "Every compound we distribute is sourced from vetted manufacturers and independently tested before it reaches you   not spot-checked, not assumed, verified. Every batch carries its own certificate of analysis, available to review before you order."
    - "We built this company because the research peptide space has too often rewarded speed over scrutiny. We chose the opposite path: documentation first, transparency by default, and a standard of proof behind every product we carry."
    - "ObeliskRX is a research-use-only supplier. Our products are intended for laboratory and research applications only, not for human or animal consumption."
  - Button: "Read More"   border border-pink-500 text-pink-500 rounded-full px-6 py-2 hover:bg-pink-50
- **Right Content:**
  - Rounded-lg image container, aspect-[4/3], bg-gray-200 (PLACEHOLDER: "ABOUT SECTION IMAGE   lab/research photo")

### Section 4   Features Row
- **Background:** white, border-t border-gray-100
- **Container:** max-w-7xl, mx-auto, py-16, px-4
- **Grid:** 5 columns desktop, 2 tablet, 1 mobile, gap-8, text-center

**Feature Items (icon in pink circle bg-pink-50, rounded-full, p-3, mb-4):**
1. **Search/Shield icon**   "Built for research integrity"   "Every order is backed by fast fulfillment, third-party verified purity, and responsive support so researchers can source with confidence."
2. **Truck icon**   "Fast shipping"   "Orders placed before 2pm, Monday through Thursday, ship the same day."
3. **Flask/Beaker icon**   "Third-party tested"   "Every batch is independently lab tested to confirm peptide identity and purity."
4. **Headphones icon**   "Responsive support"   "Call or text us for fast, direct answers to your questions."
5. **Lock/Shield icon**   "Secure checkout"   "Every transaction is protected by a secure, encrypted checkout process."

---

## PAGE 2: CATALOG / SHOP PAGE (Route: `/catalog`)

### Breadcrumb & Header
- Breadcrumb: "Home / Shop"   text-sm, gray-500. "Home" is clickable.
- Title: "Shop"   text-3xl, font-bold, mb-6
- **Controls Bar:** Flex between, mb-8
  - Left: "Show : 9 / 12 / 18 / 24" (clickable numbers, active one bold)
  - Center: Grid/List view toggle icons
  - Right: "Default sorting" dropdown

### Product Grid
- Same Product Card component as Home
- **Grid:** 4 columns, gap-6
- **Products (12 items for page 1):**

| # | Product | Series | Price | Discount |
|---|---------|--------|-------|----------|
| 1 | 2(T) Peptide | Metabolic Series | ~~$199.99~~ $130.00 | -35% |
| 2 | 3(R) Peptide | Metabolic Series | $70.00   $130.00 | -35% |
| 3 | BPC-157 | Recovery Series | ~~$122.99~~ $99.00 | -20% |
| 4 | CJC-1295 No DAC | Growth Series | ~~$76.99~~ $49.99 | -36% |
| 5 | Epithalon | Longevity Series | ~~$230.99~~ $149.99 | -35% |
| 6 | GHK-Cu | Longevity Series | ~~$76.99~~ $49.99 | -35% |
| 7 | IGF-LR3 | Metabolic Series | ~~$107.99~~ $69.00 | -36% |
| 8 | Ipamorelin | Metabolic Series | ~~$85.99~~ $56.00 | -35% |
| 9 | KLOW Blend | Signature Blends | ~~$153.99~~ $100.99 | -34% |
| 10 | MOTS-c | Growth Series | ~~$122.99~~ $80.99 | -34% |
| 11 | NAD+ | Longevity Series | $69.99   $100.00 | -36% |
| 12 | Selank | Neuro Series | $29.99   $59.99 | -36% |

- **Pagination:** Centered, "1 | 2 | &gt;"   active page bg-pink-500 text-white rounded px-3 py-1

---

## PAGE 3: PRODUCT DETAIL PAGE (Route: `/product/:slug`)

### Breadcrumb
- "Home / Shop / Metabolic Series / 3(R) Peptide"   text-sm, gray-500

### Product Layout (2 columns, gap-12)

**Left   Image Gallery:**
- Main image: Large square, bg-gray-100 rounded-lg (PLACEHOLDER: "MAIN PRODUCT IMAGE")
- Thumbnails below: Small squares in a row (optional, 4 placeholders)

**Right   Product Info:**
- **Title:** "3(R) Peptide"   text-3xl, font-bold
- **Price:** "$70.00   $130.00"   text-2xl, font-bold text-gray-900
- **Description:** "A 39 amino acid synthetic peptide engineered as a triple agonist at the GIP, GLP-1, and glucagon receptors, studied for its role in metabolic and glucose-regulation research."   text-gray-600, mb-4
- **Specs List:** text-sm, text-gray-600, space-y-1, mb-6
  - CAS Number: 2381089-83-2
  - Molecular Formula: C221H342N46O68
  - Molecular Weight: 4,731.33 g/mol
  - Amino Acids: 39

- **Options:**
  - Label: "Size:"
  - Dropdown: "Choose an option" (options: 10mg, 20mg)
  - Quantity selector: `-` [1] `+`
  - **Add to Cart button:** Full width, bg-pink-500 text-white rounded-full py-3 font-semibold hover:bg-pink-600
  - Heart icon button beside it (border rounded-full p-3)

- **Share Row:** "Share:" + Facebook, X, Pinterest, LinkedIn, Link icons (small gray circles)

### Tabs Section
- Tabs: "ADDITIONAL INFORMATION" | "APPLICATION METHOD"
- **Active Tab Content (Additional Information):**
  - Simple table: Size | 10mg, 20mg
- **Application Method Tab:** Empty placeholder text "Application instructions will be provided here."

### Reviews Section
- **Layout:** 2 columns
- **Left:** "Reviews" heading + "There are no reviews yet."
- **Right   Review Form:**
  - Title: "Be the first to review '3(R) Peptide'"
  - Subtext: "Your email address will not be published. Required fields are marked *"
  - Star rating: 5 empty stars, clickable
  - Textarea: "Your review *"
  - Input: "Name *"
  - Input: "Email *"
  - Checkbox: "Save my name, email, and website in this browser for the next time I comment."
  - Button: "Submit"   bg-pink-500 text-white rounded-full px-6 py-2

### Related Products
- Section title: "Related Products"
- Horizontal row of 5 product cards (same card component, smaller)

### Recently Viewed
- Section title: "Recently Viewed"
- Horizontal row of small product thumbnails with names and prices

---

## PAGE 4: CONTACT PAGE (Route: `/contact`)

### Breadcrumb
- "Home / Contact"

### Layout (2 columns, gap-12, py-16)

**Left   Get in Touch:**
- H2: "Get in Touch"   text-2xl, font-bold, mb-8
- **Info Item 1:** Mail icon (pink bg circle) + "Email" + "Contact@Obeliskrx.com"
- **Info Item 2:** Clock icon (pink bg circle) + "Business Hours" + "Monday - Friday 9:00 AM - 5:00 PM EST"

**Right   Contact Form:**
- H2: "How We Start Our Business"   text-2xl, font-bold, mb-6
- **Fields:**
  - Row: "Your name" + "Your Email" (2 inputs side by side)
  - Full width: "Customer care" (input)
  - Full width: "Your Message" (textarea, 5 rows)
- **Button:** "Ask A Question"   bg-pink-500 text-white rounded-full px-8 py-3 hover:bg-pink-600

---

## PAGE 5: SHOPPING CART PAGE (Route: `/cart`)

### Breadcrumb/Steps
- "Shopping cart → Checkout → Order complete"   Shopping cart is active/bold

### Layout (2 columns, 70/30 gap-8)

**Left   Cart Items:**
- Table headers: Product | Price | Quantity | Subtotal
- **Cart Item Row:**
  - Remove button (X)
  - Thumbnail: 50x50 bg-gray-100 rounded (PLACEHOLDER)
  - "2(T) Peptide - 20mg"
  - "$130.00"
  - Quantity: `-` [1] `+`
  - "$130.00"
- **Coupon Row:** Input "Coupon code" + "Apply Coupon" button (border border-pink-500 text-pink-500 rounded-full px-4 py-2)

**Right   Cart Totals (Sticky card):**
- Title: "Cart Totals"   text-xl, font-bold, mb-4
- Row: "Subtotal"   "$130.00"
- Row: "Total"   "$130.00" (text-lg, font-bold)
- Button: "Proceed To Checkout"   bg-pink-500 text-white rounded-full w-full py-3 font-semibold

### You May Be Interested In
- Section title: "You May Be Interested In..."
- Horizontal scroll/grid of 5 product cards

---

## FUNCTIONALITY REQUIREMENTS

1. **Cart State:** Use React Context or Zustand. Add to cart updates header badge and total. Cart persists in localStorage.
2. **Routing:** React Router with routes: `/`, `/catalog`, `/product/:id`, `/contact`, `/cart`
3. **Quantity:** Increment/decrement in cart and product detail.
4. **Wishlist:** Heart toggle (visual only, no backend).
5. **Responsive:** Fully mobile-responsive. Hamburger menu on mobile. Grid collapses to 1-2 columns.
6. **Smooth Scroll:** Implement smooth scrolling.
7. **No AI Images:** All image areas should be `div` with `bg-gray-100` or `bg-gray-200`, centered text "IMAGE PLACEHOLDER", and a comment indicating what image goes there.
8. **Hero Video Placeholder:** The hero section should have a `video` tag or a `div` with a comment: `&lt;!-- USER: REPLACE THIS DIV WITH BACKGROUND VIDEO --&gt;`

---

## IMAGE & VIDEO PLACEHOLDER GUIDE (For User Replacement)

Mark these clearly in the code with comments:

1. `&lt;!-- HERO VIDEO: Upload your background video here. Use autoplay, muted, loop --&gt;`
2. `&lt;!-- HERO OVERLAY: Dark gradient overlay on top of video --&gt;`
3. `&lt;!-- PRODUCT IMAGE: Replace with [Product Name] photo --&gt;` (on every card)
4. `&lt;!-- ABOUT IMAGE: Upload lab/research team photo --&gt;`
5. `&lt;!-- PRODUCT DETAIL MAIN IMAGE: Upload 3(R) Peptide hero image --&gt;`

---

## FINAL CHECKLIST

- [ ] All 5 pages created with exact routes
- [ ] Header and Footer are reusable components on all pages
- [ ] Notice section appears above Footer on every page
- [ ] Pink (#E91E63) is used consistently for CTAs, badges, active links
- [ ] All product data is hardcoded as shown above
- [ ] No actual images generated   only labeled placeholders
- [ ] Cart functionality works with state management
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Clean, modern code with component reusability
please use these images we have all website in zip folder also i provide you full page screen shot of this website make sure all think perfect as per my requiremt i want to create this website pixel perfect

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a90b23d8-976a-403b-9fbd-cf84ff078c29).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm   [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
