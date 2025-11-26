-- Add image columns to lots table
ALTER TABLE lots 
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS images text[];

-- STORAGE POLICIES FOR 'lot-images' BUCKET

-- 1. Enable RLS on the objects table (if not already enabled)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'lot-images' );

-- 3. Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lot-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Allow users to update/delete their own images (Optional but good practice)
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'lot-images' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'lot-images' AND auth.uid() = owner );

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'lot-images' AND auth.uid() = owner );
