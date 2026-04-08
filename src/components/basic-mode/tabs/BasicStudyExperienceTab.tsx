/**
 * BasicStudyExperienceTab — Embeds the Study Experience inside the shell tabs
 */
import { useState, useCallback, lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const StudyExperienceContent = lazy(() =>
  import("@/pages/StudyExperience").then((m) => ({
    default: m.StudyExperienceInline ?? m.default,
  }))
);

export default function BasicStudyExperienceTab() {
  return (
    <div className="h-full overflow-y-auto">
      <Suspense fallback={<LoadingScreen />}>
        <StudyExperienceContent />
      </Suspense>
    </div>
  );
}