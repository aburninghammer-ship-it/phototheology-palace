import { useState, useCallback, useEffect } from "react";
import { getAllDockItems } from "@/components/os/dockData";

const PINNED_KEY = "phototheology-pinned-dock";
const MAX_PINS = 9;

// Default pins if nothing stored
const DEFAULT_PINS = [
  "/bible",
  "/palace",
  "/phototheology-course",
  "/devotionals",
  "/daily-challenges",
  "/audio-library",
];

export interface PinnedItem {
  label: string;
  path: string;
  icon: any;
  glow: string;
}

function getStoredPins(): string[] {
  try {
    const stored = localStorage.getItem(PINNED_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PINS;
  } catch {
    return DEFAULT_PINS;
  }
}

function storePins(paths: string[]) {
  localStorage.setItem(PINNED_KEY, JSON.stringify(paths));
}

/** Global event to sync across components */
const PIN_CHANGE_EVENT = "pinned-dock-change";

export function usePinnedDock() {
  const [pinnedPaths, setPinnedPaths] = useState<string[]>(getStoredPins);
  const allItems = getAllDockItems();

  // Listen for cross-component sync
  useEffect(() => {
    const handler = () => setPinnedPaths(getStoredPins());
    window.addEventListener(PIN_CHANGE_EVENT, handler);
    return () => window.removeEventListener(PIN_CHANGE_EVENT, handler);
  }, []);

  const isPinned = useCallback((path: string) => {
    return pinnedPaths.includes(path);
  }, [pinnedPaths]);

  const togglePin = useCallback((path: string) => {
    setPinnedPaths(prev => {
      let next: string[];
      if (prev.includes(path)) {
        next = prev.filter(p => p !== path);
      } else {
        if (prev.length >= MAX_PINS) return prev; // at limit
        next = [...prev, path];
      }
      storePins(next);
      window.dispatchEvent(new Event(PIN_CHANGE_EVENT));
      return next;
    });
  }, []);

  const pinnedItems: PinnedItem[] = pinnedPaths
    .map(path => allItems.find(i => i.path === path))
    .filter(Boolean) as PinnedItem[];

  return {
    pinnedPaths,
    pinnedItems,
    isPinned,
    togglePin,
    isFull: pinnedPaths.length >= MAX_PINS,
    maxPins: MAX_PINS,
  };
}
