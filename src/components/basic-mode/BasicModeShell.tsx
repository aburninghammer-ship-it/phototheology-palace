/**
 * BasicModeShell — Level 1 interface with teal/green palette
 * Distinct from Level 3's dark purple aesthetic
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
    <div className="flex h-screen w-full" style={{ background: "hsl(170 20% 7%)", color: "hsl(170 10% 88%)" }}>
      {/* Left Sidebar */}
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 flex items-center justify-between px-4 shrink-0"
          style={{
            borderBottom: "1px solid hsl(170 20% 15%)",
            background: "linear-gradient(90deg, hsl(170 22% 9%), hsl(170 18% 8%))",
          }}>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold" style={{ color: "hsl(170 20% 65%)" }}>Phototheology</h1>
          </div>
          <div className="flex items-center gap-3">
            <LevelToggleChip />
            {!user && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="h-7 text-xs bg-transparent"
                style={{
                  borderColor: "hsl(170 20% 25%)",
                  color: "hsl(170 20% 65%)",
                }}
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
