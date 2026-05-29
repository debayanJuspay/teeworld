-- Add status column to products for draft/active support
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
  CHECK (status IN ('active', 'draft'));

-- Ensure existing products are marked active
UPDATE products SET status = 'active' WHERE status IS NULL;
