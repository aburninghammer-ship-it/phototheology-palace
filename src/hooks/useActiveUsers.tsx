import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActiveUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  last_seen: string;
}

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    let realtimeChannel: any = null;
    let interval: NodeJS.Timeout | null = null;
    
    const updateLastSeen = async () => {
      if (!isSubscribed) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isSubscribed) {
          await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
        }
      } catch (error) {
        console.error("Error updating last_seen:", error);
      }
    };

    const fetchActiveUsers = async () => {
      if (!isSubscribed) return;
      
      try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, last_seen", { count: "exact" })
          .gte("last_seen", fifteenMinutesAgo)
          .order("last_seen", { ascending: false });
        
        if (!error && isSubscribed) {
          setActiveCount(count || 0);
          setActiveUsers(data || []);
        }
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    const init = async () => {
      // Get current user and set up everything
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isSubscribed) return;

      // Update user's last_seen immediately
      await updateLastSeen();
      
      // Fetch active users count immediately
      await fetchActiveUsers();
      
      // Update every 30 seconds
      interval = setInterval(() => {
        if (isSubscribed) {
          updateLastSeen();
          fetchActiveUsers();
        }
      }, 30000);

      // Set up realtime subscription for profile updates
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
            if (isSubscribed) {
              fetchActiveUsers();
            }
          }
        )
        .subscribe();
    };

    init();

    return () => {
      isSubscribed = false;
      if (interval) clearInterval(interval);
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  return { activeCount, activeUsers };
};
