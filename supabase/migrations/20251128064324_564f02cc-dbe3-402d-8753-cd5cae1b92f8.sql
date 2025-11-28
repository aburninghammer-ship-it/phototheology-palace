-- Create voice chat invites table
CREATE TABLE public.voice_chat_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  inviter_id UUID NOT NULL,
  invitee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes')
);

-- Enable RLS
ALTER TABLE public.voice_chat_invites ENABLE ROW LEVEL SECURITY;

-- Users can see invites they sent or received
CREATE POLICY "Users can view their own invites"
ON public.voice_chat_invites
FOR SELECT
USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Users can create invites
CREATE POLICY "Users can create invites"
ON public.voice_chat_invites
FOR INSERT
WITH CHECK (auth.uid() = inviter_id);

-- Users can update invites they received (to accept/decline)
CREATE POLICY "Users can update invites they received"
ON public.voice_chat_invites
FOR UPDATE
USING (auth.uid() = invitee_id);

-- Users can delete their own invites
CREATE POLICY "Users can delete their own invites"
ON public.voice_chat_invites
FOR DELETE
USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Enable realtime for voice chat invites
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_invites;