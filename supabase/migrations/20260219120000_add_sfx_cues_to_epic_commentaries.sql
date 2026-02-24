-- Add sfx_cues column to epic_commentaries for narrative sound effect cue data
ALTER TABLE epic_commentaries
ADD COLUMN IF NOT EXISTS sfx_cues JSONB DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN epic_commentaries.sfx_cues IS 'JSON array of sound effect cues with timing positions for atmospheric audio layering during playback';
