import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Gamepad2, GraduationCap, Users, User, Menu, Home, Crown, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GlobalSearch } from "./GlobalSearch";
import { NavigationStyleToggle } from "./NavigationStyleToggle";

export const SimplifiedNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const studyLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/daily-verse", label: "Verse of the Day", icon: BookOpen },
    { to: "/bible", label: "Bible Reader", icon: BookOpen },
    { to: "/bible/search", label: "Search", icon: BookOpen },
    { to: "/palace/floor/1/room/gr", label: "Produce a Gem", icon: BookOpen },
    { to: "/bible-image-library", label: "Image Library", icon: BookOpen },
    { to: "/quarterly-study", label: "Quarterly Study", icon: BookOpen },
    { to: "/memorization", label: "Memorization", icon: BookOpen },
  ];

  const practiceLinks = [
    { to: "/games", label: "All Games", icon: Gamepad2 },
    { to: "/chain-chess", label: "Chain Chess", icon: Gamepad2 },
    { to: "/escape-room", label: "Escape Rooms", icon: Gamepad2 },
    { to: "/treasure-hunt", label: "Treasure Hunt", icon: Gamepad2 },
    { to: "/training-drills", label: "Training Drills", icon: Gamepad2 },
  ];

  const researchLinks = [
    { to: "/research-mode", label: "Research Mode", icon: BookOpen },
    { to: "/prophecy-watch", label: "Prophecy Watch", icon: BookOpen },
    { to: "/culture-controversy", label: "Culture & Controversy", icon: BookOpen },
  ];

  const learnLinks = [
    { to: "/palace", label: "Memory Palace", icon: GraduationCap },
    { to: "/revelation-course", label: "Revelation Course", icon: GraduationCap },
    { to: "/daniel-course", label: "Daniel Course", icon: GraduationCap },
    { to: "/blueprint-course", label: "Blueprint Course", icon: GraduationCap },
    { to: "/phototheology-course", label: "Phototheology Course", icon: GraduationCap },
  ];

  const communityLinks = [
    { to: "/community", label: "Community Posts", icon: Users },
    { to: "/live-study", label: "Live Study", icon: Users },
    { to: "/leaderboard", label: "Leaderboard", icon: Users },
  ];

  if (!user) {
    return (
      <>
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Phototheology</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* Spacer for sticky nav */}
      <div className="h-16" />
      </>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline">Phototheology</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><Home className="h-4 w-4 mr-1" />Dashboard</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />Study
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {studyLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Gamepad2 className="h-4 w-4 mr-1" />Practice
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {practiceLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <GraduationCap className="h-4 w-4 mr-1" />Learn
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {learnLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-1" />Community
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {communityLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          
          <NavigationStyleToggle />
          
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link to="/pricing"><Crown className="h-4 w-4 mr-1" />Upgrade</Link>
          </Button>

          {/* Desktop Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:flex">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/certificates">Certificates</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/study-partners">Study Partners</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/referrals">Referrals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/achievements">Achievements</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/feedback">Feedback</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 px-2 text-sm font-semibold">Study</h3>
                    <div className="space-y-1">
                      {studyLinks.map((link) => (
                        <Button
                          key={link.to}
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobile}
                        >
                          <Link to={link.to}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 px-2 text-sm font-semibold">Practice</h3>
                    <div className="space-y-1">
                      {practiceLinks.map((link) => (
                        <Button
                          key={link.to}
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobile}
                        >
                          <Link to={link.to}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 px-2 text-sm font-semibold">Learn</h3>
                    <div className="space-y-1">
                      {learnLinks.map((link) => (
                        <Button
                          key={link.to}
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobile}
                        >
                          <Link to={link.to}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 px-2 text-sm font-semibold">Community</h3>
                    <div className="space-y-1">
                      {communityLinks.map((link) => (
                        <Button
                          key={link.to}
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobile}
                        >
                          <Link to={link.to}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMobile}
                    >
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMobile}
                    >
                      <Link to="/pricing">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={() => {
                        signOut();
                        closeMobile();
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
    {/* Spacer for sticky nav */}
    <div className="h-16" />
    </>
  );
};
