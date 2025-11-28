import { useEffect, useState } from 'react';
import { Phone, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useVoiceChat } from '@/contexts/VoiceChatContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceChatInvite {
  id: string;
  room_id: string;
  room_name: string;
  inviter_id: string;
  inviter_name?: string;
  status: string;
  created_at: string;
}

export function VoiceChatInviteNotification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { joinVoiceChat, isDoNotDisturb } = useVoiceChat();
  const [invites, setInvites] = useState<VoiceChatInvite[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch pending invites
    const fetchInvites = async () => {
      const { data, error } = await supabase
        .from('voice_chat_invites')
        .select('*')
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (!error && data) {
        // Fetch inviter names
        const invitesWithNames = await Promise.all(
          data.map(async (invite) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', invite.inviter_id)
              .single();
            return {
              ...invite,
              inviter_name: profile?.display_name || 'Someone'
            };
          })
        );
        setInvites(invitesWithNames);
      }
    };

    fetchInvites();

    // Subscribe to new invites
    const channel = supabase
      .channel('voice-chat-invites')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voice_chat_invites',
          filter: `invitee_id=eq.${user.id}`
        },
        async (payload) => {
          const newInvite = payload.new as VoiceChatInvite;
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', newInvite.inviter_id)
            .single();
          
          setInvites(prev => [...prev, {
            ...newInvite,
            inviter_name: profile?.display_name || 'Someone'
          }]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'voice_chat_invites',
          filter: `invitee_id=eq.${user.id}`
        },
        (payload) => {
          const updated = payload.new as VoiceChatInvite;
          if (updated.status !== 'pending') {
            setInvites(prev => prev.filter(i => i.id !== updated.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAccept = async (invite: VoiceChatInvite) => {
    if (isDoNotDisturb) {
      toast({
        title: "Do Not Disturb Active",
        description: "Turn off DND mode to join voice chat",
        variant: "destructive",
      });
      return;
    }

    // Update invite status
    await supabase
      .from('voice_chat_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    // Parse room_id to navigate and join
    const [roomType, ...roomParts] = invite.room_id.split('-');
    const roomId = roomParts.join('-');
    
    // Navigate to the room if it's a palace room
    if (roomType === 'palace' && roomId.includes('/')) {
      navigate(`/palace/${roomId}`);
    }
    
    // Join the voice chat
    joinVoiceChat(invite.room_id);
    
    toast({
      title: "Joined Voice Chat",
      description: `You joined ${invite.room_name}`,
    });

    setInvites(prev => prev.filter(i => i.id !== invite.id));
  };

  const handleDecline = async (invite: VoiceChatInvite) => {
    await supabase
      .from('voice_chat_invites')
      .update({ status: 'declined' })
      .eq('id', invite.id);

    setInvites(prev => prev.filter(i => i.id !== invite.id));
  };

  if (!user || invites.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {invites.map((invite) => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="p-4 bg-card border-primary/20 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Voice Chat Invite</p>
                  <p className="text-xs text-muted-foreground truncate">
                    <User className="h-3 w-3 inline mr-1" />
                    {invite.inviter_name} invited you to
                  </p>
                  <p className="text-xs font-medium text-primary truncate">
                    {invite.room_name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleDecline(invite)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDecline(invite)}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleAccept(invite)}
                >
                  <Phone className="h-3 w-3" />
                  Join
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
