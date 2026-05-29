-- Fix: product deletion fails because product_id is NOT NULL
-- but the FK has ON DELETE SET NULL, causing a conflict.
-- This migration drops the NOT NULL constraint so deleted products
-- don't break order history.

ALTER TABLE order_items
  ALTER COLUMN product_id DROP NOT NULL;
