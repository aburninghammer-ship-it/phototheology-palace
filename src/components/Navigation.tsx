import { Link, useLocation } from "react-router-dom";
import { Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const location = useLocation();
  
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
          </div>
        </div>
      </div>
    </nav>
  );
};
