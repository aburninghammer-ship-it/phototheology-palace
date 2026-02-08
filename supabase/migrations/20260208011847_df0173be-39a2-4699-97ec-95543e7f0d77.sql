-- Add columns for tab ordering preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS pinned_nav_tabs text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS nav_tab_order text[] DEFAULT '{}';