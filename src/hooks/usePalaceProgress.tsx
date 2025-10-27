import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const usePalaceProgress = () => {
  const { user } = useAuth();
  const [completedRooms, setCompletedRooms] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedRooms = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("room_progress")
          .select("id")
          .eq("user_id", user.id)
          .not("completed_at", "is", null);

        if (error) throw error;
        setCompletedRooms(data?.length || 0);
      } catch (error) {
        console.error("Error fetching palace progress:", error);
        setCompletedRooms(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRooms();
  }, [user]);

  return { completedRooms, loading };
};
