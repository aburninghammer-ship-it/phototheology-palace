-- Create rate_limits table to track API usage and prevent abuse
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own rate limits
CREATE POLICY "Users can view own rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can manage all rate limits (for edge functions)
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);

-- Function to cleanup old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '2 hours';
END;
$$;