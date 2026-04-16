import { useState, useEffect } from "react";
import type { Floor, Room } from "@/data/palaceData";

// Cache the loaded data to avoid multiple imports
let cachedPalaceFloors: Floor[] | null = null;
let loadPromise: Promise<Floor[]> | null = null;

async function loadPalaceData(): Promise<Floor[]> {
  if (cachedPalaceFloors) {
    return cachedPalaceFloors;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = import("@/data/palaceData").then((module) => {
    cachedPalaceFloors = module.palaceFloors;
    return cachedPalaceFloors;
  });

  return loadPromise;
}

// Synchronous access for components that already have data loaded
export function getPalaceFloors(): Floor[] | null {
  return cachedPalaceFloors;
}

// Hook for async loading
export function usePalaceData() {
  const [palaceFloors, setPalaceFloors] = useState<Floor[] | null>(cachedPalaceFloors);
  const [loading, setLoading] = useState(!cachedPalaceFloors);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedPalaceFloors) {
      setPalaceFloors(cachedPalaceFloors);
      setLoading(false);
      return;
    }

    loadPalaceData()
      .then((data) => {
        setPalaceFloors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { palaceFloors, loading, error };
}

// Utility functions
export function getFloor(floorNumber: number): Floor | undefined {
  return cachedPalaceFloors?.find((f) => f.number === floorNumber);
}

export function getRoom(floorNumber: number, roomId: string): Room | undefined {
  const floor = getFloor(floorNumber);
  return floor?.rooms.find((r) => r.id === roomId);
}

export function getRoomByTag(tag: string): { floor: Floor; room: Room } | undefined {
  if (!cachedPalaceFloors) return undefined;

  for (const floor of cachedPalaceFloors) {
    const room = floor.rooms.find((r) => r.tag === tag);
    if (room) {
      return { floor, room };
    }
  }
  return undefined;
}

// Preload function to call early in app lifecycle
export function preloadPalaceData(): void {
  loadPalaceData();
}

// Re-export types for convenience
export type { Floor, Room };
