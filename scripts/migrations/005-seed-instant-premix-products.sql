-- Migration 005: Seed Instant Premix products
--
-- Inserts or updates 13 Instant Premix product variants in the products table.
-- This migration is idempotent - uses INSERT OR REPLACE to safely rerun.
--
-- Product types included:
-- - Non Milk Tea (Black Tea): 4 variants
-- - Non Milk Tea (Green Tea): 3 variants
-- - Milk Tea: 3 variants
-- - Matcha Tea: 1 variant
-- - Malt Protein: 2 variants
--
-- Run directly on Turso:
--   turso db shell <db-name> < scripts/migrations/005-seed-instant-premix-products.sql
--
-- Note: This migration uses INSERT OR REPLACE which is idempotent and safe to rerun.
-- It will update existing products if they exist, or insert new ones if they don't.

-- Non Milk Tea - Black Tea (4 variants)
INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'black-tea-lemon',
  'Black Tea Premix - Classic Lemon',
  'instant-premix',
  'Fruit-infused black tea with natural lemon — refreshing & healthy',
  'Discover the uniquely crafted Black Tea Fruit Infused Instant Premix Classic - Lemon at Bean Leaf Brew. No added preservatives, colors, or flavors, sweetened with natural fruit sugar, making it low in glycemic index.',
  378,
  440,
  '10 sachets',
  '["/images/a32a5f_5b2ce5c04c6a4bb8833aeee47f1e6c53mv2.webp", "/images/DSC5452.webp"]',
  '["instant", "tea", "lemon", "vitamin c", "antioxidants"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-black-tea","variants":[{"name":"Black Tea Premix - Classic Lemon","weight":"10 sachets","sellingPrice":378,"regularPrice":440}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'black-tea-peach-lemon',
  'Instant Black Tea Peach Lemon',
  'instant-premix',
  'Black tea with peach and lemon — refreshing fruit infusion',
  'Instant Black Tea Peach Lemon is a fruit-infused black tea instant premix. Sweetened with natural fruit sugar, low in glycemic index, with no added preservatives, colours, or flavours. Rich in antioxidants and Vitamin C.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "tea", "peach", "lemon", "antioxidants", "vitamin c", "low gi"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-black-tea","variants":[{"name":"Instant Black Tea Peach Lemon","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'black-tea-blueberry',
  'Instant Black Tea Blueberry',
  'instant-premix',
  'Black tea with blueberry — antioxidant-rich fruit infusion',
  'Instant Black Tea Blueberry is a fruit-infused black tea instant premix. Sweetened with natural fruit sugar, low in glycemic index, with no added preservatives, colours, or flavours. Rich in antioxidants.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "tea", "blueberry", "antioxidants", "low gi"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-black-tea","variants":[{"name":"Instant Black Tea Blueberry","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'black-tea-masala',
  'Instant Black Tea Masala',
  'instant-premix',
  'Spiced black tea premix with traditional masala blend',
  'Instant Black Tea Masala is a spiced black tea instant premix with traditional Indian masala spices. Easy to prepare whether at home, in the office, or on the go.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "tea", "masala", "spiced", "traditional"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-black-tea","variants":[{"name":"Instant Black Tea Masala","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

-- Non Milk Tea - Green Tea (3 variants)
INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'green-tea-masala',
  'Instant Green Tea Masala',
  'instant-premix',
  'Spiced green tea premix with traditional masala blend',
  'Instant Green Tea Masala is a spiced green tea instant premix with traditional Indian masala spices. Rich in catechins and antioxidants. Easy to prepare whether at home, in the office, or on the go.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "green tea", "masala", "spiced", "catechins", "antioxidants"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-green-tea","variants":[{"name":"Instant Green Tea Masala","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'green-tea-cardamom',
  'Instant Green Tea Cardamom',
  'instant-premix',
  'Green tea with aromatic cardamom — refreshing and healthy',
  'Instant Green Tea Cardamom is a green tea instant premix infused with aromatic cardamom. Rich in catechins and antioxidants. No added preservatives, colours, or flavours.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "green tea", "cardamom", "catechins", "antioxidants"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-green-tea","variants":[{"name":"Instant Green Tea Cardamom","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'green-tea-lemon',
  'Instant Green Tea Lemon',
  'instant-premix',
  'Green tea with lemon — antioxidants and Vitamin C boost',
  'Instant Green Tea Lemon is a green tea instant premix with refreshing lemon. Rich in catechins, antioxidants, and Vitamin C. No added preservatives, colours, or flavours.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "green tea", "lemon", "catechins", "antioxidants", "vitamin c"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"non-milk-tea-green-tea","variants":[{"name":"Instant Green Tea Lemon","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

