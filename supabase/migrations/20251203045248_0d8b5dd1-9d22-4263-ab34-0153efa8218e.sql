-- Add missing columns to monthly_gates table
ALTER TABLE public.monthly_gates 
ADD COLUMN IF NOT EXISTS score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_spent_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS passed_at timestamp with time zone;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_monthly_gates_user_path 
ON public.monthly_gates(user_id, path_type, year, month);