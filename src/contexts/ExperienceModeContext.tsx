/**
 * Experience Mode System
 * 
 * Controls how much Phototheology architecture is visible to the user.
 * - basic: No PT jargon. ChatGPT-like interface. Answers only. ("The Clock")
 * - explorer: Guided PT context. Learn the engine through use. ("The Workshop")
 * - immersion: Full rooms, floors, codes, principles. ("The Engine")
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MODE_LEVEL } from "@/config/featureRegistry";

export type ExperienceMode = "basic" | "explorer" | "immersion";

// Map old DB values to new ones
const MIGRATE_MAP: Record<string, ExperienceMode> = {
  simple: "basic",
  guided: "explorer",
  master: "immersion",
};

// Map new values to old DB values for storage compatibility
const DB_VALUE_MAP: Record<ExperienceMode, string> = {
  basic: "simple",
  explorer: "guided",
  immersion: "master",
};

function normalizeMode(raw: string | null): ExperienceMode {
  if (!raw) return "basic";
  if (raw === "basic" || raw === "explorer" || raw === "immersion") return raw;
  if (MIGRATE_MAP[raw]) return MIGRATE_MAP[raw];
  return "basic";
}

export { MODE_LEVEL };

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
  isBasic: boolean;
  isExplorer: boolean;
  isImmersion: boolean;
  /** Backward compat aliases */
  isSimple: boolean;
  isGuided: boolean;
  isMaster: boolean;
  /** Returns true if PT terminology should be shown (explorer or immersion) */
  showPTLabels: boolean;
  /** Returns true if full PT architecture should be shown (immersion only) */
  showFullArchitecture: boolean;
  /** Returns true if the current mode meets or exceeds the given minimum */
  meetsMinMode: (minMode: ExperienceMode) => boolean;
}

const ExperienceModeContext = createContext<ExperienceModeContextType | undefined>(undefined);

const STORAGE_KEY = "pt-experience-mode";

export function ExperienceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ExperienceMode>(() => {
    return normalizeMode(localStorage.getItem(STORAGE_KEY));
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

      if (data?.experience_mode) {
        const normalized = normalizeMode(data.experience_mode);
        setModeState(normalized);
        localStorage.setItem(STORAGE_KEY, normalized);
      }
    };

    loadFromProfile();
  }, []);

  const setMode = useCallback(async (newMode: ExperienceMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);

    // Persist to database (use old DB values for compat)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ experience_mode: DB_VALUE_MAP[newMode] } as any)
        .eq("id", user.id);
    }
  }, []);

  const meetsMinModeCheck = useCallback(
    (minMode: ExperienceMode) => MODE_LEVEL[mode] >= MODE_LEVEL[minMode],
    [mode],
  );

  const value: ExperienceModeContextType = {
    mode,
    setMode,
    isBasic: mode === "basic",
    isExplorer: mode === "explorer",
    isImmersion: mode === "immersion",
    // Backward compat
    isSimple: mode === "basic",
    isGuided: mode === "explorer",
    isMaster: mode === "immersion",
    showPTLabels: mode === "explorer" || mode === "immersion",
    showFullArchitecture: mode === "immersion",
    meetsMinMode: meetsMinModeCheck,
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
