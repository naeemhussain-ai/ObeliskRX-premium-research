-- Product page "Independently Tested · 99%+ Purity" label ON/OFF (admin Products list)
-- Admin panel khud bhi ye column bana leta hai (ensureProductColumns), ye sirf manual setup ke liye.
ALTER TABLE products ADD COLUMN show_purity_badge TINYINT(1) NOT NULL DEFAULT 1;
