// ─── War College: Data Registry ─────────────────────────────────────────────
// Central import hub for all 20 avatar War College tracks.

import type { AATSAvatarId } from "./aatsTrainingData";
import { AATS_AVATAR_IDS } from "./aatsTrainingData";
import type { WarCollegeTrack } from "./warCollegeTypes";

import { atheistTrack } from "./warCollege/atheistTrack";
import { muslimTrack } from "./warCollege/muslimTrack";
import { evangelicalTrack } from "./warCollege/evangelicalTrack";
import { catholicTrack } from "./warCollege/catholicTrack";
import { jwTrack } from "./warCollege/jwTrack";
import { mormonTrack } from "./warCollege/mormonTrack";
import { bhiTrack } from "./warCollege/bhiTrack";
import { formerSdaTrack } from "./warCollege/formerSdaTrack";
import { offshootSdaTrack } from "./warCollege/offshootSdaTrack";
import { jewishTrack } from "./warCollege/jewishTrack";
import { preteristTrack } from "./warCollege/preteristTrack";
import { futuristTrack } from "./warCollege/futuristTrack";
import { secularScholarTrack } from "./warCollege/secularScholarTrack";
import { progressiveChristianTrack } from "./warCollege/progressiveChristianTrack";
import { skepticalExsdaTrack } from "./warCollege/skepticalExsdaTrack";
import { philosopherTrack } from "./warCollege/philosopherTrack";
import { newAgeTrack } from "./warCollege/newAgeTrack";
import { antiProphetTrack } from "./warCollege/antiProphetTrack";
import { internetSkepticTrack } from "./warCollege/internetSkepticTrack";
import { agnosticTrack } from "./warCollege/agnosticTrack";

const TRACK_MAP: Record<AATSAvatarId, WarCollegeTrack> = {
  atheist: atheistTrack,
  muslim: muslimTrack,
  evangelical: evangelicalTrack,
  catholic: catholicTrack,
  jw: jwTrack,
  mormon: mormonTrack,
  bhi: bhiTrack,
  "former-sda": formerSdaTrack,
  "offshoot-sda": offshootSdaTrack,
  jewish: jewishTrack,
  preterist: preteristTrack,
  futurist: futuristTrack,
  "secular-scholar": secularScholarTrack,
  "progressive-christian": progressiveChristianTrack,
  "skeptical-exsda": skepticalExsdaTrack,
  philosopher: philosopherTrack,
  "new-age": newAgeTrack,
  "anti-prophet": antiProphetTrack,
  "internet-skeptic": internetSkepticTrack,
  agnostic: agnosticTrack,
};

export function getWarCollegeTrack(avatarId: AATSAvatarId): WarCollegeTrack {
  return TRACK_MAP[avatarId];
}

export function getAllWarCollegeTracks(): WarCollegeTrack[] {
  return AATS_AVATAR_IDS.map((id) => TRACK_MAP[id]);
}

export * from "./warCollegeTypes";
