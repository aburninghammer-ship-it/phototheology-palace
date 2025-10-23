-- Create escape rooms table
CREATE TABLE public.escape_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('category_gauntlet', 'floor_race')),
  category TEXT CHECK (category IN ('prophecy', 'sanctuary', 'gospel_mission')),
  difficulty TEXT NOT NULL DEFAULT 'pro',
  time_limit_minutes INTEGER NOT NULL DEFAULT 60,
  max_hints INTEGER NOT NULL DEFAULT 3,
  biblical_conclusion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create escape room puzzles table
CREATE TABLE public.escape_room_puzzles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.escape_rooms(id) ON DELETE CASCADE,
  puzzle_number INTEGER NOT NULL,
  floor_number INTEGER,
  room_tag TEXT NOT NULL,
  principle TEXT NOT NULL,
  prompt TEXT NOT NULL,
  expected_verses TEXT[] NOT NULL,
  typology_notes TEXT,
  points_perfect INTEGER NOT NULL DEFAULT 5,
  points_partial INTEGER NOT NULL DEFAULT 3,
  time_cap_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, puzzle_number)
);

-- Create escape room attempts table
CREATE TABLE public.escape_room_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.escape_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  time_elapsed_seconds INTEGER,
  is_team BOOLEAN NOT NULL DEFAULT false,
  team_members TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create escape room solutions table
CREATE TABLE public.escape_room_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.escape_room_attempts(id) ON DELETE CASCADE,
  puzzle_id UUID NOT NULL REFERENCES public.escape_room_puzzles(id) ON DELETE CASCADE,
  submitted_verses TEXT[] NOT NULL,
  room_justification TEXT NOT NULL,
  principle_used TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.escape_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escape_room_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escape_room_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escape_room_solutions ENABLE ROW LEVEL SECURITY;

-- Policies for escape_rooms
CREATE POLICY "Escape rooms are viewable by everyone"
ON public.escape_rooms FOR SELECT
USING (true);

-- Policies for escape_room_puzzles
CREATE POLICY "Escape room puzzles are viewable by everyone"
ON public.escape_room_puzzles FOR SELECT
USING (true);

-- Policies for escape_room_attempts
CREATE POLICY "Users can view their own attempts"
ON public.escape_room_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts"
ON public.escape_room_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts"
ON public.escape_room_attempts FOR UPDATE
USING (auth.uid() = user_id);

-- Policies for escape_room_solutions
CREATE POLICY "Users can view their own solutions"
ON public.escape_room_solutions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.escape_room_attempts
    WHERE escape_room_attempts.id = escape_room_solutions.attempt_id
    AND escape_room_attempts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own solutions"
ON public.escape_room_solutions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.escape_room_attempts
    WHERE escape_room_attempts.id = escape_room_solutions.attempt_id
    AND escape_room_attempts.user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX idx_escape_rooms_expires_at ON public.escape_rooms(expires_at);
CREATE INDEX idx_escape_room_puzzles_room_id ON public.escape_room_puzzles(room_id);
CREATE INDEX idx_escape_room_attempts_user_id ON public.escape_room_attempts(user_id);
CREATE INDEX idx_escape_room_attempts_room_id ON public.escape_room_attempts(room_id);
CREATE INDEX idx_escape_room_solutions_attempt_id ON public.escape_room_solutions(attempt_id);