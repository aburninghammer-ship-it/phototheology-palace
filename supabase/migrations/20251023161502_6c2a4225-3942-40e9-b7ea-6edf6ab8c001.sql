-- Create treasure hunts table
CREATE TABLE IF NOT EXISTS public.treasure_hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'intermediate', 'advance', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  biblical_conclusion TEXT NOT NULL,
  total_clues INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Create treasure hunt clues table
CREATE TABLE IF NOT EXISTS public.treasure_hunt_clues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.treasure_hunts(id) ON DELETE CASCADE,
  clue_number INTEGER NOT NULL,
  room_tag TEXT NOT NULL,
  principle TEXT NOT NULL,
  hint TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hunt_id, clue_number)
);

-- Create treasure hunt participants table
CREATE TABLE IF NOT EXISTS public.treasure_hunt_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.treasure_hunts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_clue INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_time_seconds INTEGER,
  UNIQUE(hunt_id, user_id)
);

-- Create treasure hunt answers table
CREATE TABLE IF NOT EXISTS public.treasure_hunt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.treasure_hunts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clue_id UUID NOT NULL REFERENCES public.treasure_hunt_clues(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training drills table
CREATE TABLE IF NOT EXISTS public.training_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_tag TEXT NOT NULL,
  drill_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_tag, drill_number)
);

-- Create user drill completions table
CREATE TABLE IF NOT EXISTS public.user_drill_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES public.training_drills(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response TEXT,
  UNIQUE(user_id, drill_id)
);

-- Enable RLS
ALTER TABLE public.treasure_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treasure_hunt_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treasure_hunt_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treasure_hunt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_drill_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for treasure_hunts
CREATE POLICY "Treasure hunts viewable by all authenticated users"
  ON public.treasure_hunts FOR SELECT
  USING (auth.uid() IS NOT NULL AND expires_at > NOW());

CREATE POLICY "Only admins can create treasure hunts"
  ON public.treasure_hunts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for treasure_hunt_clues
CREATE POLICY "Clues viewable by hunt participants"
  ON public.treasure_hunt_clues FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.treasure_hunt_participants
      WHERE hunt_id = treasure_hunt_clues.hunt_id
      AND user_id = auth.uid()
      AND clue_number <= current_clue
    )
  );

-- RLS Policies for treasure_hunt_participants
CREATE POLICY "Participants can view their own participation"
  ON public.treasure_hunt_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join treasure hunts"
  ON public.treasure_hunt_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
  ON public.treasure_hunt_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for treasure_hunt_answers
CREATE POLICY "Users can view their own answers"
  ON public.treasure_hunt_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit answers"
  ON public.treasure_hunt_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for training_drills
CREATE POLICY "Training drills viewable by all authenticated users"
  ON public.training_drills FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage training drills"
  ON public.training_drills FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_drill_completions
CREATE POLICY "Users can view their own completions"
  ON public.user_drill_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own completions"
  ON public.user_drill_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_treasure_hunts_difficulty ON public.treasure_hunts(difficulty);
CREATE INDEX idx_treasure_hunts_expires ON public.treasure_hunts(expires_at);
CREATE INDEX idx_treasure_hunt_participants_hunt ON public.treasure_hunt_participants(hunt_id);
CREATE INDEX idx_treasure_hunt_participants_user ON public.treasure_hunt_participants(user_id);
CREATE INDEX idx_training_drills_room ON public.training_drills(room_tag);