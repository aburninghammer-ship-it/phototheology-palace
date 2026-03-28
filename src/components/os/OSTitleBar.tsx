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
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: "linear-gradient(135deg, hsl(32 95% 53%), hsl(270 75% 60%), hsl(210 85% 55%))", boxShadow: "0 0 16px hsl(32 95% 53% / 0.3)" }}>
          <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-sm" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, hsl(32 95% 58%), hsl(350 80% 60%), hsl(280 70% 65%), hsl(210 85% 60%), hsl(160 70% 50%))" }}>
            PhototheologyOS
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, hsl(145 70% 50%), hsl(170 65% 55%))" }}>
              Eden
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "hsl(145 70% 50%)" }} />
            <span className="text-[8px] text-muted-foreground/60 font-medium tracking-wider uppercase whitespace-nowrap">
              Powered by AI · Biblical Intelligence
            </span>
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
