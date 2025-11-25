import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, Award, Book, Brain, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const UserMetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalVerses: 0,
    memorizedVerses: 0,
    currentStreak: 0,
    totalGems: 0,
    totalApologetics: 0,
    masteryLevel: 0,
    floorsCompleted: 0
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load memory verses
    const { count: memoryCount } = await supabase
      .from("memorization_verses")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id);

    const { data: memoryVerses } = await supabase
      .from("memorization_verses")
      .select("mastery_level")
      .eq("user_id", user.id)
      .gte("mastery_level", 4);

    // Load gems/tags (use count)
    const { count: gemsCount, error: gemsError } = await supabase
      .from("user_gems")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id);

    // Load apologetics notes (count only)
    const { count: apologeticsCount, error: apologeticsError } = await supabase
      .from("user_gems")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .ilike("gem_type", "%apologetics%");

    // Load streak
    const { data: streak } = await supabase
      .from("mastery_streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .maybeSingle();

    // Load mastery
    const { data: mastery } = await supabase
      .from("global_master_titles")
      .select("floors_completed, total_xp")
      .eq("user_id", user.id)
      .maybeSingle();

    const totalMemory = memoryCount || 0;
    const masteredVerses = memoryVerses?.length || 0;

    setMetrics({
      totalVerses: totalMemory,
      memorizedVerses: masteredVerses,
      currentStreak: streak?.current_streak || 0,
      totalGems: gemsCount || 0,
      totalApologetics: apologeticsCount || 0,
      masteryLevel: mastery?.total_xp || 0,
      floorsCompleted: mastery?.floors_completed || 0
    });
  };

  const masteryPercentage = metrics.totalVerses > 0 
    ? (metrics.memorizedVerses / metrics.totalVerses) * 100 
    : 0;

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-sm text-foreground">Your Progress</h4>
        </div>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          Level {Math.floor(metrics.masteryLevel / 100)}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="p-3 bg-background/50 rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.currentStreak}
          </div>
          <div className="text-xs text-muted-foreground">days</div>
        </div>

        {/* Memory Verses */}
        <div className="p-3 bg-background/50 rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-muted-foreground">Memory</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.totalVerses}
          </div>
          <div className="text-xs text-muted-foreground">verses</div>
        </div>

        {/* Gems/Tags */}
        <div className="p-3 bg-background/50 rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Book className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Gems</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.totalGems}
          </div>
          <div className="text-xs text-muted-foreground">tagged</div>
        </div>

        {/* Apologetics */}
        <div className="p-3 bg-background/50 rounded border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-muted-foreground">Defense</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {metrics.totalApologetics}
          </div>
          <div className="text-xs text-muted-foreground">notes</div>
        </div>
      </div>

      {/* Mastery Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Verse Mastery</span>
          <span className="text-xs font-semibold text-foreground">
            {metrics.memorizedVerses}/{metrics.totalVerses}
          </span>
        </div>
        <Progress value={masteryPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {Math.round(masteryPercentage)}% of verses mastered (4+ stars)
        </p>
      </div>

      {/* Floors Completed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Palace Floors</span>
          <span className="text-xs font-semibold text-foreground">
            {metrics.floorsCompleted}/8
          </span>
        </div>
        <Progress value={(metrics.floorsCompleted / 8) * 100} className="h-2" />
      </div>

      {/* Achievement Badge */}
      <div className="bg-accent/10 p-3 rounded border border-accent/20 flex items-center gap-3">
        <Award className="h-8 w-8 text-primary" />
        <div>
          <p className="text-xs font-semibold text-foreground">
            {metrics.masteryLevel > 1000 
              ? "Advanced Scholar"
              : metrics.masteryLevel > 500
              ? "Dedicated Learner"
              : metrics.masteryLevel > 100
              ? "Rising Student"
              : "Beginner"}
          </p>
          <p className="text-xs text-muted-foreground">
            {metrics.masteryLevel} XP earned
          </p>
        </div>
      </div>

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Track Progress:</strong> Build your streak, master verses, and advance through the 8 floors of the Palace!
        </p>
      </div>
    </Card>
  );
};
