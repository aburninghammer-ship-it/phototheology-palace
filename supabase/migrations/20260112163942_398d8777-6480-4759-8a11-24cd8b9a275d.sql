-- Add missing columns to email_logs for campaign tracking
ALTER TABLE public.email_logs 
ADD COLUMN IF NOT EXISTS campaign_type TEXT,
ADD COLUMN IF NOT EXISTS day_number INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS subject TEXT;

-- Update campaign_type for existing records
UPDATE public.email_logs SET campaign_type = 'winback' WHERE campaign_type IS NULL;

-- Create index for campaign queries
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_type ON public.email_logs(campaign_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_campaign ON public.email_logs(user_id, campaign_type);