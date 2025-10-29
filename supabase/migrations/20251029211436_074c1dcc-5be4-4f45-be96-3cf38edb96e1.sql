-- Create Strong's Dictionary table
CREATE TABLE IF NOT EXISTS public.strongs_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strongs_number TEXT UNIQUE NOT NULL,
  word TEXT NOT NULL,
  transliteration TEXT,
  language TEXT NOT NULL CHECK (language IN ('Hebrew', 'Greek')),
  definition TEXT NOT NULL,
  gloss TEXT,
  morph TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_strongs_number ON public.strongs_dictionary(strongs_number);
CREATE INDEX IF NOT EXISTS idx_strongs_language ON public.strongs_dictionary(language);

-- Enable RLS
ALTER TABLE public.strongs_dictionary ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read Strong's entries
CREATE POLICY "Strong's entries viewable by all"
  ON public.strongs_dictionary
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert entries
CREATE POLICY "Admins can insert Strong's entries"
  ON public.strongs_dictionary
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
  );

-- Policy: Only admins can update entries
CREATE POLICY "Admins can update Strong's entries"
  ON public.strongs_dictionary
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_strongs_updated_at
  BEFORE UPDATE ON public.strongs_dictionary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();