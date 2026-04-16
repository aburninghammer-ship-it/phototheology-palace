-- Add new columns for gem styles, depth, and daily gem feature
ALTER TABLE generated_gems ADD COLUMN IF NOT EXISTS gem_style TEXT;
ALTER TABLE generated_gems ADD COLUMN IF NOT EXISTS gem_depth TEXT DEFAULT 'study';
ALTER TABLE generated_gems ADD COLUMN IF NOT EXISTS passage_focus TEXT;
ALTER TABLE generated_gems ADD COLUMN IF NOT EXISTS is_gem_of_day BOOLEAN DEFAULT false;

-- Create index for efficient daily gem lookup
CREATE INDEX IF NOT EXISTS idx_generated_gems_daily ON generated_gems (is_gem_of_day, created_at DESC);

-- Create index for style-based queries
CREATE INDEX IF NOT EXISTS idx_generated_gems_style ON generated_gems (gem_style);

COMMENT ON COLUMN generated_gems.gem_style IS 'The style of gem: typology, hebrew_greek, prophecy, palace, chiasm, number, story';
COMMENT ON COLUMN generated_gems.gem_depth IS 'Depth level: quick, study, deep';
COMMENT ON COLUMN generated_gems.passage_focus IS 'Optional passage the gem focuses on';
COMMENT ON COLUMN generated_gems.is_gem_of_day IS 'True if this is the shared Gem of the Day';
