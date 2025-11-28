-- Study Partnerships table for 1:1 partner mode
CREATE TABLE public.study_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined', 'ended')),
  invitation_message TEXT,
  partnership_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_both_completed_date DATE,
  total_sessions_together INTEGER NOT NULL DEFAULT 0,
  bonus_xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Partnership daily activity tracking
CREATE TABLE public.partnership_daily_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_id UUID NOT NULL REFERENCES public.study_partnerships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_mastery BOOLEAN DEFAULT false,
  completed_reading BOOLEAN DEFAULT false,
  completed_challenge BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  bonus_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(partnership_id, user_id, activity_date)
);

-- Partnership nudges sent
CREATE TABLE public.partnership_nudges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_id UUID NOT NULL REFERENCES public.study_partnerships(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nudge_type TEXT NOT NULL DEFAULT 'encouragement' CHECK (nudge_type IN ('encouragement', 'reminder', 'celebration', 'mercy_carry')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.study_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_nudges ENABLE ROW LEVEL SECURITY;

-- RLS policies for study_partnerships
CREATE POLICY "Users can view their own partnerships"
ON public.study_partnerships FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create partnership invitations"
ON public.study_partnerships FOR INSERT
WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can update partnerships they're part of"
ON public.study_partnerships FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS policies for partnership_daily_activity
CREATE POLICY "Users can view activity for their partnerships"
ON public.partnership_daily_activity FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.study_partnerships sp
    WHERE sp.id = partnership_id
    AND (sp.user1_id = auth.uid() OR sp.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can insert their own activity"
ON public.partnership_daily_activity FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
ON public.partnership_daily_activity FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for partnership_nudges
CREATE POLICY "Users can view nudges for their partnerships"
ON public.partnership_nudges FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send nudges"
ON public.partnership_nudges FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Indexes for performance
CREATE INDEX idx_partnerships_user1 ON public.study_partnerships(user1_id);
CREATE INDEX idx_partnerships_user2 ON public.study_partnerships(user2_id);
CREATE INDEX idx_partnerships_status ON public.study_partnerships(status);
CREATE INDEX idx_partnership_activity_date ON public.partnership_daily_activity(activity_date);
CREATE INDEX idx_partnership_activity_partnership ON public.partnership_daily_activity(partnership_id);

-- Function to update partnership streak when both complete
CREATE OR REPLACE FUNCTION public.update_partnership_streak()
RETURNS TRIGGER AS $$
DECLARE
  partner_completed BOOLEAN;
  partnership_record RECORD;
  partner_user_id UUID;
BEGIN
  -- Get the partnership
  SELECT * INTO partnership_record
  FROM public.study_partnerships
  WHERE id = NEW.partnership_id AND status = 'active';
  
  IF NOT FOUND THEN RETURN NEW; END IF;
  
  -- Determine partner's user_id
  IF partnership_record.user1_id = NEW.user_id THEN
    partner_user_id := partnership_record.user2_id;
  ELSE
    partner_user_id := partnership_record.user1_id;
  END IF;
  
  -- Check if partner also completed today
  SELECT EXISTS (
    SELECT 1 FROM public.partnership_daily_activity
    WHERE partnership_id = NEW.partnership_id
    AND user_id = partner_user_id
    AND activity_date = NEW.activity_date
    AND (completed_mastery = true OR completed_reading = true OR completed_challenge = true)
  ) INTO partner_completed;
  
  -- If both completed today and not already counted
  IF partner_completed AND partnership_record.last_both_completed_date IS DISTINCT FROM NEW.activity_date THEN
    -- Check if streak continues (yesterday or first day)
    IF partnership_record.last_both_completed_date = NEW.activity_date - 1 
       OR partnership_record.partnership_streak = 0 THEN
      UPDATE public.study_partnerships
      SET 
        partnership_streak = partnership_streak + 1,
        longest_streak = GREATEST(longest_streak, partnership_streak + 1),
        last_both_completed_date = NEW.activity_date,
        total_sessions_together = total_sessions_together + 1,
        updated_at = now()
      WHERE id = NEW.partnership_id;
    ELSE
      -- Streak broken, restart at 1
      UPDATE public.study_partnerships
      SET 
        partnership_streak = 1,
        last_both_completed_date = NEW.activity_date,
        total_sessions_together = total_sessions_together + 1,
        updated_at = now()
      WHERE id = NEW.partnership_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for streak updates
CREATE TRIGGER update_partnership_streak_trigger
AFTER INSERT OR UPDATE ON public.partnership_daily_activity
FOR EACH ROW
EXECUTE FUNCTION public.update_partnership_streak();

-- Add Two-by-Two achievement
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_count, points)
VALUES 
  ('Two-by-Two', 'Complete 7 days of study with your partner', '👥', 'partnership', 'partnership_streak', 7, 100),
  ('Iron Sharpens Iron', 'Complete 30 days of study with your partner', '⚔️', 'partnership', 'partnership_streak', 30, 500),
  ('Threefold Cord', 'Earn 1000 bonus XP with your partner', '🔗', 'partnership', 'partnership_bonus_xp', 1000, 250)
ON CONFLICT DO NOTHING;