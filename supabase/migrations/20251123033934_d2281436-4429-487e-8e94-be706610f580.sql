-- Create room_report_cards table
CREATE TABLE IF NOT EXISTS public.room_report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  mastery_level INTEGER NOT NULL CHECK (mastery_level >= 1 AND mastery_level <= 5),
  report_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.room_report_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own report cards"
  ON public.room_report_cards
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own report cards"
  ON public.room_report_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_room_report_cards_user_room ON public.room_report_cards(user_id, room_id);
CREATE INDEX idx_room_report_cards_created ON public.room_report_cards(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_room_report_cards_updated_at
  BEFORE UPDATE ON public.room_report_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();