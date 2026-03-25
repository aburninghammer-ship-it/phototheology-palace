export type { TourSegment, TourDefinition } from "./types";
export { buildAllSegments, getTotalSeconds } from "./types";
export { HOOK_TOUR } from "./hookTour";
export { PSALM_23_TOUR } from "./psalm23Tour";
export { PSALM_23_GUIDED_TOUR } from "./psalm23GuidedTour";
export { PHILIPPIANS_2_5_TOUR } from "./philippians2Tour";
export { PHILIPPIANS_2_GUIDED_TOUR } from "./philippians2GuidedTour";
export { SUITE_TOUR } from "./suiteTour";

import { HOOK_TOUR } from "./hookTour";
import { PSALM_23_TOUR } from "./psalm23Tour";
import { PSALM_23_GUIDED_TOUR } from "./psalm23GuidedTour";
import { PHILIPPIANS_2_5_TOUR } from "./philippians2Tour";
import { PHILIPPIANS_2_GUIDED_TOUR } from "./philippians2GuidedTour";
import { SUITE_TOUR } from "./suiteTour";
import type { TourDefinition } from "./types";

export interface TourTier {
  label: string;
  description: string;
  badge: string;
  badgeColor: string;
  tours: TourDefinition[];
}

export const TOUR_TIERS: TourTier[] = [
  {
    label: "Start Here",
    description: "New to Phototheology? This 3-minute taste will blow your mind.",
    badge: "3 min",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    tours: [HOOK_TOUR],
  },
  {
    label: "Guided Tours",
    description: "Step-by-step walkthroughs — 5 key rooms, one passage, deep insight.",
    badge: "10–12 min",
    badgeColor: "bg-blue-500/20 text-blue-400",
    tours: [PSALM_23_GUIDED_TOUR, PHILIPPIANS_2_GUIDED_TOUR],
  },
  {
    label: "Deep Immersion",
    description: "Every room, every floor, every principle. The full Palace experience.",
    badge: "15–18 min",
    badgeColor: "bg-amber-500/20 text-amber-400",
    tours: [PSALM_23_TOUR, PHILIPPIANS_2_5_TOUR],
  },
  {
    label: "Suite Overview",
    description: "Reginald walks you through every tool in the platform.",
    badge: "15 min",
    badgeColor: "bg-purple-500/20 text-purple-400",
    tours: [SUITE_TOUR],
  },
];

export const ALL_TOURS: TourDefinition[] = [
  HOOK_TOUR,
  PSALM_23_GUIDED_TOUR,
  PSALM_23_TOUR,
  PHILIPPIANS_2_5_TOUR,
  SUITE_TOUR,
];
