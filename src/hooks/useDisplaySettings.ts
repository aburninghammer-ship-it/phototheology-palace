import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  colorTheme: "pt-color-theme",
  focusMode: "pt-focus-mode",
  reducedMotion: "pt-reduced-motion",
} as const;

export type ColorTheme = "default" | "sepia" | "calm" | "sage";

function applyColorTheme(theme: ColorTheme) {
  const root = document.documentElement;
  // Remove all theme classes
  root.classList.remove("theme-sepia", "theme-calm", "theme-sage");
  if (theme !== "default") {
    root.classList.add(`theme-${theme}`);
  }
}

function applyReducedMotion(enabled: boolean) {
  document.documentElement.setAttribute("data-reduced-motion", enabled ? "true" : "false");
}

function applyFocusMode(enabled: boolean) {
  document.documentElement.setAttribute("data-focus-mode", enabled ? "true" : "false");
}

export function useDisplaySettings() {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.colorTheme) as ColorTheme) || "default";
  });

  const [focusMode, setFocusModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.focusMode) === "true";
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.reducedMotion) === "true";
  });

  // Apply on mount
  useEffect(() => {
    applyColorTheme(colorTheme);
    applyReducedMotion(reducedMotion);
    applyFocusMode(focusMode);
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(STORAGE_KEYS.colorTheme, theme);
    applyColorTheme(theme);
  }, []);

  const setFocusMode = useCallback((enabled: boolean) => {
    setFocusModeState(enabled);
    localStorage.setItem(STORAGE_KEYS.focusMode, String(enabled));
    applyFocusMode(enabled);
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem(STORAGE_KEYS.reducedMotion, String(enabled));
    applyReducedMotion(enabled);
  }, []);

  return {
    colorTheme,
    setColorTheme,
    focusMode,
    setFocusMode,
    reducedMotion,
    setReducedMotion,
  };
}
