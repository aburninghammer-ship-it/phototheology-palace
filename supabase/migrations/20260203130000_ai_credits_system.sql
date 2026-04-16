-- AI Credits System
-- Migration: 20260203130000_ai_credits_system.sql
-- Allows users to pay for AI usage via credits or upgrade to unlimited tier

-- ============================================
-- AI Credits Table
-- ============================================

CREATE TABLE IF NOT EXISTS user_ai_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credits_balance INTEGER DEFAULT 100,  -- Start with 100 free credits
  lifetime_credits_used INTEGER DEFAULT 0,
  last_refill_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_ai_credits ENABLE ROW LEVEL SECURITY;

-- Users can only view their own credits
CREATE POLICY "Users view own credits" ON user_ai_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can modify credits (via edge functions)
CREATE POLICY "Service role manages credits" ON user_ai_credits
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- AI Usage Log (for analytics and debugging)
-- ============================================

CREATE TABLE IF NOT EXISTS ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,  -- 'infographic', 'study-series', 'study-guide-ai', etc.
  credits_used INTEGER NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users view own usage" ON ai_usage_log
  FOR SELECT USING (auth.uid() = user_id);

-- Index for usage queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature ON ai_usage_log(feature);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON ai_usage_log(created_at);

-- ============================================
-- Credit Packages (purchasable)
-- ============================================

CREATE TABLE IF NOT EXISTS ai_credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default packages
INSERT INTO ai_credit_packages (name, credits, price_cents, sort_order) VALUES
  ('Starter Pack', 100, 499, 1),      -- $4.99 for 100 credits
  ('Value Pack', 300, 999, 2),        -- $9.99 for 300 credits
  ('Power Pack', 1000, 2499, 3)       -- $24.99 for 1000 credits
ON CONFLICT DO NOTHING;

-- ============================================
-- Credit Costs per Feature
-- ============================================

-- These are the credit costs for each AI feature
-- Stored as constants but could be made configurable
CREATE TABLE IF NOT EXISTS ai_feature_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL UNIQUE,
  credits_cost INTEGER NOT NULL,
  description TEXT,
  is_premium_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert feature costs
INSERT INTO ai_feature_costs (feature, credits_cost, description, is_premium_only) VALUES
  ('infographic', 3, 'Generate an infographic', false),
  ('study-guide-ai', 2, 'AI-enhanced study guide', false),
  ('study-series-lesson', 10, 'Generate one lesson in a series', true),
  ('study-series-outline', 5, 'Generate series outline', true),
  ('jeeves-response', 1, 'Jeeves AI response', false),
  ('mind-map-analyze', 2, 'Mind map analysis', false)
ON CONFLICT (feature) DO NOTHING;

-- ============================================
-- Helper Functions
-- ============================================

