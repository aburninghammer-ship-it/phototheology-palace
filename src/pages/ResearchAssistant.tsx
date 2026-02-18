import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { ResearchAssistantWidget } from "@/components/dashboard/ResearchAssistantWidget";

export default function ResearchAssistant() {
  const { preferences } = useUserPreferences();

  return (
    <div className="min-h-screen gradient-dreamy">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 pb-32 md:pb-8 max-w-4xl">
        <ResearchAssistantWidget defaultExpanded />
      </div>
    </div>
  );
}
