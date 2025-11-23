import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface FocusedRoom {
  focused_room_id: string | null;
  focused_room_floor: number | null;
  focused_room_set_at: string | null;
}

export const useFocusedRoom = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch focused room data
  const { data: focusedRoom, isLoading } = useQuery({
    queryKey: ["focused-room"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("focused_room_id, focused_room_floor, focused_room_set_at")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as FocusedRoom;
    },
  });

  // Set focused room mutation
  const setFocusedRoom = useMutation({
    mutationFn: async ({ roomId, floorNumber }: { roomId: string; floorNumber: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          focused_room_id: roomId,
          focused_room_floor: floorNumber,
          focused_room_set_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focused-room"] });
      toast({
        title: "Focus Room Set!",
        description: "This room is now your primary focus for mastery.",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Failed to set focused room:", error);
      toast({
        title: "Error",
        description: "Failed to set focus room. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear focused room mutation
  const clearFocusedRoom = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          focused_room_id: null,
          focused_room_floor: null,
          focused_room_set_at: null,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focused-room"] });
      toast({
        title: "Focus Cleared",
        description: "You can now set a new focus room.",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Failed to clear focused room:", error);
      toast({
        title: "Error",
        description: "Failed to clear focus room. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    focusedRoom,
    isLoading,
    setFocusedRoom: setFocusedRoom.mutate,
    clearFocusedRoom: clearFocusedRoom.mutate,
    isSettingFocus: setFocusedRoom.isPending || clearFocusedRoom.isPending,
    isFocused: (roomId: string, floorNumber: number) => {
      return (
        focusedRoom?.focused_room_id === roomId &&
        focusedRoom?.focused_room_floor === floorNumber
      );
    },
  };
};
