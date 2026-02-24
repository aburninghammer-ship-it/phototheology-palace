import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * This hook tracks user presence by updating the last_seen field in profiles.
 * It runs independently of useActiveUsers and ensures ALL authenticated users
 * have their presence tracked, even if they have cached old code elsewhere.
 */
export const usePresenceTracker = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    let isSubscribed = true;

    const updatePresence = async () => {
      // Prevent concurrent updates
      if (isUpdatingRef.current || !isSubscribed) return;
      
      isUpdatingRef.current = true;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && isSubscribed) {
          const { error } = await supabase
            .from("profiles")
            .update({ last_seen: new Date().toISOString() })
            .eq("id", user.id);
          
          if (error) {
            console.error("[PresenceTracker] Error updating last_seen:", error);
          }
        }
      } catch (error) {
        console.error("[PresenceTracker] Error:", error);
      } finally {
        isUpdatingRef.current = false;
      }
    };

    // Update immediately on mount
    updatePresence();

    // Update every 2 minutes to reduce database writes while maintaining presence accuracy
    intervalRef.current = setInterval(updatePresence, 120000);

    // Also update on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update on auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        updatePresence();
      }
    });

    return () => {
      isSubscribed = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      subscription?.unsubscribe();
    };
  }, []);
};
