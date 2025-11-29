import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UserTrack {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_path: string;
  file_url: string;
  duration_seconds?: number;
  category: string;
  mood?: string;
  is_favorite: boolean;
  play_count: number;
  created_at: string;
}

export function useUserMusic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: userTracks = [], isLoading } = useQuery({
    queryKey: ["user-music", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_music")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as UserTrack[];
    },
    enabled: !!user,
  });

  const uploadMusic = useCallback(async (file: File, name: string, mood?: string) => {
    if (!user) {
      toast.error("Please sign in to upload music");
      return null;
    }

    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return null;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be under 50MB");
      return null;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("user-music")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("user-music")
        .getPublicUrl(filePath);

      // Save to database
      const { data, error: dbError } = await supabase
        .from("user_music")
        .insert({
          user_id: user.id,
          name: name || file.name.replace(/\.[^/.]+$/, ""),
          file_path: filePath,
          file_url: urlData.publicUrl,
          mood: mood,
          category: "custom",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["user-music"] });
      toast.success("Music uploaded successfully!");
      return data as UserTrack;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload music");
      return null;
    } finally {
      setUploading(false);
    }
  }, [user, queryClient]);

  const deleteMusic = useMutation({
    mutationFn: async (track: UserTrack) => {
      // Delete from storage
      await supabase.storage.from("user-music").remove([track.file_path]);
      
      // Delete from database
      const { error } = await supabase
        .from("user_music")
        .delete()
        .eq("id", track.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-music"] });
      toast.success("Track deleted");
    },
    onError: () => {
      toast.error("Failed to delete track");
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (track: UserTrack) => {
      const { error } = await supabase
        .from("user_music")
        .update({ is_favorite: !track.is_favorite })
        .eq("id", track.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-music"] });
    },
  });

  return {
    userTracks,
    isLoading,
    uploading,
    uploadMusic,
    deleteMusic: deleteMusic.mutate,
    toggleFavorite: toggleFavorite.mutate,
  };
}
