import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SimpleVoiceRoom } from './SimpleVoiceRoom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Volume2 } from 'lucide-react';

interface DirectCallButtonProps {
  otherUserId: string;
  otherUserName: string;
}

export function DirectCallButton({ otherUserId, otherUserName }: DirectCallButtonProps) {
  const { user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [displayName, setDisplayName] = useState('User');

  // Create a consistent room ID for 1-on-1 calls (sorted user IDs)
  const roomId = user ? 
    `dm-${[user.id, otherUserId].sort().join('-')}` : '';

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (data?.display_name) {
          setDisplayName(data.display_name);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsInCall(true)}
        className="h-8 w-8 hover:bg-accent"
        title={`Call ${otherUserName}`}
      >
        <Phone className="h-4 w-4" />
      </Button>

      <Dialog open={isInCall} onOpenChange={setIsInCall}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-green-500" />
              Call with {otherUserName}
            </DialogTitle>
          </DialogHeader>
          
          <SimpleVoiceRoom
            roomId={roomId}
            userId={user.id}
            userName={displayName}
            roomName={`Call with ${otherUserName}`}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
