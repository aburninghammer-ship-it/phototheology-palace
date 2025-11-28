-- Devotional Profiles System
-- Core profile table for tracking people you're ministering to
CREATE TABLE public.devotional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Person details
  name TEXT NOT NULL,
  relationship TEXT NOT NULL, -- child, spouse, friend, student, team_member, mentee
  age_group TEXT, -- child, teen, young_adult, adult, senior
  avatar_emoji TEXT DEFAULT '🙏',
  
  -- Spiritual context
  struggles TEXT[] DEFAULT '{}', -- anxiety, addiction, grief, identity, fear, etc.
  current_situation TEXT, -- Free text about what they're going through
  spiritual_goals TEXT[] DEFAULT '{}',
  preferred_tone TEXT DEFAULT 'comforting', -- comforting, straight-forward, motivational, discipleship, theological
  
  -- PT customization
  preferred_rooms TEXT[] DEFAULT '{}', -- Story, Christ, 24FPS, Sanctuary, Prophecy, etc.
  preferred_themes TEXT[] DEFAULT '{}', -- grief, addiction, identity, fear, hope, etc.
  
  -- Current devotional plan
  active_plan_id UUID REFERENCES devotional_plans(id) ON DELETE SET NULL,
  
  -- Two-way sync (if they have an account)
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_token TEXT UNIQUE,
  invite_sent_at TIMESTAMP WITH TIME ZONE,
  invite_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_devotional_sent_at TIMESTAMP WITH TIME ZONE,
  total_devotionals_sent INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notes/observations for each profile (pastoral care notes)
CREATE TABLE public.devotional_profile_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES devotional_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  note_type TEXT NOT NULL DEFAULT 'observation', -- observation, prayer_point, breakthrough, answered_prayer, concern
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- History of shared devotionals
CREATE TABLE public.devotional_profile_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES devotional_profiles(id) ON DELETE CASCADE,
  day_id UUID REFERENCES devotional_days(id) ON DELETE SET NULL,
  
  -- Share details
  shared_via TEXT NOT NULL DEFAULT 'copy', -- copy, sms, email, whatsapp, in_app
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Custom message sent with devotional
  personal_message TEXT,
  
  -- Tracking (if linked user)
  viewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- AI suggested message that was used
  ai_suggested_message TEXT,
  used_ai_suggestion BOOLEAN DEFAULT false
);

-- Scheduled devotionals/messages
CREATE TABLE public.devotional_profile_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES devotional_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  schedule_type TEXT NOT NULL DEFAULT 'devotional', -- devotional, encouragement, prayer_reminder
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Content
  day_id UUID REFERENCES devotional_days(id) ON DELETE SET NULL,
  custom_message TEXT,
  
  -- Status
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- daily, weekly, monthly
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI-generated insights for each profile
CREATE TABLE public.devotional_profile_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES devotional_profiles(id) ON DELETE CASCADE,
  
  -- Weekly insight data
  insight_period_start DATE NOT NULL,
  insight_period_end DATE NOT NULL,
  
  -- AI Analysis
  emotional_patterns JSONB DEFAULT '[]',
  spiritual_themes JSONB DEFAULT '[]',
  recurring_scriptures TEXT[] DEFAULT '{}',
  areas_improving TEXT[] DEFAULT '{}',
  areas_needing_prayer TEXT[] DEFAULT '{}',
  
  -- Recommendations
  suggested_next_plan TEXT,
  suggested_next_theme TEXT,
  suggested_message TEXT,
  
  -- Summary
  weekly_summary TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.devotional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_profile_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_profile_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_profile_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_profile_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for devotional_profiles
CREATE POLICY "Users can view own profiles" ON public.devotional_profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = linked_user_id);

CREATE POLICY "Users can create own profiles" ON public.devotional_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" ON public.devotional_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles" ON public.devotional_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notes
CREATE POLICY "Users can view notes for own profiles" ON public.devotional_profile_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes" ON public.devotional_profile_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.devotional_profile_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.devotional_profile_notes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for history
CREATE POLICY "Users can view history for own profiles" ON public.devotional_profile_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM devotional_profiles 
    WHERE id = profile_id AND (user_id = auth.uid() OR linked_user_id = auth.uid())
  ));

CREATE POLICY "Users can create history" ON public.devotional_profile_history
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM devotional_profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  ));

-- RLS Policies for schedules
CREATE POLICY "Users can view own schedules" ON public.devotional_profile_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create schedules" ON public.devotional_profile_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON public.devotional_profile_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON public.devotional_profile_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for insights
CREATE POLICY "Users can view insights for own profiles" ON public.devotional_profile_insights
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM devotional_profiles 
    WHERE id = profile_id AND user_id = auth.uid()
  ));

-- Indexes for performance
CREATE INDEX idx_devotional_profiles_user_id ON public.devotional_profiles(user_id);
CREATE INDEX idx_devotional_profiles_linked_user ON public.devotional_profiles(linked_user_id);
CREATE INDEX idx_devotional_profile_notes_profile ON public.devotional_profile_notes(profile_id);
CREATE INDEX idx_devotional_profile_history_profile ON public.devotional_profile_history(profile_id);
CREATE INDEX idx_devotional_profile_schedules_profile ON public.devotional_profile_schedules(profile_id);
CREATE INDEX idx_devotional_profile_schedules_scheduled ON public.devotional_profile_schedules(scheduled_for) WHERE is_sent = false;

-- Generate unique invite token
CREATE OR REPLACE FUNCTION generate_profile_invite_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    token := 'DV' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 10));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM devotional_profiles WHERE invite_token = token);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique invite token';
    END IF;
  END LOOP;
  RETURN token;
END;
$$;