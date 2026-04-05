/**
 * ExplorerModeShell — Level 2 interface
 * Includes Level 1 tabs (Ask Jeeves, Study Bible, Chapel) + 4 Spaces tabs
 */
import { useState, lazy, Suspense } from "react";
import { ExplorerModeSidebar, type ExplorerTab } from "./ExplorerModeSidebar";
import { LevelToggleChip } from "@/components/basic-mode/LevelToggleChip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, Volume2, BookOpen, Flame, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BASIC_MODE_TOUR } from "@/data/basicModeTour";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BasicChatTab = lazy(() => import("@/components/basic-mode/tabs/BasicChatTab"));
const BasicBibleTab = lazy(() => import("@/components/basic-mode/tabs/BasicBibleTab"));
const BasicChapelTab = lazy(() => import("@/components/basic-mode/tabs/BasicChapelTab"));
const ExplorerSpaceTab = lazy(() => import("./ExplorerSpaceTab"));
const ExplorerPalaceTab = lazy(() => import("./ExplorerPalaceTab"));

function useExplorerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["explorer-profile", userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", userId)
        .single();
      const { data: streak } = await supabase
        .from("reading_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .single();
      return {
        displayName: data?.display_name || data?.username || "Explorer",
        avatarUrl: data?.avatar_url || null,
        streak: streak?.current_streak || 0,
        initials: (data?.display_name || data?.username || "E").slice(0, 2).toUpperCase(),
      };
    },
  });
}

export function ExplorerModeShell() {
  const [activeTab, setActiveTab] = useState<ExplorerTab>("chat");
  const [tourOpen, setTourOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useExplorerProfile(user?.id);

  const startTour = () => {
    primeAudioForTour();
    setTourOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <BasicChatTab />;
      case "bible":
        return <BasicBibleTab />;
      case "chapel":
        return <BasicChapelTab />;
      case "palace":
        return <ExplorerPalaceTab />;
      case "games-space":
      case "university-space":
        return <ExplorerSpaceTab spaceId={activeTab} />;
      default:
        return <BasicChatTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <ExplorerModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Profile bar */}
        <header className="h-12 flex items-center justify-between px-4 shrink-0 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            {user && profile ? (
              <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName} />
                  <AvatarFallback className="text-[10px] bg-primary/15 text-primary font-bold">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                  {profile.displayName}
                </span>
                {(profile.streak ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-400" title="Reading streak">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="font-semibold">{profile.streak}</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <Compass className="h-3 w-3" />
                  <span>Explorer Mode</span>
                </div>
              </div>
            ) : (
              <h1 className="text-sm font-semibold text-primary">Phototheology</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startTour}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:brightness-125 bg-primary/10 text-primary border border-primary/20"
            >
              <Volume2 className="h-3 w-3" />
              <span className="hidden sm:inline">Audio Tour</span>
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
            {renderContent()}
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
