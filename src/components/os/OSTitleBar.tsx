import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, User, LogOut, Settings, Languages, MessageCircle } from "lucide-react";
import { useDirectMessages } from "@/hooks/useDirectMessages";
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
  const { conversations } = useDirectMessages();
  const chatUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

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
            background: "linear-gradient(135deg, hsl(40 75% 55%), hsl(30 70% 45%))",
            boxShadow: "0 2px 12px hsl(40 75% 50% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.2)"
          }}>
          <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-sm" />
        </div>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[14px] whitespace-nowrap"
              style={{ 
                fontFamily: "'Cinzel', serif", 
                fontWeight: 700,
                color: "hsl(38 65% 65%)",
                letterSpacing: "0.04em"
              }}>
              PHOTOTHEOLOGY
            </span>
            <span className="text-[10px] whitespace-nowrap rounded-[3px] px-1 py-[1px]"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 700,
                color: "hsl(35 60% 60%)",
                background: "hsl(38 60% 55% / 0.12)",
                border: "1px solid hsl(38 60% 55% / 0.2)",
                letterSpacing: "0.08em"
              }}>
              OS
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-[2px]">
            <span className="text-[8px] whitespace-nowrap"
              style={{ 
                fontFamily: "'Cinzel', serif", 
                fontWeight: 600,
                color: "hsl(40 50% 70%)",
                letterSpacing: "0.18em",
                textTransform: "uppercase"
              }}>
              Eden
            </span>
            <span className="w-[3px] h-[3px] rounded-full" style={{ background: "hsl(38 65% 60%)" }} />
            <span className="text-[7px] whitespace-nowrap"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 500,
                color: "hsl(35 20% 65% / 0.6)",
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
          <div className="hidden lg:flex items-center gap-1.5 px-3 h-8 rounded-full bg-background/90 border border-border/50 text-foreground text-xs font-medium shadow-md backdrop-blur-sm">
            <Users className="h-4 w-4" style={{ color: "hsl(210 90% 60%)" }} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tabular-nums">{activeCount}</span>
              <span className="text-[9px] text-muted-foreground -mt-0.5">online</span>
            </div>
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

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => window.dispatchEvent(new CustomEvent('open-chat-sidebar', { detail: {} }))}
        >
          <MessageCircle className="h-5 w-5" />
          {chatUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {chatUnread > 9 ? '9+' : chatUnread}
            </Badge>
          )}
        </Button>
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
