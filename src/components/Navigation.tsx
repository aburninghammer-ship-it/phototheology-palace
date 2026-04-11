import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Columns2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image, Search, Video, Sword, Crown, Shield, Brain, Lightbulb, Zap, Trophy, MessageSquare, Target, StickyNote, Radio, Church, GraduationCap, Award, Gamepad2, BarChart3, Archive, Library, Layers, Network, Home, Heart, Gem, FileImage, FolderOpen, Globe, Settings } from "lucide-react";
import { DraggableNavTabs } from "@/components/navigation/DraggableNavTabs";
import { GlobalStudyBanner } from "@/components/GlobalStudyBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { EnhancedMobileDrawer } from "@/components/EnhancedMobileDrawer";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FocusModeToggle } from "@/components/FocusModeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";

import { NavigationStyleToggle } from "@/components/NavigationStyleToggle";

import { SessionModeIndicator } from "@/components/session/SessionModeIndicator";
import { BackButton } from "@/components/BackButton";
import { PhototheologyOSLogo } from "@/components/PhototheologyOSLogo";
import { SessionStartButton } from "@/components/session/SessionStartButton";
import { SuiteModeToggle, SuiteModeBadge } from "@/components/SuiteModeToggle";
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

export const Navigation = () => {
  // OS Dock + OSTitleBar now handle all navigation — this legacy component is disabled
  return null;

  const { t } = useTranslation();
  const { user, signOut, loading } = useAuth();
  const { activeCount } = useActiveUsers();
  const { isAdmin } = useIsAdmin();
  const { isMember: isChurchMember, churchId, role: churchRole } = useChurchMembership();
  const { preferences, loading: preferencesLoading, updatePreference } = useUserPreferences();
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
          role="navigation"
          aria-label="Main navigation"
          style={{ top: "var(--app-top-banner-height, 0px)" }}
className="fixed left-0 right-0 z-40 bg-card border-b border-border shadow-sm pt-[env(safe-area-inset-top)]"
        >
          <div className="w-full px-4">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
              <PhototheologyOSLogo />
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
        role="navigation"
        aria-label="Main navigation"
        style={{ top: "var(--app-top-banner-height, 0px)" }}
        className="fixed left-0 right-0 z-40 bg-card border-b border-border shadow-sm pt-[env(safe-area-inset-top)]"
      >
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <BackButton />
              <PhototheologyOSLogo />
              {/* Guest House Mode Badge */}
              <SuiteModeBadge className="hidden md:flex" />
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
              <GlobalSearch />
              {user && (
                <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                  <Link to="/workspace">
                    <Columns2 className="h-4 w-4" />
                    <span className="hidden md:inline">Workshop</span>
                  </Link>
                </Button>
              )}
              <PWAInstallButton />
              <FocusModeToggle />
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
                    <span>{t('nav.live')}</span>
                  </Link>
                </Button>
              )}

              {/* Workspace Link - desktop only */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden lg:flex text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Link to={`/workspace?from=${encodeURIComponent(location.pathname)}`}>
                    <Columns2 className="h-4 w-4 mr-1" />
                    <span>Workspace</span>
                  </Link>
                </Button>
              )}

              {/* Live User Count - Always Visible */}
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20" aria-label={`${activeCount} users online`}>
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-green-600">{activeCount}</span>
                <span className="text-xs text-green-600/80">{t('nav.online')}</span>
              </div>
              
              {user && (
                <>
                  <NotificationCenter />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSidebar()}
                    className="relative"
                    aria-label="Open chat"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">{t('nav.chat')}</span>
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" title="Change language">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <LanguageSelector showLabel={false} />
                    </PopoverContent>
                  </Popover>

                  <NavigationStyleToggle />
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
                        {t('nav.myAccount')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/palace" className="cursor-pointer">
                          <Building2 className="h-4 w-4 mr-2" />
                          {t('nav.enterPalace')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          {t('common.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/pricing" className="cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {t('profile.subscription')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-2">
                        <LanguageSelector showLabel={false} />
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('nav.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Language selector for logged-out users */}
                  <div className="hidden md:block w-32">
                    <LanguageSelector showLabel={false} />
                  </div>
                  {/* Enter App Button for logged-out users */}
                  <Button asChild className="gradient-palace whitespace-nowrap">
                    <Link to="/auth">{t('nav.enterApp')}</Link>
                  </Button>
                  
                  {/* Desktop Navigation for logged-out users - Horizontal Scroll */}
                  <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-2xl">
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/palace">{t('nav.palace')}</Link>
                    </Button>

                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/bible">{t('nav.bible')}</Link>
                    </Button>

                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/games">{t('nav.games')}</Link>
                    </Button>

                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/memory">
                        <Brain className="h-4 w-4 mr-1" />
                        {t('nav.memory')}
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap">
                          <Building2 className="h-4 w-4 mr-1" />
                          {t('nav.blueprints')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-marriage" className="cursor-pointer">
                            💍 {t('nav.blueprintMarriage')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-grief" className="cursor-pointer">
                            💙 {t('nav.blueprintGrief')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-stronghold" className="cursor-pointer">
                            🛡️ {t('nav.blueprintStronghold')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-weight-loss" className="cursor-pointer">
                            ⚖️ {t('nav.blueprintWeightLoss')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-mental-health" className="cursor-pointer">
                            🧠 {t('nav.blueprintMentalHealth')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-financial" className="cursor-pointer">
                            💰 {t('nav.blueprintFinancial')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/blueprint-stress" className="cursor-pointer">
                            🧘 {t('nav.blueprintStress')}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap">
                          <Sparkles className="h-4 w-4 mr-1" />
                          {t('nav.gpts')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/phototheologygpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('nav.phototheologyGpt')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/branch-study" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('nav.branchStudy')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/kidgpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('nav.kidGpt')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/daniel-revelation-gpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('nav.danielRevelationGpt')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/apologetics-gpt" className="cursor-pointer">
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t('nav.apologeticsGpt')}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/courses">{t('nav.courses')}</Link>
                    </Button>

                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/pricing">{t('nav.pricing')}</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Horizontal Tab Navigation - Second row, only for authenticated users, hidden on mobile */}
          {user && <DraggableNavTabs />}

          {/* Legacy static tabs - replaced by DraggableNavTabs above */}
          {false && user && (
          <div className="border-t border-border/40 hidden md:block">
              <div className="max-w-7xl mx-auto overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60" style={{ scrollbarWidth: 'thin' }}>
                <div className="flex items-center gap-1 py-2 px-2 flex-nowrap min-w-max">
                  <Link
                    to="/palace"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/palace') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">{t('navTabs.palace', 'Palace')}</span>
                  </Link>
                  {isChurchMember && churchId && (
                    <Link
                      to={`/living-manna?church=${churchId}`}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-green-500/20 ${isActiveTab('/living-manna') ? 'shadow-[0_0_12px_2px_rgba(16,185,129,0.5)] border-emerald-400/60' : ''}`}
                    >
                      <Church className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">{t('navTabs.church-space', 'My Church Space')}</span>
                    </Link>
                  )}
                  <Link
                    to="/daily-verse"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/daily-verse') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">Verse of the Day</span>
                  </Link>
                  <Link
                    to="/bible"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 ${isActiveTab('/bible') ? 'shadow-[0_0_12px_2px_rgba(59,130,246,0.5)] border-blue-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">{t('navTabs.bible', 'Phototheology Study Bible')}</span>
                  </Link>
                  <Link
                    to="/study-buddy"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-slate-500/10 to-zinc-500/10 border border-slate-500/20 hover:from-slate-500/20 hover:to-zinc-500/20 ${isActiveTab('/study-buddy') ? 'shadow-[0_0_12px_2px_rgba(100,116,139,0.5)] border-slate-400/60' : ''}`}
                  >
                    <Brain className="h-3.5 w-3.5 text-slate-400" />
                    <span className="bg-gradient-to-r from-slate-500 to-zinc-500 bg-clip-text text-transparent font-semibold">{t('navTabs.study-buddy', 'Study Buddy')}</span>
                  </Link>
                  <Link
                    to="/study-ideas"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-yellow-500/20 ${isActiveTab('/study-ideas') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-semibold">{t('navTabs.study-ideas', 'Study Ideas')}</span>
                  </Link>
                  <Link
                    to="/give-me-a-gem"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 ${isActiveTab('/give-me-a-gem') ? 'shadow-[0_0_12px_2px_rgba(16,185,129,0.5)] border-emerald-400/60' : ''}`}
                  >
                    <Gem className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">{t('navTabs.give-me-a-gem', 'Give Me A Gem')}</span>
                  </Link>
                  <Link
                    to="/mind-map"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-violet-500/20 ${isActiveTab('/mind-map') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Network className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-semibold">{t('navTabs.mind-map', 'Mind Map Palace')}</span>
                  </Link>
                  <Link
                    to="/image-bible"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/image-bible') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Image className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">{t('navTabs.image-bible', 'PT Image Bible')}</span>
                  </Link>
                  <Link
                    to="/card-deck"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20 ${isActiveTab('/card-deck') ? 'shadow-[0_0_12px_2px_rgba(139,92,246,0.5)] border-violet-400/60' : ''}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">{t('navTabs.card-deck', 'Phototheology Study Deck')}</span>
                  </Link>
                  <Link
                    to="/reading-plans"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 ${isActiveTab('/reading-plans') ? 'shadow-[0_0_12px_2px_rgba(16,185,129,0.5)] border-emerald-400/60' : ''}`}
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">{t('navTabs.reading-plans', 'Reading Plans')}</span>
                  </Link>
                  <Link
                    to="/devotionals" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-rose-500/20 ${isActiveTab('/devotionals') ? 'shadow-[0_0_12px_2px_rgba(236,72,153,0.5)] border-pink-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-pink-500" />
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold">{t('navTabs.devotionals', 'Devotionals')}</span>
                  </Link>
                  <Link
                    to="/encyclopedia"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-blue-500/20 ${isActiveTab('/encyclopedia') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Search className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-semibold">{t('navTabs.encyclopedia', 'Encyclopedia')}</span>
                  </Link>
                  <Link
                    to="/video-training"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-orange-500/20 ${isActiveTab('/video-training') ? 'shadow-[0_0_12px_2px_rgba(239,68,68,0.5)] border-red-400/60' : ''}`}
                  >
                    <Video className="h-3.5 w-3.5 text-red-500" />
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-semibold">{t('navTabs.video-training', 'Video Training')}</span>
                  </Link>
                  <Link
                    to="/my-studies"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:from-sky-500/20 hover:to-blue-500/20 ${isActiveTab('/my-studies') ? 'shadow-[0_0_12px_2px_rgba(14,165,233,0.5)] border-sky-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-semibold">{t('navTabs.my-studies', 'My Studies')}</span>
                  </Link>
                  <Link
                    to="/notes"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/notes') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">{t('navTabs.notes', 'Notes')}</span>
                  </Link>
                  <Link
                    to="/libraries"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-purple-500/20 ${isActiveTab('/libraries') ? 'shadow-[0_0_12px_2px_rgba(99,102,241,0.5)] border-indigo-400/60' : ''}`}
                  >
                    <Library className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">{t('navTabs.libraries', 'Libraries')}</span>
                  </Link>
                  <Link
                    to="/cota-series"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20 ${isActiveTab('/cota-series') ? 'shadow-[0_0_12px_2px_rgba(245,158,11,0.5)] border-amber-400/60' : ''}`}
                  >
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">COTA Series</span>
                  </Link>
                  <Link
                    to="/games" 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 hover:from-fuchsia-500/20 hover:to-pink-500/20 ${isActiveTab('/games') ? 'shadow-[0_0_12px_2px_rgba(217,70,239,0.5)] border-fuchsia-400/60' : ''}`}
                  >
                    <Zap className="h-3.5 w-3.5 text-fuchsia-500" />
                    <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent font-semibold">{t('navTabs.games', 'Games')}</span>
                  </Link>
                  <Link
                    to="/memory"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:from-cyan-500/20 hover:to-teal-500/20 ${isActiveTab('/memory') ? 'shadow-[0_0_12px_2px_rgba(6,182,212,0.5)] border-cyan-400/60' : ''}`}
                  >
                    <Brain className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-semibold">{t('navTabs.memory', 'Memory Palace')}</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20">
                        <Layers className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">{t('navTabs.study-tools', 'Study Tools')}</span>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/sources">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Source Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/infographics">
                          <FileImage className="h-4 w-4 mr-2" />
                          Infographic Generator
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/study-series" className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Study Series
                          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">Premium</Badge>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Link
                    to="/leaderboard"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/leaderboard') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">{t('navTabs.leaderboard', 'Leaderboard')}</span>
                  </Link>
                  <Link
                    to="/drill-drill"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20 ${isActiveTab('/drill-drill') ? 'shadow-[0_0_12px_2px_rgba(249,115,22,0.5)] border-orange-400/60' : ''}`}
                  >
                    <Target className="h-3.5 w-3.5 text-orange-500" />
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">{t('navTabs.drill-drill', 'Gather Fragments')}</span>
                  </Link>
                  <Link
                    to="/analyze-thoughts"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20 ${isActiveTab('/analyze-thoughts') ? 'shadow-[0_0_12px_2px_rgba(234,179,8,0.5)] border-yellow-400/60' : ''}`}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">{t('navTabs.analyze-thoughts', 'Analyze My Thoughts')}</span>
                  </Link>
                  <Link
                    to="/spiritual-training"
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-rose-500/20 ${isActiveTab('/spiritual-training') ? 'shadow-[0_0_12px_2px_rgba(239,68,68,0.5)] border-red-400/60' : ''}`}
                  >
                    <Sword className="h-3.5 w-3.5 text-red-500" />
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent font-semibold">{t('navTabs.spiritual-training', 'Christian Art of War Dojo')}</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">{t('navTabs.gpts', 'GPTs')}</span>
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
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">{t('navTabs.blueprints', 'Blueprints')}</span>
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
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-semibold">{t('navTabs.courses', 'Courses')}</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20">
                        <Zap className="h-3.5 w-3.5 text-orange-500" />
                        <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">{t('navTabs.challenges', 'Challenges')}</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/daily-challenges">Daily Challenges</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/challenge-board">Public Challenge Board</Link>
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
                    <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-semibold">{t('navTabs.achievements', 'Achievements')}</span>
                  </Link>
                  <Link
                    to="/mastery"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:from-rose-500/20 hover:to-pink-500/20"
                  >
                    <Crown className="h-3.5 w-3.5 text-rose-500" />
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-semibold">{t('navTabs.mastery', 'Mastery')}</span>
                  </Link>
                  <Link
                    to="/bible-study-series"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:from-sky-500/20 hover:to-blue-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-semibold">{t('navTabs.series', 'Series')}</span>
                  </Link>
                  <Link
                    to="/sermon-builder"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-fuchsia-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent font-semibold">{t('navTabs.sermon-builder', 'Sermon Builder')}</span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/20 hover:from-lime-500/20 hover:to-green-500/20"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-lime-500" />
                    <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent font-semibold">{t('navTabs.pricing', 'Pricing')}</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 hover:from-teal-500/20 hover:to-cyan-500/20">
                        <Users className="h-3.5 w-3.5 text-teal-500" />
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-semibold">{t('navTabs.community', 'Community')}</span>
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
                        <Link to="/research-assistant">Research Assistant</Link>
                      </DropdownMenuItem>
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
                      {/* Suite Mode Toggle */}
                      <div className="px-1 py-1">
                        <SuiteModeToggle variant="menu-item" />
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/pricing">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/manage-subscription">
                          <Settings className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">Manage Subscription</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('nav.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Global profile banner with rotating prompts */}
        
        {/* Global rotating study/encouragement banner */}
        {user && <GlobalStudyBanner userId={user.id} userEmail={user.email ?? null} />}
      </nav>
      
      {/* Spacer div - matches the actual fixed header height */}
      <div aria-hidden style={{ height: headerHeight }} />
    </>
  );
};