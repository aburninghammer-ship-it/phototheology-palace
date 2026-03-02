-- Death Chamber 30-Day Program + Tomb Space (Group)

-- Individual progress tracking
CREATE TABLE IF NOT EXISTS death_chamber_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_id UUID, -- null = solo mode
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  completed_at TIMESTAMPTZ DEFAULT now(),
  reflection TEXT NOT NULL,
  tomb_affirmation_accepted BOOLEAN DEFAULT false,
  surrender_exercise_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, group_id, day_number)
);

-- Groups for doing the 30-day challenge together
CREATE TABLE IF NOT EXISTS death_chamber_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  room_code TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_members INTEGER DEFAULT 12,
  current_day INTEGER DEFAULT 0, -- 0 = not started
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Group members
CREATE TABLE IF NOT EXISTS death_chamber_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES death_chamber_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  days_completed INTEGER DEFAULT 0,
  UNIQUE(group_id, user_id)
);

-- Tomb Space messages (shared reflections, encouragements, prayers)
CREATE TABLE IF NOT EXISTS tomb_space_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES death_chamber_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  message_type TEXT NOT NULL DEFAULT 'reflection' CHECK (message_type IN ('reflection', 'encouragement', 'prayer', 'testimony', 'question')),
  day_number INTEGER, -- which day this relates to
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tomb Space reactions
CREATE TABLE IF NOT EXISTS tomb_space_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES tomb_space_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('pray', 'amen', 'fire', 'heart')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Indexes
CREATE INDEX idx_dc_progress_user ON death_chamber_progress(user_id);
CREATE INDEX idx_dc_progress_group ON death_chamber_progress(group_id);
CREATE INDEX idx_dc_groups_code ON death_chamber_groups(room_code);
CREATE INDEX idx_dc_members_group ON death_chamber_group_members(group_id);
CREATE INDEX idx_dc_members_user ON death_chamber_group_members(user_id);
CREATE INDEX idx_ts_messages_group ON tomb_space_messages(group_id);
CREATE INDEX idx_ts_reactions_message ON tomb_space_reactions(message_id);

-- RLS
ALTER TABLE death_chamber_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE death_chamber_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE death_chamber_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tomb_space_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tomb_space_reactions ENABLE ROW LEVEL SECURITY;

-- Progress: users can read/write their own
CREATE POLICY "Users can manage own progress" ON death_chamber_progress
  FOR ALL USING (auth.uid() = user_id);

-- Groups: anyone authenticated can read active groups, creators manage
CREATE POLICY "Anyone can read active groups" ON death_chamber_groups
  FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create groups" ON death_chamber_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update groups" ON death_chamber_groups
  FOR UPDATE USING (auth.uid() = created_by);

-- Members: members can read their group, anyone can join
CREATE POLICY "Members can read group members" ON death_chamber_group_members
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM death_chamber_group_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can join groups" ON death_chamber_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own membership" ON death_chamber_group_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Tomb Space messages: group members can read and write
CREATE POLICY "Group members can read messages" ON tomb_space_messages
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM death_chamber_group_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Group members can post messages" ON tomb_space_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    group_id IN (SELECT group_id FROM death_chamber_group_members WHERE user_id = auth.uid())
  );

-- Reactions: group members can react
CREATE POLICY "Group members can read reactions" ON tomb_space_reactions
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM tomb_space_messages WHERE group_id IN (
        SELECT group_id FROM death_chamber_group_members WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "Group members can add reactions" ON tomb_space_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own reactions" ON tomb_space_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Add foreign key for progress -> groups
ALTER TABLE death_chamber_progress
  ADD CONSTRAINT fk_dc_progress_group
  FOREIGN KEY (group_id) REFERENCES death_chamber_groups(id) ON DELETE SET NULL;

-- Enable realtime for Tomb Space
ALTER PUBLICATION supabase_realtime ADD TABLE tomb_space_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE tomb_space_reactions;
