import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useProcessState } from "@/hooks/useProcessState";

interface ProcessTrackingContextType {
  trackLocation: (location: string) => void;
  trackProcess: (params: {
    process: string;
    step?: number;
    totalSteps?: number;
    taskType?: string;
    notes?: string;
  }) => void;
  trackDrill: (sessionId: string) => void;
  trackRoomMastery: (roomCode: string) => void;
  clearProcess: () => void;
}

const ProcessTrackingContext = createContext<ProcessTrackingContextType | undefined>(undefined);

export const ProcessTrackingProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { updateProcessState, clearProcessState } = useProcessState();

  // Auto-track location changes
  useEffect(() => {
    if (location.pathname !== "/auth" && location.pathname !== "/404") {
      updateProcessState({
        last_location: location.pathname,
        last_timestamp: new Date().toISOString(),
      });
    }
  }, [location.pathname]);

  const trackLocation = (loc: string) => {
    updateProcessState({
      last_location: loc,
      last_timestamp: new Date().toISOString(),
    });
  };

  const trackProcess = ({
    process,
    step,
    totalSteps,
    taskType,
    notes,
  }: {
    process: string;
    step?: number;
    totalSteps?: number;
    taskType?: string;
    notes?: string;
  }) => {
    updateProcessState({
      active_process: process,
      process_step: step || null,
      process_total_steps: totalSteps || null,
      task_type: taskType || null,
      notes: notes || null,
      last_timestamp: new Date().toISOString(),
    });
  };

  const trackDrill = (sessionId: string) => {
    updateProcessState({
      last_drill_session_id: sessionId,
      last_timestamp: new Date().toISOString(),
    });
  };

  const trackRoomMastery = (roomCode: string) => {
    updateProcessState({
      last_room_mastered: roomCode,
      last_timestamp: new Date().toISOString(),
    });
  };

  const clearProcess = () => {
    clearProcessState();
  };

  return (
    <ProcessTrackingContext.Provider
      value={{
        trackLocation,
        trackProcess,
        trackDrill,
        trackRoomMastery,
        clearProcess,
      }}
    >
      {children}
    </ProcessTrackingContext.Provider>
  );
};

export const useProcessTracking = () => {
  const context = useContext(ProcessTrackingContext);
  if (!context) {
    throw new Error("useProcessTracking must be used within ProcessTrackingProvider");
  }
  return context;
};
