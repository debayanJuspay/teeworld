-- Migration: Fix order_items product snapshots and add payment_status to orders
-- Run this in Supabase SQL Editor

-- 1. Add product snapshot columns to order_items so deleted products still show info
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT;

-- 2. Add payment_status to orders for explicit payment tracking
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded'));

-- 3. Index on payment_status for fast filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. Backfill: set payment_status to 'captured' for existing Paid orders
UPDATE orders
SET payment_status = 'captured'
WHERE status = 'Paid' AND payment_status = 'pending';
