-- Migration 004: Rename instant_premix_options to options
--
-- Renames the column `instant_premix_options` to `options` in the products table.
-- This simplifies the schema naming and aligns with the application-layer property.
--
-- Run directly on Turso:
--   turso db shell <db-name> < scripts/migrations/004-rename-instant-premix-options-to-options.sql
--
-- Note: SQLite ALTER TABLE RENAME COLUMN is supported in SQLite 3.25.0+.
-- Turso uses a modern SQLite version that supports this operation.
--
-- The migration preserves all existing data, constraints, and defaults.
--
-- To verify the column exists before renaming (optional safety check):
--   turso db shell <db-name> \
--     "SELECT name FROM pragma_table_info('products') WHERE name='instant_premix_options';"

ALTER TABLE products RENAME COLUMN instant_premix_options TO options;
