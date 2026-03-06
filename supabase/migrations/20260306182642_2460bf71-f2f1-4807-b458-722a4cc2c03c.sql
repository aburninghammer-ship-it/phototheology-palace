-- Host can update any player's record (needed for dealing cards at game start)
CREATE POLICY "Host can update players in game" ON public.pt_scrabble_players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.pt_scrabble_games
      WHERE id = pt_scrabble_players.game_id
      AND host_user_id = auth.uid()
    )
  );