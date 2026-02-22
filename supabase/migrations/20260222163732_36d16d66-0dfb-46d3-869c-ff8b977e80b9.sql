
-- Gift purchases: track when someone buys the Suite for another person
CREATE TABLE public.gift_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gifter_user_id UUID NOT NULL,
  gifter_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  gift_token TEXT NOT NULL UNIQUE DEFAULT 'GIFT' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 10)),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('essential_monthly', 'essential_annual')),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'redeemed', 'expired')),
  personal_message TEXT,
  redeemed_by UUID,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '90 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Day passes: free 24-hour access with limited audio
CREATE TABLE public.day_passes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  pass_token TEXT NOT NULL UNIQUE DEFAULT 'DAY' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 10)),
  recipient_identifier TEXT, -- email or fingerprint to enforce one-per-recipient
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- set to 24h after redemption
  audio_plays_used INTEGER NOT NULL DEFAULT 0,
  audio_plays_limit INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_passes ENABLE ROW LEVEL SECURITY;

-- Gift policies
CREATE POLICY "Users can view their sent gifts"
  ON public.gift_purchases FOR SELECT
  USING (auth.uid() = gifter_user_id OR auth.uid() = redeemed_by);

CREATE POLICY "Users can create gifts"
  ON public.gift_purchases FOR INSERT
  WITH CHECK (auth.uid() = gifter_user_id);

CREATE POLICY "Anyone can view gift by token for redemption"
  ON public.gift_purchases FOR SELECT
  USING (true);

CREATE POLICY "System can update gift status"
  ON public.gift_purchases FOR UPDATE
  USING (auth.uid() = gifter_user_id OR auth.uid() = redeemed_by);

-- Day pass policies
CREATE POLICY "Users can view their created passes"
  ON public.day_passes FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create day passes"
  ON public.day_passes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Anyone can view pass by token"
  ON public.day_passes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update pass for redemption"
  ON public.day_passes FOR UPDATE
  USING (true);

-- Function to redeem a day pass (enforces one per recipient)
CREATE OR REPLACE FUNCTION public.redeem_day_pass(_token TEXT, _recipient_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pass_record RECORD;
BEGIN
  -- Get the pass
  SELECT * INTO pass_record
  FROM public.day_passes
  WHERE pass_token = _token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid day pass');
  END IF;

  IF pass_record.status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'error', 'This day pass has already been used');
  END IF;

  -- Check if this recipient already redeemed any day pass
  IF EXISTS (
    SELECT 1 FROM public.day_passes
    WHERE recipient_identifier = _recipient_id
    AND status IN ('redeemed', 'expired')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already used a day pass. Each person can only use one day pass.');
  END IF;

  -- Redeem it
  UPDATE public.day_passes
  SET 
    status = 'redeemed',
    recipient_identifier = _recipient_id,
    redeemed_at = NOW(),
    expires_at = NOW() + INTERVAL '24 hours'
  WHERE id = pass_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Day pass activated! You have 24 hours of access with up to 3 audio commentaries.',
    'expires_at', (NOW() + INTERVAL '24 hours')::TEXT
  );
END;
$$;

-- Function to check/increment audio usage for day pass
CREATE OR REPLACE FUNCTION public.use_day_pass_audio(_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pass_record RECORD;
BEGIN
  SELECT * INTO pass_record
  FROM public.day_passes
  WHERE pass_token = _token
  AND status = 'redeemed'
  AND expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No active day pass found');
  END IF;

  IF pass_record.audio_plays_used >= pass_record.audio_plays_limit THEN
    RETURN jsonb_build_object('success', false, 'error', 'Audio commentary limit reached (3 of 3 used). Subscribe for unlimited access!', 'limit_reached', true);
  END IF;

  UPDATE public.day_passes
  SET audio_plays_used = audio_plays_used + 1
  WHERE id = pass_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'plays_used', pass_record.audio_plays_used + 1,
    'plays_remaining', pass_record.audio_plays_limit - pass_record.audio_plays_used - 1
  );
END;
$$;

-- Indexes
CREATE INDEX idx_gift_purchases_token ON public.gift_purchases(gift_token);
CREATE INDEX idx_gift_purchases_gifter ON public.gift_purchases(gifter_user_id);
CREATE INDEX idx_day_passes_token ON public.day_passes(pass_token);
CREATE INDEX idx_day_passes_recipient ON public.day_passes(recipient_identifier);
CREATE INDEX idx_day_passes_created_by ON public.day_passes(created_by);
