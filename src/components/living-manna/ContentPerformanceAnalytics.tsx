import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Eye, Clock, Share2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface ContentAnalyticsProps {
  churchId: string;
}

interface ContentStat {
  content_type: string;
  content_id: string;
  views: number;
  unique_views: number;
  completions: number;
  shares: number;
  avg_time_spent: number;
  date: string;
}

export function ContentPerformanceAnalytics({ churchId }: ContentAnalyticsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");
  const [analytics, setAnalytics] = useState<ContentStat[]>([]);
  const [topContent, setTopContent] = useState<{type: string; views: number; completions: number}[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [churchId, dateRange]);

  const loadAnalytics = async () => {
    try {
      const startDate = format(subDays(new Date(), parseInt(dateRange)), "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("content_analytics")
        .select("*")
        .eq("church_id", churchId)
        .gte("date", startDate)
        .order("date", { ascending: true });

      if (error) throw error;
      setAnalytics(data || []);

      // Aggregate top content by type
      const byType: Record<string, {views: number; completions: number}> = {};
      (data || []).forEach((stat) => {
        if (!byType[stat.content_type]) {
          byType[stat.content_type] = { views: 0, completions: 0 };
        }
        byType[stat.content_type].views += stat.views;
        byType[stat.content_type].completions += stat.completions;
      });

      setTopContent(
        Object.entries(byType).map(([type, stats]) => ({
          type,
          views: stats.views,
          completions: stats.completions,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error loading analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Aggregate data by date for chart
  const chartData = analytics.reduce((acc: any[], stat) => {
    const existing = acc.find((d) => d.date === stat.date);
    if (existing) {
      existing.views += stat.views;
      existing.completions += stat.completions;
      existing.shares += stat.shares;
    } else {
      acc.push({
        date: stat.date,
        views: stat.views,
        completions: stat.completions,
        shares: stat.shares,
      });
    }
    return acc;
  }, []);

  // Summary stats
  const totals = analytics.reduce(
    (acc, stat) => ({
      views: acc.views + stat.views,
      uniqueViews: acc.uniqueViews + stat.unique_views,
      completions: acc.completions + stat.completions,
      shares: acc.shares + stat.shares,
      timeSpent: acc.timeSpent + stat.avg_time_spent,
    }),
    { views: 0, uniqueViews: 0, completions: 0, shares: 0, timeSpent: 0 }
  );

  const avgTimeFormatted = Math.round(totals.timeSpent / Math.max(analytics.length, 1) / 60);
  const completionRate = totals.views > 0 ? Math.round((totals.completions / totals.views) * 100) : 0;

  const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Content Performance</CardTitle>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>Track how your content is performing</CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Total Views</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totals.views.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Unique Views</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totals.uniqueViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Completions</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totals.completions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Shares</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totals.shares.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-500" />
              <span className="text-xs text-muted-foreground">Avg Time</span>
            </div>
            <p className="text-2xl font-bold mt-1">{avgTimeFormatted} min</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                  />
                  <Area type="monotone" dataKey="views" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="completions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Type Breakdown */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Content Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {topContent.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={topContent}
                    dataKey="views"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ type, views }) => `${type}: ${views}`}
                  >
                    {topContent.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No content data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">Performance by Content Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContent.map((content, index) => (
              <div key={content.type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium capitalize">{content.type}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    {content.views} views
                  </Badge>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {content.completions} completed
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    {content.views > 0 ? Math.round((content.completions / content.views) * 100) : 0}% rate
                  </Badge>
                </div>
              </div>
            ))}
            {topContent.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No content performance data yet. Start creating content to see analytics.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
