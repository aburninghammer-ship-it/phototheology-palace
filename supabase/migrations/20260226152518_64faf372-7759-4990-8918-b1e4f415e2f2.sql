
-- Update the initialize_ai_credits function to give 500 credits instead of 100
CREATE OR REPLACE FUNCTION public.initialize_ai_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.ai_credit_balances (user_id, credits_balance)
  VALUES (NEW.id, 500)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Give existing users with 100 or fewer credits a bump to 500
UPDATE public.ai_credit_balances
SET credits_balance = 500
WHERE credits_balance <= 100 AND has_unlimited = false;
