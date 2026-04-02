/**
 * Simple A/B testing utility
 * Assigns users to variants deterministically via localStorage
 * Tracks impressions and conversions via user_events table
 */

import { supabase } from "@/integrations/supabase/client";

export interface ABVariant {
  id: string;
  label: string;
  /** Additional props passed to components */
  props?: Record<string, unknown>;
}

export interface ABExperiment {
  name: string;
  variants: ABVariant[];
}

const STORAGE_PREFIX = "ab_";

/** Get or assign a variant for an experiment */
export function getVariant(experiment: ABExperiment): ABVariant {
  const key = `${STORAGE_PREFIX}${experiment.name}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    const found = experiment.variants.find(v => v.id === stored);
    if (found) return found;
  }
  
  // Random assignment
  const idx = Math.floor(Math.random() * experiment.variants.length);
  const variant = experiment.variants[idx];
  localStorage.setItem(key, variant.id);
  
  // Track assignment (fire-and-forget)
  trackABEvent(experiment.name, variant.id, "impression");
  
  return variant;
}

/** Track an A/B event */
export function trackABEvent(
  experiment: string,
  variantId: string,
  action: "impression" | "click" | "conversion"
) {
  supabase.from("user_events").insert({
    user_id: null,
    event_type: `ab_${action}`,
    event_data: { experiment, variant: variantId },
    page_path: window.location.pathname,
  }).then(() => {});
}

// ─── Experiments ────────────────────────────────────────

export const HERO_CTA_EXPERIMENT: ABExperiment = {
  name: "hero_cta_2026_04",
  variants: [
    { id: "control", label: "Sign In", props: { icon: "login" } },
    { id: "start_free", label: "Start Free", props: { icon: "sparkles" } },
    { id: "try_palace", label: "Try the Palace", props: { icon: "castle" } },
    { id: "begin_journey", label: "Begin Your Journey", props: { icon: "compass" } },
  ],
};
