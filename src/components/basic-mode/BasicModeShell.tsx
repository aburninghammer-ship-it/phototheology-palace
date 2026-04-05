/**
 * BasicModeShell — Level 1 interface with warm indigo/slate palette
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
    <div className="flex h-screen w-full" style={{ background: "hsl(230 25% 8%)", color: "hsl(220 15% 88%)" }}>
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex items-center justify-between px-4 shrink-0"
          style={{
            borderBottom: "1px solid hsl(230 20% 16%)",
            background: "linear-gradient(90deg, hsl(230 22% 10%), hsl(230 18% 9%))",
          }}>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold" style={{ color: "hsl(230 30% 70%)" }}>Phototheology</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={startTour}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:brightness-125"
              style={{
                background: "hsl(250 45% 45% / 0.18)",
                color: "hsl(250 60% 72%)",
                border: "1px solid hsl(250 45% 45% / 0.3)",
              }}
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
                className="h-7 text-xs bg-transparent"
                style={{
                  borderColor: "hsl(230 20% 25%)",
                  color: "hsl(230 20% 65%)",
                }}
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
          accentColor="indigo-500"
        />
      )}
    </div>
  );
}
