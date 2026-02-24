import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, RefreshCw, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsSnapshot {
  snapshot_date: string;
  stripe_active: number;
  stripe_trialing: number;
  stripe_cancelled: number;
  total_users: number;
  lifetime_access: number;
  patreon_active: number;
  pickaxe_count: number;
  mrr_cents: number;
  tier_essential: number;
  tier_premium: number;
  tier_student: number;
  tier_church: number;
}

type TimeRange = '7d' | '30d' | '90d' | 'all' | 'jan18';

export function SubscriptionAnalyticsChart() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('jan18');

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      // Use analytics_snapshots table which has complete historical data
      let query = (supabase as any)
        .from("analytics_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: true });

      // Apply time filter
      if (timeRange === 'jan18') {
        query = query.gte("snapshot_date", "2026-01-18");
      } else if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte("snapshot_date", startDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSnapshots((data as AnalyticsSnapshot[]) || []);
    } catch (error: any) {
      console.error("Error loading snapshots:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const recordSnapshot = async () => {
    setRecording(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("record-analytics-snapshot", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Snapshot Recorded",
        description: data.message || "Analytics snapshot saved successfully",
      });

      await loadSnapshots();
    } catch (error: any) {
      console.error("Error recording snapshot:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to record snapshot",
        variant: "destructive",
      });
    } finally {
      setRecording(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, [timeRange]);

  // Format data for the chart
  const chartData = snapshots.map((s) => ({
    date: new Date(s.snapshot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: s.snapshot_date,
    active: s.stripe_active,
    trialing: s.stripe_trialing,
    patrons: s.patreon_active,
    pickaxe: s.pickaxe_count,
    lifetime: s.lifetime_access,
    mrr: s.mrr_cents / 100,
    total: s.stripe_active + s.patreon_active + s.lifetime_access,
    users: s.total_users,
    essential: s.tier_essential,
    premium: s.tier_premium,
    student: s.tier_student,
  }));

  // Calculate growth
  const calculateGrowth = (key: keyof typeof chartData[0]) => {
    if (chartData.length < 2) return null;
    const first = chartData[0][key] as number;
    const last = chartData[chartData.length - 1][key] as number;
    if (first === 0) return last > 0 ? 100 : 0;
    return Math.round(((last - first) / first) * 100);
  };

  const activeGrowth = calculateGrowth('active');
  const mrrGrowth = calculateGrowth('mrr');
  const totalGrowth = calculateGrowth('total');

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan18">Since Jan 18</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {snapshots.length} data points
          </span>
        </div>
        <Button onClick={recordSnapshot} disabled={recording} variant="outline" size="sm">
          {recording ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Recording...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Record Today's Snapshot
            </>
          )}
        </Button>
      </div>

      {/* Growth Summary */}
      {snapshots.length >= 2 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-green-500/5 border-green-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Subs Growth</span>
                <TrendingUp className={`h-4 w-4 ${activeGrowth && activeGrowth > 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-2xl font-bold ${activeGrowth && activeGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {activeGrowth !== null ? `${activeGrowth > 0 ? '+' : ''}${activeGrowth}%` : 'N/A'}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MRR Growth</span>
                <TrendingUp className={`h-4 w-4 ${mrrGrowth && mrrGrowth > 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-2xl font-bold ${mrrGrowth && mrrGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mrrGrowth !== null ? `${mrrGrowth > 0 ? '+' : ''}${mrrGrowth}%` : 'N/A'}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Paying Growth</span>
                <TrendingUp className={`h-4 w-4 ${totalGrowth && totalGrowth > 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className={`text-2xl font-bold ${totalGrowth && totalGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGrowth !== null ? `${totalGrowth > 0 ? '+' : ''}${totalGrowth}%` : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Over Time</CardTitle>
          <CardDescription>Active subscriptions, trials, and patron counts</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No historical data yet. Click "Record Today's Snapshot" to start tracking.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={2} name="Active Stripe" dot={false} />
                <Line type="monotone" dataKey="trialing" stroke="#3b82f6" strokeWidth={2} name="Trialing" dot={false} />
                <Line type="monotone" dataKey="patrons" stroke="#f97316" strokeWidth={2} name="Patrons" dot={false} />
                <Line type="monotone" dataKey="lifetime" stroke="#8b5cf6" strokeWidth={2} name="Lifetime" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* MRR Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Recurring Revenue</CardTitle>
          <CardDescription>MRR from Stripe subscriptions over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No historical data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'MRR']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} name="MRR" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Tier Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions by Tier</CardTitle>
          <CardDescription>Essential, Premium, and Student tiers over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No historical data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="essential" stroke="#6366f1" strokeWidth={2} name="Essential" dot={false} />
                <Line type="monotone" dataKey="premium" stroke="#f59e0b" strokeWidth={2} name="Premium" dot={false} />
                <Line type="monotone" dataKey="student" stroke="#ec4899" strokeWidth={2} name="Student" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
