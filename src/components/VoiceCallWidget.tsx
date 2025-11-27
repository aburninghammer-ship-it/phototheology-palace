import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, Mic, MicOff, Users } from "lucide-react";
import { useVoiceCall } from "@/hooks/useVoiceCall";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface VoiceCallWidgetProps {
  roomId: string;
  roomName?: string;
}

export const VoiceCallWidget = ({ roomId, roomName }: VoiceCallWidgetProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('User');

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

  const { 
    isInCall, 
    isMuted, 
    participants, 
    joinCall, 
    leaveCall, 
    toggleMute 
  } = useVoiceCall(
    roomId, 
    user?.id || '', 
    displayName
  );

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isInCall ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={joinCall}
              size="lg"
              className="rounded-full h-16 w-16 shadow-lg"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Card className="p-4 space-y-3 shadow-xl min-w-[200px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {participants.length} in call
                  </span>
                </div>
              </div>

              {roomName && (
                <p className="text-xs text-muted-foreground truncate">
                  {roomName}
                </p>
              )}

              <div className="space-y-1">
                {participants.map((participant) => (
                  <div 
                    key={participant.userId}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      participant.isMuted ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <span className="truncate">
                      {participant.name}
                      {participant.userId === user.id && ' (You)'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant={isMuted ? "destructive" : "secondary"}
                  className="flex-1"
                >
                  {isMuted ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={leaveCall}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
