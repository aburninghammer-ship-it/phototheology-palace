import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image, Search, Video, Sword, Crown, Shield, Brain, Lightbulb, Zap, Trophy, MessageSquare, Target, StickyNote, Radio, Church, GraduationCap, Award, Gamepad2, BarChart3, Archive, Library, Layers, Network } from "lucide-react";
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
          
          {/* Horizontal Tab Navigation - Second row, only for authenticated users, hidden on mobile */}
          {user && (
          <div className="border-t border-border/40 hidden md:block">
              <div className="max-w-7xl mx-auto overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60" style={{ scrollbarWidth: 'thin' }}>
                <div className="flex items-center gap-1 py-2 px-2 flex-nowrap min-w-max">
                  <Link 
                    to="/palace" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/palace') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">Palace</span>
                  </Link>
                  {isChurchMember && churchId && (
                    <Link 
                      to={`/living-manna?church=${churchId}`}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-green-500/20 ${isActiveTab('/living-manna') ? 'shadow-[0_0_12px_2px_rgba(16,185,129,0.5)] border-emerald-400/60' : ''}`}
                    >
                      <Church className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">My Church Space</span>
                    </Link>
                  )}
                  <Link
                    to="/bible"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 ${isActiveTab('/bible') ? 'shadow-[0_0_12px_2px_rgba(59,130,246,0.5)] border-blue-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">Phototheology Study Bible</span>
                  </Link>
                  <Link
                    to="/study-buddy"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-slate-500/10 to-zinc-500/10 border border-slate-500/20 hover:from-slate-500/20 hover:to-zinc-500/20 ${isActiveTab('/study-buddy') ? 'shadow-[0_0_12px_2px_rgba(100,116,139,0.5)] border-slate-400/60' : ''}`}
                  >
                    <Brain className="h-3.5 w-3.5 text-slate-400" />
                    <span className="bg-gradient-to-r from-slate-500 to-zinc-500 bg-clip-text text-transparent font-semibold">Study Buddy</span>
                  </Link>
                  <Link
                    to="/mind-map"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-violet-500/20 ${isActiveTab('/mind-map') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Network className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-semibold">Mind Map Palace</span>
                  </Link>
                  <Link
                    to="/image-bible"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/image-bible') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Image className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">PT Image Bible</span>
                  </Link>
                  <Link
                    to="/card-deck" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20 ${isActiveTab('/card-deck') ? 'shadow-[0_0_12px_2px_rgba(139,92,246,0.5)] border-violet-400/60' : ''}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">Phototheology Study Deck</span>
                  </Link>
                  <Link 
                    to="/reading-plans" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 ${isActiveTab('/reading-plans') ? 'shadow-[0_0_12px_2px_rgba(16,185,129,0.5)] border-emerald-400/60' : ''}`}
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">Reading Plans</span>
                  </Link>
                  <Link 
                    to="/devotionals" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-rose-500/20 ${isActiveTab('/devotionals') ? 'shadow-[0_0_12px_2px_rgba(236,72,153,0.5)] border-pink-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-pink-500" />
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold">Devotionals</span>
                  </Link>
                  <Link 
                    to="/encyclopedia"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-blue-500/20 ${isActiveTab('/encyclopedia') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Search className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-semibold">Encyclopedia</span>
                  </Link>
                  <Link 
                    to="/video-training" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-orange-500/20 ${isActiveTab('/video-training') ? 'shadow-[0_0_12px_2px_rgba(239,68,68,0.5)] border-red-400/60' : ''}`}
                  >
                    <Video className="h-3.5 w-3.5 text-red-500" />
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-semibold">Video Training</span>
                  </Link>
                  <Link 
                    to="/my-studies" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:from-sky-500/20 hover:to-blue-500/20 ${isActiveTab('/my-studies') ? 'shadow-[0_0_12px_2px_rgba(14,165,233,0.5)] border-sky-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-semibold">My Studies</span>
                  </Link>
                  <Link
                    to="/notes"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/notes') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">Notes</span>
                  </Link>
                  <Link
                    to="/libraries"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-purple-500/20 ${isActiveTab('/libraries') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Library className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">Libraries</span>
                  </Link>
                  <Link 
                    to="/games" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 hover:from-fuchsia-500/20 hover:to-pink-500/20 ${isActiveTab('/games') ? 'shadow-[0_0_12px_2px_rgba(217,70,239,0.5)] border-fuchsia-400/60' : ''}`}
                  >
                    <Zap className="h-3.5 w-3.5 text-fuchsia-500" />
                    <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent font-semibold">Games</span>
                  </Link>
                  <Link
                    to="/memory"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:from-cyan-500/20 hover:to-teal-500/20 ${isActiveTab('/memory') ? 'shadow-[0_0_12px_2px_rgba(6,182,212,0.5)] border-cyan-400/60' : ''}`}
                  >
                    <Brain className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-semibold">Memory Palace</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20">
                        <Layers className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">Study Tools</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/flashcards">
                          <Layers className="h-4 w-4 mr-2" />
                          Flashcards
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/daily-reading">
                          <Calendar className="h-4 w-4 mr-2" />
                          Daily Reading
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/training-drills">
                          <Target className="h-4 w-4 mr-2" />
                          Training Drills
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/study-partners">
                          <Users className="h-4 w-4 mr-2" />
                          Study Partners
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Link
                    to="/leaderboard" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/leaderboard') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">Leaderboard</span>
                  </Link>
                  <Link 
                    to="/drill-drill"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20 ${isActiveTab('/drill-drill') ? 'shadow-[0_0_12px_2px_rgba(249,115,22,0.5)] border-orange-400/60' : ''}`}
                  >
                    <Target className="h-3.5 w-3.5 text-orange-500" />
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">Gather Fragments</span>
                  </Link>
                  <Link 
                    to="/analyze-thoughts"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/analyze-thoughts') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">Analyze My Thoughts</span>
                  </Link>
                  <Link 
                    to="/spiritual-training" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-rose-500/20 ${isActiveTab('/spiritual-training') ? 'shadow-[0_0_12px_2px_rgba(239,68,68,0.5)] border-red-400/60' : ''}`}
                  >
                    <Sword className="h-3.5 w-3.5 text-red-500" />
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent font-semibold">Christian Art of War Dojo</span>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">GPTs</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/phototheologygpt">Phototheology GPT</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/branch-study">BranchStudy</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/kidgpt">Kid GPT</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/daniel-revelation-gpt">Daniel & Revelation GPT</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/apologetics-gpt">Apologetics GPT</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-indigo-500/20">
                        <Building2 className="h-3.5 w-3.5 text-blue-500" />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">Blueprints</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-marriage">Dating & Marriage</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-grief">Grieving</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-stronghold">Breaking Strongholds</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-weight-loss">Weight Loss</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-mental-health">Mental Health</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link 
                    to="/courses" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-green-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">Courses</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20">
                        <Zap className="h-3.5 w-3.5 text-orange-500" />
                        <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">Challenges</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/daily-challenges">Daily Challenges</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/genesis-challenge">Genesis High Rise</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link 
                    to="/achievements" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-yellow-500/20"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-semibold">Achievements</span>
                  </Link>
                  <Link 
                    to="/mastery" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:from-rose-500/20 hover:to-pink-500/20"
                  >
                    <Crown className="h-3.5 w-3.5 text-rose-500" />
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-semibold">Mastery</span>
                  </Link>
                  <Link
                    to="/bible-study-series" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:from-sky-500/20 hover:to-blue-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-semibold">Series</span>
                  </Link>
                  <Link 
                    to="/sermon-builder" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-fuchsia-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-semibold">Sermon Builder</span>
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/20 hover:from-lime-500/20 hover:to-green-500/20"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-lime-500" />
                    <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent font-semibold">Pricing</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 hover:from-teal-500/20 hover:to-cyan-500/20">
                        <Users className="h-3.5 w-3.5 text-teal-500" />
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-semibold">Community</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/community">
                          <Users className="h-4 w-4 mr-2" />
                          Community Feed
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/pt-multiplayer">
                          <Gamepad2 className="h-4 w-4 mr-2" />
                          PT Multiplayer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/guilds">
                          <Shield className="h-4 w-4 mr-2" />
                          Guilds
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1">
                        <Search className="h-3.5 w-3.5" />
                        Research
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/bible-reference">PT Codebook</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/encyclopedia">Bible Encyclopedia</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/quarterly-study">Lesson Study</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/prophecy-watch">Prophecy Watch</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/culture-controversy">Culture Controversy</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/research-mode">Research Mode</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/sermon-archive">
                          <Archive className="h-4 w-4 mr-2" />
                          Sermon Archive
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/content-library">
                          <Library className="h-4 w-4 mr-2" />
                          Content Library
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Account
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-progress">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          My Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/certificates">
                          <Award className="h-4 w-4 mr-2" />
                          Certificates
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/sparks">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Sparks Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/pricing">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/manage-subscription" className="text-muted-foreground">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
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