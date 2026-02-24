export { PALACE_PRINCIPLES } from "./types";
export type { StudyContent, Question, PrincipleApplication } from "./types";

export { STUDIES_01_06 } from "./studies01-06";
export { STUDIES_07_12 } from "./studies07-12";
export { STUDIES_13_18 } from "./studies13-18";
export { STUDIES_19_24 } from "./studies19-24";
export { STUDIES_25_28 } from "./studies25-28";

import { STUDIES_01_06 } from "./studies01-06";
import { STUDIES_07_12 } from "./studies07-12";
import { STUDIES_13_18 } from "./studies13-18";
import { STUDIES_19_24 } from "./studies19-24";
import { STUDIES_25_28 } from "./studies25-28";

export const ALL_STUDIES = [
  ...STUDIES_01_06,
  ...STUDIES_07_12,
  ...STUDIES_13_18,
  ...STUDIES_19_24,
  ...STUDIES_25_28,
];
