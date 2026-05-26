-- Storage bucket setup (run this separately if bucket/policy issues persist)

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tees', 'tees', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read tees" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads tees" ON storage.objects;

-- Allow anyone to read files from the tees bucket
CREATE POLICY "Allow public read tees" ON storage.objects
  FOR SELECT USING (bucket_id = 'tees');

-- Allow authenticated users to upload files to the tees bucket
CREATE POLICY "Allow authenticated uploads tees" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tees');

-- Also allow authenticated users to update/delete their own files
DROP POLICY IF EXISTS "Allow authenticated updates tees" ON storage.objects;
CREATE POLICY "Allow authenticated updates tees" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'tees') WITH CHECK (bucket_id = 'tees');

DROP POLICY IF EXISTS "Allow authenticated deletes tees" ON storage.objects;
CREATE POLICY "Allow authenticated deletes tees" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'tees');
