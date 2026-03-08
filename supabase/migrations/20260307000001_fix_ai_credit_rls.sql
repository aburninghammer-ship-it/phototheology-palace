-- Fix overly permissive RLS policies on financial tables.
-- The "Service can manage" policies used USING(true) without a role restriction,
-- meaning ANY authenticated user could INSERT/UPDATE/DELETE any user's credits.
-- Edge functions already use service_role which bypasses RLS entirely,
-- so these wide-open policies are unnecessary and dangerous.

-- Drop the dangerous policies
DROP POLICY IF EXISTS "Service can manage balances" ON public.ai_credit_balances;
DROP POLICY IF EXISTS "Service can manage purchases" ON public.ai_credit_purchases;

-- Users should only be able to read their own data (policies already exist, but re-create safely)
DROP POLICY IF EXISTS "Users can read own balance" ON public.ai_credit_balances;
DROP POLICY IF EXISTS "Users can read own purchases" ON public.ai_credit_purchases;

CREATE POLICY "Users can read own balance"
  ON public.ai_credit_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own purchases"
  ON public.ai_credit_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
