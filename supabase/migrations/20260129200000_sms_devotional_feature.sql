-- SMS Devotional Feature
-- Enables automatic SMS sending of daily devotionals via Twilio

-- 1. Add phone/SMS fields to existing devotional_profiles table
ALTER TABLE public.devotional_profiles
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+1',
  ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_sms_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_sms_sent INTEGER DEFAULT 0;

-- Index for finding profiles with SMS enabled
CREATE INDEX IF NOT EXISTS idx_devotional_profiles_sms_opt_in
  ON public.devotional_profiles(active_plan_id)
  WHERE sms_opt_in = true AND phone_number IS NOT NULL;

-- 2. Standalone SMS recipients table (for phone numbers without full profiles)
CREATE TABLE IF NOT EXISTS public.sms_devotional_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Recipient info
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  phone_country_code TEXT DEFAULT '+1',

  -- Which devotional plan to send
  plan_id UUID REFERENCES public.devotional_plans(id) ON DELETE SET NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,
  opted_out_at TIMESTAMPTZ,
  opt_out_reason TEXT,

  -- Delivery tracking
  last_sms_sent_at TIMESTAMPTZ,
  total_sms_sent INTEGER DEFAULT 0,
  last_delivery_status TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique phone per user
  UNIQUE(user_id, phone_number)
);

-- Enable RLS
ALTER TABLE public.sms_devotional_recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sms recipients"
  ON public.sms_devotional_recipients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sms recipients"
  ON public.sms_devotional_recipients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sms recipients"
  ON public.sms_devotional_recipients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sms recipients"
  ON public.sms_devotional_recipients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for active recipients by plan
CREATE INDEX idx_sms_recipients_active_plan
  ON public.sms_devotional_recipients(plan_id)
  WHERE is_active = true AND opted_out_at IS NULL;

-- 3. SMS send log for tracking deliveries and costs
CREATE TABLE IF NOT EXISTS public.sms_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Recipient info
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('profile', 'standalone')),
  recipient_id UUID,
  phone_number TEXT NOT NULL,

  -- Message details
  plan_id UUID REFERENCES public.devotional_plans(id) ON DELETE SET NULL,
  day_number INTEGER,
  message_type TEXT DEFAULT 'devotional' CHECK (message_type IN ('devotional', 'verification', 'opt_out_confirm')),
  message_body TEXT,

  -- Twilio response
  twilio_sid TEXT,
  status TEXT, -- queued, sent, delivered, failed, undelivered
  error_code TEXT,
  error_message TEXT,

  -- Cost tracking
  segments INTEGER DEFAULT 1,
  price DECIMAL(10, 4),

  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sms_send_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own SMS logs
CREATE POLICY "Users can view own sms logs"
  ON public.sms_send_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for cost reporting
CREATE INDEX idx_sms_log_user_date ON public.sms_send_log(user_id, sent_at DESC);
CREATE INDEX idx_sms_log_twilio_sid ON public.sms_send_log(twilio_sid) WHERE twilio_sid IS NOT NULL;
