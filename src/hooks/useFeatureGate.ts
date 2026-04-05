import { useCallback } from "react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import {
  isFeatureAccessible as _isFeatureAccessible,
  getMinModeForPath,
  meetsMinMode as _meetsMinMode,
  type ExperienceMode,
} from "@/config/featureRegistry";

/**
 * React hook wrapping the feature registry with the current experience mode.
 */
export function useFeatureGate() {
  const { mode } = useExperienceMode();

  const isAccessible = useCallback(
    (path: string) => _isFeatureAccessible(mode, path),
    [mode],
  );

  const meetsMin = useCallback(
    (minMode: ExperienceMode) => _meetsMinMode(mode, minMode),
    [mode],
  );

  const getMinMode = useCallback(
    (path: string) => getMinModeForPath(path),
    [],
  );

  return { isAccessible, meetsMin, getMinMode, currentMode: mode };
}
