
-- Daily Audio Devotionals: 365 pre-generated devotionals, same for all users
-- With OpenAI TTS audio and SMS delivery

CREATE TABLE public.daily_audio_devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 365),
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT,
  devotional_text TEXT NOT NULL,
  prayer TEXT,
  audio_storage_path TEXT,
  audio_url TEXT,
  audio_duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating_text', 'text_ready', 'generating_audio', 'ready', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Track which users are subscribed to daily audio devotional SMS
CREATE TABLE public.daily_devotional_sms_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  phone_country_code TEXT NOT NULL DEFAULT '+1',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  preferred_send_hour INTEGER NOT NULL DEFAULT 7,
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_day INTEGER NOT NULL DEFAULT 1,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- SMS send log for daily audio devotionals
CREATE TABLE public.daily_devotional_sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES public.daily_devotional_sms_subscribers(id) ON DELETE CASCADE,
  devotional_id UUID NOT NULL REFERENCES public.daily_audio_devotionals(id),
  day_number INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  message_body TEXT,
  sns_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS policies
ALTER TABLE public.daily_audio_devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_devotional_sms_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_devotional_sms_log ENABLE ROW LEVEL SECURITY;

-- Devotionals are readable by all authenticated users
CREATE POLICY "Anyone can read devotionals"
  ON public.daily_audio_devotionals FOR SELECT
  TO authenticated
  USING (true);

-- Subscribers can manage their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.daily_devotional_sms_subscribers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own subscription"
  ON public.daily_devotional_sms_subscribers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON public.daily_devotional_sms_subscribers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own subscription"
  ON public.daily_devotional_sms_subscribers FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- SMS log viewable by the subscriber
CREATE POLICY "Users can view own sms log"
  ON public.daily_devotional_sms_log FOR SELECT
  TO authenticated
  USING (subscriber_id IN (
    SELECT id FROM public.daily_devotional_sms_subscribers WHERE user_id = auth.uid()
  ));

-- Create storage bucket for devotional audio
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-devotional-audio', 'daily-devotional-audio', true)
ON CONFLICT (id) DO NOTHING;
