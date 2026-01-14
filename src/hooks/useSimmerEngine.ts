import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Request browser notification permission on mount
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

// Send browser notification
const sendBrowserNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'simmer-complete',
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    // Focus window on click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};
export type Lane = "BUILD" | "SHARPEN" | "STRESS" | "DISTILL";

export interface SimmerArtifact {
  id: string;
  type: string;
  summary: string;
  content: string;
  linked_sections?: string[];
  verse?: string;
  ptCodes?: string[];
  pass_index: number;
  lane: Lane;
  created_at: string;
  validated?: boolean;
  validation_score?: number;
  validation_passed?: boolean;
  validation_issues?: string[];
}

export interface PassRecord {
  pass_index: number;
  lane: Lane;
  diagnosis: string;
  artifacts_produced: number;
  artifacts_rejected: number;
  flags: {
    possible_overlap: boolean;
    lane_boundary_risk: boolean;
    scripture_uncertainty: boolean;
    thesis_drift: boolean;
  };
  timestamp: string;
}

export interface EngineState {
  simmerMode: "classic" | "engine";
  simmerDuration: "1h" | "2h" | "3h";
  passCount: number;
  currentLane: Lane | null;
  laneSchedule: Lane[];
  artifacts: SimmerArtifact[];
  parkingArtifacts: any[];
  passHistory: PassRecord[];
  validationErrors: any[];
  projectSummary: string | null;
  isPaused: boolean;
  lockedThesis: boolean;
  humanApprovedArtifacts: string[];
  isComplete: boolean;
}

interface PassResult {
  success: boolean;
  pass_index: number;
  lane: Lane;
  next_lane: Lane | null;
  artifacts_added: number;
  artifacts_rejected: number;
  complete: boolean;
  flags: any;
  diagnosis: string;
}

/**
 * Hook for managing the Simmer Engine V1 - the distributed cognitive system
 */
export function useSimmerEngine(sessionId: string | undefined) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [engineState, setEngineState] = useState<EngineState | null>(null);

  // Request notification permission when hook mounts
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  // Initialize engine mode for a session
  const initializeEngine = useCallback(async (duration: "1h" | "2h" | "3h" = "1h") => {
    if (!sessionId) {
      toast.error("No session ID");
      return null;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("simmer-engine", {
        body: { action: "initialize", sessionId, duration },
      });

      if (error) throw error;

      toast.success(data.message);
      await refreshState();
      return data;
    } catch (error: any) {
      console.error("Initialize error:", error);
      toast.error("Failed to initialize engine: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  // Run a single pass
  const runPass = useCallback(async (forceLane?: Lane): Promise<PassResult | null> => {
    if (!sessionId) {
      toast.error("No session ID");
      return null;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("simmer-engine", {
        body: { action: "run_pass", sessionId, forceLane },
      });

      if (error) throw error;

      if (data.complete) {
        toast.success("🔥 Simmer complete! All passes finished.");
        
        // Send browser notification when simmer completes
        sendBrowserNotification(
          "🔥 Simmer Complete!",
          "Your sermon has finished simmering. All passes are complete!"
        );
      } else {
        toast.success(`Pass ${data.pass_index}: ${data.lane} → ${data.artifacts_added} artifact(s)`);
      }

      await refreshState();
      return data;
    } catch (error: any) {
      console.error("Run pass error:", error);
      toast.error("Pass failed: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  // Run multiple passes in sequence
  const runPasses = useCallback(async (count: number): Promise<PassResult[]> => {
    const results: PassResult[] = [];
    
    for (let i = 0; i < count; i++) {
      const result = await runPass();
      if (!result) break;
      results.push(result);
      if (result.complete) break;
      
      // Small delay between passes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }, [runPass]);

  // Run validation
  const runValidation = useCallback(async (artifactIds?: string[]) => {
    if (!sessionId) return null;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("simmer-validator", {
        body: { sessionId, artifactIds },
      });

      if (error) throw error;

      toast.success(`Validated: ${data.passed} passed, ${data.failed} failed`);
      await refreshState();
      return data;
    } catch (error: any) {
      console.error("Validation error:", error);
      toast.error("Validation failed: " + error.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  // Pause/Resume
  const togglePause = useCallback(async () => {
    if (!sessionId) return;

    const action = engineState?.isPaused ? "resume" : "pause";
    
    try {
      const { data, error } = await supabase.functions.invoke("simmer-engine", {
        body: { action, sessionId },
      });

      if (error) throw error;

      toast.success(data.paused ? "Simmer paused ⏸️" : "Simmer resumed ▶️");
      await refreshState();
    } catch (error: any) {
      toast.error("Failed to toggle pause");
    }
  }, [sessionId, engineState?.isPaused]);

  // Lock/Unlock Thesis
  const toggleThesisLock = useCallback(async () => {
    if (!sessionId) return;

    const action = engineState?.lockedThesis ? "unlock_thesis" : "lock_thesis";
    
    try {
      const { data, error } = await supabase.functions.invoke("simmer-engine", {
        body: { action, sessionId },
      });

      if (error) throw error;

      toast.success(data.locked ? "Thesis locked 🔒" : "Thesis unlocked 🔓");
      await refreshState();
    } catch (error: any) {
      toast.error("Failed to toggle thesis lock");
    }
  }, [sessionId, engineState?.lockedThesis]);

  // Approve/Reject Artifact
  const approveArtifact = useCallback(async (artifactId: string) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.functions.invoke("simmer-engine", {
        body: { action: "approve_artifact", sessionId, artifactId },
      });

      if (error) throw error;
      toast.success("Artifact approved ✓");
      await refreshState();
    } catch (error: any) {
      toast.error("Failed to approve artifact");
    }
  }, [sessionId]);

  const rejectArtifact = useCallback(async (artifactId: string) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.functions.invoke("simmer-engine", {
        body: { action: "reject_artifact", sessionId, artifactId },
      });

      if (error) throw error;
      toast.success("Artifact rejected ✗");
      await refreshState();
    } catch (error: any) {
      toast.error("Failed to reject artifact");
    }
  }, [sessionId]);

  // Refresh state from DB
  const refreshState = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from("sermon_simmer_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      const laneSchedule = (data.lane_schedule as Lane[]) || [];
      
      setEngineState({
        simmerMode: data.simmer_mode as "classic" | "engine" || "classic",
        simmerDuration: data.simmer_duration as "1h" | "2h" | "3h" || "1h",
        passCount: data.pass_count || 0,
        currentLane: data.current_lane as Lane | null,
        laneSchedule,
        artifacts: (data.artifacts as unknown as SimmerArtifact[]) || [],
        parkingArtifacts: (data.parking_artifacts as unknown as any[]) || [],
        passHistory: (data.pass_history as unknown as PassRecord[]) || [],
        validationErrors: (data.validation_errors as any[]) || [],
        projectSummary: data.project_summary,
        isPaused: data.is_paused || false,
        lockedThesis: data.locked_thesis || false,
        humanApprovedArtifacts: (data.human_approved_artifacts as string[]) || [],
        isComplete: data.pass_count >= laneSchedule.length,
      });
    } catch (error: any) {
      console.error("Refresh state error:", error);
    }
  }, [sessionId]);

  return {
    engineState,
    isProcessing,
    initializeEngine,
    runPass,
    runPasses,
    runValidation,
    togglePause,
    toggleThesisLock,
    approveArtifact,
    rejectArtifact,
    refreshState,
  };
}
