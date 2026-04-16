-- Jeeves response cache to reduce AI API costs
-- Caches responses for identical card+text combinations

CREATE TABLE IF NOT EXISTS public.jeeves_response_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,  -- Hash of cardCode + storyText + mode
  mode TEXT NOT NULL,               -- 'standard', 'gather-fragments', 'fragment-dialogue'
  card_code TEXT,                   -- Room code (null for gather-fragments)
  story_reference TEXT,             -- Bible reference
  response TEXT NOT NULL,           -- Cached AI response
  selected_rooms TEXT[],            -- For gather-fragments mode
  hit_count INTEGER DEFAULT 1,      -- Track how often this cache is used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_jeeves_cache_key ON public.jeeves_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_jeeves_cache_expires ON public.jeeves_response_cache(expires_at);

-- Enable RLS but allow public read (responses are not user-specific)
ALTER TABLE public.jeeves_response_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read jeeves cache"
  ON public.jeeves_response_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage cache"
  ON public.jeeves_response_cache FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to clean expired cache entries (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_jeeves_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.jeeves_response_cache
  WHERE expires_at < now();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Schedule cleanup daily at 3 AM UTC
SELECT cron.schedule(
  'cleanup-jeeves-cache',
  '0 3 * * *',
  'SELECT public.cleanup_jeeves_cache()'
);

-- AI usage quota table to track daily usage per user
CREATE TABLE IF NOT EXISTS public.ai_usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  jeeves_calls INTEGER DEFAULT 0,
  image_generations INTEGER DEFAULT 0,
  tts_requests INTEGER DEFAULT 0,
  total_tokens_estimated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(user_id, usage_date)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_quota_user_date ON public.ai_usage_quotas(user_id, usage_date);

-- Enable RLS
ALTER TABLE public.ai_usage_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quota"
  ON public.ai_usage_quotas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage quotas"
  ON public.ai_usage_quotas FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to increment usage and check quota
CREATE OR REPLACE FUNCTION public.check_and_increment_ai_quota(
  p_user_id UUID,
  p_quota_type TEXT,  -- 'jeeves', 'image', 'tts'
  p_daily_limit INTEGER DEFAULT 50
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_usage INTEGER;
  v_is_premium BOOLEAN;
  v_result JSONB;
BEGIN
  -- Check if user is premium (unlimited quota)
  SELECT subscription_status IN ('active', 'trial') INTO v_is_premium
  FROM public.profiles
  WHERE id = p_user_id;

  -- Premium users have unlimited quota
  IF v_is_premium THEN
    -- Still track usage for analytics, but don't limit
    INSERT INTO public.ai_usage_quotas (user_id, usage_date, jeeves_calls, image_generations, tts_requests)
    VALUES (p_user_id, CURRENT_DATE,
      CASE WHEN p_quota_type = 'jeeves' THEN 1 ELSE 0 END,
      CASE WHEN p_quota_type = 'image' THEN 1 ELSE 0 END,
      CASE WHEN p_quota_type = 'tts' THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id, usage_date) DO UPDATE SET
      jeeves_calls = ai_usage_quotas.jeeves_calls + CASE WHEN p_quota_type = 'jeeves' THEN 1 ELSE 0 END,
      image_generations = ai_usage_quotas.image_generations + CASE WHEN p_quota_type = 'image' THEN 1 ELSE 0 END,
      tts_requests = ai_usage_quotas.tts_requests + CASE WHEN p_quota_type = 'tts' THEN 1 ELSE 0 END,
      updated_at = now();

    RETURN jsonb_build_object('allowed', true, 'is_premium', true, 'remaining', -1);
  END IF;

  -- Get current usage for free users
  SELECT
    CASE p_quota_type
      WHEN 'jeeves' THEN COALESCE(jeeves_calls, 0)
      WHEN 'image' THEN COALESCE(image_generations, 0)
      WHEN 'tts' THEN COALESCE(tts_requests, 0)
    END INTO v_current_usage
  FROM public.ai_usage_quotas
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  v_current_usage := COALESCE(v_current_usage, 0);

  -- Check if quota exceeded
  IF v_current_usage >= p_daily_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'is_premium', false,
      'current_usage', v_current_usage,
      'daily_limit', p_daily_limit,
      'remaining', 0,
      'message', 'Daily AI limit reached. Upgrade to Premium for unlimited access.'
    );
  END IF;

  -- Increment usage
  INSERT INTO public.ai_usage_quotas (user_id, usage_date, jeeves_calls, image_generations, tts_requests)
  VALUES (p_user_id, CURRENT_DATE,
    CASE WHEN p_quota_type = 'jeeves' THEN 1 ELSE 0 END,
    CASE WHEN p_quota_type = 'image' THEN 1 ELSE 0 END,
    CASE WHEN p_quota_type = 'tts' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, usage_date) DO UPDATE SET
    jeeves_calls = ai_usage_quotas.jeeves_calls + CASE WHEN p_quota_type = 'jeeves' THEN 1 ELSE 0 END,
    image_generations = ai_usage_quotas.image_generations + CASE WHEN p_quota_type = 'image' THEN 1 ELSE 0 END,
    tts_requests = ai_usage_quotas.tts_requests + CASE WHEN p_quota_type = 'tts' THEN 1 ELSE 0 END,
    updated_at = now();

  RETURN jsonb_build_object(
    'allowed', true,
    'is_premium', false,
    'current_usage', v_current_usage + 1,
    'daily_limit', p_daily_limit,
    'remaining', p_daily_limit - v_current_usage - 1
  );
END;
$$;

-- Clean up old quota records (keep 30 days for analytics)
CREATE OR REPLACE FUNCTION public.cleanup_old_quotas()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.ai_usage_quotas
  WHERE usage_date < CURRENT_DATE - interval '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Schedule quota cleanup weekly
SELECT cron.schedule(
  'cleanup-old-quotas',
  '0 4 * * 0',
  'SELECT public.cleanup_old_quotas()'
);
