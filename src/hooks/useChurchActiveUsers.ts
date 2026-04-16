import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChurchLiveMember {
  id: string;
  display_name: string | null;
  username: string;
  avatar_url: string | null;
  last_seen: string;
  current_floor: number;
}

export const useChurchActiveUsers = (churchId: string) => {
  const [liveMembers, setLiveMembers] = useState<ChurchLiveMember[]>([]);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    let isSubscribed = true;
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

    const fetchLiveMembers = async () => {
      if (!isSubscribed) return;

      try {
        // Get church member user IDs
        const { data: memberRows, error: memberError } = await supabase
          .from("church_members")
          .select("user_id")
          .eq("church_id", churchId);

        if (memberError || !memberRows || memberRows.length === 0) {
          if (isSubscribed) {
            setLiveMembers([]);
            setLiveCount(0);
          }
          return;
        }

        const userIds = memberRows.map((m) => m.user_id);

        // 5-minute window for "live" feel
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, last_seen, current_floor")
          .in("id", userIds)
          .gte("last_seen", fiveMinutesAgo)
          .order("last_seen", { ascending: false });

        if (!profileError && isSubscribed && profiles) {
          setLiveMembers(profiles);
          setLiveCount(profiles.length);
        }
      } catch (error) {
        console.error("[ChurchActiveUsers] Error fetching live members:", error);
      }
    };

    fetchLiveMembers();

    // Poll every 30 seconds
    const interval = setInterval(fetchLiveMembers, 30000);

    // Realtime subscription for instant updates
    realtimeChannel = supabase
      .channel(`church-live-${churchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: "last_seen=neq.null",
        },
        () => {
          if (isSubscribed) {
            fetchLiveMembers();
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [churchId]);

  return { liveMembers, liveCount };
};
