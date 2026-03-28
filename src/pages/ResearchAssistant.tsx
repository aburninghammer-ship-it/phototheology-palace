import { useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { ResearchAssistantWidget } from "@/components/dashboard/ResearchAssistantWidget";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { RESEARCH_ASSISTANT_TOUR } from "@/data/guidedTours";

export default function ResearchAssistant() {
  const { preferences } = useUserPreferences();
  const [searchParams] = useSearchParams();
  const resumeStudyId = searchParams.get("resume") || undefined;
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="min-h-screen gradient-dreamy">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 pb-32 md:pb-8 max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
            <GraduationCap className="h-4 w-4" /> Guided Tour
          </Button>
        </div>
        {tourOpen && <GuidedTourOverlay steps={RESEARCH_ASSISTANT_TOUR} onClose={() => setTourOpen(false)} />}
        <ResearchAssistantWidget defaultExpanded resumeStudyId={resumeStudyId} />
      </div>
    </div>
  );
}

