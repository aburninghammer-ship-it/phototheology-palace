-- Add category column to user_gems table
ALTER TABLE public.user_gems
ADD COLUMN category TEXT;

-- Add index for category filtering
CREATE INDEX idx_user_gems_category ON public.user_gems(category);