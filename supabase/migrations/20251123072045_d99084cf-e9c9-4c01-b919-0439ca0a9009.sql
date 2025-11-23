-- Create guild challenge participation tracking
CREATE TABLE IF NOT EXISTS public.guild_challenge_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.guild_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create guild activity feed
CREATE TABLE IF NOT EXISTS public.guild_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID,
  activity_type TEXT NOT NULL, -- 'member_joined', 'challenge_completed', 'level_up', 'challenge_created'
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guild_challenge_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenge participation
CREATE POLICY "Guild members can view challenge participation"
  ON public.guild_challenge_participation FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members gm
      JOIN public.guild_challenges gc ON gc.guild_id = gm.guild_id
      WHERE gc.id = challenge_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can record their own challenge completion"
  ON public.guild_challenge_participation FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for activities
CREATE POLICY "Guild members can view activities"
  ON public.guild_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = guild_activities.guild_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activities"
  ON public.guild_activities FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_challenge_participation_challenge ON public.guild_challenge_participation(challenge_id);
CREATE INDEX idx_challenge_participation_user ON public.guild_challenge_participation(user_id);
CREATE INDEX idx_guild_activities_guild ON public.guild_activities(guild_id);
CREATE INDEX idx_guild_activities_created ON public.guild_activities(created_at DESC);

-- Function to update challenge progress when someone completes it
CREATE OR REPLACE FUNCTION update_guild_challenge_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update challenge completion count
  UPDATE guild_challenges
  SET current_completions = current_completions + 1,
      is_completed = (current_completions + 1 >= target_completions)
  WHERE id = NEW.challenge_id;
  
  -- Update guild XP
  UPDATE guilds
  SET total_xp = total_xp + NEW.xp_earned
  WHERE id = (SELECT guild_id FROM guild_challenges WHERE id = NEW.challenge_id);
  
  -- Update member contribution
  UPDATE guild_members
  SET contribution_xp = contribution_xp + NEW.xp_earned
  WHERE guild_id = (SELECT guild_id FROM guild_challenges WHERE id = NEW.challenge_id)
    AND user_id = NEW.user_id;
  
  -- Create activity
  INSERT INTO guild_activities (guild_id, user_id, activity_type, activity_data)
  SELECT 
    gc.guild_id,
    NEW.user_id,
    'challenge_completed',
    jsonb_build_object(
      'challenge_id', NEW.challenge_id,
      'challenge_title', gc.challenge_title,
      'xp_earned', NEW.xp_earned
    )
  FROM guild_challenges gc
  WHERE gc.id = NEW.challenge_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for challenge completion
CREATE TRIGGER on_challenge_participation_insert
  AFTER INSERT ON public.guild_challenge_participation
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_challenge_progress();