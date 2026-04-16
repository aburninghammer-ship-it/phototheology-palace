/**
 * BasicStudyExperienceTab — Study Experience embedded inside shell tabs
 */
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const StudyExperience = lazy(() => import("@/pages/StudyExperience"));

export default function BasicStudyExperienceTab() {
  return (
    <div className="h-full overflow-y-auto [&>div]:min-h-0">
      <Suspense fallback={<LoadingScreen />}>
        <StudyExperienceEmbedded />
      </Suspense>
    </div>
  );
}

/**
 * Renders StudyExperience page content without its own Nav/Footer.
 * We achieve this by rendering it and hiding the full-page chrome via CSS.
 */
function StudyExperienceEmbedded() {
  return (
    <div className="study-experience-embedded [&_.min-h-screen]:min-h-0 [&>div>div:first-child]:hidden [&>div>div:nth-child(2)]:hidden [&>div>nav]:hidden [&>div>footer]:hidden">
      <StudyExperience />
    </div>
  );
}