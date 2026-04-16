
CREATE TABLE public.polish_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  input_text TEXT NOT NULL,
  title TEXT,
  tagline TEXT,
  scenes JSONB,
  narrative TEXT,
  closing_reflection TEXT,
  verses_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.polish_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own polish stories"
  ON public.polish_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own polish stories"
  ON public.polish_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polish stories"
  ON public.polish_stories FOR DELETE
  USING (auth.uid() = user_id);
