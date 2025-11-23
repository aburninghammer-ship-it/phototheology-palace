-- Create guilds table
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  guild_type TEXT NOT NULL CHECK (guild_type IN ('house', 'order', 'squad')),
  max_members INTEGER DEFAULT 12,
  focus_rooms TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  guild_image_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0
);

-- Create guild members table
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_xp INTEGER DEFAULT 0,
  UNIQUE(guild_id, user_id)
);

-- Create guild challenges table
CREATE TABLE IF NOT EXISTS public.guild_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  challenge_title TEXT NOT NULL,
  challenge_description TEXT,
  target_completions INTEGER DEFAULT 10,
  current_completions INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  reward_xp INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT false
);

-- Create guild challenge participants table
CREATE TABLE IF NOT EXISTS public.guild_challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.guild_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  contribution_count INTEGER DEFAULT 0,
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_challenge_participants ENABLE ROW LEVEL SECURITY;

-- Guilds policies
CREATE POLICY "Guilds are viewable by everyone"
  ON public.guilds FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create guilds"
  ON public.guilds FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Guild leaders can update their guild"
  ON public.guilds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = guilds.id
        AND user_id = auth.uid()
        AND role IN ('leader', 'officer')
    )
  );

-- Guild members policies
CREATE POLICY "Guild members are viewable by everyone"
  ON public.guild_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join guilds"
  ON public.guild_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave guilds"
  ON public.guild_members FOR DELETE
  USING (auth.uid() = user_id);

-- Guild challenges policies
CREATE POLICY "Guild challenges are viewable by members"
  ON public.guild_challenges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = guild_challenges.guild_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Guild leaders can create challenges"
  ON public.guild_challenges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = guild_challenges.guild_id
        AND user_id = auth.uid()
        AND role IN ('leader', 'officer')
    )
  );

-- Guild challenge participants policies
CREATE POLICY "Challenge participants viewable by guild members"
  ON public.guild_challenge_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guild_challenges gc
      JOIN public.guild_members gm ON gm.guild_id = gc.guild_id
      WHERE gc.id = guild_challenge_participants.challenge_id
        AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can track their challenge participation"
  ON public.guild_challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their challenge participation"
  ON public.guild_challenge_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update guild updated_at
CREATE OR REPLACE FUNCTION update_guild_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for guilds updated_at
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON public.guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_updated_at();

-- Add indexes for performance
CREATE INDEX idx_guild_members_user_id ON public.guild_members(user_id);
CREATE INDEX idx_guild_members_guild_id ON public.guild_members(guild_id);
CREATE INDEX idx_guild_challenges_guild_id ON public.guild_challenges(guild_id);
CREATE INDEX idx_guild_challenge_participants_challenge_id ON public.guild_challenge_participants(challenge_id);
CREATE INDEX idx_guild_challenge_participants_user_id ON public.guild_challenge_participants(user_id);