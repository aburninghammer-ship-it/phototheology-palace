-- Fix RLS policy for pt_multiplayer_players to allow Jeeves system players
-- Drop existing policies
DROP POLICY IF EXISTS "Players can view game players" ON pt_multiplayer_players;
DROP POLICY IF EXISTS "Users can join games as players" ON pt_multiplayer_players;
DROP POLICY IF EXISTS "Service role can manage players" ON pt_multiplayer_players;

-- Allow viewing players in games you're part of
CREATE POLICY "Players can view game players"
ON pt_multiplayer_players
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM pt_multiplayer_players p2
    WHERE p2.game_id = pt_multiplayer_players.game_id
    AND p2.user_id = auth.uid()
  )
  OR
  -- Allow viewing Jeeves players
  user_id IN (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002'
  )
);

-- Allow users to join games AND allow system to create Jeeves players
CREATE POLICY "Users can join games and system can create Jeeves"
ON pt_multiplayer_players
FOR INSERT
WITH CHECK (
  -- Regular users can join as themselves
  (auth.uid() = user_id)
  OR
  -- System can create Jeeves players with special UUIDs
  (
    user_id IN (
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002'
    )
    AND display_name LIKE '%Jeeves%'
  )
);

-- Allow users to update their own player data
CREATE POLICY "Users can update own player data"
ON pt_multiplayer_players
FOR UPDATE
USING (auth.uid() = user_id);