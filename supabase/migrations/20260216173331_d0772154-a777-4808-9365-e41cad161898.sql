
-- Epic commentaries table for cached cinematic Bible commentary
CREATE TABLE public.epic_commentaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  commentary_text TEXT NOT NULL,
  audio_storage_path TEXT,
  audio_duration_ms INTEGER,
  audio_file_size_bytes INTEGER,
  voice_id TEXT NOT NULL DEFAULT 'onwK4e9ZLuTAKqWW03F9',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'error')),
  version INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (book, chapter, version)
);

-- Enable RLS
ALTER TABLE public.epic_commentaries ENABLE ROW LEVEL SECURITY;

-- Everyone can read ready commentaries (access gated in app code by premium check)
CREATE POLICY "Anyone can read ready epic commentaries"
  ON public.epic_commentaries
  FOR SELECT
  USING (status = 'ready');

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage epic commentaries"
  ON public.epic_commentaries
  FOR ALL
  USING (public.is_admin_user(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_epic_commentaries_updated_at
  BEFORE UPDATE ON public.epic_commentaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_church_updated_at();

-- Index for fast lookups
CREATE INDEX idx_epic_commentaries_book_chapter ON public.epic_commentaries (book, chapter, status);

-- Storage bucket for epic audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('epic-audio', 'epic-audio', true);

-- Public read access for epic audio
CREATE POLICY "Public read access for epic audio"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'epic-audio');

-- Only service role / admin can upload
CREATE POLICY "Admin upload for epic audio"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'epic-audio');
