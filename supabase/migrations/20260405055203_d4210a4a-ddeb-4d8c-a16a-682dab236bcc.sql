
-- Table to store daily AI-generated sample questions for Level 1 chat
CREATE TABLE public.generated_sample_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_date DATE NOT NULL UNIQUE,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow public read access (no auth needed to show sample questions)
ALTER TABLE public.generated_sample_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sample questions"
  ON public.generated_sample_questions
  FOR SELECT
  USING (true);
