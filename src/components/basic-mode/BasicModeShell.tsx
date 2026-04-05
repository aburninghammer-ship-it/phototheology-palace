/**
 * BasicModeShell — Level 1 interface using the same dark theme as Level 3
 * 3 tabs: Ask Jeeves, Study Bible, Chapel
 * Includes a simplified profile bar (no rooms, floors, gems, etc.)
 */
import { useState, lazy, Suspense } from "react";
import { BasicModeSidebar, type BasicTab } from "./BasicModeSidebar";
import { LevelToggleChip } from "./LevelToggleChip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, Volume2, BookOpen, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BASIC_MODE_TOUR } from "@/data/basicModeTour";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BasicChatTab = lazy(() => import("./tabs/BasicChatTab"));
const BasicBibleTab = lazy(() => import("./tabs/BasicBibleTab"));
const BasicChapelTab = lazy(() => import("./tabs/BasicChapelTab"));

const TAB_COMPONENTS: Record<BasicTab, React.LazyExoticComponent<() => JSX.Element>> = {
  chat: BasicChatTab,
  bible: BasicBibleTab,
  chapel: BasicChapelTab,
};

/** Simplified profile stats for Level 1 */
function useBasicProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["basic-profile", userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, study_streak")
        .eq("id", userId)
        .single();

      // Get reading streak
      const { data: streak } = await supabase
        .from("reading_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .single();

      return {
        displayName: data?.display_name || data?.username || "Scholar",
        avatarUrl: data?.avatar_url || null,
        streak: streak?.current_streak || data?.study_streak || 0,
        initials: (data?.display_name || data?.username || "S").slice(0, 2).toUpperCase(),
      };
    },
  });
}

export function BasicModeShell() {
  const [activeTab, setActiveTab] = useState<BasicTab>("chat");
  const [tourOpen, setTourOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useBasicProfile(user?.id);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  const startTour = () => {
    primeAudioForTour();
    setTourOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Simple profile bar + controls */}
        <header className="h-12 flex items-center justify-between px-4 shrink-0 border-b border-border bg-card/50">
          {/* Left: profile greeting */}
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
                {profile.streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-400" title="Reading streak">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="font-semibold">{profile.streak}</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground" title="Daily reading">
                  <BookOpen className="h-3 w-3" />
                  <span>Daily Reading</span>
                </div>
              </div>
            ) : (
              <h1 className="text-sm font-semibold text-primary">Phototheology</h1>
            )}
          </div>

          {/* Right: controls */}
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
