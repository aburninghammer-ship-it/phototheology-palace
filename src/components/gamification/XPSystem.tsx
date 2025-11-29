import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Trophy, Zap, Target, BookOpen, Brain, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface XPData {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXP: number;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];

const XP_REWARDS = {
  daily_login: 10,
  complete_devotional: 25,
  complete_challenge: 50,
  finish_course_lesson: 30,
  read_bible_chapter: 15,
  memory_verse: 40,
  share_content: 20,
  community_post: 15,
  streak_bonus: 5, // per day
};

export const XPSystem = () => {
  const { user } = useAuth();
  const [xpData, setXPData] = useState<XPData>({
    totalXP: 0,
    level: 1,
    xpToNextLevel: 100,
    currentLevelXP: 0,
  });
  const [recentXP, setRecentXP] = useState<{ amount: number; reason: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const loadXP = async () => {
      // Get XP from various activities
      const [challengeResult, devotionalResult, readingResult] = await Promise.all([
        supabase.from("challenge_submissions").select("id").eq("user_id", user.id),
        supabase.from("devotional_progress").select("id").eq("user_id", user.id),
        supabase.from("daily_reading_log").select("id").eq("user_id", user.id),
      ]);

      const challengeXP = (challengeResult.data?.length || 0) * XP_REWARDS.complete_challenge;
      const devotionalXP = (devotionalResult.data?.length || 0) * XP_REWARDS.complete_devotional;
      const readingXP = (readingResult.data?.length || 0) * XP_REWARDS.read_bible_chapter;
      
      const totalXP = challengeXP + devotionalXP + readingXP;
      
      let level = 1;
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_THRESHOLDS[i]) {
          level = i + 1;
          break;
        }
      }

      const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
      const nextLevelThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
      const currentLevelXP = totalXP - currentLevelThreshold;
      const xpToNextLevel = nextLevelThreshold - currentLevelThreshold;

      setXPData({ totalXP, level, xpToNextLevel, currentLevelXP });
    };

    loadXP();
  }, [user]);

  const progress = (xpData.currentLevelXP / xpData.xpToNextLevel) * 100;

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (level >= 7) return <Trophy className="h-5 w-5 text-purple-500" />;
    if (level >= 4) return <Star className="h-5 w-5 text-blue-500" />;
    return <Zap className="h-5 w-5 text-emerald-500" />;
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Experience Points
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {getLevelIcon(xpData.level)}
            <span className="ml-1">Level {xpData.level}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress to Level {xpData.level + 1}</span>
            <span className="font-medium">{xpData.currentLevelXP} / {xpData.xpToNextLevel} XP</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="text-center py-2 px-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{xpData.totalXP.toLocaleString()} XP</p>
          <p className="text-xs text-muted-foreground">Total Experience</p>
        </div>

        {recentXP && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-center"
          >
            <p className="font-bold">+{recentXP.amount} XP</p>
            <p className="text-xs">{recentXP.reason}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>Read: +{XP_REWARDS.read_bible_chapter} XP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-3 w-3" />
            <span>Challenge: +{XP_REWARDS.complete_challenge} XP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Brain className="h-3 w-3" />
            <span>Memorize: +{XP_REWARDS.memory_verse} XP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Devotional: +{XP_REWARDS.complete_devotional} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
