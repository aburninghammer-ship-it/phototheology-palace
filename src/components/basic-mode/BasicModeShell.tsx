/**
 * BasicModeShell — Level 1 interface using the same dark theme as Level 3
 * 3 tabs: Ask Jeeves, Study Bible, Chapel
 */
import { useState, lazy, Suspense } from "react";
import { BasicModeSidebar, type BasicTab } from "./BasicModeSidebar";
import { LevelToggleChip } from "./LevelToggleChip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BASIC_MODE_TOUR } from "@/data/basicModeTour";

const BasicChatTab = lazy(() => import("./tabs/BasicChatTab"));
const BasicBibleTab = lazy(() => import("./tabs/BasicBibleTab"));
const BasicChapelTab = lazy(() => import("./tabs/BasicChapelTab"));

const TAB_COMPONENTS: Record<BasicTab, React.LazyExoticComponent<() => JSX.Element>> = {
  chat: BasicChatTab,
  bible: BasicBibleTab,
  chapel: BasicChapelTab,
};

export function BasicModeShell() {
  const [activeTab, setActiveTab] = useState<BasicTab>("chat");
  const [tourOpen, setTourOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  const startTour = () => {
    primeAudioForTour();
    setTourOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex items-center justify-between px-4 shrink-0 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-primary">Phototheology</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={startTour}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:brightness-125 bg-primary/10 text-primary border border-primary/20"
            >
              <Volume2 className="h-3 w-3" />
              Audio Tour
            </button>
            <div data-tour="level-chip">
              <LevelToggleChip />
            </div>
            {!user && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="h-7 text-xs"
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Sign In
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingScreen />}>
            <ActiveComponent />
          </Suspense>
        </main>
      </div>

      {tourOpen && (
        <GuidedTourOverlay
          steps={BASIC_MODE_TOUR}
          onClose={() => setTourOpen(false)}
          accentColor="primary"
        />
      )}
    </div>
  );
}
