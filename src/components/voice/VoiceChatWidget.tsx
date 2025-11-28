import { useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Users, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVoiceChat } from '@/contexts/VoiceChatContext';
import { WebRTCCall } from '@/components/WebRTCCall';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { VoiceChatInviteDialog } from './VoiceChatInviteDialog';

interface VoiceChatWidgetProps {
  roomType: 'palace' | 'bible' | 'deck' | 'games' | 'challenges' | 'battle' | 'study';
  roomId: string;
  roomName?: string;
  className?: string;
}

export function VoiceChatWidget({ roomType, roomId, roomName, className }: VoiceChatWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isVoiceChatActive, currentRoom, isMuted, isDoNotDisturb, joinVoiceChat, leaveVoiceChat, toggleMute, toggleDoNotDisturb } = useVoiceChat();
  const [showCallUI, setShowCallUI] = useState(false);
  const fullRoomId = `${roomType}-${roomId}`;
  const isInThisRoom = isVoiceChatActive && currentRoom === fullRoomId;

  const handleJoin = () => {
    if (isDoNotDisturb) {
      toast({
        title: "Do Not Disturb Active",
        description: "Turn off DND mode to join voice chat",
        variant: "destructive",
      });
      return;
    }
    joinVoiceChat(fullRoomId);
    setShowCallUI(true);
  };

  const handleLeave = () => {
    leaveVoiceChat();
    setShowCallUI(false);
  };

  const handleToggleDND = () => {
    toggleDoNotDisturb();
    toast({
      title: isDoNotDisturb ? "Do Not Disturb Off" : "Do Not Disturb On",
      description: isDoNotDisturb ? "You can now join voice chats" : "You won't receive voice chat notifications",
    });
  };

  if (!user) return null;

  return (
    <>
      <Card className={cn("p-4 bg-card/50 backdrop-blur-sm", className)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {isInThisRoom ? 'Voice Chat Active' : 'Join Voice Chat'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleDND}
              className={cn(
                "h-9 w-9",
                isDoNotDisturb && "text-purple-400 bg-purple-400/10"
              )}
              title="Do Not Disturb"
            >
              <Moon className="h-4 w-4" />
            </Button>

            {isInThisRoom && (
              <VoiceChatInviteDialog 
                roomId={fullRoomId} 
                roomName={roomName || `${roomType} - ${roomId}`} 
              />
            )}

            {isInThisRoom && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className={cn(
                  "h-9 w-9",
                  isMuted && "text-destructive"
                )}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant={isInThisRoom ? "destructive" : "default"}
              size="sm"
              onClick={isInThisRoom ? handleLeave : handleJoin}
              className="gap-2"
              disabled={!isInThisRoom && isDoNotDisturb}
            >
              {isInThisRoom ? (
                <>
                  <PhoneOff className="h-4 w-4" />
                  Leave
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  Join
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {showCallUI && isInThisRoom && user && (
        <div className="fixed bottom-4 right-4 z-50">
          <WebRTCCall
            roomId={fullRoomId}
            userId={user.id}
            userName={user.email || 'User'}
          />
        </div>
      )}
    </>
  );
}
