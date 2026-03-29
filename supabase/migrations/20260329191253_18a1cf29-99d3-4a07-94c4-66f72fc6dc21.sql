
CREATE TABLE public.user_playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_type TEXT NOT NULL DEFAULT 'commentary',
  audio_url TEXT,
  audio_meta JSONB DEFAULT '{}',
  position SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Max 7 items per user
CREATE OR REPLACE FUNCTION check_playlist_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT count(*) FROM public.user_playlist_items WHERE user_id = NEW.user_id) >= 7 THEN
    RAISE EXCEPTION 'Playlist limit of 7 items reached';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_playlist_limit
  BEFORE INSERT ON public.user_playlist_items
  FOR EACH ROW
  EXECUTE FUNCTION check_playlist_limit();

ALTER TABLE public.user_playlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own playlist" ON public.user_playlist_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlist" ON public.user_playlist_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlist" ON public.user_playlist_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlist" ON public.user_playlist_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
