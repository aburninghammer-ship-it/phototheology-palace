-- Create table for Jeeves conversation messages
CREATE TABLE public.jeeves_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_jeeves_messages_user_id ON public.jeeves_messages(user_id);
CREATE INDEX idx_jeeves_messages_session_id ON public.jeeves_messages(session_id);
CREATE INDEX idx_jeeves_messages_created_at ON public.jeeves_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.jeeves_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own messages
CREATE POLICY "Users can view their own Jeeves messages"
ON public.jeeves_messages
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own messages
CREATE POLICY "Users can create their own Jeeves messages"
ON public.jeeves_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own Jeeves messages"
ON public.jeeves_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Add column to study_sessions to track if it has Jeeves history
ALTER TABLE public.study_sessions 
ADD COLUMN IF NOT EXISTS has_jeeves_history BOOLEAN DEFAULT false;