import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, User, LogOut, Settings, Languages } from "lucide-react";
import { CommandPaletteTrigger } from "./CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShareableProgressCard } from "@/components/ShareableProgressCard";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { StartSessionDialog } from "@/components/session/StartSessionDialog";
import { NavigationStyleToggle } from "@/components/NavigationStyleToggle";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Radio, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePresenceTracker } from "@/hooks/usePresenceTracker";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { Users } from "lucide-react";

export function OSTitleBar() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeCount } = useActiveUsers();

  const publicPaths = ["/", "/landing", "/auth", "/pricing", "/interactive-demo", "/comparison", "/privacy-policy", "/terms-of-service"];
  const isPublicPage = publicPaths.some(p => location.pathname === p) || location.pathname.startsWith("/auth");
  const isWorkspacePane = new URLSearchParams(window.location.search).has('workspace');

  if (!user || isPublicPage || isWorkspacePane || isMobile) return null;

  const initials = user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="h-11 flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl border-b border-border/40 shrink-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ 
            background: "linear-gradient(135deg, hsl(32 95% 55%), hsl(320 80% 55%), hsl(260 75% 58%))",
            boxShadow: "0 2px 14px hsl(320 80% 55% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.2)"
          }}>
          <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-sm" />
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span className="text-[14px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Sora', sans-serif", 
                fontWeight: 800,
                backgroundImage: "linear-gradient(100deg, hsl(32 95% 62%), hsl(350 85% 62%), hsl(310 75% 65%), hsl(260 80% 68%), hsl(210 90% 62%))",
                letterSpacing: "-0.01em"
              }}>
              Phototheology
            </span>
            <span className="text-[11px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Sora', sans-serif", 
                fontWeight: 600,
                backgroundImage: "linear-gradient(100deg, hsl(180 70% 55%), hsl(150 75% 50%))",
                letterSpacing: "0.03em"
              }}>
              OS
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-[2px]">
            <span className="text-[8px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 500,
                backgroundImage: "linear-gradient(90deg, hsl(145 70% 55%), hsl(180 65% 55%))",
                letterSpacing: "0.14em",
                textTransform: "uppercase"
              }}>
              Eden
            </span>
            <span className="w-[3px] h-[3px] rounded-full" style={{ background: "linear-gradient(135deg, hsl(32 90% 60%), hsl(350 80% 60%))" }} />
            <span className="text-[7px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 500,
                backgroundImage: "linear-gradient(90deg, hsl(220 60% 70% / 0.7), hsl(280 50% 70% / 0.6))",
                letterSpacing: "0.06em",
                textTransform: "uppercase"
              }}>
              Powered by AI. Built for Biblical Intelligence.
            </span>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-sm mx-4">
        <CommandPaletteTrigger className="w-full justify-center text-[11px]" />
      </div>

      {/* Right: Utility Toolbar */}
      <div className="flex items-center gap-1">
        {activeCount > 0 && (
          <div className="hidden lg:flex items-center gap-1 px-2 h-8 rounded-xl border border-border/60 bg-muted/30 text-foreground/80 text-xs font-medium shadow-sm">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>{activeCount} online</span>
          </div>
        )}
        <ShareableProgressCard />
        <PWAInstallButton />
        <ThemeToggle />

        <Button asChild variant="ghost" size="sm" className="hidden lg:flex gap-1.5 h-8 px-2 text-xs" style={{ color: "hsl(0 85% 60%)" }}>
          <Link to="/live-demo">
            <Radio className="h-3.5 w-3.5" style={{ color: "hsl(0 85% 60%)" }} />
            Live
          </Link>
        </Button>

        <Button asChild variant="ghost" size="sm" className="hidden lg:flex gap-1.5 h-8 px-2 text-xs" style={{ color: "hsl(210 85% 60%)" }}>
          <Link to="/workspace">
            <Globe className="h-3.5 w-3.5" style={{ color: "hsl(210 85% 60%)" }} />
            Workspace
          </Link>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden lg:flex gap-1.5 h-8 px-2 text-xs border border-border/50 bg-muted/20 hover:bg-muted/40" style={{ color: "hsl(270 75% 65%)" }}>
              <Languages className="h-3.5 w-3.5" style={{ color: "hsl(270 75% 65%)" }} />
              Language
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <LanguageSelector showLabel={false} />
          </PopoverContent>
        </Popover>

        <NotificationCenter />
        <StartSessionDialog />
        <NavigationStyleToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-lg hover:bg-muted transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-semibold bg-primary/15 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/my-profile")}>
              <User className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
