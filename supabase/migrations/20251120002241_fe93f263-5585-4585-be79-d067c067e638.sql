-- Add source_url and search_timestamp to challenges table for prophecy signals
ALTER TABLE challenges 
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS search_timestamp TIMESTAMP WITH TIME ZONE;