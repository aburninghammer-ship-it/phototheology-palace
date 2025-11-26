-- Fix RLS policies for pt_multiplayer_games to prevent chicken-and-egg issues

-- Drop existing SELECT policy that causes issues during INSERT
DROP POLICY IF EXISTS "Users can view games they're in" ON public.pt_multiplayer_games;

-- Create new SELECT policy that allows:
-- 1) Host to view their own games (fixes the issue during INSERT with .select())
-- 2) Players to view games they're in (using the helper function to avoid recursion)
CREATE POLICY "Users can view games they participate in"
ON public.pt_multiplayer_games
FOR SELECT
USING (
  auth.uid() = host_id 
  OR 
  public.is_player_in_game(id, auth.uid())
);
