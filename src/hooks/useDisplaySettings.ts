import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  colorTheme: "pt-color-theme",
  zenMode: "pt-zen-mode",
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

function applyZenMode(enabled: boolean) {
  document.documentElement.setAttribute("data-zen-mode", enabled ? "true" : "false");
}

export function useDisplaySettings() {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.colorTheme) as ColorTheme) || "default";
  });

  const [zenMode, setZenModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.zenMode) === "true";
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.reducedMotion) === "true";
  });

  // Apply on mount
  useEffect(() => {
    applyColorTheme(colorTheme);
    applyReducedMotion(reducedMotion);
    applyZenMode(zenMode);
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem(STORAGE_KEYS.colorTheme, theme);
    applyColorTheme(theme);
  }, []);

  const setZenMode = useCallback((enabled: boolean) => {
    setZenModeState(enabled);
    localStorage.setItem(STORAGE_KEYS.zenMode, String(enabled));
    applyZenMode(enabled);
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem(STORAGE_KEYS.reducedMotion, String(enabled));
    applyReducedMotion(enabled);
  }, []);

  return {
    colorTheme,
    setColorTheme,
    zenMode,
    setZenMode,
    reducedMotion,
    setReducedMotion,
  };
}
