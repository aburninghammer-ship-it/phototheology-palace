/**
 * BasicModeShell — Level 1 interface using the same dark theme as Level 3
 * 3 tabs: Ask Jeeves, Study Bible, Chapel
 * Desktop: sidebar + header. Mobile: fullscreen content + bottom tabs.
 */
import { useState, lazy, Suspense } from "react";
import { BasicModeSidebar, type BasicTab } from "./BasicModeSidebar";
import { LevelToggleChip } from "./LevelToggleChip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { Button } from "@/components/ui/button";
import { LogIn, Volume2, BookOpen, Flame, Users } from "lucide-react";
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
        .select("display_name, username, avatar_url")
        .eq("id", userId)
        .single();

      const { data: streak } = await supabase
        .from("reading_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .single();

      return {
        displayName: data?.display_name || data?.username || "Scholar",
        avatarUrl: data?.avatar_url || null,
        streak: streak?.current_streak || 0,
        initials: (data?.display_name || data?.username || "S").slice(0, 2).toUpperCase(),
      };
    },
  });
}

export function BasicModeShell() {
  const [activeTab, setActiveTab] = useState<BasicTab>("chat");
  const [tourOpen, setTourOpen] = useState(false);
  const { user } = useAuth();
  const { activeCount } = useActiveUsers();
  const navigate = useNavigate();
  const { data: profile } = useBasicProfile(user?.id);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  const startTour = () => {
    primeAudioForTour();
    setTourOpen(true);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <BasicModeSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — compact on mobile */}
        <header className="h-11 md:h-12 flex items-center justify-between px-3 md:px-4 shrink-0 border-b border-border bg-card/50">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            {user && profile ? (
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-6 w-6 md:h-7 md:w-7 shrink-0">
                  <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName} />
                  <AvatarFallback className="text-[9px] md:text-[10px] bg-primary/15 text-primary font-bold">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs md:text-sm font-medium text-foreground truncate max-w-[100px] sm:max-w-none">
                  {profile.displayName}
                </span>
                {(profile.streak ?? 0) > 0 && (
                  <div className="flex items-center gap-0.5 text-xs text-amber-400 shrink-0" title="Reading streak">
                    <Flame className="h-3 w-3 md:h-3.5 md:w-3.5" />
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

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <button
              onClick={startTour}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all hover:brightness-125 bg-primary/10 text-primary border border-primary/20"
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
                <LogIn className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </header>

        {/* Main content — on mobile, add bottom padding for the tab bar */}
        <main className="flex-1 overflow-hidden pb-[62px] md:pb-0">
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
