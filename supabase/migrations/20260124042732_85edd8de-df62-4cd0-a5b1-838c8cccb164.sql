-- Drop the old check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_payment_source_check;

-- Add the updated check constraint with 'patreon' included
ALTER TABLE public.profiles ADD CONSTRAINT profiles_payment_source_check 
CHECK (payment_source IS NULL OR payment_source = ANY (ARRAY['stripe', 'promotional', 'lifetime', 'manual', 'church', 'patreon', 'trial', 'none']));