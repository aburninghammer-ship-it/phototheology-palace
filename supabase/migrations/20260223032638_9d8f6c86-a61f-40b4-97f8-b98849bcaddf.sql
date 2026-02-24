
-- Add subtitle column to defense_arsenal
ALTER TABLE public.defense_arsenal ADD COLUMN IF NOT EXISTS subtitle text;

-- Add subtitle column to community_armory
ALTER TABLE public.community_armory ADD COLUMN IF NOT EXISTS subtitle text;
