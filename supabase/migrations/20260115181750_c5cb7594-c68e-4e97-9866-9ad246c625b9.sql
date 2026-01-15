-- Add study_buddy_theme column to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS study_buddy_theme text DEFAULT 'dark';