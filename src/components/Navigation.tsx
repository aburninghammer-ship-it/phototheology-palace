import { Link } from "react-router-dom";
import { Building2, Sparkles, Users, User, CreditCard, LogOut, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { MobileNav } from "@/components/MobileNav";
import { useSidebar } from "@/components/ui/sidebar";
import { useDirectMessages } from "@/hooks/useDirectMessages";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { activeCount } = useActiveUsers();
  const { toggleSidebar } = useSidebar();
  const { conversations } = useDirectMessages();
  
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  
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
          
            <div className="flex items-center gap-4">
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
                  {/* Desktop Navigation - Lean */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/palace">Palace</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/bible">Bible</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/games">Games</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/phototheology-gpt">GPTs</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/phototheology-course">Courses</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/series-builder">Series</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/pricing">Pricing</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/community">Community</Link>
                    </Button>
                    
                    <Button asChild size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                      <Link to="/install">
                        <Download className="h-4 w-4" />
                        Download App
                      </Link>
                    </Button>
                    
                    {/* Account Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <User className="h-4 w-4" />
                          <span className="hidden lg:inline">Account</span>
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
                    <MobileNav />
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop Navigation for logged-out users */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/palace">Palace</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/bible">Bible</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/games">Games</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/phototheology-gpt">GPTs</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/phototheology-course">Courses</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/series-builder">Series</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/pricing">Pricing</Link>
                    </Button>
                    
                    <Button variant="ghost" asChild size="sm">
                      <Link to="/community">Community</Link>
                    </Button>
                    
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link to="/install">
                        <Download className="h-4 w-4" />
                        Download App
                      </Link>
                    </Button>
                    
                    <Button asChild size="sm">
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