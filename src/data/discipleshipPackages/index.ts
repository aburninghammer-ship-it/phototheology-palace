export type { DiscipleshipPackage, PackageWeek } from "./types";
export { PRAYER_PACKAGE } from "./prayerPackage";
export { STUDYING_PACKAGE } from "./studyingPackage";
export { WITNESS_PACKAGE } from "./witnessPackage";

import { PRAYER_PACKAGE } from "./prayerPackage";
import { STUDYING_PACKAGE } from "./studyingPackage";
import { WITNESS_PACKAGE } from "./witnessPackage";
import type { DiscipleshipPackage } from "./types";

export const ALL_PACKAGES: DiscipleshipPackage[] = [
  PRAYER_PACKAGE,
  STUDYING_PACKAGE,
  WITNESS_PACKAGE,
];
