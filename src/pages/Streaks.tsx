import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Sparkles, Gamepad2, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface StreakData {
  activity: string;
  icon: React.ReactNode;
  currentStreak: number;
  longestStreak: number;
  description: string;
  color: string;
}

export default function Streaks() {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<StreakData[]>([
    {
      activity: "Daily Study",
      icon: <Calendar className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: "Completing at least one exercise or study note per day.",
      color: "border-orange-500"
    },
    {
      activity: "Gem Creation",
      icon: <Sparkles className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: 'Creating at least one high-quality "Gem" per day.',
      color: "border-orange-500"
    },
    {
      activity: "Chain Chess",
      icon: <Gamepad2 className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: "Winning at least one game of Chain Chess per day.",
      color: "border-gray-400"
    },
    {
      activity: "Equations",
      icon: <Calculator className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: "Completing one round of the Equations game per day.",
      color: "border-gray-400"
    }
  ]);

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user]);

  const fetchStreakData = async () => {
    // Fetch user streak data from database
    const { data: userData } = await supabase
      .from('profiles')
      .select('daily_study_streak, longest_study_streak, gem_creation_streak, longest_gem_streak, chain_chess_streak, longest_chess_streak, equations_streak, longest_equations_streak')
      .eq('id', user?.id)
      .single();

    if (userData) {
      setStreaks([
        {
          activity: "Daily Study",
          icon: <Calendar className="h-6 w-6" />,
          currentStreak: userData.daily_study_streak || 0,
          longestStreak: userData.longest_study_streak || 0,
          description: "Completing at least one exercise or study note per day.",
          color: userData.daily_study_streak > 0 ? "border-orange-500" : "border-gray-400"
        },
        {
          activity: "Gem Creation",
          icon: <Sparkles className="h-6 w-6" />,
          currentStreak: userData.gem_creation_streak || 0,
          longestStreak: userData.longest_gem_streak || 0,
          description: 'Creating at least one high-quality "Gem" per day.',
          color: userData.gem_creation_streak > 0 ? "border-orange-500" : "border-gray-400"
        },
        {
          activity: "Chain Chess",
          icon: <Gamepad2 className="h-6 w-6" />,
          currentStreak: userData.chain_chess_streak || 0,
          longestStreak: userData.longest_chess_streak || 0,
          description: "Winning at least one game of Chain Chess per day.",
          color: userData.chain_chess_streak > 0 ? "border-gray-400" : "border-gray-400"
        },
        {
          activity: "Equations",
          icon: <Calculator className="h-6 w-6" />,
          currentStreak: userData.equations_streak || 0,
          longestStreak: userData.longest_equations_streak || 0,
          description: "Completing one round of the Equations game per day.",
          color: userData.equations_streak > 0 ? "border-gray-400" : "border-gray-400"
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-6 py-2 text-base border-orange-500">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            My Streaks
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold">
            Consistency is Key
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your momentum and build powerful study habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {streaks.map((streak, index) => (
            <Card key={index} className={`border-2 ${streak.color} transition-all hover:shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {streak.icon}
                  {streak.activity}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-orange-500">
                      {streak.currentStreak}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current Streak
                    </p>
                  </div>
                  <div className="h-20 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {streak.longestStreak}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Longest Streak
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground border-t pt-4">
                  {streak.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}