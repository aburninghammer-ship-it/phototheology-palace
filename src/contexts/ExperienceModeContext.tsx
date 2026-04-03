/**
 * Experience Mode System
 * 
 * Controls how much Phototheology architecture is visible to the user.
 * - simple: No PT jargon. Actions & insights only. ("The Clock")
 * - guided: Occasional PT context. Learn the engine through use.
 * - master: Full rooms, floors, codes, principles. ("The Engine")
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExperienceMode = "simple" | "guided" | "master";

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
  isSimple: boolean;
  isGuided: boolean;
  isMaster: boolean;
  /** Returns true if PT terminology should be shown (guided or master) */
  showPTLabels: boolean;
  /** Returns true if full PT architecture should be shown (master only) */
  showFullArchitecture: boolean;
}

const ExperienceModeContext = createContext<ExperienceModeContextType | undefined>(undefined);

const STORAGE_KEY = "pt-experience-mode";

export function ExperienceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ExperienceMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "simple" || stored === "guided" || stored === "master") return stored;
    return "simple";
  });

  // Sync from database on auth
  useEffect(() => {
    const loadFromProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("experience_mode")
        .eq("id", user.id)
        .single();

      if (data?.experience_mode && ["simple", "guided", "master"].includes(data.experience_mode)) {
        setModeState(data.experience_mode as ExperienceMode);
        localStorage.setItem(STORAGE_KEY, data.experience_mode);
      }
    };

    loadFromProfile();
  }, []);

  const setMode = useCallback(async (newMode: ExperienceMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);

    // Persist to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ experience_mode: newMode } as any)
        .eq("id", user.id);
    }
  }, []);

  const value: ExperienceModeContextType = {
    mode,
    setMode,
    isSimple: mode === "simple",
    isGuided: mode === "guided",
    isMaster: mode === "master",
    showPTLabels: mode === "guided" || mode === "master",
    showFullArchitecture: mode === "master",
  };

  return (
    <ExperienceModeContext.Provider value={value}>
      {children}
    </ExperienceModeContext.Provider>
  );
}

export function useExperienceMode() {
  const context = useContext(ExperienceModeContext);
  if (!context) {
    throw new Error("useExperienceMode must be used within ExperienceModeProvider");
  }
  return context;
}
