-- Create social_media_connections table for OAuth tokens
CREATE TABLE IF NOT EXISTS public.social_media_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  platform_username TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.social_media_connections ENABLE ROW LEVEL SECURITY;

-- Users can only access their own connections
CREATE POLICY "Users can view own social connections"
  ON public.social_media_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social connections"
  ON public.social_media_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social connections"
  ON public.social_media_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social connections"
  ON public.social_media_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_social_connections_user_platform ON public.social_media_connections(user_id, platform);