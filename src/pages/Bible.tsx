import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { Button } from "@/components/ui/button";
import { BookMarked, HelpCircle, Headphones, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { StudyBibleDemoDialog } from "@/components/bible/StudyBibleDemoDialog";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/bible/OfflineIndicator";
import { usePreservePage } from "@/hooks/usePreservePage";
import { ResearchModeLayout } from "@/components/bible/ResearchModeLayout";

const Bible = () => {
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [researchMode, setResearchMode] = useState(false);
  
  // Enable scroll position preservation for this page
  usePreservePage();

  // Research Mode - Full screen multi-panel layout
  if (researchMode) {
    return <ResearchModeLayout onExitResearchMode={() => setResearchMode(false)} />;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-4 pb-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header - Glass Card */}
          <div className="glass-card mb-8 p-6 rounded-2xl">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/pwa-192x192.png" 
                  alt="Phototheology" 
                  className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
                />
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
                    Phototheology Study Bible (PSB)
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Scripture through principle lenses
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setResearchMode(true)}
                >
                  <FlaskConical className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Research Mode</span>
                  <span className="sm:hidden">Research</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setDemoOpen(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">How to Use</span>
                  <span className="sm:hidden">Help</span>
                </Button>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap">
                  <Link to="/memorization-verses">
                    <BookMarked className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">My Memorization Verses</span>
                    <span className="sm:hidden">Memorization</span>
                  </Link>
                </Button>
                <Button asChild className="bg-primary/90 hover:bg-primary text-primary-foreground whitespace-nowrap">
                  <Link to="/audio-bible">
                    <Headphones className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Audio Bible & Commentary</span>
                    <span className="sm:hidden">Listen</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <StudyBibleDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />

          {user && (
            <VoiceChatWidget
              roomType="bible"
              roomId="study"
              className="mb-6"
            />
          )}

          {/* Navigation */}
          <div className="mb-6 sm:mb-8">
            <BibleNavigation />
          </div>

          {/* Bible Reader */}
          <BibleReader />
        </div>
      </div>
      
      <OfflineIndicator />
    </div>
  );
};

export default Bible;
