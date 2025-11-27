import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface FloorProgress {
  id: string;
  user_id: string;
  floor_number: number;
  is_unlocked: boolean;
  rooms_required: number;
  rooms_completed: number;
  floor_completed_at: string | null;
  floor_assessment_passed_at: string | null;
  floor_assessment_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface GlobalMasterTitle {
  id: string;
  user_id: string;
  master_title: string | null;
  current_floor: number;
  floors_completed: number;
  total_xp: number;
  global_streak_days: number;
  black_master_exam_passed_at: string | null;
  last_global_practice_date: string | null;
  created_at: string;
  updated_at: string;
}

const DEFAULT_FLOORS = [
  { floor_number: 1, rooms_required: 6, is_unlocked: true },
  { floor_number: 2, rooms_required: 5, is_unlocked: false },
  { floor_number: 3, rooms_required: 5, is_unlocked: false },
  { floor_number: 4, rooms_required: 8, is_unlocked: false },
  { floor_number: 5, rooms_required: 3, is_unlocked: false },
  { floor_number: 6, rooms_required: 3, is_unlocked: false },
  { floor_number: 7, rooms_required: 3, is_unlocked: false },
  { floor_number: 8, rooms_required: 1, is_unlocked: false },
];

export const useFloorProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: floorProgress, isLoading } = useQuery({
    queryKey: ["floor-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return DEFAULT_FLOORS.map((f, i) => ({
        ...f,
        id: `default-${i}`,
        user_id: '',
        rooms_completed: 0,
        floor_completed_at: null,
        floor_assessment_passed_at: null,
        floor_assessment_score: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as FloorProgress[];

      const { data, error } = await supabase
        .from("user_floor_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("floor_number", { ascending: true });

      if (error) throw error;

      // If no data, initialize default floors for user
      if (!data || data.length === 0) {
        // Return defaults until user starts progressing
        return DEFAULT_FLOORS.map((f, i) => ({
          ...f,
          id: `default-${i}`,
          user_id: user.id,
          rooms_completed: 0,
          floor_completed_at: null,
          floor_assessment_passed_at: null,
          floor_assessment_score: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) as FloorProgress[];
      }

      return data as FloorProgress[];
    },
  });

  const { data: globalTitle } = useQuery({
    queryKey: ["global-master-title"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("global_master_titles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as GlobalMasterTitle | null;
    },
  });

  const completeRoomForFloor = useMutation({
    mutationFn: async ({ floorNumber, roomId }: { floorNumber: number; roomId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if floor progress exists
      const { data: existing } = await supabase
        .from("user_floor_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("floor_number", floorNumber)
        .maybeSingle();

      if (existing) {
        // Update rooms completed
        const { error } = await supabase
          .from("user_floor_progress")
          .update({ 
            rooms_completed: existing.rooms_completed + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);
        
        if (error) throw error;
      } else {
        // Create new floor progress
        const defaultFloor = DEFAULT_FLOORS.find(f => f.floor_number === floorNumber);
        const { error } = await supabase
          .from("user_floor_progress")
          .insert({
            user_id: user.id,
            floor_number: floorNumber,
            is_unlocked: floorNumber === 1,
            rooms_required: defaultFloor?.rooms_required || 6,
            rooms_completed: 1,
          });
        
        if (error) throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floor-progress"] });
      toast({
        title: "Room Completed!",
        description: "Progress updated toward floor completion.",
      });
    },
  });

  return {
    floorProgress,
    globalTitle,
    isLoading,
    completeRoomForFloor: completeRoomForFloor.mutate,
  };
};