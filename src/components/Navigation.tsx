import { Link, useLocation } from "react-router-dom";
import { Building2, Sparkles, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const isBiblePage = location.pathname.startsWith('/bible');
  const { user, signOut } = useAuth();
  const activeCount = useActiveUsers();
  
  return (
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{activeCount} active</span>
              </div>
            )}

            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/" ? "gradient-palace shadow-purple" : "hover:bg-muted"}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={location.pathname === "/palace" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/palace" ? "gradient-royal shadow-blue" : "hover:bg-muted"}
            >
              <Link to="/palace">The Palace</Link>
            </Button>
            <Button
              variant={isBiblePage ? "default" : "ghost"}
              asChild
              size="sm"
              className={isBiblePage ? "gradient-ocean shadow-blue" : "hover:bg-muted"}
            >
              <Link to="/bible/John/3">Bible</Link>
            </Button>
            <Button
              variant={location.pathname === "/power-of-the-lamb" ? "default" : "ghost"}
              asChild
              size="sm"
              className={location.pathname === "/power-of-the-lamb" ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg" : "hover:bg-muted"}
            >
              <Link to="/power-of-the-lamb">🔥 Power of the Lamb</Link>
            </Button>

            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Community
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to="/daily-challenges">Daily Challenges</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/games">Palace Games</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/kids-games">Kids Games</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/live-study">Live Study</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/community">Community Chat</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/leaderboard">Leaderboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/achievements">Achievements</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/feedback">Feedback</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
