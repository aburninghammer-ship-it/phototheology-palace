-- Create mind_maps table for storing user-created mind maps
CREATE TABLE public.mind_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'custom',
  source_reference TEXT,
  mode TEXT NOT NULL DEFAULT 'beginner',
  map_data JSONB NOT NULL,
  analysis_summary TEXT,
  parent_map_id UUID REFERENCES public.mind_maps(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;

-- Users can view their own mind maps
CREATE POLICY "Users can view their own mind maps"
ON public.mind_maps FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own mind maps
CREATE POLICY "Users can create their own mind maps"
ON public.mind_maps FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own mind maps
CREATE POLICY "Users can update their own mind maps"
ON public.mind_maps FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own mind maps
CREATE POLICY "Users can delete their own mind maps"
ON public.mind_maps FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster user queries
CREATE INDEX idx_mind_maps_user_id ON public.mind_maps(user_id);
CREATE INDEX idx_mind_maps_created_at ON public.mind_maps(created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mind_maps_updated_at
BEFORE UPDATE ON public.mind_maps
FOR EACH ROW
EXECUTE FUNCTION public.update_user_studies_updated_at();