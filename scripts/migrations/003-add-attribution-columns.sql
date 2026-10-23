-- Add customer_json and attribution_json columns to pending_orders table
-- These columns store customer delivery details and UTM attribution data for order processing

ALTER TABLE pending_orders ADD COLUMN customer_json TEXT;
ALTER TABLE pending_orders ADD COLUMN attribution_json TEXT;
