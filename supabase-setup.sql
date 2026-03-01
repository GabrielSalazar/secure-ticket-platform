-- Execute these queries in your Supabase SQL Editor to create the 'event-images' bucket and its security policies.

-- 1. Create the bucket (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view/read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'event-images' );

-- 3. Allow only authenticated users to upload new images
CREATE POLICY "Auth Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'event-images' AND auth.role() = 'authenticated' );

-- 4. Allow users to update/delete their own uploaded images (Optional, good practice)
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'event-images' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'event-images' AND auth.uid() = owner );

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING ( bucket_id = 'event-images' AND auth.uid() = owner );
