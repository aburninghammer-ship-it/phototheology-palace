import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Menu, 
  Building2, 
  BookOpen, 
  Sparkles, 
  User, 
  CreditCard, 
  LogOut, 
  Clock, 
  Star,
  Home,
  Gamepad2,
  Users,
  GraduationCap,
  Zap,
  Trophy,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecentPages } from "@/hooks/useRecentPages";
import { usePageBookmarks } from "@/hooks/usePageBookmarks";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const categoryConfig = {
  study: {
    title: "Study",
    icon: BookOpen,
    links: [
      { to: "/bible", label: "Phototheology Study Bible (PSB)", icon: "📖" },
      
      { to: "/reading-plans", label: "Reading Plans", icon: "📅" },
      { to: "/encyclopedia", label: "Encyclopedia", icon: "🔍" },
      { to: "/video-training", label: "Video Training", icon: "🎥" },
      { to: "/my-studies", label: "My Studies", icon: "📝" },
      { to: "/palace/floor/1/room/gr", label: "Produce a Gem", icon: "💎" },
      { to: "/memory", label: "Memory Palace", icon: "🧠" },
      { to: "/verse-memory-hall", label: "Verse Memory Hall (Legacy)", icon: "📚" },
      { to: "/bible-image-library", label: "Image Library", icon: "🎨" },
      { to: "/quarterly-study", label: "Amplified Quarterly", icon: "📅" },
      { to: "/bible-study-leader", label: "Lead Bible Study", icon: "👥" },
    ],
  },
  practice: {
    title: "Practice",
    icon: Gamepad2,
    links: [
      { to: "/games", label: "Palace Games", icon: "🎮" },
      { to: "/kids-games", label: "Kids Games", icon: "👶" },
      { to: "/training-drills", label: "Training Drills", icon: "⚡" },
      { to: "/daily-challenges", label: "Daily Challenges", icon: "📅" },
      { to: "/treasure-hunt", label: "Treasure Hunt", icon: "🏆" },
      { to: "/escape-room", label: "Escape Rooms", icon: "🚨" },
    ],
  },
  blueprints: {
    title: "Blueprints",
    icon: Building2,
    links: [
      { to: "/blueprint-marriage", label: "Dating & Marriage", icon: "💍" },
      { to: "/blueprint-grief", label: "Grieving", icon: "💙" },
      { to: "/blueprint-stronghold", label: "Breaking Strongholds", icon: "🛡️" },
      { to: "/blueprint-weight-loss", label: "Weight Loss", icon: "⚖️" },
      { to: "/blueprint-mental-health", label: "Mental Health", icon: "🧠" },
      { to: "/blueprint-financial", label: "Financial Stability", icon: "💰" },
      { to: "/blueprint-stress", label: "Stress Management", icon: "🧘" },
    ],
  },
  learn: {
    title: "Learn",
    icon: GraduationCap,
    links: [
      { to: "/palace", label: "The Palace", icon: "🏰" },
      { to: "/phototheology-course", label: "Phototheology Course", icon: "📚" },
      { to: "/blueprint-course", label: "Blueprint Course", icon: "📐" },
      { to: "/daniel-course", label: "Daniel Course", icon: "🦁" },
      { to: "/revelation-course", label: "Revelation Course", icon: "📜" },
    ],
  },
  gpts: {
    title: "GPTs",
    icon: Sparkles,
    links: [
      { to: "/phototheologygpt", label: "Phototheology GPT", icon: "🤖" },
      { to: "/branch-study", label: "BranchStudy", icon: "🌳" },
      { to: "/apologetics-gpt", label: "Apologetics GPT", icon: "🛡️" },
      { to: "/daniel-revelation-gpt", label: "Daniel & Revelation", icon: "📜" },
      { to: "/culture-controversy", label: "Culture & Controversy", icon: "🌍" },
      { to: "/kidgpt", label: "Kid GPT", icon: "👶" },
    ],
  },
  research: {
    title: "Research",
    icon: Zap,
    links: [
      { to: "/research-mode", label: "Research Mode", icon: "🔬" },
      { to: "/prophecy-watch", label: "Prophecy Watch", icon: "👁️" },
    ],
  },
  community: {
    title: "Community",
    icon: Users,
    links: [
      { to: "/guilds", label: "Guilds", icon: "⚔️" },
      { to: "/community", label: "Community Chat", icon: "💬" },
      { to: "/live-study", label: "Live Study", icon: "📺" },
      { to: "/leaderboard", label: "Leaderboard", icon: "🏅" },
      { to: "/achievements", label: "Achievements", icon: "🎖️" },
      { to: "/streaks", label: "Streaks", icon: "🔥" },
      { to: "/feedback", label: "Feedback", icon: "💡" },
    ],
  },
  mastery: {
    title: "Progress",
    icon: Trophy,
    links: [
      { to: "/mastery-dashboard", label: "Mastery Dashboard", icon: "🎯" },
      { to: "/genesis-challenge", label: "Genesis High Rise", icon: "🏢" },
      { to: "/spiritual-training", label: "Christian Art of War Dojo", icon: "⚔️" },
    ],
  },
};

