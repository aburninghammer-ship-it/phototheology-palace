import { useEffect, useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { SpacedRepetitionReview } from "@/components/SpacedRepetitionReview";
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
  Users
} from "lucide-react";

interface DashboardStats {
  dailyStreak: number;
  totalPoints: number;
  level: number;
  chesStreak: number;
  gemStreak: number;
  studyStreak: number;
  recentActivity: string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRecentReading } = useReadingHistory();
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

  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadRecentReading();
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
      <SimplifiedNav />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Here's your learning progress</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.dailyStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">{pointsToNextLevel} to level {stats.level + 1}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.level}</div>
              <Progress value={levelProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
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

        {/* Recent Reading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Reading
            </CardTitle>
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
