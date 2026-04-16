-- Add timezone support for SMS recipients
-- Allows sending devotionals at 8am in the recipient's local time

-- Add timezone column to sms_devotional_recipients
ALTER TABLE public.sms_devotional_recipients
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';

-- Add timezone column to devotional_profiles (for profiles with SMS enabled)
ALTER TABLE public.devotional_profiles
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';

-- Add preferred send hour (default 8am)
ALTER TABLE public.sms_devotional_recipients
  ADD COLUMN IF NOT EXISTS preferred_send_hour INTEGER DEFAULT 8 CHECK (preferred_send_hour >= 0 AND preferred_send_hour <= 23);

ALTER TABLE public.devotional_profiles
  ADD COLUMN IF NOT EXISTS preferred_send_hour INTEGER DEFAULT 8 CHECK (preferred_send_hour >= 0 AND preferred_send_hour <= 23);

-- Comment explaining usage
COMMENT ON COLUMN public.sms_devotional_recipients.timezone IS 'IANA timezone identifier (e.g., America/New_York, Europe/London)';
COMMENT ON COLUMN public.sms_devotional_recipients.preferred_send_hour IS 'Hour of day (0-23) to send SMS in recipient timezone';
