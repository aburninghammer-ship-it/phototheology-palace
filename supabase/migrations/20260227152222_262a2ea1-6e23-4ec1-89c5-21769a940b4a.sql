
-- Table to cache generated baptism study audio files
CREATE TABLE public.baptism_study_audio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.baptism_lessons(id) ON DELETE CASCADE,
  fundamental_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  share_token TEXT UNIQUE DEFAULT 'BS' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 8)),
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  voice TEXT NOT NULL DEFAULT 'nova',
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'error')),
  error_message TEXT,
  generated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one audio per lesson per voice
CREATE UNIQUE INDEX idx_baptism_audio_lesson_voice ON public.baptism_study_audio(lesson_id, voice);

-- Index for share token lookups
CREATE INDEX idx_baptism_audio_share_token ON public.baptism_study_audio(share_token) WHERE share_token IS NOT NULL;

-- Enable RLS
ALTER TABLE public.baptism_study_audio ENABLE ROW LEVEL SECURITY;

-- Anyone can read ready audio (for share links)
CREATE POLICY "Anyone can view ready audio"
  ON public.baptism_study_audio FOR SELECT
  USING (status = 'ready');

-- Authenticated users can insert (trigger generation)
CREATE POLICY "Authenticated users can insert audio"
  ON public.baptism_study_audio FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only the generator or admins can update
CREATE POLICY "Generator can update audio"
  ON public.baptism_study_audio FOR UPDATE
  USING (auth.uid() = generated_by OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_baptism_study_audio_updated_at
  BEFORE UPDATE ON public.baptism_study_audio
  FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();

-- Storage bucket for baptism study audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('baptism-study-audio', 'baptism-study-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for the bucket
CREATE POLICY "Public read access for baptism audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'baptism-study-audio');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload baptism audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'baptism-study-audio' AND auth.uid() IS NOT NULL);

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update baptism audio"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'baptism-study-audio' AND auth.uid() IS NOT NULL);
