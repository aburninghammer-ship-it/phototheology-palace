-- Add granular study reminder preferences
ALTER TABLE notification_preferences 
ADD COLUMN IF NOT EXISTS reading_plan_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS devotional_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS palace_practice_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS memory_challenge_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS streak_protection_alerts boolean DEFAULT true;