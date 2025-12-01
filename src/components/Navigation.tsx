import { Link } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image, Search, Video, Sword, Crown, Shield, Brain, Lightbulb, Zap, Trophy, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { EnhancedMobileDrawer } from "@/components/EnhancedMobileDrawer";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
import { NavigationStyleToggle } from "@/components/NavigationStyleToggle";
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
  const { toggleSidebar } = useSidebar();
  const { conversations } = useDirectMessagesContext();
  
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  // Don't render logged-out view while still checking auth
  if (loading) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
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
        <div className="h-16" />
      </>
    );
  }
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
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
          
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
              <GlobalSearch />
              <PWAInstallButton />
              <ThemeToggle />
              
              {/* Live User Count - Always Visible */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="relative">
                  <Users className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="font-medium">{activeCount} live</span>
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
                  
                  {/* Enter App Button - Desktop Only */}
                  <Button asChild className="hidden md:flex gradient-palace whitespace-nowrap">
                    <Link to="/palace">
                      <Building2 className="h-4 w-4 mr-2" />
                      Enter App
                    </Link>
                  </Button>
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
          
          {/* Horizontal Tab Navigation - Second row, only for authenticated users */}
          {user && (
            <div className="border-t border-border/40">
              <div className="max-w-7xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/80">
                <div className="flex items-center gap-1 py-2 px-2">
                  <Link 
                    to="/palace" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20"
                  >
                    <Building2 className="h-3.5 w-3.5 text-amber-500" />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">Palace</span>
                  </Link>
                  <Link 
                    to="/bible" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">Phototheology Study Bible</span>
                  </Link>
                  <Link 
                    to="/card-deck" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">Phototheology Study Deck</span>
                  </Link>
                  <Link 
                    to="/reading-plans" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20"
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">Reading Plans</span>
                  </Link>
                  <Link 
                    to="/devotionals" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-rose-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-pink-500" />
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold">Devotionals</span>
                  </Link>
                  <Link 
                    to="/encyclopedia"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-blue-500/20"
                  >
                    <Search className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-semibold">Encyclopedia</span>
                  </Link>
                  <Link 
                    to="/video-training" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-orange-500/20"
                  >
                    <Video className="h-3.5 w-3.5 text-red-500" />
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-semibold">Video Training</span>
                  </Link>
                  <Link 
                    to="/my-studies" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:from-sky-500/20 hover:to-blue-500/20"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent font-semibold">My Studies</span>
                  </Link>
                  <Link 
                    to="/games" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 hover:from-fuchsia-500/20 hover:to-pink-500/20"
                  >
                    <Zap className="h-3.5 w-3.5 text-fuchsia-500" />
                    <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent font-semibold">Games</span>
                  </Link>
                  <Link 
                    to="/memory" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:from-cyan-500/20 hover:to-teal-500/20"
                  >
                    <Brain className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-semibold">Memory Palace</span>
                  </Link>
                  <Link 
                    to="/leaderboard" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20"
                  >
                    <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">Leaderboard</span>
                  </Link>
                  <Link 
                    to="/drill-drill"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20"
                  >
                    <Target className="h-3.5 w-3.5 text-orange-500" />
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-semibold">The Drill</span>
                  </Link>
                  <Link 
                    to="/analyze-thoughts"
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-amber-500/20"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">Analyze My Thoughts</span>
                  </Link>
                  <Link 
                    to="/spiritual-training" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 hover:from-red-500/20 hover:to-rose-500/20"
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
                  <Link 
                    to="/community" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 hover:from-teal-500/20 hover:to-cyan-500/20"
                  >
                    <Users className="h-3.5 w-3.5 text-teal-500" />
                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-semibold">Community</span>
                  </Link>
                  <Link 
                    to="/guilds" 
                    className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 hover:from-indigo-500/20 hover:to-violet-500/20"
                  >
                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-semibold">Guilds</span>
                  </Link>
                  
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
                        <Link to="/quarterly-study">Sabbath School</Link>
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
                        <Link to="/pricing">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscription
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
      
      {/* Spacer div - increased for tabs row */}
      <div className={user ? "h-32" : "h-16"} />
    </>
  );
};