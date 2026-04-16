import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Sparkles, Gamepad2, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

interface StreakData {
  activity: string;
  icon: React.ReactNode;
  currentStreak: number;
  longestStreak: number;
  description: string;
  color: string;
}

export default function Streaks() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<StreakData[]>([
    {
      activity: t('streaks.activities.dailyStudy.name'),
      icon: <Calendar className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: t('streaks.activities.dailyStudy.description'),
      color: "border-orange-500"
    },
    {
      activity: t('streaks.activities.gemCreation.name'),
      icon: <Sparkles className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: t('streaks.activities.gemCreation.description'),
      color: "border-orange-500"
    },
    {
      activity: t('streaks.activities.chainChess.name'),
      icon: <Gamepad2 className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: t('streaks.activities.chainChess.description'),
      color: "border-gray-400"
    },
    {
      activity: t('streaks.activities.equations.name'),
      icon: <Calculator className="h-6 w-6" />,
      currentStreak: 0,
      longestStreak: 0,
      description: t('streaks.activities.equations.description'),
      color: "border-gray-400"
    }
  ]);

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user]);

  const fetchStreakData = async () => {
    // Fetch user streak data from profiles
    const { data: userData } = await supabase
      .from('profiles')
      .select('daily_study_streak, longest_study_streak, gem_creation_streak, longest_gem_streak, chain_chess_streak, longest_chess_streak, equations_streak, longest_equations_streak')
      .eq('id', user?.id)
      .single();

    // Also fetch reading_streaks as primary source of truth for study streaks
    const { data: readingData } = await supabase
      .from('reading_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user?.id)
      .maybeSingle();

    const studyStreak = readingData?.current_streak || userData?.daily_study_streak || 0;
    const longestStudy = readingData?.longest_streak || userData?.longest_study_streak || 0;

    setStreaks([
      {
        activity: t('streaks.activities.dailyStudy.name'),
        icon: <Calendar className="h-6 w-6" />,
        currentStreak: studyStreak,
        longestStreak: longestStudy,
        description: t('streaks.activities.dailyStudy.description'),
        color: studyStreak > 0 ? "border-orange-500" : "border-gray-400"
      },
      {
        activity: t('streaks.activities.gemCreation.name'),
        icon: <Sparkles className="h-6 w-6" />,
        currentStreak: userData?.gem_creation_streak || 0,
        longestStreak: userData?.longest_gem_streak || 0,
        description: t('streaks.activities.gemCreation.description'),
        color: (userData?.gem_creation_streak || 0) > 0 ? "border-orange-500" : "border-gray-400"
      },
      {
        activity: t('streaks.activities.chainChess.name'),
        icon: <Gamepad2 className="h-6 w-6" />,
        currentStreak: userData?.chain_chess_streak || 0,
        longestStreak: userData?.longest_chess_streak || 0,
        description: t('streaks.activities.chainChess.description'),
        color: (userData?.chain_chess_streak || 0) > 0 ? "border-purple-500" : "border-gray-400"
      },
      {
        activity: t('streaks.activities.equations.name'),
        icon: <Calculator className="h-6 w-6" />,
        currentStreak: userData?.equations_streak || 0,
        longestStreak: userData?.longest_equations_streak || 0,
        description: t('streaks.activities.equations.description'),
        color: (userData?.equations_streak || 0) > 0 ? "border-blue-500" : "border-gray-400"
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-6 py-2 text-base border-orange-500">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            {t('streaks.badge')}
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold">
            {t('streaks.title')}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('streaks.subtitle')}
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
                      {t('streaks.currentStreak')}
                    </p>
                  </div>
                  <div className="h-20 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {streak.longestStreak}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('streaks.longestStreak')}
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
      <Footer />
    </div>
  );
}