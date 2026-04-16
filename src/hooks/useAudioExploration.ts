import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AUDIO_EXPLORED_KEY = "pt_audio_explored";

interface AudioExploration {
  roomsListened: Set<string>; // "floor-roomId" format
  tabsListened: Set<string>; // tab id
}

export function useAudioExploration() {
  const { user } = useAuth();
  const [exploration, setExploration] = useState<AudioExploration>({
    roomsListened: new Set(),
    tabsListened: new Set(),
  });

  // Load from localStorage on mount
  useEffect(() => {
    const key = user ? `${AUDIO_EXPLORED_KEY}_${user.id}` : AUDIO_EXPLORED_KEY;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setExploration({
          roomsListened: new Set(parsed.roomsListened || []),
          tabsListened: new Set(parsed.tabsListened || []),
        });
      } catch {}
    }
  }, [user]);

  const persist = useCallback(
    (updated: AudioExploration) => {
      const key = user ? `${AUDIO_EXPLORED_KEY}_${user.id}` : AUDIO_EXPLORED_KEY;
      localStorage.setItem(
        key,
        JSON.stringify({
          roomsListened: Array.from(updated.roomsListened),
          tabsListened: Array.from(updated.tabsListened),
        })
      );
    },
    [user]
  );

  const markRoomListened = useCallback(
    (floorNumber: number, roomId: string) => {
      setExploration((prev) => {
        const updated = {
          ...prev,
          roomsListened: new Set(prev.roomsListened).add(`${floorNumber}-${roomId}`),
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const markTabListened = useCallback(
    (tabId: string) => {
      setExploration((prev) => {
        const updated = {
          ...prev,
          tabsListened: new Set(prev.tabsListened).add(tabId),
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const hasListenedRoom = useCallback(
    (floorNumber: number, roomId: string) => exploration.roomsListened.has(`${floorNumber}-${roomId}`),
    [exploration]
  );

  const hasListenedTab = useCallback(
    (tabId: string) => exploration.tabsListened.has(tabId),
    [exploration]
  );

  const totalRoomsListened = exploration.roomsListened.size;
  const totalTabsListened = exploration.tabsListened.size;
  const totalRooms = 38;
  const totalTabs = 30; // approximate

  // Badge tiers
  const getBadge = () => {
    if (totalRoomsListened >= 38) return { label: "Palace Master", icon: "👑", tier: "gold" };
    if (totalRoomsListened >= 20) return { label: "Palace Explorer", icon: "🏛️", tier: "silver" };
    if (totalRoomsListened >= 10) return { label: "Room Rover", icon: "🚶", tier: "bronze" };
    if (totalRoomsListened >= 3) return { label: "Curious Visitor", icon: "👀", tier: "starter" };
    return null;
  };

  return {
    exploration,
    markRoomListened,
    markTabListened,
    hasListenedRoom,
    hasListenedTab,
    totalRoomsListened,
    totalTabsListened,
    totalRooms,
    getBadge,
  };
}
