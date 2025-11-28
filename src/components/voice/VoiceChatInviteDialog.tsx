import { useState, useEffect } from 'react';
import { UserPlus, Search, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceChatInviteDialogProps {
  roomId: string;
  roomName: string;
}

interface UserProfile {
  id: string;
  display_name: string | null;
}

export function VoiceChatInviteDialog({ roomId, roomName }: VoiceChatInviteDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;

    const searchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .neq('id', user.id)
        .ilike('display_name', `%${search}%`)
        .limit(20);

      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };

    const timeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeout);
  }, [open, search, user]);

  const handleInvite = async (inviteeId: string, displayName: string | null) => {
    if (!user) return;
    
    setInviting(inviteeId);
    
    try {
      // Check if there's already a pending invite
      const { data: existing } = await supabase
        .from('voice_chat_invites')
        .select('id')
        .eq('room_id', roomId)
        .eq('inviter_id', user.id)
        .eq('invitee_id', inviteeId)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (existing) {
        toast({
          title: "Already Invited",
          description: `${displayName || 'User'} already has a pending invite`,
          variant: "destructive",
        });
        setInviting(null);
        return;
      }

      const { error } = await supabase
        .from('voice_chat_invites')
        .insert({
          room_id: roomId,
          room_name: roomName,
          inviter_id: user.id,
          invitee_id: inviteeId,
        });

      if (error) throw error;

      toast({
        title: "Invite Sent",
        description: `Invited ${displayName || 'user'} to join voice chat`,
      });
    } catch (error) {
      toast({
        title: "Failed to Send Invite",
        description: "Please try again",
        variant: "destructive",
      });
    }
    
    setInviting(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" title="Invite to Voice Chat">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Voice Chat</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-muted-foreground">
                {search ? 'No users found' : 'Type to search for users'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {(profile.display_name || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {profile.display_name || 'Anonymous'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    disabled={inviting === profile.id}
                    onClick={() => handleInvite(profile.id, profile.display_name)}
                  >
                    <Send className="h-3 w-3" />
                    {inviting === profile.id ? 'Sending...' : 'Invite'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
