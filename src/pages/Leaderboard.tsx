import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Award, Target } from "lucide-react";

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userStats, setUserStats] = useState({ points: 0, challenges: 0, achievements: 0 });
  const [sortBy, setSortBy] = useState<'points' | 'challenges' | 'studies'>('points');

  useEffect(() => {
    if (user) {
      fetchLeaders();
      fetchUserStats();
    }
  }, [user, sortBy]);

  const fetchUserStats = async () => {
    // Get user profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user!.id)
      .single();

    // Get challenges completed
    const { data: challenges } = await supabase
      .from("challenge_submissions")
      .select("id")
      .eq("user_id", user!.id);

    // Get achievements earned
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user!.id);

    setUserStats({
      points: profile?.points || 0,
      challenges: challenges?.length || 0,
      achievements: achievements?.length || 0,
    });

    // Calculate user rank
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("id, points")
      .order("points", { ascending: false });

    const rank = allProfiles?.findIndex(p => p.id === user!.id) ?? -1;
    setUserRank(rank + 1);
  };

  const fetchLeaders = async () => {
    if (sortBy === 'points') {
      // Sort by points (default)
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level")
        .order("points", { ascending: false })
        .limit(50);
      
      setLeaders(data || []);
    } else if (sortBy === 'challenges') {
      // Sort by challenges completed
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level");

      if (profiles) {
        // Get challenge counts for each user
        const leadersWithChallenges = await Promise.all(
          profiles.map(async (profile) => {
            const { data: submissions } = await supabase
              .from("challenge_submissions")
              .select("id")
              .eq("user_id", profile.id);
            
            return {
              ...profile,
              challengeCount: submissions?.length || 0
            };
          })
        );

        // Sort by challenge count and take top 50
        const sorted = leadersWithChallenges
          .sort((a, b) => b.challengeCount - a.challengeCount)
          .slice(0, 50);
        
        setLeaders(sorted);
      }
    } else if (sortBy === 'studies') {
      // Sort by study activity (daily streak)
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, points, level, daily_study_streak")
        .order("daily_study_streak", { ascending: false })
        .limit(50);
      
      setLeaders(data || []);
    }
  };

  if (!user) return null;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="h-16 w-16" />
            <div>
              <h1 className="text-5xl font-bold">Leaderboard</h1>
              <p className="text-purple-200 text-lg">Top Phototheology scholars</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">#{userRank || '-'}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Total Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.points}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.challenges}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.achievements}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Sort Tabs */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={sortBy === 'points' ? 'default' : 'outline'}
                  onClick={() => setSortBy('points')}
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  By Points
                </Button>
                <Button
                  variant={sortBy === 'challenges' ? 'default' : 'outline'}
                  onClick={() => setSortBy('challenges')}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  By Challenges
                </Button>
                <Button
                  variant={sortBy === 'studies' ? 'default' : 'outline'}
                  onClick={() => setSortBy('studies')}
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  By Studies
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaders.map((leader, index) => {
                  const isCurrentUser = leader.id === user?.id;
                  return (
                    <div
                      key={leader.username}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400'
                          : index === 0
                          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                          : 'bg-accent/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold w-12 text-center flex items-center justify-center">
                          {getRankIcon(index) || `#${index + 1}`}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {leader.display_name || leader.username}
                            </p>
                            {isCurrentUser && (
                              <Badge variant="secondary" className="bg-purple-500 text-white">You</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Level {leader.level} • {sortBy === 'challenges' ? leader.challengeCount || 0 : 0} challenges • {sortBy === 'studies' ? leader.daily_study_streak || 0 : 0} day streak
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {sortBy === 'points' && (
                          <>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{leader.points}</p>
                            <p className="text-sm text-muted-foreground">points</p>
                          </>
                        )}
                        {sortBy === 'challenges' && (
                          <>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{leader.challengeCount || 0}</p>
                            <p className="text-sm text-muted-foreground">challenges</p>
                          </>
                        )}
                        {sortBy === 'studies' && (
                          <>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{leader.daily_study_streak || 0}</p>
                            <p className="text-sm text-muted-foreground">day streak</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
