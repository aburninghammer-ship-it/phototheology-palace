
CREATE TABLE public.saved_daily_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  verse_id UUID NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

ALTER TABLE public.saved_daily_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved verses"
  ON public.saved_daily_verses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save verses"
  ON public.saved_daily_verses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved verses"
  ON public.saved_daily_verses FOR DELETE
  USING (auth.uid() = user_id);
