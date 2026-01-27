-- Add 'pickaxe' and 'pending' values to the payment_source constraint
-- Also add 'teachable' for future use

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_payment_source_check;

ALTER TABLE profiles ADD CONSTRAINT profiles_payment_source_check 
CHECK (payment_source IN ('stripe', 'promotional', 'lifetime', 'manual', 'church', 'patreon', 'trial', 'none', 'pickaxe', 'teachable'));