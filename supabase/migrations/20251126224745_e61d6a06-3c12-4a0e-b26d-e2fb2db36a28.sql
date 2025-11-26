-- Add columns to memory_verse_list_items for PT analysis
ALTER TABLE public.memory_verse_list_items
ADD COLUMN IF NOT EXISTS pt_insights JSONB,
ADD COLUMN IF NOT EXISTS hebrew_greek JSONB;

-- Add is_template column to memory_verse_lists for curation
ALTER TABLE public.memory_verse_lists
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- Create index for template lists
CREATE INDEX IF NOT EXISTS idx_memory_verse_lists_template 
ON public.memory_verse_lists(is_template) 
WHERE is_template = TRUE;