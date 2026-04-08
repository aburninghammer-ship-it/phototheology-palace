import { useState, useCallback } from "react";

type CountFeature = "verse" | "mindmap";
type BooleanFeature = "meditation" | "commentary" | "study";
type Feature = CountFeature | BooleanFeature;

const COUNT_LIMITS: Record<CountFeature, number> = {
  verse: 3,
  mindmap: 3,
};

const STORAGE_KEYS: Record<Feature, string> = {
  verse: "showme-verse-count",
  mindmap: "showme-mindmap-count",
  meditation: "showme-meditation-used",
  commentary: "showme-commentary-used",
  study: "showme-study-used",
};

const TOUR_KEY = "showme-tour-seen";

function isCountFeature(f: Feature): f is CountFeature {
  return f === "verse" || f === "mindmap";
}

function getCount(feature: CountFeature): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS[feature]) || "0", 10);
}

function getBool(feature: BooleanFeature): boolean {
  return localStorage.getItem(STORAGE_KEYS[feature]) === "true";
}

export function useShowMeUsage() {
  // Force re-renders when usage changes
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);

  const canUse = useCallback((feature: Feature): boolean => {
    if (isCountFeature(feature)) {
      return getCount(feature) < COUNT_LIMITS[feature];
    }
    return !getBool(feature as BooleanFeature);
  }, []);

  const use = useCallback(
    (feature: Feature) => {
      if (isCountFeature(feature)) {
        const current = getCount(feature);
        localStorage.setItem(STORAGE_KEYS[feature], String(current + 1));
      } else {
        localStorage.setItem(STORAGE_KEYS[feature], "true");
      }
      bump();
    },
    [bump]
  );

  const getRemaining = useCallback((feature: CountFeature): number => {
    return Math.max(0, COUNT_LIMITS[feature] - getCount(feature));
  }, []);

  const isTourSeen = useCallback((): boolean => {
    return localStorage.getItem(TOUR_KEY) === "true";
  }, []);

  const markTourSeen = useCallback(() => {
    localStorage.setItem(TOUR_KEY, "true");
    bump();
  }, [bump]);

  return { canUse, use, getRemaining, isTourSeen, markTourSeen };
}
