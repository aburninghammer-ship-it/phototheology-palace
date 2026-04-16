-- Add access_expires_at to teachable_students for grace period tracking
ALTER TABLE public.teachable_students 
ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT 'active';

-- Add access_expires_at to patreon_connections for grace period tracking  
ALTER TABLE public.patreon_connections
ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pledge_status TEXT DEFAULT 'active';

-- Create index for efficient sync queries
CREATE INDEX IF NOT EXISTS idx_teachable_students_user_id ON public.teachable_students(user_id);
CREATE INDEX IF NOT EXISTS idx_patreon_connections_user_id ON public.patreon_connections(user_id);