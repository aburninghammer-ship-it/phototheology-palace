-- Create course progress table
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_name TEXT NOT NULL,
  completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_lesson TEXT,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_name)
);

-- Enable RLS
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
ON public.course_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.course_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.course_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  certificate_type TEXT NOT NULL,
  course_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  certificate_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  share_token TEXT UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own certificates"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id OR (is_public = true));

CREATE POLICY "Users can create their own certificates"
ON public.certificates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates"
ON public.certificates
FOR UPDATE
USING (auth.uid() = user_id);

-- Create study buddies/partners table
CREATE TABLE public.study_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, partner_id),
  CHECK (user_id != partner_id)
);

-- Enable RLS
ALTER TABLE public.study_partners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own partnerships"
ON public.study_partners
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create partnership requests"
ON public.study_partners
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update partnerships they're part of"
ON public.study_partners
FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = partner_id);

-- Create study activity feed table
CREATE TABLE public.study_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.study_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public activities"
ON public.study_activities
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
ON public.study_activities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create spaced repetition schedule table
CREATE TABLE public.spaced_repetition_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS
ALTER TABLE public.spaced_repetition_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own review items"
ON public.spaced_repetition_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own review items"
ON public.spaced_repetition_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review items"
ON public.spaced_repetition_items
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_course_progress_user ON public.course_progress(user_id);
CREATE INDEX idx_certificates_user ON public.certificates(user_id);
CREATE INDEX idx_certificates_share ON public.certificates(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_study_partners_user ON public.study_partners(user_id);
CREATE INDEX idx_study_partners_partner ON public.study_partners(partner_id);
CREATE INDEX idx_study_activities_user ON public.study_activities(user_id);
CREATE INDEX idx_study_activities_public ON public.study_activities(is_public, created_at DESC);
CREATE INDEX idx_spaced_repetition_user_next ON public.spaced_repetition_items(user_id, next_review_date);