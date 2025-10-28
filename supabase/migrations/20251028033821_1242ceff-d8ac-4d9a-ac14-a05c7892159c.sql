-- Create table for app update ideas/suggestions
CREATE TABLE IF NOT EXISTS public.app_update_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  category TEXT CHECK (category IN ('feature', 'improvement', 'bug', 'other')),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'planned', 'implemented', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_update_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own ideas"
  ON public.app_update_ideas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas"
  ON public.app_update_ideas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ideas"
  ON public.app_update_ideas
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all ideas"
  ON public.app_update_ideas
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_app_update_ideas_user ON public.app_update_ideas(user_id, created_at DESC);
CREATE INDEX idx_app_update_ideas_status ON public.app_update_ideas(status, created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER app_update_ideas_updated_at
  BEFORE UPDATE ON public.app_update_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();