-- Migration 003: Add premix subcategories to products table
--
-- Updates the category CHECK constraint to include premix subcategories:
--   non-milk-tea, milk-tea, matcha-tea, malt-protein
--
-- Run directly on Turso:
--   turso db shell <db-name> < scripts/migrations/003-add-premix-categories.sql
--
-- Note: SQLite doesn't support ALTER TABLE to modify CHECK constraints directly.
-- This migration recreates the table with the updated constraint.
--
-- Backup data before running this migration.

BEGIN TRANSACTION;

-- Create new table with updated constraint
CREATE TABLE products_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('ground-coffee','whole-bean','instant-premix','non-milk-tea','milk-tea','matcha-tea','malt-protein','filter-coffee-decoction','merchandise-accessories')),
  price REAL NOT NULL,
  regular_price REAL,
  images TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  in_stock INTEGER NOT NULL DEFAULT 1,
  weight TEXT,
  weight_options TEXT NOT NULL DEFAULT '[]',
  brewing_equipment_options TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '[]',
  roast TEXT,
  blend TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  ean TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Copy data from old table to new table
INSERT INTO products_new SELECT * FROM products;

-- Drop old table
DROP TABLE products;

-- Rename new table to products
ALTER TABLE products_new RENAME TO products;

-- Recreate indexes
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_featured ON products (featured);

COMMIT;
