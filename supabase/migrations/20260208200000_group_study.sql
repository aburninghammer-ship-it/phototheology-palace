-- Group Study Feature
-- Gamified group Bible study with scheduling, insights, voting, and chat

-- Study Groups (persistent groups that meet regularly)
CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theology_frame TEXT, -- e.g., "adventist", "general", "phototheology"
  is_public BOOLEAN DEFAULT false,
  invite_code TEXT UNIQUE,
  max_members INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Group Members
CREATE TABLE IF NOT EXISTS public.study_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- leader, co-leader, member
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Scheduled Study Sessions (like scheduled_games)
CREATE TABLE IF NOT EXISTS public.scheduled_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.study_groups(id) ON DELETE SET NULL, -- null = open to anyone
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  -- Content selection
  content_type TEXT NOT NULL, -- 'passage', 'devotional', 'pt_principle'
  content_reference TEXT, -- e.g., "John 3:16-21", "devotional-plan-id:day-5", "room-sr"
  content_text TEXT, -- Cached text for display
  -- Session settings
  max_participants INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
  room_code TEXT UNIQUE, -- Generated when session starts
  -- Timestamps
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Study RSVPs
CREATE TABLE IF NOT EXISTS public.study_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_study_id UUID NOT NULL REFERENCES public.scheduled_studies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  status TEXT DEFAULT 'going', -- going, maybe, not_going
  prayer_request TEXT, -- Optional prayer request to share
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(scheduled_study_id, user_id)
);

-- Active Study Sessions (real-time session data)
CREATE TABLE IF NOT EXISTS public.group_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_study_id UUID REFERENCES public.scheduled_studies(id) ON DELETE SET NULL,
  room_code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Content
  content_type TEXT NOT NULL,
  content_reference TEXT,
  content_text TEXT,
  -- State
  current_phase TEXT DEFAULT 'gathering', -- gathering, reading, sharing, voting, recap
  phase_ends_at TIMESTAMPTZ, -- For timed phases
  -- Stats
  total_insights INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Session Participants
CREATE TABLE IF NOT EXISTS public.study_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  insights_shared INTEGER DEFAULT 0,
  votes_cast INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Insights (like Scrabble moves - the core gamified content)
CREATE TABLE IF NOT EXISTS public.study_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.study_session_participants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Content
  insight_text TEXT NOT NULL,
  verse_reference TEXT, -- Specific verse this insight relates to
  pt_principle TEXT, -- PT principle code if applicable (e.g., "SR", "IR")
  cross_references TEXT[], -- Related verses mentioned
  -- Gamification
  is_christ_connection BOOLEAN DEFAULT false,
  base_points INTEGER DEFAULT 1,
  bonus_points INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 1,
  -- Voting
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  vote_score INTEGER DEFAULT 0, -- up - down
  -- Status
  status TEXT DEFAULT 'active', -- active, hidden (if downvoted heavily)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Votes on Insights
CREATE TABLE IF NOT EXISTS public.insight_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id UUID NOT NULL REFERENCES public.study_insights(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INTEGER NOT NULL, -- 1 = up, -1 = down
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(insight_id, user_id)
);

-- Chat Messages (separate from insights, for general discussion)
CREATE TABLE IF NOT EXISTS public.study_session_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat', -- chat, prayer, announcement
  reply_to_id UUID REFERENCES public.study_session_chat(id) ON DELETE SET NULL, -- For threading
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_chat ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_groups
CREATE POLICY "Anyone authenticated can view public groups" ON public.study_groups
  FOR SELECT TO authenticated
  USING (is_public = true OR leader_id = auth.uid());

CREATE POLICY "Leaders can create groups" ON public.study_groups
  FOR INSERT TO authenticated
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "Leaders can update their groups" ON public.study_groups
  FOR UPDATE TO authenticated
  USING (leader_id = auth.uid());

CREATE POLICY "Leaders can delete their groups" ON public.study_groups
  FOR DELETE TO authenticated
  USING (leader_id = auth.uid());

-- RLS Policies for study_group_members
CREATE POLICY "Members can view group membership" ON public.study_group_members
  FOR SELECT TO authenticated
  USING (true); -- Allow viewing for join purposes

CREATE POLICY "Users can join groups" ON public.study_group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups" ON public.study_group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for scheduled_studies
CREATE POLICY "Anyone authenticated can view scheduled studies" ON public.scheduled_studies
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create scheduled studies" ON public.scheduled_studies
  FOR INSERT TO authenticated
  WITH CHECK (host_user_id = auth.uid());

