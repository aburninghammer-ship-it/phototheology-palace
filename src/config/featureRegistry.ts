/**
 * Feature Registry — single source of truth for path → minimum experience mode.
 * All navigation surfaces consume this to gate features.
 *
 * Mode names match ExperienceModeContext:
 *   basic    (Level 1) — formerly "simple"
 *   explorer (Level 2) — formerly "guided"
 *   immersion(Level 3) — formerly "master"
 */

export type ExperienceMode = "basic" | "explorer" | "immersion";

export const MODE_LEVEL: Record<ExperienceMode, number> = {
  basic: 1,
  explorer: 2,
  immersion: 3,
};

export const MODE_LABELS: Record<ExperienceMode, string> = {
  basic: "Basic",
  explorer: "Explorer",
  immersion: "Immersion",
};

/** Returns true if `current` mode meets or exceeds `min` mode */
export function meetsMinMode(current: ExperienceMode, min: ExperienceMode): boolean {
  return MODE_LEVEL[current] >= MODE_LEVEL[min];
}

/**
 * Registry mapping route path prefixes to minimum required mode.
 * Ordered from most specific to least specific within each mode.
 * Paths not listed here default to "basic" (accessible to all).
 */
const FEATURE_REGISTRY: Array<{ path: string; minMode: ExperienceMode }> = [
  // ── Immersion-only features (Level 3) ──
  // Train Space
  { path: "/mastery", minMode: "immersion" },
  { path: "/palace/freestyle", minMode: "immersion" },
  { path: "/spiritual-training", minMode: "immersion" },
  { path: "/video-training", minMode: "immersion" },
  { path: "/photo31", minMode: "immersion" },
  { path: "/vr", minMode: "immersion" },
  { path: "/card-deck", minMode: "immersion" },

  // Teach Space
  { path: "/sermon-builder", minMode: "immersion" },
  { path: "/sermon-ideas", minMode: "immersion" },
  { path: "/amplify", minMode: "immersion" },
  { path: "/remix", minMode: "immersion" },
  { path: "/polish", minMode: "immersion" },

  // Equip Space
  { path: "/cota-series", minMode: "immersion" },
  { path: "/apologetics-gpt", minMode: "immersion" },
  { path: "/culture-controversy", minMode: "immersion" },

  // Workshop / AI Tools Space
  { path: "/phototheologygpt", minMode: "immersion" },
  { path: "/branch-study", minMode: "immersion" },
  { path: "/kidgpt", minMode: "immersion" },
  { path: "/daniel-revelation-gpt", minMode: "immersion" },

  // Other Immersion features
  { path: "/prophecy-watch", minMode: "immersion" },
  { path: "/research-mode", minMode: "immersion" },
  { path: "/encyclopedia", minMode: "immersion" },
  { path: "/character-profiles", minMode: "immersion" },
  { path: "/libraries", minMode: "immersion" },
  { path: "/bible-atlas", minMode: "immersion" },
  { path: "/quarterly-study", minMode: "immersion" },

  // ── Explorer features (Level 2) ──
  { path: "/master-class", minMode: "explorer" },
  // Study Experience
  { path: "/study-experience", minMode: "explorer" },
  // Study Space
  { path: "/palace/tour", minMode: "explorer" },
  { path: "/palace", minMode: "explorer" },
  { path: "/image-bible", minMode: "explorer" },
  { path: "/bible-timeline", minMode: "explorer" },
  { path: "/bible-lexicon", minMode: "explorer" },
  { path: "/interlinear", minMode: "explorer" },
  { path: "/study-buddy", minMode: "explorer" },
  { path: "/research-assistant", minMode: "explorer" },
  { path: "/give-me-a-gem", minMode: "explorer" },
  { path: "/analyze-thoughts", minMode: "explorer" },
  { path: "/memory", minMode: "explorer" },
  { path: "/mind-map", minMode: "explorer" },
  { path: "/test-me", minMode: "explorer" },
  { path: "/drill-drill", minMode: "explorer" },

  // Games Space
  { path: "/daily-challenges", minMode: "explorer" },
  { path: "/challenge-board", minMode: "explorer" },
  { path: "/leaderboard", minMode: "explorer" },
  { path: "/achievements", minMode: "explorer" },

  // Chapel Space — morning/night watches are basic (part of Chapel, accessible to all)

  // University Space
  { path: "/phototheology-course", minMode: "explorer" },
  { path: "/daniel-course", minMode: "explorer" },
  { path: "/revelation-course", minMode: "explorer" },
  { path: "/bible-study-series", minMode: "explorer" },
  { path: "/audio-library", minMode: "explorer" },
  { path: "/40-day-challenge", minMode: "explorer" },

  // ── Basic (all users) — no entries needed, it's the default ──
];

/**
 * Get the minimum mode required for a given path.
 * Uses longest-prefix matching so `/palace/freestyle` (immersion) beats `/palace` (explorer).
 */
export function getMinModeForPath(path: string): ExperienceMode {
  let bestMatch: { path: string; minMode: ExperienceMode } | null = null;

  for (const entry of FEATURE_REGISTRY) {
    if (path === entry.path || path.startsWith(entry.path + "/") || path.startsWith(entry.path + "?")) {
      if (!bestMatch || entry.path.length > bestMatch.path.length) {
        bestMatch = entry;
      }
    }
  }

  return bestMatch?.minMode ?? "basic";
}

/** Returns true if the feature at `path` is accessible for `currentMode` */
export function isFeatureAccessible(currentMode: ExperienceMode, path: string): boolean {
  const minMode = getMinModeForPath(path);
  return meetsMinMode(currentMode, minMode);
}
