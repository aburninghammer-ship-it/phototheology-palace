ALTER TABLE public.daily_audio_devotionals 
ADD COLUMN IF NOT EXISTS call_to_action text,
ADD COLUMN IF NOT EXISTS palace_room text,
ADD COLUMN IF NOT EXISTS app_feature_cta text;