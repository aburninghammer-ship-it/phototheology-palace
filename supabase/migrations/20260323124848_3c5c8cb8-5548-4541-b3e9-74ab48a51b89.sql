
CREATE TABLE public.translation_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  user_image_description TEXT NOT NULL,
  generated_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.translation_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own translations"
  ON public.translation_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own translations"
  ON public.translation_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own translations"
  ON public.translation_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own translations"
  ON public.translation_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_translation_library_user_id ON public.translation_library(user_id);
