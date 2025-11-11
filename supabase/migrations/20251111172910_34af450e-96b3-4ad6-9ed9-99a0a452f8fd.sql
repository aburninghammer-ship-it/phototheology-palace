-- Add category column to achievements table
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Add index for faster category queries
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Update existing achievements with categories based on requirement_type
UPDATE achievements
SET category = CASE
  WHEN requirement_type = 'rooms_completed' THEN 'explorer'
  WHEN requirement_type = 'drills_completed' THEN 'scholar'
  WHEN requirement_type = 'perfect_drills' THEN 'perfectionist'
  WHEN requirement_type = 'study_streak' THEN 'dedicated'
  WHEN requirement_type = 'floors_completed' THEN 'master'
  ELSE 'general'
END
WHERE category = 'general';