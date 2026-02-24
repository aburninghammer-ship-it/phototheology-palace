-- Create SMS devotional recipients table
CREATE TABLE public.sms_devotional_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  phone_country_code TEXT NOT NULL DEFAULT '+1',
  plan_id UUID REFERENCES public.devotional_plans(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  opted_out_at TIMESTAMPTZ,
  opt_out_reason TEXT,
  last_sms_sent_at TIMESTAMPTZ,
  total_sms_sent INTEGER NOT NULL DEFAULT 0,
  last_delivery_status TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  preferred_send_hour INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, phone_number)
);

-- Create SMS send log table
CREATE TABLE public.sms_send_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  recipient_type TEXT NOT NULL DEFAULT 'standalone',
  recipient_id UUID,
  phone_number TEXT NOT NULL,
  plan_id UUID REFERENCES public.devotional_plans(id) ON DELETE SET NULL,
  day_number INTEGER,
  message_type TEXT NOT NULL DEFAULT 'devotional',
  message_body TEXT,
  twilio_sid TEXT,
  status TEXT,
  error_code TEXT,
  error_message TEXT,
  segments INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,4),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add phone fields to devotional_profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devotional_profiles' AND column_name = 'phone_number') THEN
    ALTER TABLE public.devotional_profiles ADD COLUMN phone_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devotional_profiles' AND column_name = 'phone_country_code') THEN
    ALTER TABLE public.devotional_profiles ADD COLUMN phone_country_code TEXT DEFAULT '+1';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'devotional_profiles' AND column_name = 'sms_opt_in') THEN
    ALTER TABLE public.devotional_profiles ADD COLUMN sms_opt_in BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.sms_devotional_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_send_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for sms_devotional_recipients
CREATE POLICY "Users can view their own SMS recipients"
  ON public.sms_devotional_recipients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SMS recipients"
  ON public.sms_devotional_recipients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS recipients"
  ON public.sms_devotional_recipients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SMS recipients"
  ON public.sms_devotional_recipients FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for sms_send_log
CREATE POLICY "Users can view their own SMS logs"
  ON public.sms_send_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert SMS logs"
  ON public.sms_send_log FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_sms_recipients_user_id ON public.sms_devotional_recipients(user_id);
CREATE INDEX idx_sms_recipients_plan_id ON public.sms_devotional_recipients(plan_id);
CREATE INDEX idx_sms_send_log_user_id ON public.sms_send_log(user_id);
CREATE INDEX idx_sms_send_log_sent_at ON public.sms_send_log(sent_at DESC);