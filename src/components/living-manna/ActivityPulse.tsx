import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Activity, BookOpen, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChurchActiveUsers } from "@/hooks/useChurchActiveUsers";

interface ActivityPulseProps {
  churchId: string;
}

interface ActivityStats {
  prayersThisWeek: number;
  studiesCompletedToday: number;
  lastActivityAt: Date | null;
}

export function ActivityPulse({ churchId }: ActivityPulseProps) {
  const { liveCount } = useChurchActiveUsers(churchId);
  const [stats, setStats] = useState<ActivityStats>({
    prayersThisWeek: 0,
    studiesCompletedToday: 0,
    lastActivityAt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityStats();
  }, [churchId]);

  const loadActivityStats = async () => {
    try {
      // Get prayer count this week
      const { count: prayerCount } = await supabase
        .from('church_prayer_requests')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', churchId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get study completions today
      const { count: studyCount } = await supabase
        .from('bible_study_series_progress')
        .select('*', { count: 'exact', head: true })
        .gte('completed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      // Get last activity (most recent prayer or attendance)
      const { data: lastPrayer } = await supabase
        .from('church_prayer_requests')
        .select('created_at')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setStats({
        prayersThisWeek: prayerCount || 0,
        studiesCompletedToday: studyCount || 0,
        lastActivityAt: lastPrayer?.created_at ? new Date(lastPrayer.created_at) : null
      });
    } catch (error) {
      console.error('Error loading activity stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  const indicators = [
    {
      icon: Heart,
      value: stats.prayersThisWeek,
      label: stats.prayersThisWeek === 1 ? "prayer lifted this week" : "prayers lifted this week",
      show: true
    },
    {
      icon: BookOpen,
      value: stats.studiesCompletedToday,
      label: stats.studiesCompletedToday === 1 ? "study completed today" : "studies completed today",
      show: true
    },
    {
      icon: Users,
      value: liveCount,
      label: liveCount === 1 ? "member connected" : "members connected",
      show: liveCount > 0
    }
  ].filter(i => i.show);

  // Don't show if everything is zero
  const hasAnyActivity = stats.prayersThisWeek > 0 || stats.studiesCompletedToday > 0 || liveCount > 0;

  if (!hasAnyActivity) {
    return null; // Gracefully hide when no activity exists yet
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
        <span className="font-medium text-foreground/80">Living Pulse</span>
      </div>
      
      {indicators.map((indicator, index) => (
        <div 
          key={index}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full",
            "bg-muted/50 border border-border/50"
          )}
        >
          <indicator.icon className="h-3.5 w-3.5" />
          <span>
            <span className="font-medium text-foreground">{indicator.value}</span>{" "}
            {indicator.label}
          </span>
        </div>
      ))}
      
      {stats.lastActivityAt && (
        <span className="text-xs opacity-70">
          Last activity {formatDistanceToNow(stats.lastActivityAt, { addSuffix: true })}
        </span>
      )}
    </div>
  );
}
