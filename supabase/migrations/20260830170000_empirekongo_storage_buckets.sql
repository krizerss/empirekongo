-- EmpireKongo: Storage buckets for profile photos and article images
-- Timestamp: 20260830170000

-- ─── 1. CREATE STORAGE BUCKETS ───────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- ─── 2. RLS POLICIES FOR profile-photos ──────────────────────────────────────

-- Public read access
DROP POLICY IF EXISTS "profile_photos_public_read" ON storage.objects;
CREATE POLICY "profile_photos_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Authenticated users can upload their own profile photo
DROP POLICY IF EXISTS "profile_photos_auth_upload" ON storage.objects;
CREATE POLICY "profile_photos_auth_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own profile photo
DROP POLICY IF EXISTS "profile_photos_auth_update" ON storage.objects;
CREATE POLICY "profile_photos_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own profile photo
DROP POLICY IF EXISTS "profile_photos_auth_delete" ON storage.objects;
CREATE POLICY "profile_photos_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ─── 3. RLS POLICIES FOR article-images ──────────────────────────────────────

-- Public read access
DROP POLICY IF EXISTS "article_images_public_read" ON storage.objects;
CREATE POLICY "article_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Authenticated users can upload article images
DROP POLICY IF EXISTS "article_images_auth_upload" ON storage.objects;
CREATE POLICY "article_images_auth_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own article images
DROP POLICY IF EXISTS "article_images_auth_update" ON storage.objects;
CREATE POLICY "article_images_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'article-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own article images
DROP POLICY IF EXISTS "article_images_auth_delete" ON storage.objects;
CREATE POLICY "article_images_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