-- Milk Tea (3 variants)
INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'milk-tea-ginger',
  'Milk Tea 3-in-1 Ginger Infused',
  'instant-premix',
  'Classic chai with natural ginger goodness',
  'Discover the uniquely crafted Milk Tea 3-in-1 Ginger Infused Instant Premix at Bean Leaf Brew. Easy to prepare, whether at home, in the office, or on the go.',
  324,
  390,
  '10 sachets',
  '["/images/ginger.webp", "/images/DSC5476.webp"]',
  '["instant", "milk tea", "ginger", "chai", "traditional"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"milk-tea","variants":[{"name":"Milk Tea 3-in-1 Ginger Infused","weight":"10 sachets","sellingPrice":324,"regularPrice":390}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'milk-tea-masala',
  'Instant Premix Milk Tea Masala',
  'instant-premix',
  'Classic milk tea with traditional masala spices',
  'Instant Premix Milk Tea Masala is a classic milk tea instant premix infused with traditional Indian masala spices. Easy to prepare whether at home, in the office, or on the go.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "milk tea", "masala", "spiced", "chai", "traditional"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"milk-tea","variants":[{"name":"Instant Premix MILK TEA MASALA","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'milk-tea-cardamom',
  'Instant Premix Milk Tea Cardamom',
  'instant-premix',
  'Classic milk tea with aromatic cardamom',
  'Instant Premix Milk Tea Cardamom is a classic milk tea instant premix infused with aromatic cardamom. Easy to prepare whether at home, in the office, or on the go.',
  9999,
  9999,
  '10 x 20g packs',
  '[]',
  '["instant", "milk tea", "cardamom", "chai", "traditional"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"milk-tea","variants":[{"name":"Instant Premix MILK TEA CARDAMOM","weight":"10 x 20g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

-- Matcha Tea (1 variant)
INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'matcha-latte',
  'Matcha Latte Classic 3-in-1',
  'instant-premix',
  'Classic matcha latte instant premix — rich, smooth & healthy',
  'Experience the exquisite blend of taste and wellness with Matcha Latte Classic 3-in-1 instant premix at Bean Leaf Brew. Easy to prepare whether at home, in the office, or on the go.',
  378,
  440,
  '10 sachets',
  '["/images/a32a5f_b6149460f45447a5b871bb1e66f622e0mv2.webp", "/images/DSC5466.webp"]',
  '["instant", "matcha", "latte", "green tea", "catechins"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"matcha-tea","variants":[{"name":"Matcha Latte Classic 3-in-1","weight":"10 sachets","sellingPrice":378,"regularPrice":440}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

-- Malt Protein (2 variants)
INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'malt-protein-choco-hazelnut',
  'Instant Premix Malt Choco-Hazelnut',
  'instant-premix',
  'Protein-rich malt with real cocoa and hazelnuts — 15g protein per serve',
  'Instant Premix Malt Choco-Hazelnut is a protein-rich malt premix with real cocoa and hazelnuts. Contains 15g protein per serving (30% of RDA), non-caloric natural sweetener Allulose, supports sustained release of amino acids, and is a source of fiber. Allergens: Contains Milk, Gluten, Nuts.',
  9999,
  9999,
  '5 x 40g packs',
  '[]',
  '["instant", "malt", "protein", "chocolate", "hazelnut", "high protein"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"malt-protein","variants":[{"name":"Instant Premix MALT-CHOCO-HAZELNUT","weight":"5 x 40g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO products (slug, name, category, short_description, description, price, regular_price, weight, images, tags, notes, roast, blend, in_stock, featured, visible, options, weight_options, brewing_equipment_options, created_at, updated_at)
VALUES (
  'malt-protein-kesar-badam',
  'Instant Premix Malt Kesar Badam',
  'instant-premix',
  'Protein-rich malt with saffron and almonds — 15g protein per serve',
  'Instant Premix Malt Kesar Badam is a protein-rich malt premix with saffron (kesar) and almonds. Contains 15g protein per serving (30% of RDA), non-caloric natural sweetener Allulose, supports sustained release of amino acids, and is a source of fiber. Allergens: Contains Milk, Gluten, Nuts.',
  9999,
  9999,
  '5 x 40g packs',
  '[]',
  '["instant", "malt", "protein", "kesar", "badam", "almond", "high protein"]',
  '[]',
  NULL,
  NULL,
  1,
  0,
  1,
  '{"productType":"malt-protein","variants":[{"name":"Instant Premix MALT KESAR BADAM","weight":"5 x 40g packs","sellingPrice":9999,"regularPrice":9999}]}',
  '[]',
  '[]',
  datetime('now'),
  datetime('now')
);
