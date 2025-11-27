import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  format, 
  startOfWeek, 
  eachDayOfInterval, 
  subDays, 
  isWithinInterval,
  parseISO,
  getDay
} from "date-fns";
import { TrendingUp, PieChart as PieChartIcon, Calendar, Flame } from "lucide-react";

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface StudyAnalyticsProps {
  studies: Study[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(280, 70%, 60%)",
  "hsl(200, 70%, 50%)",
  "hsl(45, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(20, 80%, 55%)",
  "hsl(260, 60%, 55%)",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function StudyAnalytics({ studies }: StudyAnalyticsProps) {
  // Calculate study activity over last 14 days
  const activityData = useMemo(() => {
    const now = new Date();
    const twoWeeksAgo = subDays(now, 13);
    const days = eachDayOfInterval({ start: twoWeeksAgo, end: now });

    return days.map((day) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const created = studies.filter((s) => {
        const createdDate = new Date(s.created_at);
        return isWithinInterval(createdDate, { start: dayStart, end: dayEnd });
      }).length;

      const updated = studies.filter((s) => {
        const updatedDate = new Date(s.updated_at);
        const createdDate = new Date(s.created_at);
        return (
          isWithinInterval(updatedDate, { start: dayStart, end: dayEnd }) &&
          updatedDate.getTime() !== createdDate.getTime()
        );
      }).length;

      return {
        date: format(day, "MMM d"),
        created,
        updated,
        total: created + updated,
      };
    });
  }, [studies]);

  // Calculate tag distribution
  const tagData = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    studies.forEach((study) => {
      study.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [studies]);

  // Calculate day of week distribution
  const dayOfWeekData = useMemo(() => {
    const dayCounts = new Array(7).fill(0);
    studies.forEach((study) => {
      const dayIndex = getDay(new Date(study.created_at));
      dayCounts[dayIndex]++;
    });

    return DAY_NAMES.map((name, index) => ({
      name,
      studies: dayCounts[index],
    }));
  }, [studies]);

  // Calculate streak
  const currentStreak = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = today;

    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivity = studies.some((s) => {
        const updatedDate = new Date(s.updated_at);
        return isWithinInterval(updatedDate, { start: dayStart, end: dayEnd });
      });

      if (hasActivity) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else if (streak === 0) {
        // Check yesterday if today has no activity yet
        checkDate = subDays(checkDate, 1);
        const yesterdayHasActivity = studies.some((s) => {
          const updatedDate = new Date(s.updated_at);
          const dayStart = new Date(checkDate);
          const dayEnd = new Date(checkDate);
          dayEnd.setHours(23, 59, 59, 999);
          return isWithinInterval(updatedDate, { start: dayStart, end: dayEnd });
        });
        if (yesterdayHasActivity) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      } else {
        break;
      }

      if (streak > 365) break; // Safety limit
    }

    return streak;
  }, [studies]);

  if (studies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Study Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-500/20">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Activity (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorActivity)"
                  name="Activity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tag Distribution */}
        {tagData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Tag Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tagData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tagData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center -mt-2">
                {tagData.slice(0, 4).map((tag, index) => (
                  <div key={tag.name} className="flex items-center gap-1 text-xs">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{tag.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Day of Week */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Studies by Day</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar 
                  dataKey="studies" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Studies Created"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
