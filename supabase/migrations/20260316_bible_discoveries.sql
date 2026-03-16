
-- Bible Discovery Board: community-shared biblical insights
CREATE TABLE public.bible_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  discovery_text TEXT NOT NULL,
  category TEXT NOT NULL,
  scripture_refs TEXT[] NOT NULL DEFAULT '{}',
  ai_score INTEGER NOT NULL DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
  ai_analysis TEXT NOT NULL DEFAULT '',
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vote tracking (one vote per user per discovery)
CREATE TABLE public.bible_discovery_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_id UUID NOT NULL REFERENCES public.bible_discoveries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL DEFAULT 'upvote',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(discovery_id, user_id)
);

-- Enable RLS
ALTER TABLE public.bible_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_discovery_votes ENABLE ROW LEVEL SECURITY;

-- Discovery policies
CREATE POLICY "Anyone authenticated can view discoveries" ON public.bible_discoveries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can submit discoveries" ON public.bible_discoveries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discoveries" ON public.bible_discoveries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discoveries" ON public.bible_discoveries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vote policies
CREATE POLICY "Anyone authenticated can view votes" ON public.bible_discovery_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can vote" ON public.bible_discovery_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove votes" ON public.bible_discovery_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their votes" ON public.bible_discovery_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_bible_discoveries_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_bible_discoveries_timestamp
  BEFORE UPDATE ON public.bible_discoveries
  FOR EACH ROW EXECUTE FUNCTION public.update_bible_discoveries_updated_at();

-- Indexes
CREATE INDEX idx_bible_discoveries_votes ON public.bible_discoveries(votes_count DESC);
CREATE INDEX idx_bible_discoveries_created ON public.bible_discoveries(created_at DESC);
CREATE INDEX idx_bible_discoveries_category ON public.bible_discoveries(category);
CREATE INDEX idx_bible_discovery_votes_user ON public.bible_discovery_votes(user_id);
