-- Add challenges_remaining column to pt_battle_players table
ALTER TABLE pt_battle_players 
ADD COLUMN IF NOT EXISTS challenges_remaining INTEGER DEFAULT 3 NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pt_battle_players_challenges 
ON pt_battle_players(player_id, challenges_remaining);