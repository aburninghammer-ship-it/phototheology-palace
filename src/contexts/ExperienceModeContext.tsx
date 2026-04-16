/**
 * Experience Mode System
 * 
 * Controls how much Phototheology architecture is visible to the user.
 * - basic: Learn the Bible. Devotional, listening, absorbing. ("Learn")
 * - immersion: Study the Bible with PT principles. Full rooms, floors, codes. ("Study")
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MODE_LEVEL } from "@/config/featureRegistry";

export type ExperienceMode = "basic" | "immersion";

// Map old DB values to new ones (collapse 3 → 2)
const MIGRATE_MAP: Record<string, ExperienceMode> = {
  simple: "basic",
  guided: "basic",      // old explorer → now basic (Learn)
  master: "immersion",
  explorer: "basic",     // new name that was briefly used
};

// Map new values to old DB values for storage compatibility
const DB_VALUE_MAP: Record<ExperienceMode, string> = {
  basic: "simple",
  immersion: "master",
};

function normalizeMode(raw: string | null): ExperienceMode {
  if (!raw) return "basic";
  if (raw === "basic" || raw === "immersion") return raw;
  if (MIGRATE_MAP[raw]) return MIGRATE_MAP[raw];
  return "basic";
}

export { MODE_LEVEL };

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
  isLoading: boolean;
  isBasic: boolean;
  isImmersion: boolean;
  /** Backward compat aliases */
  isSimple: boolean;
  isExplorer: boolean;
  isGuided: boolean;
  isMaster: boolean;
  /** Returns true if PT terminology should be shown (immersion only) */
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
  const [isLoading, setIsLoading] = useState(true);

  // Sync from database on auth
  useEffect(() => {
    let isMounted = true;

    const loadFromProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted || !user) return;

        const { data } = await supabase
          .from("profiles")
          .select("experience_mode")
          .eq("id", user.id)
          .single();

        if (!isMounted) return;

        if (data?.experience_mode) {
          const normalized = normalizeMode(data.experience_mode);
          setModeState(normalized);
          localStorage.setItem(STORAGE_KEY, normalized);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFromProfile();

    return () => {
      isMounted = false;
    };
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
    isLoading,
    isBasic: mode === "basic",
    isImmersion: mode === "immersion",
    // Backward compat — explorer maps to basic now
    isSimple: mode === "basic",
    isExplorer: mode === "basic",
    isGuided: mode === "basic",
    isMaster: mode === "immersion",
    showPTLabels: mode === "immersion",
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
