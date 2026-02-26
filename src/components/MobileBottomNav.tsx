import { Home, BookOpen, Building2, MessageCircle, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItemDefs = [
  { icon: Home, labelKey: "common.home", path: "/dashboard" },
  { icon: BookOpen, labelKey: "nav.bible", path: "/bible" },
  { icon: MessageCircle, labelKey: "nav.chat", path: "/public-chat" },
  { icon: Zap, labelKey: "nav.freestyle", path: "/palace/freestyle" },
  { icon: Building2, labelKey: "nav.palace", path: "/palace" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Don't show on landing page or auth pages when not logged in
  if (!user) return null;

  // Hide inside workspace iframe panes
  const isWorkspacePane = new URLSearchParams(window.location.search).has('workspace');
  if (isWorkspacePane) return null;

  // Don't show on certain pages
  const hiddenPaths = ["/auth", "/onboarding", "/interactive-demo"];
  if (hiddenPaths.some(path => location.pathname.startsWith(path))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]"
      style={{
        touchAction: 'manipulation',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)'
      }}
    >
      <div className="flex items-center justify-evenly h-[64px] px-2 w-full">
        {navItemDefs.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

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
      </div>
    </nav>
  );
}
