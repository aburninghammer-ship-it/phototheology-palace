import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsSnapshots, TimeRange } from "@/hooks/useAnalyticsSnapshots";
import { Loader2, TrendingUp, TrendingDown, Calendar, Users, DollarSign, RefreshCw, CheckCircle, Camera, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { toast } from "sonner";

export function AnalyticsDashboard() {
  const {
    snapshots,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch,
    recordSnapshot,
    summary,
  } = useAnalyticsSnapshots("30d");

  const [isRecording, setIsRecording] = useState(false);

  // Check for missing days in the data
  const getMissingDays = () => {
    if (snapshots.length < 2) return [];

    const dates = snapshots.map(s => new Date(s.snapshot_date));
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    const allDays = eachDayOfInterval({ start: firstDate, end: lastDate });
    const snapshotDates = new Set(snapshots.map(s => s.snapshot_date));

    return allDays.filter(day => {
      const dateStr = format(day, "yyyy-MM-dd");
      return !snapshotDates.has(dateStr);
    });
  };

  const missingDays = getMissingDays();

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

  // Format data for charts
  const chartData = snapshots.map((s) => ({
    date: format(new Date(s.snapshot_date), "MMM d"),
    fullDate: s.snapshot_date,
    active: s.stripe_active,
    trials: s.stripe_trialing,
    patreon: s.patreon_active,
    lifetime: s.lifetime_access,
    totalPaying: s.stripe_active + s.patreon_active + s.lifetime_access,
    total: s.stripe_active + s.stripe_trialing + s.patreon_active + s.lifetime_access,
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
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Analytics Over Time
          </h2>
          <p className="text-muted-foreground">
            Automatic daily snapshots tracking your growth
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[140px]">
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
          <Badge variant="outline" className="text-sm">
            {snapshots.length} data points
          </Badge>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Auto-recording status */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm">
              <strong>Automatic tracking enabled.</strong> Snapshots are recorded daily at midnight UTC.
            </span>
          </div>
          <Button
            onClick={handleRecordSnapshot}
            disabled={isRecording}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {isRecording ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Record Now
          </Button>
        </CardContent>
      </Card>

      {/* Warning if missing days */}
      {missingDays.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span className="text-sm">
              <strong>Missing {missingDays.length} day(s) of data.</strong> The cron job may not have run. Click "Record Now" to capture today's snapshot.
              {missingDays.length <= 5 && (
                <span className="text-muted-foreground ml-1">
                  Missing: {missingDays.map(d => format(d, "MMM d")).join(", ")}
                </span>
              )}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Warning if very few data points */}
      {snapshots.length > 0 && snapshots.length < 3 && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm">
              <strong>Limited historical data.</strong> Only {snapshots.length} day(s) recorded so far.
              Charts will become more useful as more days are collected.
            </span>
          </CardContent>
        </Card>
      )}

      {/* Growth Summary Cards */}
      {summary && summary.latestSnapshot && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.latestSnapshot.stripe_active}</div>
              {summary.subscriberGrowth !== 0 && (
                <p className={`text-sm mt-1 flex items-center gap-1 ${summary.subscriberGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.subscriberGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {summary.subscriberGrowth > 0 ? "+" : ""}{summary.subscriberGrowth} in period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monthly Recurring Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${(summary.latestSnapshot.mrr_cents / 100).toFixed(2)}
              </div>
              {summary.mrrGrowth !== 0 && (
                <p className={`text-sm mt-1 flex items-center gap-1 ${summary.mrrGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.mrrGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {summary.mrrGrowth > 0 ? "+" : ""}${(summary.mrrGrowth / 100).toFixed(2)} in period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.latestSnapshot.total_users}</div>
              {summary.userGrowth !== 0 && (
                <p className={`text-sm mt-1 flex items-center gap-1 ${summary.userGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.userGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {summary.userGrowth > 0 ? "+" : ""}{summary.userGrowth} in period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Trials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {summary.latestSnapshot.stripe_trialing}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Converting to paid
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secondary Stats Row */}
      {summary && summary.latestSnapshot && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardDescription>Current Paying Users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {summary.latestSnapshot.stripe_active + summary.latestSnapshot.patreon_active + summary.latestSnapshot.lifetime_access}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Stripe + Patreon + Lifetime
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span className="text-orange-500">🎭</span>
                Patreon Active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {summary.latestSnapshot.patreon_active}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Connected patrons
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span className="text-purple-500">💎</span>
                Lifetime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {summary.latestSnapshot.lifetime_access}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Permanent access
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New Signups Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.latestSnapshot.new_signups_today}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Latest registrations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Over Time</CardTitle>
          <CardDescription>Active subscriptions, trials, patrons, and lifetime access</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="active"
                    name="Active Stripe"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trials"
                    name="Trialing"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="patreon"
                    name="Patrons"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lifetime"
                    name="Lifetime"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">No data yet</p>
                <p className="text-sm mt-1">Snapshots will be recorded automatically each day</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Paying Users Over Time Chart */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Total Paying Users Over Time</CardTitle>
          <CardDescription>Stripe Active + Patreon + Lifetime combined</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Paying Users"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalPaying"
                    name="Total Paying"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
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

      {/* MRR Over Time Chart */}
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
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "MRR"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    name="MRR"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
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

      {/* Tier Breakdown Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Tiers</CardTitle>
          <CardDescription>Essential vs Premium breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
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
                    dataKey="premium"
                    name="Premium"
                    stackId="1"
                    stroke="#9333ea"
                    fill="#9333ea"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="essential"
                    name="Essential"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
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

      {/* User Growth Over Time */}
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
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Users"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Total Users"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
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

      {/* Raw Data Table */}
      {snapshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Snapshot Data</CardTitle>
            <CardDescription>All recorded daily snapshots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Stripe Active</th>
                    <th className="text-right p-3 font-medium">7-Day Trials</th>
                    <th className="text-right p-3 font-medium">Patreon</th>
                    <th className="text-right p-3 font-medium">Lifetime</th>
                    <th className="text-right p-3 font-medium">Total Paying</th>
                    <th className="text-right p-3 font-medium">MRR</th>
                    <th className="text-right p-3 font-medium">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.slice().reverse().slice(0, 30).map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-3 font-mono">
                        {format(new Date(s.snapshot_date), "MMM d, yyyy")}
                      </td>
                      <td className="p-3 text-right text-green-600 font-medium">{s.stripe_active}</td>
                      <td className="p-3 text-right text-blue-600">{s.stripe_trialing}</td>
                      <td className="p-3 text-right text-orange-600">{s.patreon_active}</td>
                      <td className="p-3 text-right text-purple-600">{s.lifetime_access}</td>
                      <td className="p-3 text-right font-bold text-primary">{s.stripe_active + s.patreon_active + s.lifetime_access}</td>
                      <td className="p-3 text-right font-mono">${(s.mrr_cents / 100).toFixed(2)}</td>
                      <td className="p-3 text-right">{s.total_users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {snapshots.length > 30 && (
                <div className="p-2 text-center text-sm text-muted-foreground border-t">
                  Showing 30 of {snapshots.length} snapshots
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
