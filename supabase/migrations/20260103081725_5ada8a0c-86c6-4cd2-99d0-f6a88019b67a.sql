-- Add polish_analysis column to store sermon polish outputs
ALTER TABLE public.sermons 
ADD COLUMN IF NOT EXISTS polish_analysis jsonb DEFAULT NULL;

-- Add index for faster queries when checking if analysis exists
CREATE INDEX IF NOT EXISTS idx_sermons_polish_analysis ON public.sermons ((polish_analysis IS NOT NULL));