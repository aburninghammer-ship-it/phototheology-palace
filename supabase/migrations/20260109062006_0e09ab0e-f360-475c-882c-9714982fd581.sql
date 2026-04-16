-- Create sermon_topics table
CREATE TABLE public.sermon_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  anchor_scriptures TEXT[] DEFAULT '{}',
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sermon_starters table
CREATE TABLE public.sermon_starters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.sermon_topics(id) ON DELETE CASCADE,
  starter_title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Master')),
  floors JSONB DEFAULT '{}',
  room_refs TEXT[] DEFAULT '{}',
  quality_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_sermon_topics_slug ON public.sermon_topics(slug);
CREATE INDEX idx_sermon_topics_category ON public.sermon_topics(category);
CREATE INDEX idx_sermon_starters_topic_id ON public.sermon_starters(topic_id);
CREATE INDEX idx_sermon_starters_level ON public.sermon_starters(level);
CREATE INDEX idx_sermon_starters_quality ON public.sermon_starters(quality_status);

-- Enable RLS
ALTER TABLE public.sermon_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_starters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sermon topics (they're public content)
CREATE POLICY "Anyone can read sermon topics"
ON public.sermon_topics
FOR SELECT
USING (true);

-- Allow anyone to read published sermon starters
CREATE POLICY "Anyone can read published sermon starters"
ON public.sermon_starters
FOR SELECT
USING (quality_status = 'published');

-- Allow authenticated users to insert sermon starters (for AI generation)
CREATE POLICY "Authenticated users can insert sermon starters"
ON public.sermon_starters
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own generated starters
CREATE POLICY "Authenticated users can update sermon starters"
ON public.sermon_starters
FOR UPDATE
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_sermon_topics_updated_at
BEFORE UPDATE ON public.sermon_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sermon_starters_updated_at
BEFORE UPDATE ON public.sermon_starters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();