
-- =============================================
-- FIX 3: gift_purchases - restrict SELECT
-- =============================================

DROP POLICY IF EXISTS "Anyone can view gift by token for redemption" ON public.gift_purchases;

CREATE POLICY "Users can view own gifts"
  ON public.gift_purchases FOR SELECT TO authenticated
  USING (auth.uid() = gifter_user_id OR auth.uid() = redeemed_by);

CREATE OR REPLACE FUNCTION public.get_gift_by_token(_token text)
RETURNS TABLE(
  id uuid, gift_token text, status text, personal_message text,
  plan_type text, expires_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT gp.id, gp.gift_token, gp.status, gp.personal_message,
         gp.plan_type, gp.expires_at
  FROM public.gift_purchases gp WHERE gp.gift_token = _token;
$$;

-- =============================================
-- FIX 4: debate_turn_analyses
-- =============================================

DROP POLICY IF EXISTS "Service role can manage turn analyses" ON public.debate_turn_analyses;

CREATE POLICY "Service role manages turn analyses"
  ON public.debate_turn_analyses FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Users can view own debate analyses"
  ON public.debate_turn_analyses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
