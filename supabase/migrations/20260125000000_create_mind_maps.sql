-- Mind Map Palace Storage
-- Stores AI-generated mind maps that map text to the Phototheology Palace framework

CREATE TABLE IF NOT EXISTS public.mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_text TEXT NOT NULL,
  source_type TEXT DEFAULT 'custom' CHECK (source_type IN ('custom', 'scripture', 'sermon', 'devotional')),
  source_reference TEXT, -- e.g., "John 3:16-21" or sermon title
  mode TEXT DEFAULT 'scholar' CHECK (mode IN ('beginner', 'scholar', 'preacher', 'research')),
  map_data JSONB NOT NULL DEFAULT '{}',
  analysis_summary TEXT, -- Brief AI-generated summary
  parent_map_id UUID REFERENCES public.mind_maps(id) ON DELETE SET NULL, -- For recursive "Make Seed" chains
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own maps"
ON public.mind_maps FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create maps"
ON public.mind_maps FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maps"
ON public.mind_maps FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maps"
ON public.mind_maps FOR DELETE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_mind_maps_user_id ON public.mind_maps(user_id);
CREATE INDEX idx_mind_maps_created_at ON public.mind_maps(created_at DESC);
CREATE INDEX idx_mind_maps_source_type ON public.mind_maps(source_type);
CREATE INDEX idx_mind_maps_mode ON public.mind_maps(mode);
CREATE INDEX idx_mind_maps_tags ON public.mind_maps USING GIN(tags);
CREATE INDEX idx_mind_maps_parent ON public.mind_maps(parent_map_id) WHERE parent_map_id IS NOT NULL;

-- Full text search on source text
ALTER TABLE public.mind_maps ADD COLUMN IF NOT EXISTS source_text_search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(source_text, ''))) STORED;
CREATE INDEX idx_mind_maps_search ON public.mind_maps USING GIN(source_text_search);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_mind_maps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mind_maps_updated_at
  BEFORE UPDATE ON public.mind_maps
  FOR EACH ROW
  EXECUTE FUNCTION update_mind_maps_updated_at();

-- Comment for documentation
COMMENT ON TABLE public.mind_maps IS 'Stores AI-generated mind maps that map user text to the Phototheology Palace framework';
COMMENT ON COLUMN public.mind_maps.map_data IS 'JSONB containing nodes, edges, and AI analysis for React Flow rendering';
COMMENT ON COLUMN public.mind_maps.parent_map_id IS 'Reference to parent map when using "Make Seed" recursive exploration';
