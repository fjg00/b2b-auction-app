-- STORAGE POLICIES FOR 'verification-documents' BUCKET

-- 1. Allow authenticated users to upload verification documents
-- (Only to their own folder)
CREATE POLICY "Authenticated Upload Verification"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- 2. Allow users to view ONLY their own verification documents
CREATE POLICY "Owner Read Verification"
ON storage.objects FOR SELECT
USING ( 
  bucket_id = 'verification-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[2] = auth.uid()::text
);


-- STORAGE POLICIES FOR 'avatars' BUCKET

-- 1. Allow authenticated users to upload avatars
CREATE POLICY "Authenticated Upload Avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 2. Allow public access to view avatars
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 3. Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );
