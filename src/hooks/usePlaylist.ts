import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface PlaylistItem {
  id: string;
  title: string;
  description: string | null;
  audio_type: string;
  audio_url: string | null;
  audio_meta: Record<string, any>;
  position: number;
  created_at: string;
  playlist_id: string | null;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

const MAX_ITEMS = 10;

export function usePlaylist() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch all playlists for user
  const fetchPlaylists = useCallback(async () => {
    if (!user) return;
    const { data, error } = await (supabase as any)
      .from("user_playlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setPlaylists(data as Playlist[]);
      // Auto-select first playlist if none selected
      if (!activePlaylistId && data.length > 0) {
        setActivePlaylistId(data[0].id);
      }
    }
  }, [user, activePlaylistId]);

  // Fetch items for active playlist
  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = (supabase as any)
      .from("user_playlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (activePlaylistId) {
      query = query.eq("playlist_id", activePlaylistId);
    } else {
      query = query.is("playlist_id", null);
    }

    const { data, error } = await query;
    if (!error && data) {
      setItems(data as PlaylistItem[]);
    }
    setLoading(false);
  }, [user, activePlaylistId]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Create a new playlist
  const createPlaylist = useCallback(async (name: string) => {
    if (!user) {
      toast.error("Sign in to create a playlist");
      return null;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Playlist name cannot be empty");
      return null;
    }

    const { data, error } = await (supabase as any)
      .from("user_playlists")
      .insert({ user_id: user.id, name: trimmed })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create playlist");
      console.error(error);
      return null;
    }

    toast.success(`Created playlist "${trimmed}"`);
    await fetchPlaylists();
    setActivePlaylistId(data.id);
    return data as Playlist;
  }, [user, fetchPlaylists]);

  // Rename a playlist
  const renamePlaylist = useCallback(async (playlistId: string, newName: string) => {
    if (!user) return false;
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const { error } = await (supabase as any)
      .from("user_playlists")
      .update({ name: trimmed })
      .eq("id", playlistId);

    if (error) {
      toast.error("Failed to rename playlist");
      return false;
    }

    toast.success(`Renamed to "${trimmed}"`);
    await fetchPlaylists();
    return true;
  }, [user, fetchPlaylists]);

  // Delete a playlist (and its items via CASCADE)
  const deletePlaylist = useCallback(async (playlistId: string) => {
    if (!user) return false;
    const pl = playlists.find(p => p.id === playlistId);

    const { error } = await (supabase as any)
      .from("user_playlists")
      .delete()
      .eq("id", playlistId);

    if (error) {
      toast.error("Failed to delete playlist");
      return false;
    }

    toast.success(`Deleted "${pl?.name || "playlist"}"`);
    if (activePlaylistId === playlistId) {
      const remaining = playlists.filter(p => p.id !== playlistId);
      setActivePlaylistId(remaining.length > 0 ? remaining[0].id : null);
      setCurrentIndex(null);
      setIsPlaying(false);
    }
    await fetchPlaylists();
    return true;
  }, [user, playlists, activePlaylistId, fetchPlaylists]);

  // Select a playlist
  const selectPlaylist = useCallback((playlistId: string | null) => {
    if (activePlaylistId !== playlistId) {
      setActivePlaylistId(playlistId);
      setCurrentIndex(null);
      setIsPlaying(false);
    }
  }, [activePlaylistId]);

  const addItem = useCallback(async (item: {
    title: string;
    description?: string;
    audio_type: string;
    audio_url?: string;
    audio_meta?: Record<string, any>;
    targetPlaylistId?: string | null;
  }) => {
    if (!user) {
      toast.error("Sign in to create a playlist");
      return false;
    }

    const targetId = item.targetPlaylistId !== undefined ? item.targetPlaylistId : activePlaylistId;

    // Get current count for target playlist to check limit
    let countQuery = (supabase as any)
      .from("user_playlist_items")
      .select("id, position", { count: "exact" })
      .eq("user_id", user.id);

    if (targetId) {
      countQuery = countQuery.eq("playlist_id", targetId);
    } else {
      countQuery = countQuery.is("playlist_id", null);
    }

    const { data: existingItems, count: itemCount } = await countQuery;

    if ((itemCount ?? 0) >= MAX_ITEMS) {
      toast.error(`Playlist is full (max ${MAX_ITEMS} items). Remove one first.`);
      return false;
    }

    const nextPosition = existingItems && existingItems.length > 0
      ? Math.max(...existingItems.map((i: any) => i.position)) + 1
      : 0;

    const { error } = await (supabase as any).from("user_playlist_items").insert({
      user_id: user.id,
      title: item.title,
      description: item.description || null,
      audio_type: item.audio_type,
      audio_url: item.audio_url || null,
      audio_meta: item.audio_meta || {},
      position: nextPosition,
      playlist_id: targetId,
    });

    if (error) {
      if (error.message?.includes("limit")) {
        toast.error("Playlist is full (max 7 items)");
      } else {
        toast.error("Failed to add to playlist");
        console.error(error);
      }
      return false;
    }

    const playlistName = playlists.find(p => p.id === targetId)?.name || "playlist";
    toast.success(`Added "${item.title}" to ${playlistName}`);
    if (targetId === activePlaylistId) {
      await fetchItems();
    }
    return true;
  }, [user, playlists, fetchItems, activePlaylistId]);

  const removeItem = useCallback(async (id: string) => {
    if (!user) return;
    const removing = items.find(i => i.id === id);
    const { error } = await (supabase as any).from("user_playlist_items").delete().eq("id", id);
    if (!error) {
      toast.success(`Removed "${removing?.title || "item"}" from playlist`);
      if (currentIndex !== null) {
        const idx = items.findIndex(i => i.id === id);
        if (idx < currentIndex) setCurrentIndex(prev => (prev !== null ? prev - 1 : null));
        else if (idx === currentIndex) {
          setIsPlaying(false);
          setCurrentIndex(null);
        }
      }
      await fetchItems();
    }
  }, [user, items, currentIndex, fetchItems]);

  const clearPlaylist = useCallback(async () => {
    if (!user) return;
    let query = (supabase as any).from("user_playlist_items").delete().eq("user_id", user.id);
    if (activePlaylistId) {
      query = query.eq("playlist_id", activePlaylistId);
    } else {
      query = query.is("playlist_id", null);
    }
    await query;
    setItems([]);
    setCurrentIndex(null);
    setIsPlaying(false);
    toast.success("Playlist cleared");
  }, [user, activePlaylistId]);

  const reorderItems = useCallback(async (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex || !user) return;
    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setItems(reordered);

    if (currentIndex !== null) {
      if (currentIndex === oldIndex) {
        setCurrentIndex(newIndex);
      } else if (oldIndex < currentIndex && newIndex >= currentIndex) {
        setCurrentIndex(currentIndex - 1);
      } else if (oldIndex > currentIndex && newIndex <= currentIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    const updates = reordered.map((item, i) =>
      (supabase as any).from("user_playlist_items").update({ position: i }).eq("id", item.id)
    );
    await Promise.all(updates);
  }, [user, items, currentIndex]);

  const isFull = items.length >= MAX_ITEMS;
  const count = items.length;

  return {
    items,
    loading,
    addItem,
    removeItem,
    clearPlaylist,
    fetchItems,
    reorderItems,
    isFull,
    count,
    maxItems: MAX_ITEMS,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    // Multi-playlist features
    playlists,
    activePlaylistId,
    selectPlaylist,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
  };
}
