-- Create reading plans table (templates for different plan types)
CREATE TABLE IF NOT EXISTS public.reading_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_days integer NOT NULL,
  plan_type text NOT NULL, -- 'standard', 'extended', 'nt_focus', 'lite'
  depth_mode text NOT NULL DEFAULT 'standard', -- 'lite', 'standard', 'full'
  daily_schedule jsonb NOT NULL, -- Array of {day: 1, passages: ['Genesis 1-3'], floor_prompts: {...}}
  created_at timestamptz DEFAULT now()
);

-- Create user reading progress table
CREATE TABLE IF NOT EXISTS public.user_reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  current_day integer NOT NULL DEFAULT 1,
  last_completed_day integer DEFAULT 0,
  is_active boolean DEFAULT true,
  custom_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_id, is_active)
);

-- Create daily completions tracking
CREATE TABLE IF NOT EXISTS public.daily_reading_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_progress_id uuid NOT NULL REFERENCES public.user_reading_progress(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  floors_completed text[] DEFAULT '{}', -- Array of floor codes like ['SR', 'CR', 'BF']
  notes text,
  floor_responses jsonb DEFAULT '{}', -- Stores user responses for each floor
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_progress_id, day_number)
);

-- Enable RLS
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reading_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_plans (public read)
CREATE POLICY "Reading plans are viewable by everyone"
  ON public.reading_plans FOR SELECT
  USING (true);

-- RLS Policies for user_reading_progress
CREATE POLICY "Users can view their own reading progress"
  ON public.user_reading_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress"
  ON public.user_reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress"
  ON public.user_reading_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress"
  ON public.user_reading_progress FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for daily_reading_completions
CREATE POLICY "Users can view their own completions"
  ON public.daily_reading_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_reading_progress
      WHERE id = user_progress_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own completions"
  ON public.daily_reading_completions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_reading_progress
      WHERE id = user_progress_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own completions"
  ON public.daily_reading_completions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_reading_progress
      WHERE id = user_progress_id AND user_id = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_reading_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_reading_progress_timestamp
BEFORE UPDATE ON public.user_reading_progress
FOR EACH ROW
EXECUTE FUNCTION update_user_reading_progress_updated_at();

-- Create indexes for performance
CREATE INDEX idx_user_reading_progress_user_id ON public.user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_active ON public.user_reading_progress(user_id, is_active);
CREATE INDEX idx_daily_completions_progress_id ON public.daily_reading_completions(user_progress_id);
CREATE INDEX idx_daily_completions_day ON public.daily_reading_completions(user_progress_id, day_number);