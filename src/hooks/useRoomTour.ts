import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const ROOM_TOUR_PREFIX = "room_tour_completed_";

export function useRoomTour(roomId: string, floorNumber: number) {
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(true);

  const storageKey = `${ROOM_TOUR_PREFIX}${floorNumber}_${roomId}`;
  const userStorageKey = user ? `${storageKey}_${user.id}` : storageKey;

  useEffect(() => {
    const checkTourStatus = () => {
      // Check localStorage for tour completion
      const completed = localStorage.getItem(userStorageKey);
      if (completed === "true") {
        setShowTour(false);
      } else {
        // First time visiting this room - show tour
        setShowTour(true);
      }
      setLoading(false);
    };

    if (roomId && floorNumber) {
      checkTourStatus();
    }
  }, [roomId, floorNumber, userStorageKey]);

  const completeTour = () => {
    localStorage.setItem(userStorageKey, "true");
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(userStorageKey, "true");
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(userStorageKey);
    setShowTour(true);
  };

  return {
    showTour,
    loading,
    completeTour,
    skipTour,
    resetTour,
  };
}
