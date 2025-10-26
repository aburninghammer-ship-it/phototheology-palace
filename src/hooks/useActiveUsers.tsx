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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let isSubscribed = true;
    
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
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data, count, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, last_seen", { count: "exact" })
          .gte("last_seen", fiveMinutesAgo)
          .order("last_seen", { ascending: false });
        
        if (!error && isSubscribed) {
          setActiveCount(count || 0);
          setActiveUsers(data || []);
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

      // Set up realtime subscription for profile updates (only if not exceeding retries)
      const channel = supabase
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

      return () => {
        isSubscribed = false;
        clearInterval(interval);
        supabase.removeChannel(channel);
      };
    }
  }, [retryCount]);

  return { activeCount, activeUsers };
};
