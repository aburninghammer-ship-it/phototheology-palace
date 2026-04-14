/**
 * Feature Registry — single source of truth for path → minimum experience mode.
 * All navigation surfaces consume this to gate features.
 *
 * Mode names match ExperienceModeContext:
 *   basic    (Level 1) — "Learn" — Bible learning, devotional, consumption
 *   immersion(Level 2) — "Study" — PT principles, deep analysis, creation
 */

export type ExperienceMode = "basic" | "immersion";

export const MODE_LEVEL: Record<ExperienceMode, number> = {
  basic: 1,
  immersion: 2,
};

export const MODE_LABELS: Record<ExperienceMode, string> = {
  basic: "Learn",
  immersion: "Study",
};

/** Returns true if `current` mode meets or exceeds `min` mode */
export function meetsMinMode(current: ExperienceMode, min: ExperienceMode): boolean {
  return MODE_LEVEL[current] >= MODE_LEVEL[min];
}

/**
 * Registry mapping route path prefixes to minimum required mode.
 * Ordered from most specific to least specific within each mode.
 * Paths not listed here default to "basic" (accessible to all).
 *
 * Level 1 (Learn): Devotional, listening, absorbing — Chapel, Commentary, Master Class,
 *   Podcast, Give Me a Gem, Audio Library, KidGPT, Study Buddy, Daily Reading, etc.
 *
 * Level 2 (Study): PT-powered analysis & creation — Palace, Sermon Builder, Mind Map,
 *   specialized GPTs, Prophecy Watch, Defense Mode, etc.
 */
const FEATURE_REGISTRY: Array<{ path: string; minMode: ExperienceMode }> = [
  // ── Study-only features (Level 2 — Immersion) ──
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
  { path: "/daniel-revelation-gpt", minMode: "immersion" },

  // Other Study features
  { path: "/prophecy-watch", minMode: "immersion" },
  { path: "/research-mode", minMode: "immersion" },
  { path: "/encyclopedia", minMode: "immersion" },
  { path: "/character-profiles", minMode: "immersion" },
  { path: "/libraries", minMode: "immersion" },
  { path: "/bible-atlas", minMode: "immersion" },
  { path: "/quarterly-study", minMode: "immersion" },

  // Palace & Study tools (formerly Explorer, now Study)
  { path: "/palace/tour", minMode: "immersion" },
  { path: "/palace", minMode: "immersion" },
  { path: "/image-bible", minMode: "immersion" },
  { path: "/bible-timeline", minMode: "immersion" },
  { path: "/bible-lexicon", minMode: "immersion" },
  { path: "/interlinear", minMode: "immersion" },
  { path: "/research-assistant", minMode: "immersion" },
  { path: "/analyze-thoughts", minMode: "immersion" },
  { path: "/mind-map", minMode: "immersion" },
  { path: "/test-me", minMode: "immersion" },
  { path: "/drill-drill", minMode: "immersion" },

  // Games Space
  { path: "/daily-challenges", minMode: "immersion" },
  { path: "/challenge-board", minMode: "immersion" },
  { path: "/leaderboard", minMode: "immersion" },
  { path: "/achievements", minMode: "immersion" },

  // University Space
  { path: "/phototheology-course", minMode: "immersion" },
  { path: "/daniel-course", minMode: "immersion" },
  { path: "/revelation-course", minMode: "immersion" },
  { path: "/bible-study-series", minMode: "immersion" },
  { path: "/40-day-challenge", minMode: "immersion" },

  // ── Learn (Level 1 — all users) — no entries needed, it's the default ──
  // Chapel, Morning/Night Watches, Study Bible, Ask Jeeves, Study Experience,
  // Study Buddy, Give Me a Gem, Memory, Master Class, Podcast, Audio Library,
  // KidGPT, Devotionals, Daily Reading, Reading Plans, Commentary Suite
];

/**
 * Get the minimum mode required for a given path.
 * Uses longest-prefix matching so `/palace/freestyle` (immersion) beats `/palace` (immersion).
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
