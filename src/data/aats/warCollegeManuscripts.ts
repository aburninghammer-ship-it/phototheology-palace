// ─── War College Manuscript Registry ────────────────────────────────────────
// Central registry of all pre-built War College day manuscripts.
// AI-generated manuscripts are stored in the database; this file holds
// the gold-standard model templates.

import type { WarCollegeDay } from "./warCollegeTypes";
import { WAR_COLLEGE_DAY_1_ATHEIST } from "./warCollegeDay1Atheist";

/** Pre-built manuscripts keyed by "{avatarId}-day-{dayNumber}" */
const MANUSCRIPT_REGISTRY: Record<string, WarCollegeDay> = {
  "atheist-day-1": WAR_COLLEGE_DAY_1_ATHEIST,
};

export function getPrebuiltManuscript(
  avatarId: string,
  dayNumber: number
): WarCollegeDay | null {
  return MANUSCRIPT_REGISTRY[`${avatarId}-day-${dayNumber}`] ?? null;
}

export function hasPrebuiltManuscript(
  avatarId: string,
  dayNumber: number
): boolean {
  return `${avatarId}-day-${dayNumber}` in MANUSCRIPT_REGISTRY;
}
