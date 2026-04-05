/**
 * BasicModeShell — ChatGPT-style interface for Level 1 (Basic) users
 * Dark, clean, minimal. Left sidebar tabs + main content area.
 */
import { useState, lazy, Suspense } from "react";
import { BasicModeSidebar, type BasicTab } from "./BasicModeSidebar";
import { LevelToggleChip } from "./LevelToggleChip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Lazy load tab content
const BasicChatTab = lazy(() => import("./tabs/BasicChatTab"));
const BasicBibleTab = lazy(() => import("./tabs/BasicBibleTab"));
const BasicAudioTab = lazy(() => import("./tabs/BasicAudioTab"));
const BasicPlansTab = lazy(() => import("./tabs/BasicPlansTab"));
const BasicMorningTab = lazy(() => import("./tabs/BasicMorningTab"));
const BasicNightTab = lazy(() => import("./tabs/BasicNightTab"));
const BasicDevotionalTab = lazy(() => import("./tabs/BasicDevotionalTab"));

const TAB_COMPONENTS: Record<BasicTab, React.LazyExoticComponent<() => JSX.Element>> = {
  chat: BasicChatTab,
  bible: BasicBibleTab,
  audio: BasicAudioTab,
  plans: BasicPlansTab,
  morning: BasicMorningTab,
  night: BasicNightTab,
  devotional: BasicDevotionalTab,
};

export function BasicModeShell() {
  const [activeTab, setActiveTab] = useState<BasicTab>("chat");
  const { user } = useAuth();
  const navigate = useNavigate();

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex h-screen w-full bg-[hsl(220,13%,10%)] text-[hsl(220,10%,90%)]">
      {/* Left Sidebar */}
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 flex items-center justify-between px-4 border-b border-[hsl(220,10%,18%)] bg-[hsl(220,13%,12%)] shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-[hsl(220,10%,75%)]">Phototheology</h1>
          </div>
          <div className="flex items-center gap-3">
            <LevelToggleChip />
            {!user && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="h-7 text-xs border-[hsl(220,10%,25%)] bg-transparent text-[hsl(220,10%,70%)] hover:bg-[hsl(220,10%,18%)]"
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Sign In
              </Button>
            )}
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingScreen />}>
            <ActiveComponent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
