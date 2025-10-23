import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Building2, BookOpen, Sparkles, User, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

export const MobileNav = () => {
  const { user, signOut } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="bg-gradient-palace bg-clip-text text-transparent">
              Phototheology
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-6">
          {user ? (
            <>
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link to="/palace">
                <Button variant="ghost" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  The Palace
                </Button>
              </Link>
              <Link to="/bible/John/3">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Phototheology Bible
                </Button>
              </Link>
              <Link to="/games">
                <Button variant="ghost" className="w-full justify-start">
                  🎮 Games
                </Button>
              </Link>
              <Link to="/phototheologygpt">
                <Button variant="ghost" className="w-full justify-start">
                  🤖 GPTs
                </Button>
              </Link>
              <Link to="/spiritual-training">
                <Button variant="ghost" className="w-full justify-start">
                  ⚔️ Spiritual Training
                </Button>
              </Link>
              
              <Separator />
              
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pricing & Plans
                </Button>
              </Link>
              
              <Separator />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button className="w-full gradient-palace">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="w-full">
                  View Pricing
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
