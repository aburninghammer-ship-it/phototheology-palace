import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, BookOpen, Flame, Target, Users, Brain, Heart, Star, Lock, Crown, Zap, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requirement: { type: string; count: number };
  tier: "bronze" | "silver" | "gold" | "platinum";
}

const BADGES: BadgeDefinition[] = [
  // Reading badges
  { id: "reader_10", name: "Scripture Reader", description: "Read 10 Bible chapters", icon: BookOpen, color: "from-blue-400 to-cyan-400", requirement: { type: "reading", count: 10 }, tier: "bronze" },
  { id: "reader_50", name: "Bible Scholar", description: "Read 50 Bible chapters", icon: BookOpen, color: "from-blue-500 to-cyan-500", requirement: { type: "reading", count: 50 }, tier: "silver" },
  { id: "reader_200", name: "Word Master", description: "Read 200 Bible chapters", icon: BookOpen, color: "from-blue-600 to-cyan-600", requirement: { type: "reading", count: 200 }, tier: "gold" },
  
  // Streak badges
  { id: "streak_7", name: "Week Warrior", description: "7-day study streak", icon: Flame, color: "from-orange-400 to-red-400", requirement: { type: "streak", count: 7 }, tier: "bronze" },
  { id: "streak_30", name: "Monthly Champion", description: "30-day study streak", icon: Flame, color: "from-orange-500 to-red-500", requirement: { type: "streak", count: 30 }, tier: "silver" },
  { id: "streak_100", name: "Century Streak", description: "100-day study streak", icon: Flame, color: "from-orange-600 to-red-600", requirement: { type: "streak", count: 100 }, tier: "gold" },
  
  // Challenge badges
  { id: "challenge_5", name: "Challenger", description: "Complete 5 challenges", icon: Target, color: "from-purple-400 to-pink-400", requirement: { type: "challenges", count: 5 }, tier: "bronze" },
  { id: "challenge_25", name: "Challenge Master", description: "Complete 25 challenges", icon: Target, color: "from-purple-500 to-pink-500", requirement: { type: "challenges", count: 25 }, tier: "silver" },
  { id: "challenge_100", name: "Challenge Legend", description: "Complete 100 challenges", icon: Target, color: "from-purple-600 to-pink-600", requirement: { type: "challenges", count: 100 }, tier: "gold" },
  
  // Devotional badges
  { id: "devotion_7", name: "Devoted", description: "Complete 7 devotionals", icon: Heart, color: "from-pink-400 to-rose-400", requirement: { type: "devotionals", count: 7 }, tier: "bronze" },
  { id: "devotion_30", name: "Faithful", description: "Complete 30 devotionals", icon: Heart, color: "from-pink-500 to-rose-500", requirement: { type: "devotionals", count: 30 }, tier: "silver" },
  
  // Memory badges
  { id: "memory_10", name: "Memory Keeper", description: "Memorize 10 verses", icon: Brain, color: "from-emerald-400 to-teal-400", requirement: { type: "memory", count: 10 }, tier: "bronze" },
  { id: "memory_50", name: "Scripture Mind", description: "Memorize 50 verses", icon: Brain, color: "from-emerald-500 to-teal-500", requirement: { type: "memory", count: 50 }, tier: "silver" },
  
  // Community badges
  { id: "community_5", name: "Community Member", description: "5 community interactions", icon: Users, color: "from-amber-400 to-yellow-400", requirement: { type: "community", count: 5 }, tier: "bronze" },
  
  // Special badges
  { id: "first_floor", name: "Palace Explorer", description: "Complete Floor 1", icon: Crown, color: "from-yellow-400 to-amber-400", requirement: { type: "floors", count: 1 }, tier: "bronze" },
  { id: "all_floors", name: "Palace Master", description: "Complete all 8 floors", icon: Crown, color: "from-yellow-500 to-amber-500", requirement: { type: "floors", count: 8 }, tier: "platinum" },
];

const TIER_COLORS = {
  bronze: "border-amber-600",
  silver: "border-gray-400",
  gold: "border-yellow-400",
  platinum: "border-purple-400",
};

export const BadgeSystem = () => {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const [readingRes, challengeRes, devotionalRes] = await Promise.all([
        supabase.from("daily_reading_log").select("id").eq("user_id", user.id),
        supabase.from("challenge_submissions").select("id").eq("user_id", user.id),
        supabase.from("devotional_progress").select("id").eq("user_id", user.id),
      ]);

      const progressData = {
        reading: readingRes.data?.length || 0,
        challenges: challengeRes.data?.length || 0,
        devotionals: devotionalRes.data?.length || 0,
        streak: 0, // Would need streak calculation
        memory: 0,
        community: 0,
        floors: 0,
      };

      setProgress(progressData);

      // Calculate earned badges
      const earned = new Set<string>();
      BADGES.forEach(badge => {
        const current = progressData[badge.requirement.type as keyof typeof progressData] || 0;
        if (current >= badge.requirement.count) {
          earned.add(badge.id);
        }
      });
      setEarnedBadges(earned);
    };

    loadProgress();
  }, [user]);

  const displayBadges = BADGES.slice(0, 6);

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Badges
          </div>
          <Badge variant="outline">
            {earnedBadges.size} / {BADGES.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {displayBadges.map((badge) => {
            const Icon = badge.icon;
            const isEarned = earnedBadges.has(badge.id);
            const currentProgress = progress[badge.requirement.type] || 0;
            
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "relative p-3 rounded-xl border-2 text-center transition-all",
                  isEarned 
                    ? `bg-gradient-to-br ${badge.color} ${TIER_COLORS[badge.tier]}` 
                    : "bg-muted/50 border-muted-foreground/20 opacity-50"
                )}
              >
                {!isEarned && (
                  <Lock className="absolute top-1 right-1 h-3 w-3 text-muted-foreground" />
                )}
                <Icon className={cn(
                  "h-6 w-6 mx-auto mb-1",
                  isEarned ? "text-white" : "text-muted-foreground"
                )} />
                <p className={cn(
                  "text-xs font-medium truncate",
                  isEarned ? "text-white" : "text-muted-foreground"
                )}>
                  {badge.name}
                </p>
                {!isEarned && (
                  <p className="text-[10px] text-muted-foreground">
                    {currentProgress}/{badge.requirement.count}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full text-center text-sm text-primary hover:underline">
              View All Badges →
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                All Badges ({earnedBadges.size}/{BADGES.length})
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map((badge) => {
                  const Icon = badge.icon;
                  const isEarned = earnedBadges.has(badge.id);
                  const currentProgress = progress[badge.requirement.type] || 0;
                  
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "relative p-3 rounded-xl border-2 text-center",
                        isEarned 
                          ? `bg-gradient-to-br ${badge.color} ${TIER_COLORS[badge.tier]}` 
                          : "bg-muted/50 border-muted-foreground/20 opacity-60"
                      )}
                    >
                      {!isEarned && <Lock className="absolute top-1 right-1 h-3 w-3" />}
                      <Icon className={cn("h-8 w-8 mx-auto mb-1", isEarned ? "text-white" : "")} />
                      <p className={cn("text-xs font-medium", isEarned ? "text-white" : "")}>{badge.name}</p>
                      <p className={cn("text-[10px]", isEarned ? "text-white/80" : "text-muted-foreground")}>
                        {isEarned ? "Earned!" : `${currentProgress}/${badge.requirement.count}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
