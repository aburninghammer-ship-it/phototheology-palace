-- Update RLS policy for game_moves to allow null player_id for Jeeves/system moves
DROP POLICY IF EXISTS "Players can insert game moves" ON public.game_moves;

CREATE POLICY "Players can insert game moves"
ON public.game_moves
FOR INSERT
WITH CHECK (
  -- Allow if the player_id matches the authenticated user
  (auth.uid() = player_id)
  OR
  -- Allow null player_id for system/Jeeves moves if user is a player in the game
  (player_id IS NULL AND EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = game_moves.game_id 
    AND (games.player1_id = auth.uid() OR games.player2_id = auth.uid())
  ))
);