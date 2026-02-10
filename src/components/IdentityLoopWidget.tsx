import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flame, Trophy, Gem, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface IdentityStats {
  streak: number;
  xp: number;
  gems: number;
  roomsCompleted: number;
}

interface IdentityLoopWidgetProps {
  compact?: boolean;
  className?: string;
}

export function IdentityLoopWidget({ compact = false, className }: IdentityLoopWidgetProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<IdentityStats>({
    streak: 0,
    xp: 0,
    gems: 0,
    roomsCompleted: 0,
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Get profile stats
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_study_streak, points")
        .eq("id", user!.id)
        .single();

      // Get gems count - use any to avoid deep type instantiation
      const { data: gems } = await (supabase as any)
        .from("deck_studies")
        .select("id")
        .eq("user_id", user!.id)
        .eq("is_gem", true);

      // Get completed rooms
      const { data: rooms } = await (supabase as any)
        .from("room_progress")
        .select("id")
        .eq("user_id", user!.id)
        .eq("completed", true);

      setStats({
        streak: profile?.daily_study_streak || 0,
        xp: profile?.points || 0,
        gems: Array.isArray(gems) ? gems.length : 0,
        roomsCompleted: Array.isArray(rooms) ? rooms.length : 0,
      });
    } catch (error) {
      console.error("Error loading identity stats:", error);
    }
  };

  if (!user) return null;

  if (compact) {
    return (
      <Link 
        to="/streaks"
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors",
          className
        )}
      >
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="h-4 w-4" />
          <span className="text-sm font-bold">{stats.streak}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1 text-yellow-500">
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-bold">{stats.xp}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1 text-primary">
          <Gem className="h-4 w-4" />
          <span className="text-sm font-bold">{stats.gems}</span>
        </div>
      </Link>
    );
  }

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      <Link 
        to="/streaks"
        className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors text-center"
      >
        <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
        <div className="text-lg font-bold">{stats.streak}</div>
        <div className="text-xs text-muted-foreground">{t('identity.streak')}</div>
      </Link>
      <Link 
        to="/leaderboard"
        className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors text-center"
      >
        <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
        <div className="text-lg font-bold">{stats.xp}</div>
        <div className="text-xs text-muted-foreground">{t('identity.xp')}</div>
      </Link>
      <Link 
        to="/my-studies"
        className="p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-center"
      >
        <Gem className="h-5 w-5 mx-auto mb-1 text-primary" />
        <div className="text-lg font-bold">{stats.gems}</div>
        <div className="text-xs text-muted-foreground">{t('identity.gems')}</div>
      </Link>
      <Link 
        to="/mastery"
        className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-center"
      >
        <Building2 className="h-5 w-5 mx-auto mb-1 text-purple-500" />
        <div className="text-lg font-bold">{stats.roomsCompleted}</div>
        <div className="text-xs text-muted-foreground">{t('identity.rooms')}</div>
      </Link>
    </div>
  );
}
