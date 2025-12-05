-- Remove plain text token columns from social_media_connections table
-- Keep only the encrypted versions for security

ALTER TABLE public.social_media_connections 
DROP COLUMN IF EXISTS access_token,
DROP COLUMN IF EXISTS refresh_token;