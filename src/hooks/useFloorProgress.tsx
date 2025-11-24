import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useFloorProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: floorProgress, isLoading } = useQuery({
    queryKey: ["floor-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Placeholder until types regenerate
      return [];
    },
  });

  const { data: globalTitle } = useQuery({
    queryKey: ["global-master-title"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Placeholder until types regenerate
      return null;
    },
  });

  const completeRoomForFloor = useMutation({
    mutationFn: async ({ floorNumber, roomId }: { floorNumber: number; roomId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Will be implemented once types regenerate
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
