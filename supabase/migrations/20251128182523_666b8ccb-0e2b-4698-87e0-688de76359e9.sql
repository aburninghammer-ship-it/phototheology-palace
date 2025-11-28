-- Devotional Plans - Master table for user-created devotionals
CREATE TABLE public.devotional_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('standard', '24fps', 'blueprint', 'room-driven', 'verse-genetics')),
  duration INTEGER NOT NULL CHECK (duration IN (7, 14, 21, 30, 40)),
  study_style TEXT DEFAULT 'reading' CHECK (study_style IN ('reading', 'memory', 'study', 'meditation', 'battle')),
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'active', 'completed')),
  current_day INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Devotional Days - Individual days content
CREATE TABLE public.devotional_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.devotional_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT,
  room_assignment TEXT,
  floor_number INTEGER,
  visual_imagery TEXT,
  memory_hook TEXT,
  cross_references TEXT[],
  application TEXT,
  prayer TEXT,
  challenge TEXT,
  journal_prompt TEXT,
  sanctuary_station TEXT,
  christ_connection TEXT NOT NULL,
  additional_content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_id, day_number)
);

-- User devotional progress
CREATE TABLE public.devotional_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.devotional_plans(id) ON DELETE CASCADE,
  day_id UUID NOT NULL REFERENCES public.devotional_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  journal_entry TEXT,
  reflection_notes TEXT,
  time_spent_minutes INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(user_id, day_id)
);

-- Team/Group devotional enrollments
CREATE TABLE public.devotional_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.devotional_plans(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  current_day INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, plan_id)
);

-- Enable RLS
ALTER TABLE public.devotional_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_enrollments ENABLE ROW LEVEL SECURITY;

-- Devotional Plans policies
CREATE POLICY "Users can view own plans" ON public.devotional_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public plans" ON public.devotional_plans
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own plans" ON public.devotional_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.devotional_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.devotional_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Devotional Days policies
CREATE POLICY "Users can view days of own plans" ON public.devotional_days
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devotional_plans WHERE id = plan_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.devotional_plans WHERE id = plan_id AND is_public = true)
    OR EXISTS (SELECT 1 FROM public.devotional_enrollments WHERE plan_id = devotional_days.plan_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert days to own plans" ON public.devotional_days
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.devotional_plans WHERE id = plan_id AND user_id = auth.uid())
  );

-- Devotional Progress policies
CREATE POLICY "Users can view own progress" ON public.devotional_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.devotional_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.devotional_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Enrollment policies
CREATE POLICY "Users can view own enrollments" ON public.devotional_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.devotional_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON public.devotional_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_devotional_plans_user ON public.devotional_plans(user_id);
CREATE INDEX idx_devotional_plans_status ON public.devotional_plans(status);
CREATE INDEX idx_devotional_days_plan ON public.devotional_days(plan_id);
CREATE INDEX idx_devotional_progress_user ON public.devotional_progress(user_id);
CREATE INDEX idx_devotional_enrollments_user ON public.devotional_enrollments(user_id);

-- Update trigger
CREATE TRIGGER update_devotional_plans_updated_at
  BEFORE UPDATE ON public.devotional_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();