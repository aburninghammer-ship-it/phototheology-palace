-- Create storage bucket for Image Bible generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('image-bible', 'image-bible', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public can view image-bible images"
ON storage.objects FOR SELECT
USING (bucket_id = 'image-bible');

-- Only authenticated users (admins) can upload
CREATE POLICY "Authenticated users can upload to image-bible"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'image-bible');

-- Table to track generated images
CREATE TABLE public.image_bible_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  theme TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  prompt_used TEXT,
  UNIQUE(book, chapter)
);

-- Enable RLS
ALTER TABLE public.image_bible_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read cached images
CREATE POLICY "Anyone can view image_bible_cache"
ON public.image_bible_cache FOR SELECT
USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can manage image_bible_cache"
ON public.image_bible_cache FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);