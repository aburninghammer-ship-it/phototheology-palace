-- War College: 56-Day Tiered Avatar Training System
-- 3 tables: enrollments, day completions, weapons

-- ── Enrollments ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.war_college_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  avatar_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'abandoned')),
  completed_at TIMESTAMPTZ,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, avatar_id)
);

CREATE INDEX IF NOT EXISTS idx_wc_enrollments_user
  ON public.war_college_enrollments(user_id);

-- ── Day Completions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.war_college_day_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL
    REFERENCES public.war_college_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 56),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  mastery_score INTEGER,
  drill_completed BOOLEAN NOT NULL DEFAULT false,
  weapon_forged BOOLEAN NOT NULL DEFAULT false,
  jeeves_debrief_used BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_wc_completions_enrollment
  ON public.war_college_day_completions(enrollment_id);

-- ── Weapons ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.war_college_weapons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  enrollment_id UUID NOT NULL
    REFERENCES public.war_college_enrollments(id) ON DELETE CASCADE,
  avatar_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  weapon_name TEXT NOT NULL,
  weapon_text TEXT NOT NULL,
  topic TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wc_weapons_user
  ON public.war_college_weapons(user_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.war_college_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.war_college_day_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.war_college_weapons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wc enrollments"
  ON public.war_college_enrollments
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own wc day completions"
  ON public.war_college_day_completions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own wc weapons"
  ON public.war_college_weapons
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
