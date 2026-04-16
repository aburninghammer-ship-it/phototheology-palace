import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useWorshipPlaylists(churchId?: string) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getPlaylists = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_worship_playlists")
        .select("*")
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPlaylists(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching playlists:", err);
      return [];
    }
  }, [churchId]);

  const getPlaylistSongs = useCallback(async (playlistId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("church_playlist_songs")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: true });
      if (error) throw error;
      setSongs(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching playlist songs:", err);
      return [];
    }
  }, []);

  const getSuggestions = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_song_suggestions")
        .select("*")
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuggestions(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      return [];
    }
  }, [churchId]);

  const suggestSong = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_song_suggestions")
        .insert({
          church_id: cId,
          suggested_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Song suggestion submitted!");
      await getSuggestions(cId);
      return result;
    } catch (err: any) {
      console.error("Error suggesting song:", err);
      toast.error(err.message || "Failed to suggest song");
      return null;
    }
  }, [user, getSuggestions]);

  const createPlaylist = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_worship_playlists")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Playlist created!");
      await getPlaylists(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating playlist:", err);
      toast.error(err.message || "Failed to create playlist");
      return null;
    }
  }, [user, getPlaylists]);

  const addSong = useCallback(async (playlistId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_playlist_songs")
        .insert({
          playlist_id: playlistId,
          added_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Song added to playlist!");
      await getPlaylistSongs(playlistId);
      return result;
    } catch (err: any) {
      console.error("Error adding song:", err);
      toast.error(err.message || "Failed to add song");
      return null;
    }
  }, [user, getPlaylistSongs]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getPlaylists(), getSuggestions()])
      .finally(() => setLoading(false));
  }, [churchId]);

  return {
    playlists,
    songs,
    suggestions,
    loading,
    getPlaylists,
    getPlaylistSongs,
    suggestSong,
    createPlaylist,
    addSong,
    getSuggestions,
  };
}
