-- Add more granular notification preferences for different challenge types
ALTER TABLE public.notification_preferences
  ADD COLUMN IF NOT EXISTS christ_chapter_challenges BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sanctuary_challenges BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS dimension_challenges BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS connect6_challenges BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS fruit_check_challenges BOOLEAN NOT NULL DEFAULT true;