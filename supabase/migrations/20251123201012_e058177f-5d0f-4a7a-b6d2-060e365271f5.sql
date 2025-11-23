-- Add navigation_style preference to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS navigation_style TEXT DEFAULT 'full' 
CHECK (navigation_style IN ('simplified', 'full'));