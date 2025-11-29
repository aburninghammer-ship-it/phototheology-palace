import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Calendar, Zap, Crown, Star, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface StreakMilestone {
  days: number;
  title: string;
  reward: string;
  icon: React.ElementType;
  color: string;
}

const MILESTONES: StreakMilestone[] = [
  { days: 3, title: "Getting Started", reward: "+10 XP", icon: Star, color: "text-green-500" },
  { days: 7, title: "Week Warrior", reward: "+25 XP", icon: Flame, color: "text-orange-500" },
  { days: 14, title: "Fortnight Fighter", reward: "+50 XP", icon: Zap, color: "text-yellow-500" },
  { days: 30, title: "Monthly Master", reward: "+100 XP", icon: Trophy, color: "text-amber-500" },
  { days: 60, title: "Discipline Disciple", reward: "+200 XP", icon: Crown, color: "text-purple-500" },
  { days: 90, title: "Quarter Champion", reward: "+300 XP", icon: Gift, color: "text-pink-500" },
  { days: 180, title: "Half-Year Hero", reward: "+500 XP", icon: Crown, color: "text-indigo-500" },
  { days: 365, title: "Annual Achiever", reward: "+1000 XP", icon: Crown, color: "text-primary" },
];

interface StreakSystemProps {
  variant?: "compact" | "full" | "minimal";
  showMilestones?: boolean;
}

export function StreakSystem({ variant = "full", showMilestones = true }: StreakSystemProps) {
  const { user } = useAuth();
  const [streak, setStreak] = useState({ current: 0, longest: 0, total: 0 });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (user) fetchStreak();
  }, [user]);

  const fetchStreak = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("daily_study_streak, longest_study_streak")
      .eq("id", user.id)
      .single();
    
    if (data) {
      setStreak({
        current: data.daily_study_streak || 0,
        longest: data.longest_study_streak || 0,
        total: data.longest_study_streak || 0
      });
    }
  };

  const getNextMilestone = () => {
    return MILESTONES.find(m => m.days > streak.current) || MILESTONES[MILESTONES.length - 1];
  };

  const getAchievedMilestones = () => {
    return MILESTONES.filter(m => m.days <= streak.current);
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone 
    ? (streak.current / nextMilestone.days) * 100 
    : 100;

  const getFlameSize = () => {
    if (streak.current >= 30) return "h-8 w-8";
    if (streak.current >= 14) return "h-7 w-7";
    if (streak.current >= 7) return "h-6 w-6";
    return "h-5 w-5";
  };

  const getFlameAnimation = () => {
    if (streak.current >= 30) return "animate-pulse";
    if (streak.current >= 7) return "animate-bounce";
    return "";
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2">
        <Flame className={`${getFlameSize()} text-orange-500 ${getFlameAnimation()}`} />
        <span className="font-bold text-lg">{streak.current}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
        <div className="flex items-center gap-1">
          <Flame className={`${getFlameSize()} text-orange-500 ${getFlameAnimation()}`} />
          <span className="font-bold text-xl">{streak.current}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <div>day streak</div>
          <div>Best: {streak.longest}</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-amber-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className={`${getFlameSize()} text-orange-500`} />
            </motion.div>
            <div>
              <div className="text-4xl font-bold">{streak.current}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Best: {streak.longest}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Total: {streak.total} days</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next: {nextMilestone.title}</span>
              <span className="font-medium">{streak.current}/{nextMilestone.days} days</span>
            </div>
            <Progress value={progressToNext} className="h-3" />
            <div className="flex items-center justify-end gap-1 text-xs text-green-500">
              <Gift className="h-3 w-3" />
              <span>{nextMilestone.reward}</span>
            </div>
          </div>
        )}

        {/* Milestones */}
        {showMilestones && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Milestones</div>
            <div className="flex flex-wrap gap-2">
              {MILESTONES.slice(0, 5).map((milestone) => {
                const achieved = streak.current >= milestone.days;
                const Icon = milestone.icon;
                return (
                  <Badge
                    key={milestone.days}
                    variant={achieved ? "default" : "outline"}
                    className={`${achieved ? milestone.color + " bg-opacity-20" : "opacity-50"}`}
                  >
                    <Icon className={`h-3 w-3 mr-1 ${achieved ? milestone.color : ""}`} />
                    {milestone.days}d
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Streak tips */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          💡 Study at least once per day to maintain your streak. Don't break the chain!
        </div>
      </CardContent>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-card p-6 rounded-lg text-center"
            >
              <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              <div className="text-xl font-bold">Milestone Reached!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
