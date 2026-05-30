-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  colors TEXT[] DEFAULT ARRAY['Black', 'White', 'Gray'],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Shipped', 'Delivered')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded')),
  total NUMERIC(10, 2) NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title TEXT,
  image_url TEXT,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

-- Function to decrement stock safely
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - qty
  WHERE id = product_id AND stock >= qty;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: allow all to read
DROP POLICY IF EXISTS "Allow all read products" ON products;
CREATE POLICY "Allow all read products" ON products
  FOR SELECT USING (true);

-- Orders: users can only see their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: users can view items for their orders
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tees', 'tees', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Allow public read tees" ON storage.objects;
CREATE POLICY "Allow public read tees" ON storage.objects
  FOR SELECT USING (bucket_id = 'tees');

DROP POLICY IF EXISTS "Allow authenticated uploads tees" ON storage.objects;
CREATE POLICY "Allow authenticated uploads tees" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tees');

DROP POLICY IF EXISTS "Allow authenticated updates tees" ON storage.objects;
CREATE POLICY "Allow authenticated updates tees" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'tees') WITH CHECK (bucket_id = 'tees');

DROP POLICY IF EXISTS "Allow authenticated deletes tees" ON storage.objects;
CREATE POLICY "Allow authenticated deletes tees" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'tees');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Sample products (optional - uncomment to seed)
/*
INSERT INTO products (title, description, price, original_price, image_urls, stock, sizes, colors) VALUES
('Classic Cotton Tee', 'Premium organic cotton t-shirt with a relaxed fit. Perfect for everyday wear.', 25, 45, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop'], 50, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Navy']),
('Urban Fit Chinos', 'Slim fit chino pants with stretch fabric for all-day comfort.', 78, 95, ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop'], 30, ARRAY['30', '32', '34', '36'], ARRAY['Beige', 'Navy', 'Olive']),
('Graphic Print Tee', 'Bold graphic print on premium cotton. Make a statement.', 34, 75, ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop'], 40, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Red']),
('Linen Casual Shirt', 'Breathable linen shirt for summer days. Lightweight and stylish.', 98, 107, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'], 25, ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Blue', 'Pink']),
('Streetwear Hoodie', 'Heavyweight hoodie with kangaroo pocket. Street ready.', 55, 80, ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop'], 35, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Gray', 'Green']),
('Denim Jacket', 'Classic denim jacket with vintage wash. Timeless style.', 89, 120, ARRAY['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=800&fit=crop'], 20, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black']);
*/
