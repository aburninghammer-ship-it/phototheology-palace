import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, Lock } from "lucide-react";

const Achievements = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: false });
    
    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    const { data } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user!.id);
    
    setUserAchievements(new Set(data?.map(a => a.achievement_id) || []));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-4">
            <Award className="h-16 w-16" />
            <div>
              <h1 className="text-5xl font-bold">Achievements</h1>
              <p className="text-purple-200 text-lg">Unlock badges as you master Phototheology</p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Unlocked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {userAchievements.size} / {achievements.length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Total Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {achievements
                    .filter(a => userAchievements.has(a.id))
                    .reduce((sum, a) => sum + (a.points || 0), 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {achievements.length > 0 ? Math.round((userAchievements.size / achievements.length) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = userAchievements.has(achievement.id);
              return (
                <Card
                  key={achievement.id}
                  className={`transition-all ${
                    isUnlocked 
                      ? "border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-lg" 
                      : "opacity-50 grayscale"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon || '🏆'}
                        </div>
                        <span className="text-lg">{achievement.name}</span>
                      </div>
                      {isUnlocked ? (
                        <Award className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-base pl-14">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-14">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        +{achievement.points} points
                      </p>
                      {isUnlocked && (
                        <p className="text-xs text-muted-foreground">
                          ✓ Unlocked
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No achievements available yet. Check back soon!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Achievements;
