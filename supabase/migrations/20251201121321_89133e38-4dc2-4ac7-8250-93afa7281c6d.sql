-- Add missing commentary settings columns to sequence_items
ALTER TABLE public.sequence_items 
ADD COLUMN IF NOT EXISTS commentary_voice text DEFAULT 'daniel',
ADD COLUMN IF NOT EXISTS commentary_depth text DEFAULT 'surface',
ADD COLUMN IF NOT EXISTS commentary_mode text DEFAULT 'chapter';