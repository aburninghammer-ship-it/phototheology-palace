-- Add review scheduling columns to memorization_verses table
ALTER TABLE memorization_verses
ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
ADD COLUMN IF NOT EXISTS review_interval_days INTEGER DEFAULT 7;