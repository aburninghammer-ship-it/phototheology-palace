ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS global_live_chat boolean NOT NULL DEFAULT true;