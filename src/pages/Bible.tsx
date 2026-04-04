import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { AtAGlanceSidebar } from "@/components/bible/AtAGlanceSidebar";
import { Button } from "@/components/ui/button";
import { BookMarked, HelpCircle, Headphones, FlaskConical, PanelLeft, GraduationCap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { StudyBibleDemoDialog } from "@/components/bible/StudyBibleDemoDialog";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/bible/OfflineIndicator";
import { usePreservePage } from "@/hooks/usePreservePage";
import { ResearchModeLayout } from "@/components/bible/ResearchModeLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { BibleTabTutorial } from "@/components/bible/BibleTabTutorial";


const Bible = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [demoOpen, setDemoOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Auto-close sidebar on mobile, auto-open on desktop
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const [searchParams, setSearchParams] = useSearchParams();
  const researchMode = searchParams.get("mode") === "research";

  const setResearchMode = (enabled: boolean) => {
    if (enabled) {
      setSearchParams({ mode: "research" });
    } else {
      setSearchParams({});
    }
  };

  const primeAudio = () => {
    const audio = new Audio();
    audio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA";
    audio.volume = 0.01;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {});
  };
  
  // Enable scroll position preservation for this page
  usePreservePage();

  // Research Mode - Full screen multi-panel layout
  if (researchMode) {
    return <ResearchModeLayout onExitResearchMode={() => setResearchMode(false)} />;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-2 sm:pt-4 pb-24 md:pb-16 px-2 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">

          {/* Header - Glass Card */}
          <div className="glass-card mb-4 sm:mb-8 p-3 sm:p-6 rounded-xl sm:rounded-2xl">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/pwa-192x192.png" 
                  alt="Phototheology" 
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl shadow-lg shadow-primary/20"
                />
                <div>
                  <h1 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-palace bg-clip-text text-transparent">
                    {t('bible.title', 'Phototheology Study Bible (PSB)')}
                  </h1>
                  <p className="text-sm sm:text-lg text-muted-foreground">
                    {t('bible.subtitle', 'Scripture through principle lenses')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => {
                    primeAudio();
                    setTutorialOpen(true);
                  }}
                  data-tutorial="bible-tutorial-btn"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Guided Tour</span>
                  <span className="sm:hidden">Tour</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  data-tutorial="at-a-glance-btn"
                >
                  <PanelLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('bible.atAGlance', 'At a Glance')}</span>
                  <span className="sm:hidden">{t('bible.atAGlanceShort', 'Books')}</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setResearchMode(true)}
                  data-tutorial="research-mode-btn"
                >
                  <FlaskConical className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('bible.researchMode', 'Research Mode')}</span>
                  <span className="sm:hidden">{t('bible.researchModeShort', 'Research')}</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setDemoOpen(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('bible.howToUse', 'How to Use')}</span>
                  <span className="sm:hidden">{t('bible.help', 'Help')}</span>
                </Button>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap">
                  <Link to="/memorization-verses" data-tutorial="memorization-btn">
                    <BookMarked className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('bible.myMemorizationVerses', 'My Memorization Verses')}</span>
                    <span className="sm:hidden">{t('bible.memorization', 'Memorization')}</span>
                  </Link>
                </Button>
                <Button asChild className="bg-primary/90 hover:bg-primary text-primary-foreground whitespace-nowrap">
                  <Link to="/audio-bible" data-tutorial="audio-bible-btn">
                    <Headphones className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('bible.audioBibleCommentary', 'Audio Bible & Commentary')}</span>
                    <span className="sm:hidden">{t('bible.listen', 'Listen')}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <StudyBibleDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />

          {tutorialOpen && (
            <BibleTabTutorial onClose={() => setTutorialOpen(false)} />
          )}

          {user && (
            <VoiceChatWidget
              roomType="bible"
              roomId="study"
              className="mb-6"
            />
          )}

          {/* Main content with optional sidebar */}
          <div className="flex gap-0 relative">
            {/* At a Glance Sidebar - overlay on mobile, inline on desktop */}
            {sidebarOpen && isMobile && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
                <div className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-background shadow-xl overflow-hidden">
                  <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
                </div>
              </>
            )}
            {sidebarOpen && !isMobile && (
              <div className="w-56 lg:w-64 shrink-0 h-[calc(100vh-220px)] sticky top-24 rounded-xl border border-border/50 overflow-hidden shadow-lg">
                <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            )}

            <div className={`flex-1 min-w-0 ${sidebarOpen && !isMobile ? 'pl-4' : ''}`}>
              {/* Navigation */}
              <div className="mb-6 sm:mb-8 bible-navigation-area">
                <BibleNavigation />
              </div>

              {/* Bible Reader */}
              <div className="bible-reader-area">
                <BibleReader />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <OfflineIndicator />
    </div>
  );
};

export default Bible;
