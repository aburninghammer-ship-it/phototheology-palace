-- Create sermon_simmer_sessions table for the 6-day Simmer Mode
CREATE TABLE public.sermon_simmer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Core sermon identity
  title TEXT,
  theme TEXT NOT NULL,
  theme_passage TEXT,
  target_style TEXT DEFAULT 'balanced', -- conservative, balanced, aggressive
  target_density TEXT DEFAULT 'teaching', -- teaching, punchy
  target_purpose TEXT DEFAULT 'evangelistic', -- evangelistic, doctrinal, prophetic
  
  -- Day tracking
  current_day INTEGER NOT NULL DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 6),
  day_1_completed_at TIMESTAMPTZ,
  day_2_completed_at TIMESTAMPTZ,
  day_3_completed_at TIMESTAMPTZ,
  day_4_completed_at TIMESTAMPTZ,
  day_5_completed_at TIMESTAMPTZ,
  day_6_completed_at TIMESTAMPTZ,
  
  -- Day 1: Ignition & Core Claim
  core_claim TEXT,
  provisional_outline JSONB, -- array of {section, content, notes}
  pressure_verses TEXT[], -- verses that create tension/engagement
  
  -- Day 2: Gem Proliferation (accumulated, never reset)
  gems JSONB DEFAULT '[]'::jsonb, -- array of {id, text, verse, symbol, sanctuary_article, prophetic_pattern, status: 'raw'|'polished'|'locked'}
  
  -- Day 3: Structural Compression
  structure JSONB, -- {opening: [], build: [], turn: [], climax: [], resolution: []}
  emotional_arc TEXT,
  visual_metaphors TEXT[],
  redundant_gems TEXT[], -- gem IDs flagged as redundant
  weak_transitions TEXT[], -- notes on weak transitions
  
  -- Day 4: Christ-Centered Overcharge
  christ_connections JSONB, -- array of {movement, connection, tension, resolution}
  rewritten_weak_connections JSONB, -- gems that needed Christ-strengthening
  
  -- Day 5: Delivery & Visual Weaponization
  slide_headlines TEXT[],
  slide_images JSONB, -- {movement: image_suggestion}
  callout_quotes TEXT[],
  white_space_guidance TEXT,
  
  -- Day 6: Final Seasoning
  final_outline JSONB,
  final_quote_list TEXT[],
  final_slide_headers TEXT[],
  closing_movement TEXT,
  
  -- Session metadata
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sermon_simmer_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own simmer sessions"
  ON public.sermon_simmer_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simmer sessions"
  ON public.sermon_simmer_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simmer sessions"
  ON public.sermon_simmer_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simmer sessions"
  ON public.sermon_simmer_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_sermon_simmer_sessions_updated_at
  BEFORE UPDATE ON public.sermon_simmer_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_sermon_simmer_sessions_user_id ON public.sermon_simmer_sessions(user_id);
CREATE INDEX idx_sermon_simmer_sessions_status ON public.sermon_simmer_sessions(status);