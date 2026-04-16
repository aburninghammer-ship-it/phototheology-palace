-- Add cross-device sync columns to user_preferences
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS app_font_size text DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS music_volume integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS recent_pages jsonb DEFAULT '[]'::jsonb;