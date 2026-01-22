import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudyEngagementAnalytics } from "@/hooks/useStudyEngagement";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { format } from "date-fns";
import {
  Loader2, RefreshCw, BookOpen, Users, Clock, Trophy,
  TrendingUp, BookMarked, Brain, Target, Video, Heart
} from "lucide-react";

interface StudyEngagementAnalyticsProps {
  churchId?: string;
}

const CONTENT_TYPE_COLORS = {
  central_study: "#6366f1",
  devotional: "#f59e0b",
  bible_reading: "#22c55e",
  memory_practice: "#a855f7",
  challenge: "#ef4444",
  sermon: "#3b82f6",
};

export function StudyEngagementAnalytics({ churchId }: StudyEngagementAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<number>(30);
  const { data, loading, error, refetch, summary } = useStudyEngagementAnalytics(churchId, timeRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/50">
        <CardContent className="p-6">
          <p className="text-red-500">Error loading analytics: {error}</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    date: format(new Date(d.summary_date), "MMM d"),
    fullDate: d.summary_date,
    sessions: d.total_sessions,
    users: d.unique_users,
    completions: d.total_completions,
    minutes: d.total_duration_minutes,
    bibleStudy: d.central_study_sessions,
    devotional: d.devotional_sessions,
    reading: d.bible_reading_sessions,
    memory: d.memory_practice_sessions,
    challenges: d.challenge_sessions,
    sermons: d.sermon_sessions,
  }));

  const pieData = summary ? [
    { name: 'Bible Study', value: data.reduce((sum, d) => sum + d.central_study_sessions, 0), color: CONTENT_TYPE_COLORS.central_study },
    { name: 'Devotional', value: data.reduce((sum, d) => sum + d.devotional_sessions, 0), color: CONTENT_TYPE_COLORS.devotional },
    { name: 'Bible Reading', value: data.reduce((sum, d) => sum + d.bible_reading_sessions, 0), color: CONTENT_TYPE_COLORS.bible_reading },
    { name: 'Memory', value: data.reduce((sum, d) => sum + d.memory_practice_sessions, 0), color: CONTENT_TYPE_COLORS.memory_practice },
    { name: 'Challenges', value: data.reduce((sum, d) => sum + d.challenge_sessions, 0), color: CONTENT_TYPE_COLORS.challenge },
    { name: 'Sermons', value: data.reduce((sum, d) => sum + d.sermon_sessions, 0), color: CONTENT_TYPE_COLORS.sermon },
  ].filter(d => d.value > 0) : [];

  const formatStudyTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours + "h " + mins + "m";
    }
    return minutes + "m";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Study Engagement Analytics
          </h2>
          <p className="text-muted-foreground">
            Track how your community engages with Bible studies and content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange.toString()} onValueChange={(v) => setTimeRange(parseInt(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sm">
            {data.length} days of data
          </Badge>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Total Study Sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalSessions}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.avgDailySessions} avg/day
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-500" />
                  Completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{summary.totalCompletions}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.avgCompletionRate}% avg completion
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Total Study Time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {formatStudyTime(summary.totalStudyMinutes)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summary.avgSessionMinutes}m avg session
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Most Popular
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-500">{summary.mostPopularContent}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Top content type
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {data.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No engagement data yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Study engagement analytics will appear here as your community uses Bible studies, 
              devotionals, and other learning content.
            </p>
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <>
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle>Study Sessions Over Time</CardTitle>
              <CardDescription>Daily study sessions and unique users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      name="Sessions"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Unique Users"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => name + " " + Math.round(percent * 100) + "%"}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={"cell-" + index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle>Content Types Over Time</CardTitle>
                <CardDescription>Daily breakdown by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="bibleStudy" name="Bible Study" stackId="a" fill={CONTENT_TYPE_COLORS.central_study} />
                      <Bar dataKey="devotional" name="Devotional" stackId="a" fill={CONTENT_TYPE_COLORS.devotional} />
                      <Bar dataKey="reading" name="Reading" stackId="a" fill={CONTENT_TYPE_COLORS.bible_reading} />
                      <Bar dataKey="memory" name="Memory" stackId="a" fill={CONTENT_TYPE_COLORS.memory_practice} />
                      <Bar dataKey="challenges" name="Challenges" stackId="a" fill={CONTENT_TYPE_COLORS.challenge} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle>Total Study Time</CardTitle>
              <CardDescription>Minutes spent in study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value + "m"}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [value + " min", "Study Time"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="minutes"
                      name="Minutes"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle>Completions Over Time</CardTitle>
              <CardDescription>Studies and content completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completions"
                      name="Completions"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