-- Initialize credits for new user
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_ai_credits (user_id, credits_balance)
  VALUES (NEW.id, 100)  -- 100 free credits for new users
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create credits for new users
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_credits();

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION check_ai_credits(
  user_id_param UUID,
  feature_param TEXT
)
RETURNS TABLE (
  has_credits BOOLEAN,
  credits_needed INTEGER,
  credits_available INTEGER,
  is_premium_only BOOLEAN,
  user_has_unlimited BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits_needed INTEGER;
  v_credits_available INTEGER;
  v_is_premium_only BOOLEAN;
  v_user_tier TEXT;
  v_has_unlimited BOOLEAN;
BEGIN
  -- Get feature cost
  SELECT credits_cost, ai_feature_costs.is_premium_only
  INTO v_credits_needed, v_is_premium_only
  FROM ai_feature_costs
  WHERE feature = feature_param;

  IF v_credits_needed IS NULL THEN
    v_credits_needed := 1;  -- Default cost
    v_is_premium_only := false;
  END IF;

  -- Get user's credits
  SELECT credits_balance INTO v_credits_available
  FROM user_ai_credits
  WHERE user_id = user_id_param;

  IF v_credits_available IS NULL THEN
    -- Initialize credits if not exists
    INSERT INTO user_ai_credits (user_id, credits_balance)
    VALUES (user_id_param, 100)
    ON CONFLICT (user_id) DO NOTHING;
    v_credits_available := 100;
  END IF;

  -- Check if user has unlimited (premium $30/mo tier)
  SELECT subscription_tier INTO v_user_tier
  FROM user_subscriptions
  WHERE user_id = user_id_param;

  -- Unlimited tier gets unlimited AI
  v_has_unlimited := v_user_tier = 'unlimited' OR v_user_tier = 'master';

  RETURN QUERY SELECT
    (v_has_unlimited OR v_credits_available >= v_credits_needed) as has_credits,
    v_credits_needed as credits_needed,
    v_credits_available as credits_available,
    v_is_premium_only as is_premium_only,
    v_has_unlimited as user_has_unlimited;
END;
$$;

-- Function to deduct credits (called by edge functions)
CREATE OR REPLACE FUNCTION deduct_ai_credits(
  user_id_param UUID,
  feature_param TEXT,
  input_tokens_param INTEGER DEFAULT NULL,
  output_tokens_param INTEGER DEFAULT NULL,
  model_param TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  new_balance INTEGER,
  credits_deducted INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits_cost INTEGER;
  v_current_balance INTEGER;
  v_has_unlimited BOOLEAN;
  v_user_tier TEXT;
BEGIN
  -- Check if user has unlimited
  SELECT subscription_tier INTO v_user_tier
  FROM user_subscriptions
  WHERE user_id = user_id_param;

  v_has_unlimited := v_user_tier = 'unlimited' OR v_user_tier = 'master';

  -- Get feature cost
  SELECT credits_cost INTO v_credits_cost
  FROM ai_feature_costs
  WHERE feature = feature_param;

  IF v_credits_cost IS NULL THEN
    v_credits_cost := 1;
  END IF;

  -- If unlimited, log but don't deduct
  IF v_has_unlimited THEN
    INSERT INTO ai_usage_log (user_id, feature, credits_used, input_tokens, output_tokens, model)
    VALUES (user_id_param, feature_param, 0, input_tokens_param, output_tokens_param, model_param);

    RETURN QUERY SELECT true as success, 999999 as new_balance, 0 as credits_deducted;
    RETURN;
  END IF;

  -- Get current balance
  SELECT credits_balance INTO v_current_balance
  FROM user_ai_credits
  WHERE user_id = user_id_param
  FOR UPDATE;

  IF v_current_balance IS NULL OR v_current_balance < v_credits_cost THEN
    RETURN QUERY SELECT false as success, COALESCE(v_current_balance, 0) as new_balance, 0 as credits_deducted;
    RETURN;
  END IF;

  -- Deduct credits
  UPDATE user_ai_credits
  SET
    credits_balance = credits_balance - v_credits_cost,
    lifetime_credits_used = lifetime_credits_used + v_credits_cost,
    updated_at = now()
  WHERE user_id = user_id_param;

  -- Log usage
  INSERT INTO ai_usage_log (user_id, feature, credits_used, input_tokens, output_tokens, model)
  VALUES (user_id_param, feature_param, v_credits_cost, input_tokens_param, output_tokens_param, model_param);

  RETURN QUERY SELECT
    true as success,
    (v_current_balance - v_credits_cost) as new_balance,
    v_credits_cost as credits_deducted;
END;
$$;

-- Function to add credits (after purchase)
CREATE OR REPLACE FUNCTION add_ai_credits(
  user_id_param UUID,
  credits_to_add INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE user_ai_credits
  SET
    credits_balance = credits_balance + credits_to_add,
    updated_at = now()
  WHERE user_id = user_id_param
  RETURNING credits_balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    INSERT INTO user_ai_credits (user_id, credits_balance)
    VALUES (user_id_param, credits_to_add)
    RETURNING credits_balance INTO v_new_balance;
  END IF;

  RETURN v_new_balance;
END;
$$;

-- Function to get user's AI usage stats
CREATE OR REPLACE FUNCTION get_ai_usage_stats(user_id_param UUID)
RETURNS TABLE (
  credits_balance INTEGER,
  lifetime_used INTEGER,
  usage_this_month INTEGER,
  top_features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.credits_balance,
    c.lifetime_credits_used as lifetime_used,
    COALESCE((
      SELECT SUM(credits_used)::INTEGER
      FROM ai_usage_log
      WHERE user_id = user_id_param
        AND created_at >= date_trunc('month', now())
    ), 0) as usage_this_month,
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object('feature', feature, 'count', cnt))
      FROM (
        SELECT feature, COUNT(*) as cnt
        FROM ai_usage_log
        WHERE user_id = user_id_param
        GROUP BY feature
        ORDER BY cnt DESC
        LIMIT 5
      ) t
    ), '[]'::jsonb) as top_features
  FROM user_ai_credits c
  WHERE c.user_id = user_id_param;
END;
$$;
