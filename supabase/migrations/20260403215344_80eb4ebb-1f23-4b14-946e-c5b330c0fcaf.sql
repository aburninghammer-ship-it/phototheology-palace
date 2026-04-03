
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience_mode TEXT NOT NULL DEFAULT 'simple' 
CHECK (experience_mode IN ('simple', 'guided', 'master'));
