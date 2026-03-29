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
}

const MAX_ITEMS = 7;

export function usePlaylist() {
  const { user } = useAuth();
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_playlist_items")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (!error && data) {
      setItems(data as PlaylistItem[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (item: {
    title: string;
    description?: string;
    audio_type: string;
    audio_url?: string;
    audio_meta?: Record<string, any>;
  }) => {
    if (!user) {
      toast.error("Sign in to create a playlist");
      return false;
    }
    if (items.length >= MAX_ITEMS) {
      toast.error(`Playlist is full (max ${MAX_ITEMS} items). Remove one first.`);
      return false;
    }

    const nextPosition = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 0;

    const { error } = await supabase.from("user_playlist_items").insert({
      user_id: user.id,
      title: item.title,
      description: item.description || null,
      audio_type: item.audio_type,
      audio_url: item.audio_url || null,
      audio_meta: item.audio_meta || {},
      position: nextPosition,
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

    toast.success(`Added "${item.title}" to playlist`);
    await fetchItems();
    return true;
  }, [user, items, fetchItems]);

  const removeItem = useCallback(async (id: string) => {
    if (!user) return;
    const removing = items.find(i => i.id === id);
    const { error } = await supabase.from("user_playlist_items").delete().eq("id", id);
    if (!error) {
      toast.success(`Removed "${removing?.title || "item"}" from playlist`);
      // Adjust current index if needed
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
    await supabase.from("user_playlist_items").delete().eq("user_id", user.id);
    setItems([]);
    setCurrentIndex(null);
    setIsPlaying(false);
    toast.success("Playlist cleared");
  }, [user]);

  const isFull = items.length >= MAX_ITEMS;
  const count = items.length;

  return {
    items,
    loading,
    addItem,
    removeItem,
    clearPlaylist,
    fetchItems,
    isFull,
    count,
    maxItems: MAX_ITEMS,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
  };
}
