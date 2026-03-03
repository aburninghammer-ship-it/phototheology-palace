
-- Game session chat messages for in-game communication
CREATE TABLE public.game_session_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Player',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_session_messages ENABLE ROW LEVEL SECURITY;

-- Anyone in the game room can read messages
CREATE POLICY "Players can read game messages"
  ON public.game_session_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_room_players
      WHERE game_room_players.room_id = game_session_messages.room_id
      AND game_room_players.user_id = auth.uid()
    )
  );

-- Authenticated users can send messages to rooms they're in
CREATE POLICY "Players can send messages"
  ON public.game_session_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.game_room_players
      WHERE game_room_players.room_id = game_session_messages.room_id
      AND game_room_players.user_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_session_messages;

-- Index for fast room message lookups
CREATE INDEX idx_game_session_messages_room ON public.game_session_messages(room_id, created_at DESC);
