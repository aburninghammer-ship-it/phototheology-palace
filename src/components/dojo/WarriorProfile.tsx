import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Shield, Sword, Crown, Star, Zap, Target, Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

// Warrior Belt/Rank System
const WARRIOR_RANKS = [
  { name: "Recruit", belt: "white", minXP: 0, icon: "🥋", color: "bg-gray-100 text-gray-800", description: "Beginning the journey" },
  { name: "Soldier", belt: "yellow", minXP: 100, icon: "⚔️", color: "bg-yellow-100 text-yellow-800", description: "Learning the basics of spiritual warfare" },
  { name: "Guardian", belt: "orange", minXP: 300, icon: "🛡️", color: "bg-orange-100 text-orange-800", description: "Standing firm in faith" },
  { name: "Warrior", belt: "green", minXP: 600, icon: "🏹", color: "bg-green-100 text-green-800", description: "Active in daily battle" },
  { name: "Champion", belt: "blue", minXP: 1000, icon: "⚡", color: "bg-blue-100 text-blue-800", description: "Consistent victor over self" },
  { name: "Knight", belt: "purple", minXP: 1500, icon: "🗡️", color: "bg-purple-100 text-purple-800", description: "Master of spiritual weapons" },
  { name: "Commander", belt: "brown", minXP: 2200, icon: "🦁", color: "bg-amber-800 text-white", description: "Leading others in battle" },
  { name: "Master", belt: "red", minXP: 3000, icon: "🔥", color: "bg-red-100 text-red-800", description: "Expert in all combat forms" },
  { name: "Grand Master", belt: "black", minXP: 4000, icon: "👑", color: "bg-gray-900 text-white", description: "Fully armored warrior of God" },
  { name: "Legend", belt: "gold", minXP: 5500, icon: "✨", color: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black", description: "An inspiration to all warriors" },
];

// XP rewards for activities
const XP_REWARDS = {
  lessonComplete: 25,
  scenarioWin: 15,
  scenarioAttempt: 5,
  challengeDayComplete: 20,
  weaponPractice: 10,
  dailyLogin: 5,
  streakBonus: 3, // per day of streak
  perfectWeek: 50,
};

interface WarriorStats {
  totalXP: number;
  lessonsCompleted: number;
  scenariosWon: number;
  scenariosAttempted: number;
  challengeDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  weaponsPracticed: number;
}

interface WarriorProfileProps {
  onChallengeClick?: () => void;
}

export const WarriorProfile = ({ onChallengeClick }: WarriorProfileProps) => {
  const [stats, setStats] = useState<WarriorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showRankUp, setShowRankUp] = useState(false);

  useEffect(() => {
    loadWarriorStats();
  }, []);

  const loadWarriorStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    // Fetch lessons completed
    const { data: lessons } = await supabase
      .from('dojo_lessons')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);

    // Fetch challenge days completed
    const { data: challenges } = await supabase
      .from('dojo_challenges')
      .select('*')
      .eq('user_id', user.id);

    // Calculate stats
    const lessonsCompleted = lessons?.length || 0;
    const challengeDaysCompleted = challenges?.length || 0;

    // Calculate XP
    const totalXP =
      (lessonsCompleted * XP_REWARDS.lessonComplete) +
      (challengeDaysCompleted * XP_REWARDS.challengeDayComplete);

    // Calculate streak (simplified)
    const today = new Date().toDateString();
    const lastActive = challenges?.sort((a, b) =>
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )[0]?.completed_at;

    let currentStreak = 0;
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const diff = Math.floor((new Date().getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      currentStreak = diff <= 1 ? challenges?.length || 0 : 0;
    }

    setStats({
      totalXP,
      lessonsCompleted,
      scenariosWon: 0,
      scenariosAttempted: 0,
      challengeDaysCompleted,
      currentStreak: Math.min(currentStreak, 30),
      longestStreak: Math.min(challengeDaysCompleted, 30),
      lastActiveDate: lastActive || today,
      weaponsPracticed: 0,
    });

    setLoading(false);
  };

  const getCurrentRank = () => {
    if (!stats) return WARRIOR_RANKS[0];
    return [...WARRIOR_RANKS].reverse().find(r => stats.totalXP >= r.minXP) || WARRIOR_RANKS[0];
  };

  const getNextRank = () => {
    const currentRankIndex = WARRIOR_RANKS.findIndex(r => r.name === getCurrentRank().name);
    return WARRIOR_RANKS[currentRankIndex + 1] || null;
  };

  const getProgressToNextRank = () => {
    if (!stats) return 0;
    const currentRank = getCurrentRank();
    const nextRank = getNextRank();
    if (!nextRank) return 100;

    const xpIntoCurrentRank = stats.totalXP - currentRank.minXP;
    const xpNeededForNext = nextRank.minXP - currentRank.minXP;
    return Math.min((xpIntoCurrentRank / xpNeededForNext) * 100, 100);
  };

  if (loading) {
    return (
      <Card variant="glass" className="animate-pulse">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading warrior profile...
        </CardContent>
      </Card>
    );
  }

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();
  const progressToNext = getProgressToNextRank();

  return (
    <Card variant="glass" className="border-primary/30 overflow-hidden">
      {/* Rank Banner */}
      <div className={`${currentRank.color} p-4 text-center`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-1"
        >
          <span className="text-4xl">{currentRank.icon}</span>
          <h2 className="text-2xl font-bold">{currentRank.name}</h2>
          <p className="text-sm opacity-80">{currentRank.belt.toUpperCase()} BELT</p>
        </motion.div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              {stats?.totalXP || 0} XP
            </span>
            {nextRank && (
              <span className="text-muted-foreground">
                {nextRank.minXP - (stats?.totalXP || 0)} XP to {nextRank.name}
              </span>
            )}
          </div>
          <Progress value={progressToNext} className="h-3" />
          {nextRank && (
            <p className="text-xs text-center text-muted-foreground">
              Next: {nextRank.icon} {nextRank.name} ({nextRank.belt} belt)
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 text-center"
          >
            <Trophy className="w-6 h-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{stats?.lessonsCompleted || 0}</p>
            <p className="text-xs text-muted-foreground">Lessons Mastered</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg p-3 text-center"
          >
            <Flame className="w-6 h-6 mx-auto text-orange-500 mb-1" />
            <p className="text-2xl font-bold">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3 text-center"
          >
            <Target className="w-6 h-6 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold">{stats?.challengeDaysCompleted || 0}</p>
            <p className="text-xs text-muted-foreground">Challenge Days</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-3 text-center"
          >
            <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{stats?.scenariosWon || 0}</p>
            <p className="text-xs text-muted-foreground">Battles Won</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            className="w-full gradient-palace"
            onClick={onChallengeClick}
          >
            <Sword className="w-4 h-4 mr-2" />
            Enter the Arena
          </Button>
        </div>

        {/* Rank Description */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p className="italic">"{currentRank.description}"</p>
        </div>
      </CardContent>
    </Card>
  );
};
