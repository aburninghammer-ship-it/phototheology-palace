
-- Sermon Discipleship Pipeline: stores the full auto-generated discipleship factory outputs
CREATE TABLE public.sermon_discipleship_packets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  sermon_amplified_study_id UUID REFERENCES public.sermon_amplified_studies(id) ON DELETE SET NULL,
  sermon_title TEXT NOT NULL,
  preacher TEXT,
  sermon_date TEXT,
  created_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'generating',
  
  -- Executive Summary
  executive_summary TEXT,
  
  -- 10 Key Verses
  key_verses TEXT[] DEFAULT '{}',
  
  -- Theological Map (doctrinal themes mapped)
  theological_map JSONB DEFAULT '{}',
  
  -- Prophetic Map (prophetic/sanctuary connections)
  prophetic_map JSONB DEFAULT '{}',
  
  -- Claim Ladder (apologetics)
  claim_ladder JSONB DEFAULT '[]',
  
  -- Debate Prep Sheet
  debate_prep JSONB DEFAULT '{}',
  
  -- 5-Day Micro-Study Plan
  micro_study_plan JSONB DEFAULT '[]',
  
  -- 5 Discussion Questions + 1 Controversy Question
  discussion_questions TEXT[] DEFAULT '{}',
  controversy_question TEXT,
  
  -- 1 Evangelism Script
  evangelism_script TEXT,
  
  -- 1 Shareable Quote
  shareable_quote TEXT,
  
  -- 1 Prayer Focus
  prayer_focus TEXT,
  
  -- 1 Obedience Challenge
  obedience_challenge TEXT,
  
  -- House Fire Guide (small group structured discussion)
  house_fire_guide JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track member engagement with the 5-day micro-study
CREATE TABLE public.sermon_micro_study_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  packet_id UUID NOT NULL REFERENCES public.sermon_discipleship_packets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
  completed_at TIMESTAMPTZ,
  
  -- Forced interaction responses
  summary_response TEXT,
  one_sentence_compression TEXT,
  strongest_argument TEXT,
  weakest_argument TEXT,
  evangelistic_question TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(packet_id, user_id, day_number)
);

-- Enable RLS
ALTER TABLE public.sermon_discipleship_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_micro_study_progress ENABLE ROW LEVEL SECURITY;

-- RLS: Church members can read packets for their church
CREATE POLICY "Church members can view packets"
  ON public.sermon_discipleship_packets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = sermon_discipleship_packets.church_id
      AND user_id = auth.uid()
    )
  );

-- RLS: Only church admins/leaders can insert/update packets
CREATE POLICY "Church admins can manage packets"
  ON public.sermon_discipleship_packets FOR ALL
  TO authenticated
  USING (
    public.is_church_admin(auth.uid(), church_id)
    OR public.is_ministry_leader(auth.uid(), church_id)
  )
  WITH CHECK (
    public.is_church_admin(auth.uid(), church_id)
    OR public.is_ministry_leader(auth.uid(), church_id)
  );

-- RLS: Users can manage their own progress
CREATE POLICY "Users manage own micro study progress"
  ON public.sermon_micro_study_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS: Church members can view all progress (for leaderboards)
CREATE POLICY "Church members can view progress"
  ON public.sermon_micro_study_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sermon_discipleship_packets p
      JOIN public.church_members cm ON cm.church_id = p.church_id
      WHERE p.id = sermon_micro_study_progress.packet_id
      AND cm.user_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE TRIGGER update_sermon_discipleship_packets_updated_at
  BEFORE UPDATE ON public.sermon_discipleship_packets
  FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();
