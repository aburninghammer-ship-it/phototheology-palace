-- Add missing columns to user_preferences for suite mode functionality
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS has_seen_mode_selector boolean DEFAULT false;

ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS suite_mode text DEFAULT 'full_suite';

ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS study_buddy_theme text DEFAULT 'dark';