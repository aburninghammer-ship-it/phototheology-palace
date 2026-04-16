import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsSnapshots, TimeRange } from "@/hooks/useAnalyticsSnapshots";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, TrendingUp, TrendingDown, Calendar, Users, DollarSign, RefreshCw,
  CheckCircle, Camera, AlertCircle, Eye, MessageSquare, MousePointer,
  UserPlus, Target, Activity, BarChart3, Clock, Zap
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { toast } from "sonner";

interface UserEvent {
  id: string;
  event_type: string;
  event_data: Record<string, any> | null;
  page_path: string | null;
  created_at: string;
  user_id: string | null;
  session_id: string | null;
}

interface PageViewStat {
  page_path: string;
  count: number;
}

interface EventTypeStat {
  event_type: string;
  count: number;
}

interface DailyEventStat {
  date: string;
  count: number;
}

const CHART_COLORS = [
  "#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

export function AnalyticsDashboard() {
  const {
    snapshots,
    loading: snapshotsLoading,
    error: snapshotsError,
    timeRange,
    setTimeRange,
    refetch: refetchSnapshots,
    recordSnapshot,
    summary,
  } = useAnalyticsSnapshots("all");

  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // User events state
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [eventTypeStats, setEventTypeStats] = useState<EventTypeStat[]>([]);
  const [dailyEventStats, setDailyEventStats] = useState<DailyEventStat[]>([]);
  const [pageViewStats, setPageViewStats] = useState<PageViewStat[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [uniqueSessions, setUniqueSessions] = useState(0);
  const [dateFilter, setDateFilter] = useState<string>("all"); // "all", "7d", "30d", "jan17"

  // Funnel data
  const [funnelData, setFunnelData] = useState<{step: string; count: number; rate: number}[]>([]);
  // Checkout funnel data (separate from feature funnel)
  const [checkoutFunnelData, setCheckoutFunnelData] = useState<{step: string; count: number; rate: number; dropoff?: number}[]>([]);

  // Fetch user events and analytics
  const fetchUserEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      // Determine date filter
      let dateStart: string | null = null;
      if (dateFilter === "jan17") {
        dateStart = "2026-01-17";
      } else if (dateFilter === "7d") {
        dateStart = format(subDays(new Date(), 7), "yyyy-MM-dd");
      } else if (dateFilter === "30d") {
        dateStart = format(subDays(new Date(), 30), "yyyy-MM-dd");
      }

      // Fetch events
      let eventsQuery = supabase
        .from("user_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (dateStart) {
        eventsQuery = eventsQuery.gte("created_at", dateStart);
      }

      const { data: events, error: eventsError } = await eventsQuery;

      if (eventsError) throw eventsError;
      setUserEvents((events as UserEvent[]) || []);
      setTotalEvents(events?.length || 0);

      // Count unique sessions
      const sessions = new Set(events?.map(e => e.session_id).filter(Boolean));
      setUniqueSessions(sessions.size);

      // Calculate event type stats
      const typeCounts: Record<string, number> = {};
      events?.forEach(e => {
        typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
      });
      const typeStats = Object.entries(typeCounts)
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count);
      setEventTypeStats(typeStats);

      // Calculate daily stats
      const dailyCounts: Record<string, number> = {};
      events?.forEach(e => {
        const date = format(new Date(e.created_at), "yyyy-MM-dd");
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });
      const dailyStats = Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setDailyEventStats(dailyStats);

      // Fetch page views
      let pageViewsQuery = supabase
        .from("page_views")
        .select("page_path")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (dateStart) {
        pageViewsQuery = pageViewsQuery.gte("created_at", dateStart);
      }

      const { data: pageViews } = await pageViewsQuery;

      if (pageViews) {
        const pathCounts: Record<string, number> = {};
        pageViews.forEach(pv => {
          pathCounts[pv.page_path] = (pathCounts[pv.page_path] || 0) + 1;
        });
        const stats = Object.entries(pathCounts)
          .map(([page_path, count]) => ({ page_path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);
        setPageViewStats(stats);
      }

      // Calculate funnel data
      const funnelSteps = [
        { step: "Signup Started", eventType: "signup_started" },
        { step: "Signup Completed", eventType: "signup_completed" },
        { step: "Onboarding Started", eventType: "onboarding_started" },
        { step: "Tour Started", eventType: "24fps_tour_started" },
        { step: "Tour Completed", eventType: "24fps_tour_completed" },
        { step: "First Win", eventType: "first_win_completed" },
        { step: "Feature Used", eventType: "feature_used" },
        { step: "Upgrade Clicked", eventType: "upgrade_clicked" },
        { step: "Purchase Completed", eventType: "purchase_completed" },
      ];

      const funnel = funnelSteps.map((step, idx) => {
        const count = typeCounts[step.eventType] || 0;
        const prevCount = idx > 0 ? (typeCounts[funnelSteps[idx-1].eventType] || 1) : count;
        const rate = idx === 0 ? 100 : (prevCount > 0 ? Math.round((count / prevCount) * 100) : 0);
        return { step: step.step, count, rate };
      });
      setFunnelData(funnel);

      // Calculate CHECKOUT FUNNEL specifically
      const checkoutSteps = [
        { step: "1. Account Created", eventType: "checkout_funnel_account_created" },
        { step: "2. Redirected to Stripe", eventType: "checkout_funnel_redirect_to_stripe" },
        { step: "3. Completed Checkout", eventType: "checkout_funnel_completed" },
        { step: "❌ Abandoned", eventType: "checkout_funnel_abandoned" },
        { step: "✓ External Member", eventType: "checkout_funnel_external_membership" },
      ];

      const checkoutFunnel = checkoutSteps.map((step, idx) => {
        const count = typeCounts[step.eventType] || 0;
        // For the first 3 steps, calculate conversion from previous step
        let rate = 100;
        let dropoff = 0;
        if (idx === 1) {
          // Redirect rate from account created
          const prevCount = typeCounts["checkout_funnel_account_created"] || 1;
          rate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
        } else if (idx === 2) {
          // Completion rate from redirect
          const prevCount = typeCounts["checkout_funnel_redirect_to_stripe"] || 1;
          rate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;
          // Calculate dropoff
          const abandoned = typeCounts["checkout_funnel_abandoned"] || 0;
          dropoff = prevCount > 0 ? Math.round((abandoned / prevCount) * 100) : 0;
        }
        return { step: step.step, count, rate, dropoff };
      });
      setCheckoutFunnelData(checkoutFunnel);

    } catch (err) {
      console.error("Error fetching user events:", err);
    } finally {
      setEventsLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchUserEvents();
  }, [fetchUserEvents]);

  const handleRecordSnapshot = async () => {
    setIsRecording(true);
    try {
      const result = await recordSnapshot();
      if (result.success) {
        toast.success("Snapshot recorded successfully!");
      } else {
        toast.error(result.error || "Failed to record snapshot");
      }
    } catch (err) {
      toast.error("Failed to record snapshot");
    } finally {
      setIsRecording(false);
    }
  };

  const handleRefresh = () => {
    refetchSnapshots();
    fetchUserEvents();
    toast.success("Analytics refreshed");
  };

  const loading = snapshotsLoading || eventsLoading;

  if (loading && snapshots.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Format snapshot data for charts
  const chartData = snapshots.map((s) => ({
    date: format(new Date(s.snapshot_date), "MMM d"),
    fullDate: s.snapshot_date,
    active: s.stripe_active,
    trials: s.stripe_trialing,
    patreon: s.patreon_active,
    lifetime: s.lifetime_access,
    totalPaying: s.stripe_active + s.patreon_active + s.lifetime_access,
    mrr: s.mrr_cents / 100,
    users: s.total_users,
    newSignups: s.new_signups_today,
    essential: s.tier_essential,
    premium: s.tier_premium,
  }));

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "all", label: "All Time (from Jan 17)" },
  ];

  const dateFilterOptions = [
    { value: "jan17", label: "Since Jan 17" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Complete analytics tracking since January 17, 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {snapshots.length} snapshots | {totalEvents} events
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleRecordSnapshot}
            disabled={isRecording}
            size="sm"
            variant="default"
            className="gap-2"
          >
            {isRecording ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Record Snapshot
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {summary && summary.latestSnapshot && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                MRR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(summary.latestSnapshot.mrr_cents / 100).toFixed(2)}
              </div>
              {summary.mrrGrowth !== 0 && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${summary.mrrGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.mrrGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {summary.mrrGrowth > 0 ? "+" : ""}${(summary.mrrGrowth / 100).toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Subs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.latestSnapshot.stripe_active}</div>
              {summary.subscriberGrowth !== 0 && (
                <p className={`text-xs mt-1 ${summary.subscriberGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.subscriberGrowth > 0 ? "+" : ""}{summary.subscriberGrowth} growth
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active Trials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary.latestSnapshot.stripe_trialing}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Converting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Total Users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.latestSnapshot.total_users}</div>
              {summary.userGrowth !== 0 && (
                <p className={`text-xs mt-1 ${summary.userGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.userGrowth > 0 ? "+" : ""}{summary.userGrowth} new
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Events Tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {uniqueSessions} sessions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">User Events</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="pages">Page Views</TabsTrigger>
          <TabsTrigger value="snapshots">Raw Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-end">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscriptions Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions Over Time</CardTitle>
              <CardDescription>Active subscriptions, trials, and other sources</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                      <Line type="monotone" dataKey="active" name="Active Stripe" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
                      <Line type="monotone" dataKey="trials" name="Trialing" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
                      <Line type="monotone" dataKey="patreon" name="Patrons" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} />
                      <Line type="monotone" dataKey="lifetime" name="Lifetime" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No snapshot data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* MRR Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue</CardTitle>
              <CardDescription>MRR growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "MRR"]}
                      />
                      <Area type="monotone" dataKey="mrr" name="MRR" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Total registered users over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      />
                      <Area type="monotone" dataKey="users" name="Total Users" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Event Tracking</h3>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFilterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Event Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Event Types
                </CardTitle>
                <CardDescription>Distribution of tracked events</CardDescription>
              </CardHeader>
              <CardContent>
                {eventTypeStats.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventTypeStats.slice(0, 10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis type="number" fontSize={12} />
                        <YAxis dataKey="event_type" type="category" width={120} fontSize={11} tickFormatter={(v) => v.replace(/_/g, ' ').slice(0, 15)} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No events recorded
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Activity
                </CardTitle>
                <CardDescription>Events per day</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyEventStats.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyEventStats}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" fontSize={10} tickFormatter={(d) => format(parseISO(d), "M/d")} />
                        <YAxis fontSize={12} />
                        <Tooltip labelFormatter={(d) => format(parseISO(d as string), "MMM d, yyyy")} />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No daily data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Last 50 tracked events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Time</th>
                      <th className="text-left p-3 font-medium">Event Type</th>
                      <th className="text-left p-3 font-medium">Page</th>
                      <th className="text-left p-3 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEvents.slice(0, 50).map((event) => (
                      <tr key={event.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">
                          {format(new Date(event.created_at), "MMM d, h:mm a")}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {event.event_type}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground text-xs max-w-40 truncate">
                          {event.page_path || "-"}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground max-w-60 truncate">
                          {event.event_data ? JSON.stringify(event.event_data) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>User journey from signup to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              {funnelData.length > 0 && funnelData.some(f => f.count > 0) ? (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis type="number" fontSize={12} />
                        <YAxis dataKey="step" type="category" width={140} fontSize={11} />
                        <Tooltip formatter={(value: number) => [value, 'Users']} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                          {funnelData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-3">
                    {funnelData.filter(f => f.count > 0).map((step, i) => (
                      <div key={step.step} className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-xl font-bold">{step.count}</div>
                        <div className="text-xs text-muted-foreground truncate">{step.step}</div>
                        {i > 0 && step.rate < 100 && (
                          <Badge variant={step.rate > 50 ? "default" : "destructive"} className="mt-1 text-xs">
                            {step.rate}% conv
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground flex-col gap-2">
                  <Target className="h-12 w-12 opacity-20" />
                  <p>No funnel data available yet</p>
                  <p className="text-xs">Events will appear as users progress through the app</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CHECKOUT FUNNEL - Separate Card */}
          <Card className="border-2 border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-500" />
                Checkout Funnel (Signup → Trial)
              </CardTitle>
              <CardDescription>Where users drop off during signup-to-trial flow</CardDescription>
            </CardHeader>
            <CardContent>
              {checkoutFunnelData.length > 0 && checkoutFunnelData.some(f => f.count > 0) ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {checkoutFunnelData.map((step, i) => (
                      <div
                        key={step.step}
                        className={`p-4 rounded-lg text-center ${
                          step.step.includes('Abandoned')
                            ? 'bg-red-500/20 border border-red-500/30'
                            : step.step.includes('External')
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-muted/50'
                        }`}
                      >
                        <div className="text-2xl font-bold">{step.count}</div>
                        <div className="text-xs text-muted-foreground">{step.step}</div>
                        {i > 0 && i < 3 && step.rate < 100 && (
                          <Badge variant={step.rate > 50 ? "default" : "destructive"} className="mt-2 text-xs">
                            {step.rate}% conv
                          </Badge>
                        )}
                        {step.dropoff !== undefined && step.dropoff > 0 && (
                          <Badge variant="destructive" className="mt-1 text-xs block">
                            {step.dropoff}% abandoned
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Key Insight */}
                  {checkoutFunnelData[1]?.count > 0 && checkoutFunnelData[2]?.count < checkoutFunnelData[1]?.count && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Checkout Drop-off Detected
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>{checkoutFunnelData[1]?.count - checkoutFunnelData[2]?.count - (checkoutFunnelData[3]?.count || 0)}</strong> users were redirected to Stripe but neither completed checkout nor explicitly cancelled.
                        They may have closed the browser or navigated away. Consider:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                        <li>Adding abandoned checkout email reminders</li>
                        <li>Offering a truly free tier without card</li>
                        <li>Simplifying the checkout page</li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground flex-col gap-2">
                  <DollarSign className="h-12 w-12 opacity-20" />
                  <p>No checkout funnel data yet</p>
                  <p className="text-xs">Data will appear as users sign up and go through checkout</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Views Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              {pageViewStats.length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageViewStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="page_path" type="category" width={200} fontSize={10} tickFormatter={(v) => v.length > 30 ? v.slice(0, 30) + '...' : v} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  No page view data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="snapshots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Snapshot Data</CardTitle>
              <CardDescription>All recorded daily snapshots since January 17, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              {snapshots.length > 0 ? (
                <div className="rounded-md border overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-right p-3 font-medium">Stripe Active</th>
                        <th className="text-right p-3 font-medium">Trials</th>
                        <th className="text-right p-3 font-medium">Patreon</th>
                        <th className="text-right p-3 font-medium">Lifetime</th>
                        <th className="text-right p-3 font-medium">Total Paying</th>
                        <th className="text-right p-3 font-medium">MRR</th>
                        <th className="text-right p-3 font-medium">Users</th>
                        <th className="text-right p-3 font-medium">New Today</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshots.slice().reverse().map((s) => (
                        <tr key={s.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono text-xs">
                            {format(new Date(s.snapshot_date), "MMM d, yyyy")}
                          </td>
                          <td className="p-3 text-right text-green-600 font-medium">{s.stripe_active}</td>
                          <td className="p-3 text-right text-blue-600">{s.stripe_trialing}</td>
                          <td className="p-3 text-right text-orange-600">{s.patreon_active}</td>
                          <td className="p-3 text-right text-purple-600">{s.lifetime_access}</td>
                          <td className="p-3 text-right font-bold text-primary">{s.stripe_active + s.patreon_active + s.lifetime_access}</td>
                          <td className="p-3 text-right font-mono text-green-600">${(s.mrr_cents / 100).toFixed(2)}</td>
                          <td className="p-3 text-right">{s.total_users}</td>
                          <td className="p-3 text-right text-muted-foreground">{s.new_signups_today}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No snapshots recorded yet</p>
                  <p className="text-sm mt-2">Click "Record Snapshot" to capture today's data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
