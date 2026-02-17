
-- Epic Commentary Playlists
CREATE TABLE public.epic_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  music_track_id TEXT DEFAULT 'none',
  music_volume INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Playlist items (chapters in a playlist)
CREATE TABLE public.epic_playlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.epic_playlists(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, book, chapter)
);

-- Enable RLS
ALTER TABLE public.epic_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epic_playlist_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for playlists
CREATE POLICY "Users can view own playlists" ON public.epic_playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own playlists" ON public.epic_playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.epic_playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.epic_playlists FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for playlist items (through playlist ownership)
CREATE POLICY "Users can view own playlist items" ON public.epic_playlist_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.epic_playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can add to own playlists" ON public.epic_playlist_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.epic_playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own playlist items" ON public.epic_playlist_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.epic_playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete from own playlists" ON public.epic_playlist_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.epic_playlists WHERE id = playlist_id AND user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_epic_playlists_updated_at
  BEFORE UPDATE ON public.epic_playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
