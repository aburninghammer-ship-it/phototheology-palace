
-- Create user_playlists table
CREATE TABLE public.user_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Playlist',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own playlists"
  ON public.user_playlists FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add playlist_id to user_playlist_items
ALTER TABLE public.user_playlist_items 
  ADD COLUMN playlist_id uuid REFERENCES public.user_playlists(id) ON DELETE CASCADE;

-- Update the check_playlist_limit trigger to work per-playlist
CREATE OR REPLACE FUNCTION public.check_playlist_limit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.playlist_id IS NOT NULL THEN
    IF (SELECT count(*) FROM public.user_playlist_items WHERE playlist_id = NEW.playlist_id) >= 7 THEN
      RAISE EXCEPTION 'Playlist limit of 7 items reached';
    END IF;
  ELSE
    IF (SELECT count(*) FROM public.user_playlist_items WHERE user_id = NEW.user_id AND playlist_id IS NULL) >= 7 THEN
      RAISE EXCEPTION 'Playlist limit of 7 items reached';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
