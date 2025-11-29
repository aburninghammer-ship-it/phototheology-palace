-- Create storage bucket for user music
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-music', 'user-music', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac']);

-- Create RLS policies for user-music bucket
CREATE POLICY "Users can upload their own music"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own music"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own music"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track user uploaded music
CREATE TABLE public.user_music (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  category TEXT DEFAULT 'custom',
  mood TEXT,
  is_favorite BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_music ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_music table
CREATE POLICY "Users can view their own music"
ON public.user_music FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own music"
ON public.user_music FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own music"
ON public.user_music FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own music"
ON public.user_music FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_music_user_id ON public.user_music(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_music_updated_at
BEFORE UPDATE ON public.user_music
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();