-- Add payment tracking fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS payment_source text CHECK (payment_source IN ('stripe', 'promotional', 'lifetime', 'manual', 'church')) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;

-- Update existing records to set proper payment sources
UPDATE profiles 
SET payment_source = 'lifetime', is_recurring = false
WHERE has_lifetime_access = true;

UPDATE profiles
SET payment_source = 'promotional', is_recurring = false
WHERE subscription_tier IN ('essential', 'premium', 'student') 
AND has_lifetime_access = false
AND stripe_subscription_id IS NULL
AND subscription_status = 'active';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_payment_source ON profiles(payment_source);
CREATE INDEX IF NOT EXISTS idx_profiles_is_recurring ON profiles(is_recurring);