-- Ensure RLS is enabled on PT multiplayer players table and allow authenticated users to read player rows
ALTER TABLE public.pt_multiplayer_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read of PT multiplayer players"
ON public.pt_multiplayer_players
FOR SELECT
TO authenticated
USING (true);
