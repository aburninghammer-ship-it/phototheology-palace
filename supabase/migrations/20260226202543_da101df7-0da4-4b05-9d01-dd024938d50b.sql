-- Add thread support columns to public_chat_messages
ALTER TABLE public.public_chat_messages 
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.public_chat_messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;

-- Create index for thread lookups
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_reply_to ON public.public_chat_messages(reply_to_id) WHERE reply_to_id IS NOT NULL;

-- Allow users to soft-delete their own messages
CREATE POLICY "Users can soft-delete own messages"
  ON public.public_chat_messages
  FOR UPDATE
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);