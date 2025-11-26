import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { playChallengeNotification } from "@/utils/notificationSound";

interface LiveNotification {
  type: string;
  message: string;
  challengeType: string;
  userName: string;
  link?: string;
}

export function useLiveNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Create unique channel ID to prevent duplicates
    const channelId = `live-notifications-${user.id}-${Date.now()}`;
    
    // Subscribe to live notifications channel
    const liveChannel = supabase.channel(channelId, {
      config: {
        broadcast: { self: false } // Don't receive your own broadcasts
      }
    });

    liveChannel
      .on('broadcast', { event: 'challenge-shared' }, (payload) => {
        const notification = payload.payload as LiveNotification;
        
        // Play challenge sound
        playChallengeNotification();
        
        // Show toast notification
        toast(notification.message, {
          description: `${notification.userName} shared a ${notification.challengeType}`,
          action: notification.link ? {
            label: "View",
            onClick: () => navigate(notification.link!)
          } : undefined,
          duration: 5000,
        });
      })
      .on('broadcast', { event: 'daily-challenge' }, (payload) => {
        const notification = payload.payload as any;
        
        // Show daily challenge notification
        toast(notification.message, {
          description: notification.title,
          action: notification.link ? {
            label: "Take Challenge",
            onClick: () => navigate(notification.link)
          } : undefined,
          duration: 8000,
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to live notifications');
        }
      });

    setChannel(liveChannel);

    return () => {
      supabase.removeChannel(liveChannel);
    };
  }, [user?.id]); // Only depend on user.id, not the whole user object or navigate

  const broadcastChallenge = async (challengeType: string, userName: string) => {
    if (!channel) return;

    const challengeLabels: Record<string, string> = {
      equation_challenges: 'Equation Challenge',
      christ_chapter_challenges: 'Christ Chapter Challenge',
      sanctuary_challenges: 'Sanctuary Challenge',
      dimension_challenges: 'Dimension Drill',
      connect6_challenges: 'Connect-6 Challenge',
      fruit_check_challenges: 'Fruit Check Challenge',
    };

    const notification: LiveNotification = {
      type: 'challenge-shared',
      message: '🔔 New Challenge Alert!',
      challengeType: challengeLabels[challengeType] || 'Challenge',
      userName,
      link: '/community'
    };

    await channel.send({
      type: 'broadcast',
      event: 'challenge-shared',
      payload: notification
    });
  };

  return { broadcastChallenge };
}