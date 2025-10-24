import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useActiveUsers = () => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const updateLastSeen = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
          
          if (error) {
            console.error("Error updating last_seen:", error);
          }
        }
      } catch (error) {
        console.error("Error in updateLastSeen:", error);
      }
    };

    const fetchActiveUsers = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("last_seen", fiveMinutesAgo);
        
        if (error) {
          console.error("Error fetching active users:", error);
          return;
        }
        
        setActiveCount(count || 0);
      } catch (error) {
        console.error("Error in fetchActiveUsers:", error);
      }
    };

    // Update user's last_seen immediately
    updateLastSeen();

    // Fetch active users count immediately
    fetchActiveUsers();

    // Update every 30 seconds
    const interval = setInterval(() => {
      updateLastSeen();
      fetchActiveUsers();
    }, 30000);

    // Set up realtime subscription for profile updates
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
          // When any profile is updated, refetch the count
          fetchActiveUsers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return activeCount;
};
