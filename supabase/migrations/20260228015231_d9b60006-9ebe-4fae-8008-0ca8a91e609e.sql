
-- Add updated_at column for edit tracking
ALTER TABLE public.public_chat_messages 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow users to update their own message content (for editing)
DROP POLICY IF EXISTS "Users can soft-delete own messages" ON public.public_chat_messages;
CREATE POLICY "Users can update own messages" ON public.public_chat_messages
  FOR UPDATE USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);
