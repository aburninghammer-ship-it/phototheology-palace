-- Fix PT Scrabble board update policy so any authenticated player in a game can update that game's board_state
DROP POLICY IF EXISTS "Players can update game board" ON public.pt_scrabble_games;

CREATE POLICY "Players can update game board"
ON public.pt_scrabble_games
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.pt_scrabble_players p
    WHERE p.game_id = pt_scrabble_games.id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.pt_scrabble_players p
    WHERE p.game_id = pt_scrabble_games.id
      AND p.user_id = auth.uid()
  )
);