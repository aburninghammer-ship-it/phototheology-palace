import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";

export const useRoomUnlock = (floorNumber: number, roomId: string) => {
  const { user } = useAuth();
  const { mode } = useExperienceMode();
  const { translatedFloors } = useTranslatedPalaceData();
  const [isUnlocked, setIsUnlocked] = useState(true); // Always unlocked now (soft lock)
  const [loading, setLoading] = useState(true);
  const [missingPrerequisites, setMissingPrerequisites] = useState<string[]>([]);
  const [recommendationWarning, setRecommendationWarning] = useState<string | null>(null);

  useEffect(() => {
    const checkUnlock = async () => {
      // Hard lock: mode-based floor restrictions
      if (mode === "basic") {
        setIsUnlocked(false);
        setLoading(false);
        return;
      }
      if (mode === "explorer" && floorNumber > 3) {
        setIsUnlocked(false);
        setLoading(false);
        return;
      }

      if (!user) {
        setIsUnlocked(true);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin - admins see no warnings
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roleError && roleData) {
          setIsUnlocked(true);
          setRecommendationWarning(null);
          setLoading(false);
          return;
        }

        // SOFT LOCK: Check if previous floor is completed (for floors 2-8)
        // Show warning but allow access
        if (floorNumber > 1) {
          const { data: previousFloorProgress } = await supabase
            .from("user_floor_progress")
            .select("floor_completed_at, floor_number")
            .eq("user_id", user.id)
            .eq("floor_number", floorNumber - 1)
            .maybeSingle();

          // If previous floor not completed, show recommendation warning
          if (!previousFloorProgress?.floor_completed_at) {
            setRecommendationWarning(`Recommended: Complete Floor ${floorNumber - 1} first for best learning experience`);
          } else {
            setRecommendationWarning(null);
          }
        }

        const floor = translatedFloors.find(f => f.number === floorNumber);
        const room = floor?.rooms.find(r => r.id === roomId);

        if (!room || !room.prerequisites || room.prerequisites.length === 0) {
          setIsUnlocked(true);
          setLoading(false);
          return;
        }

        // Get all user's completed rooms
        const { data: completedRooms, error } = await supabase
          .from("room_progress")
          .select("room_id, floor_number")
          .eq("user_id", user.id)
          .not("completed_at", "is", null);

        if (error) throw error;

        const completedSet = new Set(
          completedRooms?.map(r => `${r.floor_number}-${r.room_id}`) || []
        );

        // Check each prerequisite - but only for warning, not blocking
        const missing: string[] = [];
        for (const prereq of room.prerequisites) {
          const prereqKey = `${prereq.floor}-${prereq.room}`;
          if (!completedSet.has(prereqKey)) {
            const prereqFloor = translatedFloors.find(f => f.number === prereq.floor);
            const prereqRoom = prereqFloor?.rooms.find(r => r.id === prereq.room);
            if (prereqRoom) {
              missing.push(prereqRoom.name);
            }
          }
        }

        setMissingPrerequisites(missing);
        // Always unlocked - soft lock only shows warnings
        setIsUnlocked(true);
      } catch (error) {
        console.error("Error checking room unlock:", error);
        setIsUnlocked(true);
      } finally {
        setLoading(false);
      }
    };

    checkUnlock();
  }, [user, mode, floorNumber, roomId]);

  return { isUnlocked, loading, missingPrerequisites, recommendationWarning };
};
