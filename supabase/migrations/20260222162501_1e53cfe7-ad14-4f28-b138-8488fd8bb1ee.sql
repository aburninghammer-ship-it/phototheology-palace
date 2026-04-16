
-- Community Armory: shared theological weapons
CREATE TABLE public.community_armory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  weapon_name TEXT NOT NULL,
  weapon_emoji TEXT NOT NULL DEFAULT '⚔️',
  argument TEXT NOT NULL,
  analysis TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  likes INTEGER NOT NULL DEFAULT 0,
  is_curated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Likes tracking to prevent double-likes
CREATE TABLE public.community_armory_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  weapon_id UUID NOT NULL REFERENCES public.community_armory(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, weapon_id)
);

-- Enable RLS
ALTER TABLE public.community_armory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_armory_likes ENABLE ROW LEVEL SECURITY;

-- Armory policies: authenticated users can read all, insert own, update own
CREATE POLICY "Anyone authenticated can view armory" ON public.community_armory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can share their own weapons" ON public.community_armory
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weapons" ON public.community_armory
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weapons" ON public.community_armory
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone authenticated can view likes" ON public.community_armory_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can like weapons" ON public.community_armory_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike weapons" ON public.community_armory_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_community_armory_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_community_armory_timestamp
  BEFORE UPDATE ON public.community_armory
  FOR EACH ROW EXECUTE FUNCTION public.update_community_armory_updated_at();

-- Index for browsing
CREATE INDEX idx_community_armory_topic ON public.community_armory(topic);
CREATE INDEX idx_community_armory_likes ON public.community_armory(likes DESC);
CREATE INDEX idx_community_armory_curated ON public.community_armory(is_curated) WHERE is_curated = true;
