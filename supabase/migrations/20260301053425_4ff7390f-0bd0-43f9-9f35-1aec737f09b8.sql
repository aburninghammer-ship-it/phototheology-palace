
-- Group Study Sessions table
CREATE TABLE public.group_study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_study_id UUID,
  room_code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'passage',
  content_reference TEXT,
  content_text TEXT,
  current_phase TEXT NOT NULL DEFAULT 'gathering',
  phase_ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  total_insights INTEGER NOT NULL DEFAULT 0,
  total_votes INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sessions" ON public.group_study_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create sessions" ON public.group_study_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update session" ON public.group_study_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = host_id);

-- Study Session Participants table
CREATE TABLE public.study_session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  insights_shared INTEGER NOT NULL DEFAULT 0,
  votes_cast INTEGER NOT NULL DEFAULT 0,
  is_connected BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.study_session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read participants" ON public.study_session_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert themselves" ON public.study_session_participants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participant" ON public.study_session_participants
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Study Insights table
CREATE TABLE public.study_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.study_session_participants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  insight_type TEXT DEFAULT 'observation',
  room_code TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.study_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read insights" ON public.study_insights
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create insights" ON public.study_insights
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Insight Votes table
CREATE TABLE public.insight_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_id UUID NOT NULL REFERENCES public.study_insights(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(insight_id, user_id)
);

ALTER TABLE public.insight_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read votes" ON public.insight_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can vote" ON public.insight_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.insight_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insight_votes;
