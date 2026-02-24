-- Add website_url to churches table
ALTER TABLE public.churches
ADD COLUMN IF NOT EXISTS website_url text;
