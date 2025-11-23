-- Add preferred_translation column to user_reading_progress
ALTER TABLE user_reading_progress 
ADD COLUMN IF NOT EXISTS preferred_translation TEXT DEFAULT 'kjv';