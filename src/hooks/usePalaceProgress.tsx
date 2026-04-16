import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePalaceProgress = () => {
  const { user } = useAuth();
  const [completedRoomsCount, setCompletedRoomsCount] = useState(0);
  const [completedRoomIds, setCompletedRoomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setCompletedRoomsCount(0);
      setCompletedRoomIds([]);
      setLoading(false);
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("room_progress")
        .select("room_id")
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      if (error) throw error;
      setCompletedRoomsCount(data?.length || 0);
      setCompletedRoomIds(data?.map(r => r.room_id) || []);
    } catch (error) {
      console.error("Error loading palace progress:", error);
      setCompletedRoomsCount(0);
      setCompletedRoomIds([]);
    } finally {
      setLoading(false);
    }
  };

  const totalRooms = 38;
  const progressPercentage = Math.round((completedRoomsCount / totalRooms) * 100);

  return { 
    completedRooms: completedRoomsCount,
    completedRoomIds,
    totalRooms, 
    progressPercentage, 
    loading,
    refetch: loadProgress
  };
};
