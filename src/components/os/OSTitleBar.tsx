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
            background: "linear-gradient(135deg, hsl(220 60% 50% / 0.25), hsl(270 50% 55% / 0.2))",
            backdropFilter: "blur(12px)",
            border: "1px solid hsl(220 60% 80% / 0.15)",
            boxShadow: "0 2px 12px hsl(220 60% 50% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)"
          }}>
          <Sparkles className="h-3.5 w-3.5 drop-shadow-sm" style={{ color: "hsl(220 80% 75%)" }} />
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span className="text-[14px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Outfit', sans-serif", 
                fontWeight: 800,
                backgroundImage: "linear-gradient(120deg, hsl(0 0% 95% / 0.95), hsl(220 30% 85% / 0.8), hsl(0 0% 90% / 0.7))",
                letterSpacing: "-0.01em"
              }}>
              Phototheology
            </span>
            <span className="text-[11px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontWeight: 700,
                backgroundImage: "linear-gradient(120deg, hsl(220 80% 72%), hsl(270 60% 72%))",
                letterSpacing: "0.02em"
              }}>
              OS
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-[1px]">
            <span className="text-[8px] whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontWeight: 500,
                backgroundImage: "linear-gradient(90deg, hsl(160 60% 60%), hsl(190 55% 58%))",
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}>
              Eden
            </span>
            <span className="w-[3px] h-[3px] rounded-full" style={{ background: "hsl(160 60% 60% / 0.6)" }} />
            <span className="text-[7px] whitespace-nowrap"
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontWeight: 500,
                color: "hsl(220 20% 70% / 0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase"
              }}>
              Powered by AI. Built for Biblical Intelligence.
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
