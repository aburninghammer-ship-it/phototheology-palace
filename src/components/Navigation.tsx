import { Link } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image, Search, Video, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { EnhancedMobileDrawer } from "@/components/EnhancedMobileDrawer";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
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
  const { conversations } = useDirectMessages();
  
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
              
              {user && (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{activeCount} active</span>
                  </div>
                  
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

                  <NotificationCenter />
                </>
              )}

              {user ? (
                <>
                  {/* Mobile Navigation */}
                  <div className="md:hidden">
                    <EnhancedMobileDrawer />
                  </div>
                </>
              ) : (
                <>
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
              <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 py-2 px-2">
                  <Link 
                    to="/palace" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Palace
                  </Link>
                  <Link 
                    to="/bible" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Bible
                  </Link>
                  <Link 
                    to="/reading-plans" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Reading Plans
                  </Link>
                  <Link 
                    to="/encyclopedia" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Encyclopedia
                  </Link>
                  <Link 
                    to="/video-training" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Video Training
                  </Link>
                  <Link 
                    to="/my-studies" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    My Studies
                  </Link>
                  <Link 
                    to="/games" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Games
                  </Link>
                  <Link 
                    to="/genesis-challenge" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    Genesis High Rise
                  </Link>
                  <Link 
                    to="/spiritual-training" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Sword className="h-3.5 w-3.5" />
                    Christian Art of War Dojo
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        GPTs
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
                      <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        Blueprints
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
                        <Link to="/blueprint-weightloss">Weight Loss</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/blueprint-mentalhealth">Mental Health</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link 
                    to="/courses" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Courses
                  </Link>
                  <Link 
                    to="/daily-challenges" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Challenges
                  </Link>
                  <Link 
                    to="/achievements" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Achievements
                  </Link>
                  <Link 
                    to="/bible-study-series" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Series
                  </Link>
                  <Link 
                    to="/sermon-builder" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Sermon Builder
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/community" 
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors whitespace-nowrap"
                  >
                    Community
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
                        <Link to="/bible-encyclopedia">Bible Encyclopedia</Link>
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