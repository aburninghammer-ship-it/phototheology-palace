
-- Sermon Palace Analysis table for on-demand Palace-based sermon analysis
CREATE TABLE public.sermon_palace_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  packet_id UUID REFERENCES public.sermon_discipleship_packets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  analysis_mode TEXT NOT NULL CHECK (analysis_mode IN ('full_sweep', 'room_specific', 'floor_drill', 'cycle_heaven')),
  selected_rooms TEXT[] DEFAULT '{}',
  selected_floor INTEGER,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'error')),
  analysis_result JSONB DEFAULT '{}',
  sermon_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX idx_sermon_palace_analyses_packet ON public.sermon_palace_analyses(packet_id);
CREATE INDEX idx_sermon_palace_analyses_user ON public.sermon_palace_analyses(user_id);

-- RLS
ALTER TABLE public.sermon_palace_analyses ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can create analyses
CREATE POLICY "Users can insert own analyses"
ON public.sermon_palace_analyses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can read own analyses
CREATE POLICY "Users can read own analyses"
ON public.sermon_palace_analyses FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Users can update own analyses
CREATE POLICY "Users can update own analyses"
ON public.sermon_palace_analyses FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Service role can do anything (for edge function)
CREATE POLICY "Service role full access"
ON public.sermon_palace_analyses FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Updated_at trigger
CREATE TRIGGER update_sermon_palace_analyses_updated_at
  BEFORE UPDATE ON public.sermon_palace_analyses
  FOR EACH ROW EXECUTE FUNCTION update_living_manna_updated_at();
