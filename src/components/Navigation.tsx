import { Link } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, BookOpen, Calendar, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { EnhancedMobileDrawer } from "@/components/EnhancedMobileDrawer";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PWAInstallButton } from "@/components/PWAInstallButton";
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
              <PWAInstallButton />
              
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
                  {/* Desktop Navigation - Horizontal Scroll */}
                  <div className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-2xl">
                  <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                    <Link to="/palace">Palace</Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="whitespace-nowrap shrink-0">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Bible
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/bible" className="cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Bible Reader
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/quarterly-study" className="cursor-pointer">
                          <Calendar className="mr-2 h-4 w-4" />
                          Amplified Quarterly
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/bible-image-library" className="cursor-pointer">
                          <Image className="mr-2 h-4 w-4" />
                          Image Library
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/bible-study-leader" className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          Lead Bible Study
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                    <Link to="/my-studies">My Studies</Link>
                  </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/games">Games</Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="whitespace-nowrap shrink-0">
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
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/phototheology-course">Courses</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/daily-challenges">Challenges</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/achievements">Achievements</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/series-builder">Series</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/pricing">Pricing</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap shrink-0">
                      <Link to="/community">Community</Link>
                    </Button>
                    
                    {/* Account Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                          <User className="h-4 w-4" />
                          <span className="hidden xl:inline">Account</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/pricing" className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Subscription
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

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
                      <Link to="/phototheology-course">Courses</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/daily-challenges">Challenges</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/series-builder">Series</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/pricing">Pricing</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                      <Link to="/community">Community</Link>
                    </Button>
                    
                    <Button asChild size="sm" className="whitespace-nowrap">
                      <Link to="/auth">Log In</Link>
                    </Button>
                  </div>

                  {/* Mobile Navigation for logged-out users */}
                  <div className="md:hidden">
                    <Button asChild size="sm">
                      <Link to="/auth">Log In</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer div to prevent content from being hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
};