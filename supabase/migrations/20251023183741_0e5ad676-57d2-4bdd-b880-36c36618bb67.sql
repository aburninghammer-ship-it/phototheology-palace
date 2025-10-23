-- Add streak tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS daily_study_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_study_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS gem_creation_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_gem_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS chain_chess_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_chess_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS equations_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_equations_streak integer DEFAULT 0;