export type { TourSegment, TourDefinition } from "./types";
export { buildAllSegments, getTotalSeconds } from "./types";
export { PSALM_23_TOUR } from "./psalm23Tour";
export { PHILIPPIANS_2_5_TOUR } from "./philippians2Tour";

import { PSALM_23_TOUR } from "./psalm23Tour";
import { PHILIPPIANS_2_5_TOUR } from "./philippians2Tour";
import type { TourDefinition } from "./types";

export const ALL_TOURS: TourDefinition[] = [
  PSALM_23_TOUR,
  PHILIPPIANS_2_5_TOUR,
];
