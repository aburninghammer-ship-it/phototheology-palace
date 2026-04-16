
-- Add guest tracking columns to lock_in_passes
ALTER TABLE public.lock_in_passes 
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS conversion_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Add comment for conversion_status values
COMMENT ON COLUMN public.lock_in_passes.conversion_status IS 'pending | active | expiring_soon | expired | converted | lost';

-- Create index for efficient querying by creator
CREATE INDEX IF NOT EXISTS idx_lock_in_passes_created_by ON public.lock_in_passes(created_by);
CREATE INDEX IF NOT EXISTS idx_lock_in_passes_conversion_status ON public.lock_in_passes(conversion_status);
