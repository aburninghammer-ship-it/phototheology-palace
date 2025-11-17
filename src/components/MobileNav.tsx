import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Building2, BookOpen, Sparkles, User, CreditCard, LogOut, Gift, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        
        <ScrollArea className="h-[calc(100vh-5rem)] mt-6">
        <div className="flex flex-col gap-2 pr-4">
          {user ? (
            <>
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Home
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wide">Quick Links</div>
              
              <Link to="/app-tour">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  App Tour
                </Button>
              </Link>
              <Link to="/palace">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  The Palace
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Bible Tools</div>
              
              <Link to="/bible/John/3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📖 Phototheology Bible
                </Button>
              </Link>
              <Link to="/palace">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏰 The Palace
                </Button>
              </Link>
              <Link to="/bible-rendered-room">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📚 Bible Rendered
                </Button>
              </Link>
              <Link to="/palace/floor/1/room/gr">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💎 Produce a Gem
                </Button>
              </Link>
              <Link to="/verse-memory-hall">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🧠 Verse Memory Hall
                </Button>
              </Link>
              <Link to="/bible-image-library">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎨 Image Library
                </Button>
              </Link>
              <Link to="/my-studies">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📝 My Studies
                </Button>
              </Link>
              <Link to="/public-image-library">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌐 Public Gallery
                </Button>
              </Link>
              <Link to="/quarterly-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📅 Amplified Quarterly
                </Button>
              </Link>
              <Link to="/bible-study-leader">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👥 Lead a Bible Study
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Research Tools</div>
              
              <Link to="/research-mode">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🔬 Research Mode
                </Button>
              </Link>
              <Link to="/prophecy-watch">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👁️ Prophecy Watch
                </Button>
              </Link>
              <Link to="/culture-controversy">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌍 Culture & Controversy
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Games</div>
              
              <Link to="/games">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎮 Palace Games
                </Button>
              </Link>
              <Link to="/kids-games">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👶 Kids Games
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">GPTs</div>
              
              <Link to="/phototheologygpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🤖 Phototheology GPT
                </Button>
              </Link>
              <Link to="/branch-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌳 BranchStudy
                </Button>
              </Link>
              <Link to="/apologetics-gpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🛡️ Apologetics GPT
                </Button>
              </Link>
              <Link to="/daniel-revelation-gpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📜 Daniel & Revelation GPT
                </Button>
              </Link>
              <Link to="/kidgpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👶 Kid GPT
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Spiritual Training</div>
              
              <Link to="/spiritual-training">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  ⚔️ Spiritual Training
                </Button>
              </Link>
              <Link to="/power-of-the-lamb">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🔥 Power of the Lamb
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Courses</div>
              
              <Link to="/blueprint-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Blueprint Course
                </Button>
              </Link>
              <Link to="/daniel-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Daniel Course
                </Button>
              </Link>
              <Link to="/phototheology-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Phototheology Course
                </Button>
              </Link>
              <Link to="/revelation-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Revelation Course
                </Button>
              </Link>
              <Link to="/revelation-course/kids">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📚 Revelation for Kids
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Community</div>
              
              <Link to="/escape-room">
                <Button variant="ghost" className="w-full justify-start font-semibold text-primary" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  🚨 Escape Rooms
                </Button>
              </Link>
              <Link to="/daily-challenges">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📅 Daily Challenges
                </Button>
              </Link>
              <Link to="/treasure-hunt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏆 Treasure Hunt (24hr)
                </Button>
              </Link>
              <Link to="/equations-challenge">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🧮 Equations Challenge
                </Button>
              </Link>
              <Link to="/live-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📺 Live Study
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💬 Community Chat
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏅 Leaderboard
                </Button>
              </Link>
              <Link to="/achievements">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎖️ Achievements
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💡 Feedback
                </Button>
              </Link>
              <Link to="/critics-analysis">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎥 Critics Analysis
                </Button>
              </Link>
              
              <Separator className="my-2" />
              
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pricing & Plans
                </Button>
              </Link>
              <Link to="/referrals">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Referrals
                </Button>
              </Link>
              <Link to="/app-update-ideas">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  💡 Submit Ideas
                </Button>
              </Link>
              
              <Separator className="my-2" />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">Get Started</h3>
                <p className="text-sm text-muted-foreground mb-4">Begin your Phototheology journey</p>
              </div>
              
              <Link to="/app-tour">
                <Button variant="outline" className="w-full border-2 border-palace-blue text-palace-blue font-semibold">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take a Tour First
                </Button>
              </Link>
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
