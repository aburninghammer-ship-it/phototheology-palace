
-- AI credit balances table
CREATE TABLE public.ai_credit_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_balance INTEGER NOT NULL DEFAULT 100,
  has_unlimited BOOLEAN NOT NULL DEFAULT false,
  unlimited_expires_at TIMESTAMPTZ,
  lifetime_purchased INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- AI credit purchase log
CREATE TABLE public.ai_credit_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  credits_added INTEGER NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.ai_credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own balance" ON public.ai_credit_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own purchases" ON public.ai_credit_purchases FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service can manage balances" ON public.ai_credit_balances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service can manage purchases" ON public.ai_credit_purchases FOR ALL USING (true) WITH CHECK (true);

-- Initialize balance for new users
CREATE OR REPLACE FUNCTION public.initialize_ai_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.ai_credit_balances (user_id, credits_balance)
  VALUES (NEW.id, 100)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_ai_credit_balances_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ai_credit_balances_updated_at
  BEFORE UPDATE ON public.ai_credit_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_ai_credit_balances_updated_at();
