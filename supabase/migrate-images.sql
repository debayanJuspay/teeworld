-- Fix the products table schema (run this in Supabase SQL Editor)

-- 1. Add the new image_urls column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';

-- 2. Migrate existing single image_url data into the new array column
DO $$
BEGIN
  -- Check if old image_url column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    -- Copy single URLs into array format
    UPDATE products
    SET image_urls = ARRAY[image_url]
    WHERE image_url IS NOT NULL AND image_url <> '' AND image_urls = '{}';
  END IF;
END $$;

-- 3. Drop the old column (safe to run after verifying migration)
ALTER TABLE products DROP COLUMN IF EXISTS image_url;

-- 4. Storage bucket setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('tees', 'tees', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage policies
DROP POLICY IF EXISTS "Allow public read tees" ON storage.objects;
CREATE POLICY "Allow public read tees" ON storage.objects
  FOR SELECT USING (bucket_id = 'tees');

DROP POLICY IF EXISTS "Allow authenticated uploads tees" ON storage.objects;
CREATE POLICY "Allow authenticated uploads tees" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tees');
