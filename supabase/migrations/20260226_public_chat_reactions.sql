-- Emoji reactions on public chat messages
CREATE TABLE IF NOT EXISTS public.public_chat_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.public_chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Fast lookups by message
CREATE INDEX IF NOT EXISTS idx_public_chat_reactions_message_id
  ON public.public_chat_reactions(message_id);

-- RLS
ALTER TABLE public.public_chat_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public chat reactions"
  ON public.public_chat_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own reactions"
  ON public.public_chat_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON public.public_chat_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_chat_reactions;
