-- Add suite_mode column to user_preferences table
-- Allows users to choose between "guest_house" (simplified) and "full_suite" (all features)
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS suite_mode text DEFAULT 'full_suite';

-- Track if user has seen the mode selection modal (for first-time users)
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS has_seen_mode_selector boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.user_preferences.suite_mode IS 'User interface mode: guest_house (simplified, 6 tabs) or full_suite (all features)';
COMMENT ON COLUMN public.user_preferences.has_seen_mode_selector IS 'Whether user has seen the initial mode selection modal';
