
-- Watch music tracks table
CREATE TABLE public.watch_music_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT,
  mood TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT 'watch',
  assigned_sessions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.watch_music_tracks ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active tracks
CREATE POLICY "Authenticated users can view active watch music tracks"
  ON public.watch_music_tracks
  FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage tracks
CREATE POLICY "Admins can insert watch music tracks"
  ON public.watch_music_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update watch music tracks"
  ON public.watch_music_tracks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete watch music tracks"
  ON public.watch_music_tracks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Timestamp trigger
CREATE TRIGGER update_watch_music_tracks_updated_at
  BEFORE UPDATE ON public.watch_music_tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for uploaded watch music
INSERT INTO storage.buckets (id, name, public) VALUES ('watch-music', 'watch-music', true);

CREATE POLICY "Watch music files are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'watch-music');

CREATE POLICY "Admins can upload watch music"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'watch-music'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete watch music"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'watch-music'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );
