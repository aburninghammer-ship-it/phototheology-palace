import { Home, BookOpen, Building2, Zap, MoreHorizontal, Crown, Microscope, BrainCircuit, Church, Scroll, X, MessageCircle, User, Users, UserRound, Eye, Scale, GraduationCap, Headphones, Lock, Flame, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { getMinModeForPath, MODE_LABELS } from "@/config/featureRegistry";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getPrimaryNavItems = (mode: string) => {
  // Home route depends on experience level
  const homePath = mode === "immersion" ? "/dashboard" : "/welcome";
  return [
    { icon: Home, labelKey: "common.home", path: homePath },
    { icon: BookOpen, labelKey: "nav.bible", path: "/bible" },
    { icon: Church, labelKey: "nav.church", path: "/living-manna" },
    { icon: Building2, labelKey: "nav.palace", path: "/palace" },
    { icon: Crown, labelKey: "nav.subscribe", path: "/pricing" },
  ];
};

// Items always visible regardless of level
const alwaysVisibleMoreItems = [
  { icon: User, label: "My Profile", path: "/profile" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: MessageCircle, label: "Public Chat", path: "/public-chat" },
];

// Items gated by feature registry
const gatedMoreNavItems = [
  { icon: Headphones, label: "Tour Palace", path: "/palace/tour" },
  { icon: GraduationCap, label: "Test Me", path: "/test-me" },
  { icon: Eye, label: "Prophecy Watch", path: "/prophecy-watch" },
  { icon: Scale, label: "Christ & Culture", path: "/culture-controversy" },
  { icon: Zap, label: "Freestyle", path: "/palace/freestyle" },
  { icon: Crown, label: "COTA Series", path: "/cota-series" },
  { icon: Microscope, label: "Research Mode", path: "/research-mode" },
  { icon: BrainCircuit, label: "Analyze My Thoughts", path: "/analyze-thoughts" },
  { icon: UserRound, label: "Discover", path: "/discover" },
  { icon: Scroll, label: "Bible Studies", path: "/bible-study-series" },
  { icon: UserRound, label: "Characters", path: "/character-profiles" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isAccessible, currentMode } = useFeatureGate();
  const { mode } = useExperienceMode();
  const [showMore, setShowMore] = useState(false);

  const primaryNavItems = useMemo(() => getPrimaryNavItems(mode), [mode]);

  // In basic mode, replace Palace (locked) with Devotional
  const activePrimaryNavItems = useMemo(() => {
    if (currentMode === "basic") {
      return primaryNavItems.map(item =>
        item.path === "/palace"
          ? { icon: Flame, labelKey: "nav.devotional" as const, path: "/devotionals" }
          : item
      );
    }
    return primaryNavItems;
  }, [currentMode]);

  // Combine always-visible items with gated items filtered by access level
  const filteredMoreNavItems = useMemo(
    () => [
      ...alwaysVisibleMoreItems,
      ...gatedMoreNavItems.filter(item => isAccessible(item.path)),
    ],
    [isAccessible],
  );

  if (!user) return null;

  const isWorkspacePane = new URLSearchParams(window.location.search).has('workspace');
  if (isWorkspacePane) return null;

  const hiddenPaths = ["/auth", "/onboarding", "/interactive-demo"];
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) return null;

  const isMoreActive = filteredMoreNavItems.some(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path)
  );

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[59] bg-black/60 md:hidden"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-[72px] left-2 right-2 bg-card border border-border rounded-2xl shadow-xl p-3"
              style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-foreground">More</span>
                <button onClick={() => setShowMore(false)} className="p-1 rounded-full hover:bg-muted">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredMoreNavItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
                        isActive
                          ? "bg-primary/12 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 active:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-background border-t border-border/50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]"
        style={{
          touchAction: 'manipulation',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)'
        }}
      >
        <div className="flex items-center justify-evenly h-[64px] px-2 w-full">
          {activePrimaryNavItems.map((item, idx) => {
            const isHome = idx === 0;
            const isActive = isHome
              ? (location.pathname === item.path || location.pathname === "/dashboard" || location.pathname === "/welcome")
              : (location.pathname === item.path || location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[48px] active:scale-95",
                  isActive
                    ? "text-primary bg-primary/12"
                    : "text-muted-foreground hover:text-foreground active:bg-muted/60"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0",
                  isActive && "text-primary"
                )} />
                <span className={cn(
                  "text-[10px] font-medium leading-tight truncate max-w-[56px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all duration-200 min-w-[56px] min-h-[48px] active:scale-95",
              isMoreActive || showMore
                ? "text-primary bg-primary/12"
                : "text-muted-foreground hover:text-foreground active:bg-muted/60"
            )}
          >
            <MoreHorizontal className={cn(
              "h-5 w-5 shrink-0",
              (isMoreActive || showMore) && "text-primary"
            )} />
            <span className={cn(
              "text-[10px] font-medium leading-tight",
              (isMoreActive || showMore) ? "text-primary" : "text-muted-foreground"
            )}>
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
