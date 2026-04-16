-- Add new ministry roles for Living Manna features
ALTER TYPE public.ministry_role ADD VALUE IF NOT EXISTS 'announcements_lead';
ALTER TYPE public.ministry_role ADD VALUE IF NOT EXISTS 'events_lead';
ALTER TYPE public.ministry_role ADD VALUE IF NOT EXISTS 'community_lead';
ALTER TYPE public.ministry_role ADD VALUE IF NOT EXISTS 'livestream_lead';
ALTER TYPE public.ministry_role ADD VALUE IF NOT EXISTS 'discipleship_lead';