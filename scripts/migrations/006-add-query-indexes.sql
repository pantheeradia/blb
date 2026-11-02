-- Composite indexes for the application's most frequent filters and sorts.
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at
  ON orders (status, created_at);

CREATE INDEX IF NOT EXISTS idx_products_visible_category
  ON products (visible, category);

CREATE INDEX IF NOT EXISTS idx_products_visible_featured
  ON products (visible, featured);

CREATE INDEX IF NOT EXISTS idx_pending_orders_created_at
  ON pending_orders (created_at);
