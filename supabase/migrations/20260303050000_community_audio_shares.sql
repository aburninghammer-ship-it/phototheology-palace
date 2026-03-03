-- Community Audio Shares: storage bucket for shared audio commentaries
-- Public read, authenticated upload, 100MB limit

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-audio',
  'community-audio',
  true,
  104857600, -- 100MB
  ARRAY['audio/wav', 'audio/mpeg', 'audio/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket)
CREATE POLICY "community_audio_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-audio');

-- Authenticated users can upload
CREATE POLICY "community_audio_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'community-audio');
