-- Add columns for tracking email opens
ALTER TABLE email_campaign_logs 
ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0;

-- Create index for faster lookups by resend_email_id
CREATE INDEX IF NOT EXISTS idx_email_campaign_logs_resend_id ON email_campaign_logs(resend_email_id);