export const EnhancedMobileDrawer = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { recentPages, clearRecentPages } = useRecentPages();
  const { bookmarks, isBookmarked, toggleBookmark } = usePageBookmarks();
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  // Close drawer when auth state changes to force re-render with new state
  useEffect(() => {
    setOpen(false);
  }, [user]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="bg-gradient-palace bg-clip-text text-transparent">
                Phototheology
              </span>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">Close</Button>
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="flex-1 px-4">
          {user ? (
            <div className="py-4 space-y-6">
              {/* Quick Actions */}
              <div>
                <Button 
                  asChild 
                  variant="default" 
                  className="w-full justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </div>

              {/* Recent Pages */}
              {recentPages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Recently Visited</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentPages}
                        className="h-7 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {recentPages.slice(0, 5).map((page) => (
                        <Button
                          key={page.path}
                          asChild
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-between",
                            location.pathname === page.path && "bg-accent"
                          )}
                          onClick={handleLinkClick}
                        >
                          <Link to={page.path}>
                            <span className="truncate">{page.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleBookmark({ path: page.path, title: page.title });
                              }}
                            >
                              <Star
                                className={cn(
                                  "h-3 w-3",
                                  isBookmarked(page.path) && "fill-yellow-500 text-yellow-500"
                                )}
                              />
                            </Button>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Bookmarks */}
              {bookmarks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <h3 className="text-sm font-semibold text-foreground">Bookmarks</h3>
                    </div>
                    <div className="space-y-1">
                      {bookmarks.map((bookmark) => (
                        <Button
                          key={bookmark.path}
                          asChild
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-between",
                            location.pathname === bookmark.path && "bg-accent"
                          )}
                          onClick={handleLinkClick}
                        >
                          <Link to={bookmark.path}>
                            <span className="truncate">{bookmark.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleBookmark(bookmark);
                              }}
                            >
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            </Button>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Categorized Navigation */}
              {Object.entries(categoryConfig).map(([key, category]) => (
                <div key={key}>
                  <Separator className="mb-3" />
                  <div className="flex items-center gap-2 mb-3">
                    <category.icon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
                  </div>
                  <div className="space-y-1">
                    {category.links.map((link) => (
                      <Button
                        key={link.to}
                        asChild
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-between",
                          location.pathname === link.to && "bg-accent"
                        )}
                        onClick={handleLinkClick}
                      >
                        <Link to={link.to}>
                          <span className="flex items-center gap-2">
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark({ path: link.to, title: link.label, icon: link.icon });
                            }}
                          >
                            <Star
                              className={cn(
                                "h-3 w-3",
                                isBookmarked(link.to) && "fill-yellow-500 text-yellow-500"
                              )}
                            />
                          </Button>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Account Section */}
              <Separator />
              <div className="space-y-1 pb-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/pricing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pricing & Plans
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="text-center">
                <h3 className="font-serif text-lg font-semibold mb-2">Get Started</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Begin your Phototheology journey
                </p>
              </div>
              
              <Button asChild variant="outline" className="w-full" onClick={handleLinkClick}>
                <Link to="/app-tour">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take a Tour
                </Link>
              </Button>
              <Button asChild className="w-full gradient-palace" onClick={handleLinkClick}>
                <Link to="/auth">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={handleLinkClick}>
                <Link to="/pricing">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Pricing
                </Link>
              </Button>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
