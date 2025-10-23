-- Create table for monthly generated games
CREATE TABLE IF NOT EXISTS public.monthly_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name TEXT NOT NULL,
  game_description TEXT NOT NULL,
  game_type TEXT NOT NULL, -- e.g., 'chain_chess_variant', 'verse_challenge', etc.
  game_rules JSONB NOT NULL, -- Stores specific rules, scoring, mechanics
  difficulty TEXT NOT NULL CHECK (difficulty IN ('kids', 'adults', 'advanced')),
  categories JSONB NOT NULL, -- Available categories for the game
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Optional: when the game becomes archived
  play_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.monthly_games ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active games
CREATE POLICY "Anyone can view active monthly games"
  ON public.monthly_games
  FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated users can play (updates play count)
CREATE POLICY "Authenticated users can update play count"
  ON public.monthly_games
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_monthly_games_month ON public.monthly_games(month_year);
CREATE INDEX idx_monthly_games_active ON public.monthly_games(is_active);

-- Create table for game ratings
CREATE TABLE IF NOT EXISTS public.game_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.monthly_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- Enable RLS for ratings
ALTER TABLE public.game_ratings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all ratings
CREATE POLICY "Anyone can view ratings"
  ON public.game_ratings
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own ratings
CREATE POLICY "Users can insert their own ratings"
  ON public.game_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON public.game_ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update average rating
CREATE OR REPLACE FUNCTION update_game_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.monthly_games
  SET average_rating = (
    SELECT AVG(rating)
    FROM public.game_ratings
    WHERE game_id = NEW.game_id
  ),
  play_count = play_count + 1
  WHERE id = NEW.game_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for updating average rating
CREATE TRIGGER update_game_rating_trigger
AFTER INSERT OR UPDATE ON public.game_ratings
FOR EACH ROW
EXECUTE FUNCTION update_game_average_rating();