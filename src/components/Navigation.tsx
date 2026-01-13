import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image, Search, Video, Sword, Crown, Shield, Brain, Lightbulb, Zap, Trophy, MessageSquare, Target, StickyNote, Radio, Church, GraduationCap, Award, Gamepad2, BarChart3, Archive, Library, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { EnhancedMobileDrawer } from "@/components/EnhancedMobileDrawer";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
import { NavigationStyleToggle } from "@/components/NavigationStyleToggle";
import { ReturnToPathBanner } from "@/components/path/ReturnToPathBanner";
import { SessionModeIndicator } from "@/components/session/SessionModeIndicator";
import { BackButton } from "@/components/BackButton";
import { SessionStartButton } from "@/components/session/SessionStartButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const { user, signOut, loading } = useAuth();
  const { activeCount } = useActiveUsers();
  const { isAdmin } = useIsAdmin();
  const { isMember: isChurchMember, churchId, role: churchRole } = useChurchMembership();
  const { toggleSidebar } = useSidebar();
  const { conversations } = useDirectMessagesContext();
  const location = useLocation();

  const navRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(64);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const getBannerHeight = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--app-top-banner-height");
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : 0;
    };

    const update = () => {
      const navH = Math.ceil(el.getBoundingClientRect().height);
      const total = navH + getBannerHeight();
      setHeaderHeight(total);
      document.documentElement.style.setProperty("--app-header-height", `${total}px`);
    };

    update();

    window.addEventListener("app:topBannerResize", update);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("app:topBannerResize", update);
      };
    }

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      window.removeEventListener("app:topBannerResize", update);
      ro.disconnect();
    };
  }, [user, loading]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  // Helper to check if a path is active
  const isActiveTab = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  // Don't render logged-out view while still checking auth
  if (loading) {
    return (
      <>
        <nav
          ref={navRef}
          style={{ top: "var(--app-top-banner-height, 0px)" }}
          className="fixed left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm pt-[env(safe-area-inset-top)]"
        >
          <div className="w-full px-4">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <Building2 className="h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110" />
                  <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
                </div>
                <span className="font-serif text-xl font-semibold bg-gradient-palace bg-clip-text text-transparent">
                  Phototheology
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <PWAInstallButton />
              </div>
            </div>
          </div>
        </nav>
        <div aria-hidden style={{ height: headerHeight }} />
      </>
    );
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{ top: "var(--app-top-banner-height, 0px)" }}
        className="fixed left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm pt-[env(safe-area-inset-top)]"
      >
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <BackButton />
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <Building2 className="h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110" />
                  <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
                </div>
                <span className="font-serif text-xl font-semibold bg-gradient-palace bg-clip-text text-transparent">
                  Phototheology
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
              <GlobalSearch />
              <PWAInstallButton />
              <ThemeToggle />

              {/* Admin-only Live Demo Link */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden md:flex text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Link to="/live-demo">
                    <Radio className="h-4 w-4 mr-1" />
                    <span>Live</span>
                  </Link>
                </Button>
              )}

              {/* Church Admin Link - only for church admins */}
              {user && churchRole === "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden md:flex text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                >
                  <Link to="/church-admin">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>Church Admin</span>
                  </Link>
                </Button>
              )}

              {/* Live User Count - Always Visible */}
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">{activeCount}</span>
                <span className="text-xs text-green-600/80">online</span>
              </div>
              
              {user && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSidebar()}
                    className="relative"
                    aria-label="Open chat"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Chat</span>
                    {totalUnread > 0 && (
                      <Badge 
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {totalUnread > 9 ? '9+' : totalUnread}
                      </Badge>
                    )}
                  </Button>

                  {/* Session Mode Controls */}
                  <div className="hidden sm:flex items-center gap-2">
                    <SessionModeIndicator />
                    <SessionStartButton />
                  </div>

                  <NavigationStyleToggle />

                  <NotificationCenter />
                </>
              )}

              {user ? (
                <>
                  {/* Mobile Navigation */}
                  <div className="md:hidden">
                    <EnhancedMobileDrawer />
                  </div>

                  {/* User Menu - Desktop Only */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="hidden md:flex gradient-palace whitespace-nowrap">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/palace" className="cursor-pointer">
                          <Building2 className="h-4 w-4 mr-2" />
                          Enter Palace
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/pricing" className="cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Enter App Button for logged-out users */}
                  <Button asChild className="gradient-palace whitespace-nowrap">
                    <Link to="/auth">Enter App</Link>
                  </Button>
                  
                  {/* Desktop Navigation for logged-out users - Horizontal Scroll */}
                  <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-2xl">
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/palace">Palace</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/bible">Bible</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/games">Games</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/memory">
                        <Brain className="h-4 w-4 mr-1" />
                        Memory
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap">
                          <Building2 className="h-4 w-4 mr-1" />
                          Blueprints
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-marriage" className="cursor-pointer">
                            💍 Dating & Marriage
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-grief" className="cursor-pointer">
                            💙 Grieving
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-stronghold" className="cursor-pointer">
                            🛡️ Breaking Strongholds
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-weight-loss" className="cursor-pointer">
                            ⚖️ Weight Loss
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-mental-health" className="cursor-pointer">
                            🧠 Mental Health
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-financial" className="cursor-pointer">
                            💰 Financial Stability
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-stress" className="cursor-pointer">
                            🧘 Stress Management
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap">
                          <Sparkles className="h-4 w-4 mr-1" />
                          GPTs
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/phototheologygpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Phototheology GPT
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/branch-study" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            BranchStudy
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/kidgpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Kid GPT
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/daniel-revelation-gpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Daniel & Revelation GPT
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/apologetics-gpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Apologetics GPT
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/courses">Courses</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/pricing">Pricing</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Secondary Navigation Tabs - Logged in users only */}
          {user && (
            <div className="hidden md:flex items-center justify-center gap-1 py-2 border-t border-border/50 overflow-x-auto scrollbar-hide">
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/mastery" || location.pathname.startsWith("/mastery") ? "bg-accent" : ""}`}>
                <Link to="/mastery">
                  <Crown className="h-3.5 w-3.5 mr-1.5" />
                  Mastery
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/bible" || location.pathname.startsWith("/bible") ? "bg-accent" : ""}`}>
                <Link to="/bible">
                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                  Study Bible
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/study-buddy" ? "bg-accent" : ""}`}>
                <Link to="/study-buddy">
                  <Brain className="h-3.5 w-3.5 mr-1.5" />
                  Study Buddy
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/palace" || location.pathname.startsWith("/palace") ? "bg-accent" : ""}`}>
                <Link to="/palace">
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />
                  Palace
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/games" || location.pathname.startsWith("/games") ? "bg-accent" : ""}`}>
                <Link to="/games">
                  <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
                  Games
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/memory" ? "bg-accent" : ""}`}>
                <Link to="/memory">
                  <Brain className="h-3.5 w-3.5 mr-1.5" />
                  Memory
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className={`whitespace-nowrap h-8 ${location.pathname === "/courses" || location.pathname.startsWith("/course") ? "bg-accent" : ""}`}>
                <Link to="/courses">
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                  Courses
                </Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Return to Path Banner - appears when user has active path */}
      {user && <ReturnToPathBanner />}
      
      {/* Spacer div - matches the actual fixed header height */}
      <div aria-hidden style={{ height: headerHeight }} />
    </>
  );
};