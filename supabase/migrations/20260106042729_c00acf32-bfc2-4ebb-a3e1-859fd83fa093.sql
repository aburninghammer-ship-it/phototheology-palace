-- Grant lifetime access to runnerbabe41@yahoo.com
UPDATE profiles
SET has_lifetime_access = true,
    lifetime_access_granted_at = now(),
    subscription_status = 'active',
    subscription_tier = 'premium',
    payment_source = 'manual'
WHERE id = '5e9cd899-ab31-46ff-840c-74de562f8df3';

UPDATE user_subscriptions
SET has_lifetime_access = true,
    lifetime_access_granted_at = now(),
    subscription_status = 'active',
    subscription_tier = 'premium'
WHERE user_id = '5e9cd899-ab31-46ff-840c-74de562f8df3';