-- Pending orders table for webhook-driven order creation
-- Stores cart + delivery data before Razorpay checkout opens.
-- The webhook creates the real order when Razorpay confirms payment.

CREATE TABLE IF NOT EXISTS pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delivery JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','captured','failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pending_orders_razorpay_order_id
  ON pending_orders(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_pending_orders_user_id
  ON pending_orders(user_id);

ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own pending orders" ON pending_orders;
CREATE POLICY "Users can view own pending orders"
  ON pending_orders FOR SELECT
  USING (auth.uid() = user_id);
