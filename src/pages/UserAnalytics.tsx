import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useReadingStreak } from "@/hooks/useReadingStreak";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

interface ActivityData {
  date: string;
  reading: number;
  challenges: number;
  devotionals: number;
}

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
}

const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

export default function UserAnalytics() {
  const { user } = useAuth();
  const { streak, loading: streakLoading } = useReadingStreak();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState({
    totalTimeMinutes: 0,
    chaptersRead: 0,
    versesMemorized: 0,
    challengesCompleted: 0,
    devotionalsCompleted: 0,
    totalDaysActive: 0,
    // Weekly stats
    weeklyChaptersRead: 0,
    weeklyChallengesCompleted: 0,
    weeklyDevotionalsCompleted: 0,
    weeklyTimeMinutes: 0,
  });
  const [timeDistribution, setTimeDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
      const thirtyDaysAgo = subDays(now, 30);

      // Get reading logs (last 30 days)
      const { data: readingLogs } = await supabase
        .from("daily_reading_log")
        .select("*")
        .eq("user_id", user.id)
        .gte("read_date", thirtyDaysAgo.toISOString().split('T')[0]);

      // Get ALL challenge submissions
      const { data: allChallenges } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("user_id", user.id);

      // Get challenge submissions with date for weekly filter
      const { data: challengesWithDate } = await supabase
        .from("challenge_submissions")
        .select("*, created_at")
        .eq("user_id", user.id);

      // Get ALL devotional progress
      const { data: allDevotionals } = await supabase
        .from("devotional_progress")
        .select("*")
        .eq("user_id", user.id);

      // Get devotional progress with date for weekly filter
      const { data: devotionalsWithDate } = await supabase
        .from("devotional_progress")
        .select("*, completed_at")
        .eq("user_id", user.id);

      // Get memorization verses count
      const { data: memorizedVerses } = await supabase
        .from("memorization_verses")
        .select("id, mastery_level")
        .eq("user_id", user.id);

      // Count verses with mastery_level >= 3 as "memorized"
      const fullyMemorizedCount = memorizedVerses?.filter(v => (v.mastery_level || 0) >= 3).length || 0;
      const totalVersesTracked = memorizedVerses?.length || 0;

      // Calculate total reading time (all time from 30 days)
      const totalReadingTime = readingLogs?.reduce((sum, log) => sum + (log.time_spent_seconds || 0), 0) || 0;

      // Calculate unique active days
      const uniqueDays = new Set(readingLogs?.map(log => log.read_date) || []);

      // Calculate weekly stats
      const weeklyReadingLogs = readingLogs?.filter(log => {
        const logDate = parseISO(log.read_date);
        return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
      }) || [];

      const weeklyChallenges = challengesWithDate?.filter(c => {
        if (!c.created_at) return false;
        const date = parseISO(c.created_at);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      }) || [];

      const weeklyDevotionals = devotionalsWithDate?.filter(d => {
        if (!d.completed_at) return false;
        const date = parseISO(d.completed_at);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      }) || [];

      const weeklyReadingTime = weeklyReadingLogs.reduce((sum, log) => sum + (log.time_spent_seconds || 0), 0);

      setStats({
        totalTimeMinutes: Math.round(totalReadingTime / 60),
        chaptersRead: readingLogs?.length || 0,
        versesMemorized: fullyMemorizedCount,
        challengesCompleted: allChallenges?.length || 0,
        devotionalsCompleted: allDevotionals?.length || 0,
        totalDaysActive: uniqueDays.size,
        // Weekly stats
        weeklyChaptersRead: weeklyReadingLogs.length,
        weeklyChallengesCompleted: weeklyChallenges.length,
        weeklyDevotionalsCompleted: weeklyDevotionals.length,
        weeklyTimeMinutes: Math.round(weeklyReadingTime / 60),
      });

      // Build activity chart data (last 14 days)
      const last14Days = eachDayOfInterval({
        start: subDays(now, 13),
        end: now,
      });

      // Get challenge and devotional counts by date
      const challengesByDate = new Map<string, number>();
      const devotionalsByDate = new Map<string, number>();

      challengesWithDate?.forEach(c => {
        if (c.created_at) {
          const dateStr = c.created_at.split('T')[0];
          challengesByDate.set(dateStr, (challengesByDate.get(dateStr) || 0) + 1);
        }
      });

      devotionalsWithDate?.forEach(d => {
        if (d.completed_at) {
          const dateStr = d.completed_at.split('T')[0];
          devotionalsByDate.set(dateStr, (devotionalsByDate.get(dateStr) || 0) + 1);
        }
      });

      const chartData = last14Days.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayReadings = readingLogs?.filter(r => r.read_date === dateStr) || [];

        return {
          date: format(date, "MMM d"),
          reading: dayReadings.length,
          challenges: challengesByDate.get(dateStr) || 0,
          devotionals: devotionalsByDate.get(dateStr) || 0,
        };
      });

      setActivityData(chartData);

      // Calculate REAL time distribution based on actual activity
      // Reading time from logs
      const readingTimeMinutes = Math.round(totalReadingTime / 60);

      // Estimate challenge time (avg 15 min per challenge)
      const challengeTimeMinutes = (allChallenges?.length || 0) * 15;

      // Estimate devotional time (avg 10 min per devotional)
      const devotionalTimeMinutes = (allDevotionals?.length || 0) * 10;

      // Estimate memorization time (avg 5 min per verse tracked)
      const memorizationTimeMinutes = totalVersesTracked * 5;

      const totalEstimatedTime = readingTimeMinutes + challengeTimeMinutes + devotionalTimeMinutes + memorizationTimeMinutes;

      if (totalEstimatedTime > 0) {
        setTimeDistribution([
          { name: "Bible Reading", value: Math.round((readingTimeMinutes / totalEstimatedTime) * 100) || 0 },
          { name: "Challenges", value: Math.round((challengeTimeMinutes / totalEstimatedTime) * 100) || 0 },
          { name: "Devotionals", value: Math.round((devotionalTimeMinutes / totalEstimatedTime) * 100) || 0 },
          { name: "Memorization", value: Math.round((memorizationTimeMinutes / totalEstimatedTime) * 100) || 0 },
        ]);
      } else {
        // Default if no activity
        setTimeDistribution([
          { name: "Bible Reading", value: 25 },
          { name: "Challenges", value: 25 },
          { name: "Devotionals", value: 25 },
          { name: "Memorization", value: 25 },
        ]);
      }
    };

    loadAnalytics();
  }, [user]);

  // Get streak data from the hook
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;

  const statCards: StatCard[] = [
    { label: "Study Time", value: `${stats.totalTimeMinutes} min`, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Chapters Read", value: stats.chaptersRead, icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { label: "Challenges Done", value: stats.challengesCompleted, icon: Target, color: "from-emerald-500 to-teal-500" },
    { label: "Verses Memorized", value: stats.versesMemorized, icon: Brain, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Your Progress
            </h1>
            <p className="text-muted-foreground">Track your spiritual growth journey</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity (Last 14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={activityData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="reading" fill="#8b5cf6" name="Chapters Read" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="challenges" fill="#10b981" name="Challenges" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="devotionals" fill="#ec4899" name="Devotionals" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time Distribution
                </CardTitle>
                <CardDescription>Based on your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={timeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {timeDistribution.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {timeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Milestones & Goals */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Read 100 Chapters</span>
                    <span className="font-medium">{stats.chaptersRead}/100</span>
                  </div>
                  <Progress value={(stats.chaptersRead / 100) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Complete 50 Challenges</span>
                    <span className="font-medium">{stats.challengesCompleted}/50</span>
                  </div>
                  <Progress value={(stats.challengesCompleted / 50) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>30 Day Streak</span>
                    <span className="font-medium">{currentStreak}/30</span>
                  </div>
                  <Progress value={(currentStreak / 30) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memorize 25 Verses</span>
                    <span className="font-medium">{stats.versesMemorized}/25</span>
                  </div>
                  <Progress value={(stats.versesMemorized / 25) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Streak Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Streak Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                    <span className="text-3xl font-bold text-white">{currentStreak}</span>
                  </div>
                  <p className="text-lg font-medium">Current Streak</p>
                  <p className="text-sm text-muted-foreground">
                    {currentStreak > 0 ? "Keep going! You're doing great." : "Start reading today to begin your streak!"}
                  </p>

                  <div className="flex justify-center gap-8 mt-6 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{longestStreak}</p>
                      <p className="text-xs text-muted-foreground">Longest Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-500">{stats.totalDaysActive}</p>
                      <p className="text-xs text-muted-foreground">Total Days Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card className="bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                This Week's Summary
              </CardTitle>
              <CardDescription>Your progress this week (Sunday - Saturday)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.weeklyChaptersRead}</p>
                  <p className="text-sm text-muted-foreground">Chapters Read</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-500">{stats.weeklyChallengesCompleted}</p>
                  <p className="text-sm text-muted-foreground">Challenges</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-500">{stats.weeklyDevotionalsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Devotionals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-500">{stats.weeklyTimeMinutes}m</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
