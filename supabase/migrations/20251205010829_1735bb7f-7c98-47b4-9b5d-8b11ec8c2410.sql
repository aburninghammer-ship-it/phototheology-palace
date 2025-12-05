-- Create a generic game sessions table for saving/resuming any game
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  game_state JSONB NOT NULL DEFAULT '{}',
  score INTEGER DEFAULT 0,
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  is_abandoned BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own game sessions
CREATE POLICY "Users can view their own game sessions"
ON public.game_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own game sessions
CREATE POLICY "Users can create their own game sessions"
ON public.game_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own game sessions
CREATE POLICY "Users can update their own game sessions"
ON public.game_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own game sessions
CREATE POLICY "Users can delete their own game sessions"
ON public.game_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_game_sessions_user_game ON public.game_sessions(user_id, game_type);
CREATE INDEX idx_game_sessions_active ON public.game_sessions(user_id, game_type, is_completed, is_abandoned);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_sessions_updated_at
BEFORE UPDATE ON public.game_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();