-- Fix infinite recursion in RLS policy for pt_multiplayer_players

-- 1) Create helper function that checks if current user is a player in the given game
CREATE OR REPLACE FUNCTION public.is_player_in_game(_game_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.pt_multiplayer_players
    WHERE game_id = _game_id
      AND user_id = _user_id
  );
$$;

-- 2) Update existing policy to use the helper function instead of directly querying the table
ALTER POLICY "Users can view players in their games"
ON public.pt_multiplayer_players
USING (
  public.is_player_in_game(game_id, auth.uid())
);
