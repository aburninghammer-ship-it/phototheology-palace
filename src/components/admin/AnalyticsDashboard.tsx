import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsSnapshots, TimeRange } from "@/hooks/useAnalyticsSnapshots";
import { Loader2, TrendingUp, TrendingDown, Calendar, Users, DollarSign, RefreshCw, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { format } from "date-fns";

export function AnalyticsDashboard() {
  const {
    snapshots,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch,
    summary,
  } = useAnalyticsSnapshots("30d");

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
        <CardContent className="py-3 px-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm">
            <strong>Automatic tracking enabled.</strong> Snapshots are recorded daily at midnight UTC.
          </span>
        </CardContent>
      </Card>

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

      {/* Subscriptions Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Over Time</CardTitle>
          <CardDescription>Active subscriptions, trials, and patron counts</CardDescription>
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
                    name="Active Paid"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trials"
                    name="Trials"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="patreon"
                    name="Patreon"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", r: 4 }}
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
                    <th className="text-right p-3 font-medium">Active</th>
                    <th className="text-right p-3 font-medium">Trials</th>
                    <th className="text-right p-3 font-medium">Patreon</th>
                    <th className="text-right p-3 font-medium">MRR</th>
                    <th className="text-right p-3 font-medium">Users</th>
                    <th className="text-right p-3 font-medium">New Today</th>
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
                      <td className="p-3 text-right font-mono">${(s.mrr_cents / 100).toFixed(2)}</td>
                      <td className="p-3 text-right">{s.total_users}</td>
                      <td className="p-3 text-right text-muted-foreground">{s.new_signups_today}</td>
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
