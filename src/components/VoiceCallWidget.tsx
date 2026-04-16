import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { SimpleVoiceRoom } from "@/components/voice";

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

  if (!user) return null;

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50">
      <SimpleVoiceRoom
        roomId={roomId}
        userId={user.id}
        userName={displayName}
      />
    </div>
  );
};
