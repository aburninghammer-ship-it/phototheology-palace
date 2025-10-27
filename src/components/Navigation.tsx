import { Link, useLocation } from "react-router-dom";
// Import all required icons from lucide-react
import { Building2, Sparkles, Users, BookOpen, User, CreditCard, LogOut, Gift, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { MobileNav } from "@/components/MobileNav";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const isBiblePage = location.pathname.startsWith('/bible');
  const { user, signOut } = useAuth();
  const { activeCount } = useActiveUsers();
  const { toggleSidebar } = useSidebar();
  const { conversations } = useDirectMessages();
  
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-purple">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Building2 className="h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110" />
              <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
            </div>
            <span className="font-serif text-xl font-semibold bg-gradient-palace bg-clip-text text-transparent">
              Phototheology
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{activeCount} active</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="relative"
                >
                  <MessageCircle className="h-4 w-4" />
                  {totalUnread > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {user ? (
              <>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1.5">

            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/" ? "gradient-palace shadow-purple text-xs" : "hover:bg-muted text-xs"}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={location.pathname === "/app-tour" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/app-tour" ? "gradient-ocean shadow-blue text-xs" : "hover:bg-muted text-xs"}
            >
              <Link to="/app-tour">📖 Tour</Link>
            </Button>
            <Button
              variant={location.pathname === "/palace" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/palace" ? "gradient-royal shadow-blue text-xs" : "hover:bg-muted text-xs"}
            >
              <Link to="/palace">Palace</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={isBiblePage ? "default" : "ghost"}
                  size="sm"
                  className={isBiblePage ? "gradient-ocean shadow-blue text-xs" : "hover:bg-muted text-xs"}
                >
                  Bible
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/bible/John/3">📖 Phototheology Bible</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/palace">🏰 The Palace</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bible-rendered-room">📚 Bible Rendered</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/verse-memory-hall">🧠 Verse Memory Hall</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bible-image-library">🎨 Image Library</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/quarterly-study">📅 Amplified Quarterly</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={location.pathname.startsWith("/games") || location.pathname === "/kids-games" ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname.startsWith("/games") || location.pathname === "/kids-games" ? "gradient-royal shadow-blue text-xs" : "hover:bg-muted text-xs"}
                >
                  Games
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/games">🎮 Palace Games</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/kids-games">👶 Kids Games</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={location.pathname.includes("gpt") ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname.includes("gpt") ? "gradient-palace shadow-purple text-xs" : "hover:bg-muted text-xs"}
                >
                  GPTs
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/phototheologygpt">🤖 PhototheologyGPT</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/apologetics-gpt">🛡️ ApologeticsGPT</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/daniel-revelation-gpt">📜 Daniel & Revelation GPT</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/kidgpt">👶 KidGPT</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={location.pathname === "/spiritual-training" || location.pathname === "/power-of-the-lamb" ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname === "/spiritual-training" || location.pathname === "/power-of-the-lamb" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg text-xs" : "hover:bg-muted text-xs"}
                >
                  ⚔️ Training
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/spiritual-training">⚔️ Spiritual Training</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/power-of-the-lamb">🔥 Power of the Lamb</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="text-xs">
                       <BookOpen className="mr-1 h-3 w-3" />
                       Courses
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                     <DropdownMenuItem asChild>
                       <Link to="/blueprint-course">🗺️ Blueprint Course</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/daniel-course">📜 Daniel Course</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/phototheology-course">🏰 Phototheology Course</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/revelation-course">🔥 Revelation Course</Link>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                       All courses include kids versions (Ages 6-15)
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={location.pathname === "/community" || location.pathname === "/achievements" || location.pathname === "/escape-room" || location.pathname === "/leaderboard" || location.pathname === "/study-partners" || location.pathname === "/live-study" || location.pathname === "/streaks" || location.pathname === "/treasure-hunt" ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname === "/community" || location.pathname === "/achievements" || location.pathname === "/escape-room" || location.pathname === "/leaderboard" || location.pathname === "/study-partners" || location.pathname === "/live-study" || location.pathname === "/streaks" || location.pathname === "/treasure-hunt" ? "gradient-palace shadow-purple text-xs" : "hover:bg-muted text-xs"}
                >
                  <Users className="mr-1 h-3 w-3" />
                  Community
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/community">💬 Community Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements">🏆 Achievements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/leaderboard">📊 Leaderboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/streaks">🔥 Streaks</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/escape-room">🚪 Escape Rooms</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/treasure-hunt">💎 Treasure Hunt</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/study-partners">👥 Study Partners</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/live-study">📹 Live Study</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="text-xs">
                       <User className="h-3 w-3 mr-1" />
                       Account
                     </Button>
                   </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pricing & Plans
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/referrals">
                        <Gift className="h-4 w-4 mr-2" />
                        Referrals
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile Navigation */}
              <MobileNav />
            </>
            ) : (
              <>
                {/* Not logged in - show auth buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/app-tour">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Tour
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/pricing">Pricing</Link>
                  </Button>
                  <Button asChild variant="default" size="sm" className="gradient-palace">
                    <Link to="/auth">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
                
                {/* Mobile Navigation for non-authenticated users */}
                <MobileNav />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    {/* Spacer to prevent content from being hidden behind fixed nav */}
    <div className="h-16" />
    </>
  );
};
