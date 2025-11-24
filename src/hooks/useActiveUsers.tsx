import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActiveUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  last_seen: string;
  current_floor?: number;
  master_title?: string | null;
}

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let isSubscribed = true;
    let realtimeChannel: any = null;
    
    const updateLastSeen = async () => {
      if (!isSubscribed || retryCount >= maxRetries) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isSubscribed) {
          await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
        }
      } catch (error) {
        // Silently fail - this is not critical functionality
        setRetryCount(prev => prev + 1);
      }
    };

    const fetchActiveUsers = async () => {
      if (!isSubscribed || retryCount >= maxRetries) return;
      
      try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, last_seen", { count: "exact" })
          .gte("last_seen", fifteenMinutesAgo)
          .order("last_seen", { ascending: false });
        
        if (!error && isSubscribed && data) {
          // Fetch mastery data for active users
          const userIds = data.map(u => u.id);
          const { data: masteryData } = await supabase
            .from("global_master_titles")
            .select("user_id, current_floor, master_title")
            .in("user_id", userIds);
          
          // Merge mastery data with user data
          const usersWithMastery = data.map(user => {
            const mastery = masteryData?.find(m => m.user_id === user.id);
            return {
              ...user,
              current_floor: mastery?.current_floor || 0,
              master_title: mastery?.master_title || null,
            };
          });
          
          setActiveCount(count || 0);
          setActiveUsers(usersWithMastery);
        }
      } catch (error) {
        // Silently fail - this is not critical functionality
        setRetryCount(prev => prev + 1);
      }
    };

    // Only proceed if we haven't exceeded retry limit
    if (retryCount < maxRetries) {
      // Update user's last_seen immediately
      updateLastSeen();
      
      // Fetch active users count immediately
      fetchActiveUsers();
      
      // Update every 60 seconds (reduced frequency)
      const interval = setInterval(() => {
        if (retryCount < maxRetries) {
          updateLastSeen();
          fetchActiveUsers();
        }
      }, 60000);

      // Set up realtime subscription for profile updates (only if not exceeding retries and user is authenticated)
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user?.id || !isSubscribed) return;
        
        realtimeChannel = supabase
          .channel('profiles-active-users')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles'
            },
            () => {
              if (isSubscribed && retryCount < maxRetries) {
                fetchActiveUsers();
              }
            }
          )
          .subscribe();
      });

      return () => {
        isSubscribed = false;
        clearInterval(interval);
        if (realtimeChannel) {
          supabase.removeChannel(realtimeChannel);
        }
      };
    }
  }, [retryCount]);

  return { activeCount, activeUsers };
};
