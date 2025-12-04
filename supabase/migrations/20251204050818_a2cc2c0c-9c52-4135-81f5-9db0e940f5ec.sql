-- Create table for path activity responses
CREATE TABLE public.path_activity_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_id TEXT NOT NULL,
  path_type TEXT NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_id)
);

-- Enable RLS
ALTER TABLE public.path_activity_responses ENABLE ROW LEVEL SECURITY;

-- Users can view their own responses
CREATE POLICY "Users can view own responses"
ON public.path_activity_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own responses"
ON public.path_activity_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own responses"
ON public.path_activity_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own responses"
ON public.path_activity_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_path_activity_responses_updated_at
BEFORE UPDATE ON public.path_activity_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();