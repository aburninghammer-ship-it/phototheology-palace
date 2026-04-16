
-- Bread Alone Fasts
CREATE TABLE public.bread_alone_fasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  duration_tier TEXT NOT NULL CHECK (duration_tier IN ('8h','16h','24h','36h','3d','7d')),
  duration_label TEXT NOT NULL,
  passage_or_theme TEXT NOT NULL,
  assignment_mode TEXT NOT NULL DEFAULT 'hybrid' CHECK (assignment_mode IN ('system','user','hybrid')),
  meal_interval_hours INTEGER NOT NULL DEFAULT 3,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  meals_consumed INTEGER NOT NULL DEFAULT 0,
  gems_collected INTEGER NOT NULL DEFAULT 0,
  breaking_bread_summary TEXT,
  buddy_code TEXT UNIQUE,
  church_fast_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bread_alone_fasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fasts" ON public.bread_alone_fasts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own fasts" ON public.bread_alone_fasts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own fasts" ON public.bread_alone_fasts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own fasts" ON public.bread_alone_fasts FOR DELETE USING (auth.uid() = user_id);

-- Bread Alone Meals
CREATE TABLE public.bread_alone_meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fast_id UUID NOT NULL REFERENCES public.bread_alone_fasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  meal_number INTEGER NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('gem_hunt','deep_dive','prophecy_thread','theme_wall','fire_bread','freestyle')),
  meal_label TEXT NOT NULL,
  palace_room_code TEXT,
  palace_floor INTEGER,
  passage TEXT,
  journal_entry TEXT,
  gems_found TEXT[],
  questions_raised TEXT[],
  suggested_by TEXT NOT NULL DEFAULT 'system' CHECK (suggested_by IN ('system','user')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bread_alone_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals" ON public.bread_alone_meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own meals" ON public.bread_alone_meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.bread_alone_meals FOR UPDATE USING (auth.uid() = user_id);

-- Bread Alone Buddies
CREATE TABLE public.bread_alone_buddies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fast_id UUID NOT NULL REFERENCES public.bread_alone_fasts(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL,
  buddy_id UUID NOT NULL,
  invite_code TEXT NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bread_alone_buddies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own buddy pairings" ON public.bread_alone_buddies FOR SELECT USING (auth.uid() = inviter_id OR auth.uid() = buddy_id);
CREATE POLICY "Users can create buddy invites" ON public.bread_alone_buddies FOR INSERT WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY "Buddies can accept invites" ON public.bread_alone_buddies FOR UPDATE USING (auth.uid() = buddy_id);

-- Bread Alone Church Fasts
CREATE TABLE public.bread_alone_church_fasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  passage_or_theme TEXT NOT NULL,
  duration_tier TEXT NOT NULL CHECK (duration_tier IN ('8h','16h','24h','36h','3d','7d')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  participant_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bread_alone_church_fasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view church fasts" ON public.bread_alone_church_fasts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Church members can create fasts" ON public.bread_alone_church_fasts FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update church fasts" ON public.bread_alone_church_fasts FOR UPDATE USING (auth.uid() = created_by);

-- Foreign key from fasts to church_fasts
ALTER TABLE public.bread_alone_fasts ADD CONSTRAINT bread_alone_fasts_church_fast_id_fkey FOREIGN KEY (church_fast_id) REFERENCES public.bread_alone_church_fasts(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX idx_bread_alone_fasts_user ON public.bread_alone_fasts(user_id);
CREATE INDEX idx_bread_alone_fasts_status ON public.bread_alone_fasts(status);
CREATE INDEX idx_bread_alone_meals_fast ON public.bread_alone_meals(fast_id);
CREATE INDEX idx_bread_alone_church_fasts_church ON public.bread_alone_church_fasts(church_id);

-- Updated_at triggers
CREATE TRIGGER update_bread_alone_fasts_updated_at BEFORE UPDATE ON public.bread_alone_fasts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bread_alone_church_fasts_updated_at BEFORE UPDATE ON public.bread_alone_church_fasts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bread_alone_fasts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bread_alone_church_fasts;
