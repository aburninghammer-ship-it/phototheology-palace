import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, BookOpen, Users, TrendingUp } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface StudyEngagementAnalyticsProps {
  churchId: string;
}

interface EngagementStats {
  totalSessions: number;
  totalTimeMinutes: number;
  completionRate: number;
  uniqueUsers: number;
  topContentTypes: { type: string; count: number }[];
  dailyActivity: { date: string; sessions: number; minutes: number }[];
}

export function StudyEngagementAnalytics({ churchId }: StudyEngagementAnalyticsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["study-engagement-analytics", churchId],
    queryFn: async (): Promise<EngagementStats> => {
      const thirtyDaysAgo = subDays(new Date(), 30);

      // Fetch all sessions for the church in the last 30 days
      const { data: sessions, error } = await (supabase as any)
        .from("study_engagement_sessions")
        .select("*")
        .eq("church_id", churchId)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        return {
          totalSessions: 0,
          totalTimeMinutes: 0,
          completionRate: 0,
          uniqueUsers: 0,
          topContentTypes: [],
          dailyActivity: [],
        };
      }

      // Calculate stats
      const totalSessions = sessions.length;
      const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
      const totalTimeMinutes = Math.round(totalSeconds / 60);
      const completedSessions = sessions.filter((s) => s.completed).length;
      const completionRate = Math.round((completedSessions / totalSessions) * 100);
      const uniqueUsers = new Set(sessions.map((s) => s.user_id)).size;

      // Content type distribution
      const contentTypeCounts: Record<string, number> = {};
      sessions.forEach((s) => {
        const type = s.content_type || "other";
        contentTypeCounts[type] = (contentTypeCounts[type] || 0) + 1;
      });
      const topContentTypes = Object.entries(contentTypeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Daily activity for the last 7 days
      const dailyActivity: { date: string; sessions: number; minutes: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const daySessions = sessions.filter((s) => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= dayStart && sessionDate <= dayEnd;
        });

        const dayMinutes = Math.round(
          daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
        );

        dailyActivity.push({
          date: format(date, "EEE"),
          sessions: daySessions.length,
          minutes: dayMinutes,
        });
      }

      return {
        totalSessions,
        totalTimeMinutes,
        completionRate,
        uniqueUsers,
        topContentTypes,
        dailyActivity,
      };
    },
    enabled: !!churchId,
  });

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Sessions",
      value: stats.totalSessions.toLocaleString(),
      description: "Last 30 days",
      icon: BarChart3,
    },
    {
      title: "Study Time",
      value: `${stats.totalTimeMinutes.toLocaleString()} min`,
      description: "Total engagement",
      icon: Clock,
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: "Studies finished",
      icon: TrendingUp,
    },
    {
      title: "Active Members",
      value: stats.uniqueUsers.toString(),
      description: "Unique participants",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Study Engagement</CardTitle>
          </div>
          <CardDescription>Track how your church engages with study content</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Activity Chart */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
          <CardDescription>Sessions and study time over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-40 gap-2">
            {stats.dailyActivity.map((day) => {
              const maxSessions = Math.max(...stats.dailyActivity.map((d) => d.sessions), 1);
              const height = (day.sessions / maxSessions) * 100;

              return (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">
                      {day.sessions}
                    </span>
                    <div
                      className="w-full bg-primary/80 rounded-t-sm transition-all duration-300"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">{day.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      {stats.topContentTypes.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Content Distribution</CardTitle>
            <CardDescription>Most engaged content types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topContentTypes.map((item) => {
                const percentage = Math.round((item.count / stats.totalSessions) * 100);
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{item.type.replace(/_/g, " ")}</span>
                      <span className="text-muted-foreground">{item.count} sessions</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
