import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface EpicPlaylist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  music_track_id: string;
  music_volume: number;
  created_at: string;
  updated_at: string;
}

export interface EpicPlaylistItem {
  id: string;
  playlist_id: string;
  book: string;
  chapter: number;
  position: number;
  created_at: string;
}

export function useEpicPlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<EpicPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("epic_playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setPlaylists(data || []);
    } catch (err) {
      console.error("Error fetching epic playlists:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createPlaylist = useCallback(async (name: string, description?: string, musicTrackId?: string, musicVolume?: number) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data, error } = await (supabase as any)
        .from("epic_playlists")
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          music_track_id: musicTrackId || "none",
          music_volume: musicVolume || 15,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success(`Playlist "${name}" created!`);
      await fetchPlaylists();
      return data as EpicPlaylist;
    } catch (err: any) {
      toast.error(err.message || "Failed to create playlist");
      return null;
    }
  }, [user, fetchPlaylists]);

  const addToPlaylist = useCallback(async (playlistId: string, book: string, chapter: number) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      // Get current max position
      const { data: items } = await (supabase as any)
        .from("epic_playlist_items")
        .select("position")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: false })
        .limit(1);
      const nextPos = items && items.length > 0 ? items[0].position + 1 : 0;

      const { error } = await (supabase as any)
        .from("epic_playlist_items")
        .insert({
          playlist_id: playlistId,
          book,
          chapter,
          position: nextPos,
        });
      if (error) {
        if (error.code === "23505") {
          toast.info(`${book} ${chapter} is already in this playlist`);
          return false;
        }
        throw error;
      }
      toast.success(`Added ${book} ${chapter} to playlist!`);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to add to playlist");
      return false;
    }
  }, [user]);

  const getPlaylistItems = useCallback(async (playlistId: string): Promise<EpicPlaylistItem[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from("epic_playlist_items")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching playlist items:", err);
      return [];
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    if (!user) return;
    try {
      const { error } = await (supabase as any)
        .from("epic_playlists")
        .delete()
        .eq("id", playlistId);
      if (error) throw error;
      toast.success("Playlist deleted");
      await fetchPlaylists();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete playlist");
    }
  }, [user, fetchPlaylists]);

  const removeFromPlaylist = useCallback(async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("epic_playlist_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error removing from playlist:", err);
      return false;
    }
  }, []);

  return {
    playlists,
    loading,
    fetchPlaylists,
    createPlaylist,
    addToPlaylist,
    getPlaylistItems,
    deletePlaylist,
    removeFromPlaylist,
  };
}
