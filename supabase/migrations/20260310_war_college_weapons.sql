-- War College Weapons table — stores forged weapons from the Weapon Forge exercise
CREATE TABLE public.war_college_weapons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  avatar_id TEXT NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 56),
  weapon_text TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  sharpening_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  forged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, avatar_id, day_number)
);

ALTER TABLE public.war_college_weapons ENABLE ROW LEVEL SECURITY;

-- RLS: users can only read/write their own weapons
CREATE POLICY "Users manage own weapons" ON public.war_college_weapons
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_wcw_user_avatar ON public.war_college_weapons(user_id, avatar_id);
