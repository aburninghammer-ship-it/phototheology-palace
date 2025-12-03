import { useEffect, useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { SpacedRepetitionReview } from "@/components/SpacedRepetitionReview";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { PalaceProgressDashboard } from "@/components/PalaceProgressDashboard";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { JeevesWelcomeModal } from "@/components/retention/JeevesWelcomeModal";
import { PathBanner, PathDashboardWidget } from "@/components/path";
import { Brain, Building2 } from "lucide-react";
import { 
  BookOpen, 
  Flame, 
  Trophy, 
  Target,
  TrendingUp,
  Clock,
  Award,
  Play,
  History,
  Users,
  Star,
  Sparkles,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { XPSystem, BadgeSystem, WeeklyLeaderboard } from "@/components/gamification";

interface DashboardStats {
  dailyStreak: number;
  totalPoints: number;
  level: number;
  chesStreak: number;
  gemStreak: number;
  studyStreak: number;
  recentActivity: string[];
}

const featuredContent = [
  {
    day: 1, // Monday
    title: "Chain Chess",
    description: "Master typological connections by linking Bible verses in this strategic game",
    path: "/chain-chess",
    icon: Target,
    gradient: "gradient-ocean",
    reason: "Perfect for building pattern recognition skills"
  },
  {
    day: 2, // Tuesday
    title: "Treasure Hunt",
    description: "Solve clues and discover hidden biblical principles in this timed adventure",
    path: "/treasure-hunt",
    icon: Sparkles,
    gradient: "gradient-palace",
    reason: "Great for applied learning and time management"
  },
  {
    day: 3, // Wednesday
    title: "Daniel & Revelation GPT",
    description: "Chat with AI trained on Daniel & Revelation to deepen your understanding",
    path: "/daniel-revelation-gpt",
    icon: Brain,
    gradient: "gradient-dreamy",
    reason: "Ideal for answering specific questions"
  },
  {
    day: 4, // Thursday
    title: "Memory Palace",
    description: "Explore the 3D visual journey through Bible typology and sanctuary principles",
    path: "/palace",
    icon: Building2,
    gradient: "gradient-ocean",
    reason: "Best for visual learners and comprehensive overview"
  },
  {
    day: 5, // Friday
    title: "Escape Rooms",
    description: "Race against the clock to solve principle-based Bible puzzles",
    path: "/escape-room",
    icon: Clock,
    gradient: "gradient-palace",
    reason: "Excellent for competitive learners"
  },
  {
    day: 6, // Saturday
    title: "Community & Study Partners",
    description: "Connect with fellow students, share insights, and grow together",
    path: "/community",
    icon: Users,
    gradient: "gradient-dreamy",
    reason: "Perfect for collaborative learning"
  },
  {
    day: 0, // Sunday
    title: "Revelation Course",
    description: "Follow our structured course for deep, comprehensive Bible study",
    path: "/revelation-course",
    icon: BookOpen,
    gradient: "gradient-ocean",
    reason: "Ideal for systematic, thorough learning"
  },
];

const getFeaturedToday = () => {
  const today = new Date().getDay();
  return featuredContent.find(item => item.day === today) || featuredContent[0];
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRecentReading } = useReadingHistory();
  const { preferences } = useUserPreferences();
  const [stats, setStats] = useState<DashboardStats>({
    dailyStreak: 0,
    totalPoints: 0,
    level: 1,
    chesStreak: 0,
    gemStreak: 0,
    studyStreak: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [recentReading, setRecentReading] = useState<any[]>([]);
  const featured = getFeaturedToday();
  const FeaturedIcon = featured.icon;

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadRecentReading();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecentReading = async () => {
    const history = await getRecentReading(3);
    setRecentReading(history);
  };

  const loadDashboardData = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (profile) {
        setStats({
          dailyStreak: profile.daily_study_streak || 0,
          totalPoints: profile.points || 0,
          level: profile.level || 1,
          chesStreak: profile.chain_chess_streak || 0,
          gemStreak: profile.gem_creation_streak || 0,
          studyStreak: profile.daily_study_streak || 0,
          recentActivity: [],
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const pointsToNextLevel = Math.ceil((stats.level * 1000) - (stats.totalPoints % (stats.level * 1000)));
  const levelProgress = ((stats.totalPoints % (stats.level * 1000)) / (stats.level * 1000)) * 100;

  return (
    <div className="min-h-screen gradient-dreamy">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <JeevesWelcomeModal />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <img 
            src="/pwa-192x192.png" 
            alt="Phototheology" 
            className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-foreground/80">Here's your learning progress</p>
          </div>
        </div>

        {/* Path Selection Banner (opt-in for existing users) */}
        <PathBanner />

        {/* Path Dashboard Widget */}
        <div className="mb-8">
          <PathDashboardWidget />
        </div>

        {/* Featured Today */}
        <Card className={`mb-8 ${featured.gradient} border-0 text-white overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white mb-1">Featured Today</CardTitle>
                  <CardDescription className="text-white/80">{featured.reason}</CardDescription>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <FeaturedIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">{featured.title}</h3>
            <p className="text-white/90 mb-4">{featured.description}</p>
            <Button 
              onClick={() => navigate(featured.path)}
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Try it now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.dailyStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">{pointsToNextLevel} to level {stats.level + 1}</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.level}</div>
              <Progress value={levelProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chess Streak</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.chesStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">wins in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Palace Progress & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PalaceProgressDashboard />
          
          <div className="space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/palace")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Memory Palace
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/bible")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Bible
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/revelation-course")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Continue Revelation Course
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/certificates")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  My Certificates
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/study-partners")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Study Partners
                </Button>
              </CardContent>
            </Card>

            <SpacedRepetitionReview />
          </div>
        </div>

        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <XPSystem />
          <BadgeSystem />
          <WeeklyLeaderboard />
        </div>

        {/* Recent Reading */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Reading
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-progress")}>
                <BarChart3 className="h-4 w-4 mr-1" />
                View Analytics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReading.length > 0 ? (
              <div className="space-y-2">
                {recentReading.map((reading) => (
                  <Button
                    key={reading.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/bible/${reading.book}/${reading.chapter}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {reading.book} {reading.chapter}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Start reading to see your history here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
