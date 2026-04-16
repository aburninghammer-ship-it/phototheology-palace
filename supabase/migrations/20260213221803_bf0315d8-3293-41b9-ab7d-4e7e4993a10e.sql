
-- Create prayer_responses table for tracking who prayed for a request
CREATE TABLE public.prayer_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prayer_request_id, user_id)
);

-- Enable RLS
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view prayer responses" ON public.prayer_responses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own prayer responses" ON public.prayer_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer responses" ON public.prayer_responses
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to increment prayer_count on prayer_requests
CREATE OR REPLACE TRIGGER increment_prayer_count_trigger
  AFTER INSERT ON public.prayer_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_prayer_count();