CREATE POLICY "Hosts can update their scheduled studies" ON public.scheduled_studies
  FOR UPDATE TO authenticated
  USING (host_user_id = auth.uid());

CREATE POLICY "Hosts can delete their scheduled studies" ON public.scheduled_studies
  FOR DELETE TO authenticated
  USING (host_user_id = auth.uid());

-- RLS Policies for study_rsvps
CREATE POLICY "Anyone authenticated can view RSVPs" ON public.study_rsvps
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create their own RSVP" ON public.study_rsvps
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own RSVP" ON public.study_rsvps
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own RSVP" ON public.study_rsvps
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for group_study_sessions
CREATE POLICY "Anyone authenticated can view sessions" ON public.group_study_sessions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Hosts can create sessions" ON public.group_study_sessions
  FOR INSERT TO authenticated
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update sessions" ON public.group_study_sessions
  FOR UPDATE TO authenticated
  USING (host_id = auth.uid());

-- RLS Policies for study_session_participants
CREATE POLICY "Anyone authenticated can view participants" ON public.study_session_participants
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can join sessions" ON public.study_session_participants
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participant record" ON public.study_session_participants
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can leave sessions" ON public.study_session_participants
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for study_insights
CREATE POLICY "Anyone authenticated can view insights" ON public.study_insights
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can share insights" ON public.study_insights
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own insights" ON public.study_insights
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for insight_votes
CREATE POLICY "Anyone authenticated can view votes" ON public.insight_votes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can vote" ON public.insight_votes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can change their vote" ON public.insight_votes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can remove their vote" ON public.insight_votes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for study_session_chat
CREATE POLICY "Anyone authenticated can view chat" ON public.study_session_chat
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can send chat messages" ON public.study_session_chat
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Enable Realtime for interactive tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insight_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_session_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_studies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_rsvps;

-- Indexes for performance
CREATE INDEX idx_study_groups_leader ON public.study_groups(leader_id);
CREATE INDEX idx_study_groups_public ON public.study_groups(is_public) WHERE is_public = true;
CREATE INDEX idx_study_group_members_group ON public.study_group_members(group_id);
CREATE INDEX idx_study_group_members_user ON public.study_group_members(user_id);
CREATE INDEX idx_scheduled_studies_scheduled_at ON public.scheduled_studies(scheduled_at);
CREATE INDEX idx_scheduled_studies_status ON public.scheduled_studies(status);
CREATE INDEX idx_scheduled_studies_host ON public.scheduled_studies(host_user_id);
CREATE INDEX idx_study_rsvps_study ON public.study_rsvps(scheduled_study_id);
CREATE INDEX idx_study_rsvps_user ON public.study_rsvps(user_id);
CREATE INDEX idx_group_study_sessions_room_code ON public.group_study_sessions(room_code);
CREATE INDEX idx_study_session_participants_session ON public.study_session_participants(session_id);
CREATE INDEX idx_study_session_participants_user ON public.study_session_participants(user_id);
CREATE INDEX idx_study_insights_session ON public.study_insights(session_id);
CREATE INDEX idx_study_insights_vote_score ON public.study_insights(vote_score DESC);
CREATE INDEX idx_study_insights_participant ON public.study_insights(participant_id);
CREATE INDEX idx_insight_votes_insight ON public.insight_votes(insight_id);
CREATE INDEX idx_study_session_chat_session ON public.study_session_chat(session_id);

-- Comments for documentation
COMMENT ON TABLE public.study_groups IS 'Persistent study groups that meet regularly';
COMMENT ON TABLE public.study_group_members IS 'Members of study groups with roles';
COMMENT ON TABLE public.scheduled_studies IS 'Scheduled study sessions with RSVPs';
COMMENT ON TABLE public.study_rsvps IS 'RSVPs for scheduled studies';
COMMENT ON TABLE public.group_study_sessions IS 'Active real-time study sessions';
COMMENT ON TABLE public.study_session_participants IS 'Participants in active sessions with scores';
COMMENT ON TABLE public.study_insights IS 'Shared insights during sessions (gamified)';
COMMENT ON TABLE public.insight_votes IS 'Votes on insights (up/down)';
COMMENT ON TABLE public.study_session_chat IS 'Chat messages during sessions';
