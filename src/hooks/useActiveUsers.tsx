import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActiveUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  last_seen: string;
  current_floor: number;
  master_title: string | null;
}

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
    
    const updateLastSeen = async () => {
      if (!isSubscribed) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isSubscribed) {
          const { error } = await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
          
          if (error) {
            console.error("Error updating last_seen:", error);
          }
        }
      } catch (error) {
        console.error("Error updating last_seen:", error);
      }
    };

    const fetchActiveUsers = async () => {
      if (!isSubscribed) return;

      try {
        // Use 1 hour window to show more users active
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, last_seen, current_floor, master_title", { count: "exact" })
          .gte("last_seen", oneHourAgo)
          .order("last_seen", { ascending: false });
        
        if (!error && isSubscribed && data) {
          const actualCount = count ?? data.length;
          console.log(`[ActiveUsers] Fetched ${actualCount} active users`);
          setActiveCount(actualCount);
          setActiveUsers(data);
        } else if (error) {
          console.error("Error fetching active users:", error);
        }
      } catch (error) {
        console.error("Error in fetchActiveUsers:", error);
      }
    };

    // Fetch active users count immediately (works for all users, even unauthenticated)
    fetchActiveUsers();
    
    // Update last_seen for authenticated users
    updateLastSeen();
    
    // Update every 15 seconds for real-time count
    const interval = setInterval(() => {
      updateLastSeen();
      fetchActiveUsers();
    }, 15000);

    // Set up realtime subscription for profile updates (works for all users)
    realtimeChannel = supabase
      .channel('profiles-active-users-global')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'last_seen=neq.null'
        },
        () => {
          if (isSubscribed) {
            fetchActiveUsers();
          }
        }
      )
      .subscribe((status) => {
        console.log(`[ActiveUsers] Realtime subscription status: ${status}`);
      });

    // Also listen for auth state changes to update last_seen when user logs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        console.log('[ActiveUsers] User signed in, updating last_seen');
        updateLastSeen();
        fetchActiveUsers();
      }
    });

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      subscription?.unsubscribe();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  return { activeCount, activeUsers };
};
