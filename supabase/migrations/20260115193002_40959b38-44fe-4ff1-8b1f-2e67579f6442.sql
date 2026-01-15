-- Add section_key column for paragraph/section identification
ALTER TABLE public.devotional_text_highlights
ADD COLUMN IF NOT EXISTS section_key TEXT DEFAULT 'main';

-- Drop the NOT NULL constraint on devotional_day_id to allow fixing the schema
-- Then recreate with proper constraints
ALTER TABLE public.devotional_text_highlights 
ALTER COLUMN devotional_day_id DROP NOT NULL;

-- Update any existing records (unlikely but safe)
UPDATE public.devotional_text_highlights SET section_key = 'main' WHERE section_key IS NULL;