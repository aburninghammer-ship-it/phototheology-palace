import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MemberEnhancedStats {
  gems: any[];
  gemsCount: number;
  achievements: any[];
  floorProgress: any[];
  currentFloor: number;
  roomsCompleted: number;
  prayerRequests: any[];
  activityDates: Record<string, number>; // date string -> count
  loading: boolean;
}

export function useMemberProfileEnhanced(userId: string) {
  const [stats, setStats] = useState<MemberEnhancedStats>({
    gems: [],
    gemsCount: 0,
    achievements: [],
    floorProgress: [],
    currentFloor: 1,
    roomsCompleted: 0,
    prayerRequests: [],
    activityDates: {},
    loading: true,
  });

  useEffect(() => {
    if (!userId) { setStats(s => ({ ...s, loading: false })); return; }

    const load = async () => {
      try {
        const [gemsRes, achievementsRes, floorsRes, prayersRes, activityRes] = await Promise.all([
          // Gems
          (supabase as any)
            .from("user_gems")
            .select("id, gem_name, gem_content, room_id, floor_number, category, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50),
          // Achievements with details
          (supabase as any)
            .from("user_achievements")
            .select("id, earned_at, achievement_id, achievements(name, description, icon, points, category, tier)")
            .eq("user_id", userId)
            .order("earned_at", { ascending: false }),
          // Floor progress
          (supabase as any)
            .from("user_floor_progress")
            .select("floor_number, is_unlocked, rooms_required, rooms_completed, floor_completed_at")
            .eq("user_id", userId)
            .order("floor_number"),
          // Prayer requests (public ones)
          (supabase as any)
            .from("prayer_requests")
            .select("id, title, content, is_answered, prayer_count, created_at, is_public")
            .eq("user_id", userId)
            .eq("is_public", true)
            .order("created_at", { ascending: false })
            .limit(20),
          // Activity dates (last 365 days from study entries)
          (supabase as any)
            .from("user_study_entries")
            .select("created_at, user_study_threads!inner(user_id)")
            .eq("user_study_threads.user_id", userId)
            .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
            .order("created_at", { ascending: false }),
        ]);

        // Build activity heatmap
        const activityDates: Record<string, number> = {};
        if (activityRes.data) {
          activityRes.data.forEach((entry: any) => {
            const date = new Date(entry.created_at).toISOString().split("T")[0];
            activityDates[date] = (activityDates[date] || 0) + 1;
          });
        }

        const floors = floorsRes.data || [];
        const totalRooms = floors.reduce((acc: number, f: any) => acc + (f.rooms_completed || 0), 0);
        const currentFloor = floors.reduce((max: number, f: any) => 
          f.is_unlocked ? Math.max(max, f.floor_number) : max, 1);

        setStats({
          gems: gemsRes.data || [],
          gemsCount: gemsRes.data?.length || 0,
          achievements: achievementsRes.data || [],
          floorProgress: floors,
          currentFloor,
          roomsCompleted: totalRooms,
          prayerRequests: prayersRes.data || [],
          activityDates,
          loading: false,
        });
      } catch (err) {
        console.error("Error loading enhanced profile stats:", err);
        setStats(s => ({ ...s, loading: false }));
      }
    };

    load();
  }, [userId]);

  return stats;
}
