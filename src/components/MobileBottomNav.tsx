import { Home, BookOpen, Building2, Lightbulb, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: BookOpen, label: "Bible", path: "/bible" },
  { icon: MessageCircle, label: "Chat", path: "/public-chat" },
  { icon: Lightbulb, label: "Thoughts", path: "/analyze-thoughts" },
  { icon: Building2, label: "Palace", path: "/palace" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show on landing page or auth pages when not logged in
  if (!user) return null;

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
      <div className="flex items-center justify-around h-[72px] px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[56px] active:scale-95",
                isActive
                  ? "text-primary bg-primary/12 shadow-sm"
                  : "text-muted-foreground hover:text-foreground active:bg-muted/60"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-transform duration-200",
                isActive && "text-primary scale-110"
              )} />
              <span className={cn(
                "text-[11px] font-semibold tracking-tight",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
