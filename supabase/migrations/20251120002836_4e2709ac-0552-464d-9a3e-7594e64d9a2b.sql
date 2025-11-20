-- Create encyclopedia_articles table with complete PT structure
CREATE TABLE IF NOT EXISTS public.encyclopedia_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  topic_type TEXT[] NOT NULL DEFAULT '{}',
  
  -- Core content
  summary_1d TEXT NOT NULL,
  primary_verses TEXT[] NOT NULL DEFAULT '{}',
  historical_background TEXT,
  cultural_notes TEXT,
  
  -- Lexical data (stored as JSONB for flexibility)
  lexical_data JSONB DEFAULT '{"hebrew": [], "greek": []}',
  
  -- PT mapping
  pt_floors TEXT[] DEFAULT '{}',
  pt_rooms TEXT[] DEFAULT '{}',
  pt_codes TEXT[] DEFAULT '{}',
  
  -- Chains (stored as JSONB for complex structure)
  chains JSONB DEFAULT '{"literal_chain": [], "typology_chain": [], "christ_centered_chain": [], "prophetic_chain": [], "practical_chain": []}',
  
  -- PT commentary by floor
  pt_commentary JSONB DEFAULT '{}',
  
  -- Adventist specific
  adventist_doctrinal_position TEXT,
  adventist_controversies TEXT[] DEFAULT '{}',
  adventist_apologetics_chains JSONB DEFAULT '[]',
  
  -- Visual elements
  visual_hooks JSONB DEFAULT '{"palace_image_hint": "", "fps_24_frames": []}',
  
  -- Cross references and related content
  cross_refs TEXT[] DEFAULT '{}',
  related_game_topics TEXT[] DEFAULT '{}',
  
  -- Metadata
  is_priority BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary_1d, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(historical_background, '')), 'C')
  ) STORED
);

-- Create index for full text search
CREATE INDEX IF NOT EXISTS encyclopedia_articles_search_idx ON public.encyclopedia_articles USING gin(search_vector);
CREATE INDEX IF NOT EXISTS encyclopedia_articles_slug_idx ON public.encyclopedia_articles(slug);
CREATE INDEX IF NOT EXISTS encyclopedia_articles_topic_type_idx ON public.encyclopedia_articles USING gin(topic_type);
CREATE INDEX IF NOT EXISTS encyclopedia_articles_is_priority_idx ON public.encyclopedia_articles(is_priority) WHERE is_priority = true;

-- Enable RLS
ALTER TABLE public.encyclopedia_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Public can read published articles"
  ON public.encyclopedia_articles
  FOR SELECT
  USING (is_published = true);

-- Only authenticated users with admin role can modify
CREATE POLICY "Admins can manage articles"
  ON public.encyclopedia_articles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_encyclopedia_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
CREATE TRIGGER update_encyclopedia_articles_updated_at
  BEFORE UPDATE ON public.encyclopedia_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_encyclopedia_articles_updated_at();

-- Create function for searching articles
CREATE OR REPLACE FUNCTION public.search_encyclopedia_articles(
  search_query TEXT,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  summary_1d TEXT,
  topic_type TEXT[],
  pt_floors TEXT[],
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.slug,
    a.title,
    a.summary_1d,
    a.topic_type,
    a.pt_floors,
    ts_rank(a.search_vector, plainto_tsquery('english', search_query)) AS relevance
  FROM public.encyclopedia_articles a
  WHERE 
    a.is_published = true
    AND a.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC, a.is_priority DESC, a.title
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;