ALTER TABLE public.public_chat_messages 
ADD CONSTRAINT public_chat_messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;