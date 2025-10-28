-- Create verses_strongs table for storing Strong's concordance data
CREATE TABLE IF NOT EXISTS public.verses_strongs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
  strongs_number TEXT NOT NULL,
  word TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verses_strongs_reference 
ON public.verses_strongs(book, chapter, verse);

CREATE INDEX IF NOT EXISTS idx_verses_strongs_number 
ON public.verses_strongs(strongs_number);

-- Enable RLS
ALTER TABLE public.verses_strongs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read Strong's data
CREATE POLICY "Anyone can read verses_strongs"
ON public.verses_strongs
FOR SELECT
USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert verses_strongs"
ON public.verses_strongs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update verses_strongs"
ON public.verses_strongs
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete verses_strongs"
ON public.verses_strongs
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);