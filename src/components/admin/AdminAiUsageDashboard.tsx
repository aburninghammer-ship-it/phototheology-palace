import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, Cpu, DollarSign, Zap, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UsageSummary {
  totalCalls: number;
  totalTokens: number;
  totalCostCents: number;
  todayCostCents: number;
  weekCostCents: number;
  monthCostCents: number;
  uniqueUsers: number;
}

interface FunctionStat {
  name: string;
  calls: number;
  tokens: number;
  cost: number;
}

interface ModelStat {
  name: string;
  calls: number;
  tokens: number;
  cost: number;
}

interface UserStat {
  userId: string;
  calls: number;
  tokens: number;
  cost: number;
}

interface DailyTrend {
  date: string;
  cost: number;
}

// Friendly names for edge functions
const FUNCTION_LABELS: Record<string, string> = {
  "forty-day-debate": "40 Days of Smoke",
  "generate-gem": "Gem Mining",
  "generate-verse-commentary": "Verse Commentary",
  "generate-chapter-commentary": "Chapter Commentary",
  "generate-epic-commentary": "Epic Commentary",
  "generate-sermon-idea": "Sermon Ideas",
  "sermon-writer-jeeves": "Sermon Writer",
  "sermon-writer-polish": "Sermon Polish",
  "bible-freestyle": "Bible Freestyle",
  "freestyle-mentor": "Freestyle Mentor",
  "study-buddy": "Study Buddy",
  "jeeves": "Jeeves AI",
  "jeeves-reasoning": "Jeeves Deep Reasoning",
  "web-research-assistant": "Research Assistant",
  "generate-devotional": "Devotional Generator",
  "palace-ai-engine": "Palace AI Engine",
  "room-mentor": "Room Mentor",
  "apply-spiritual-weapon": "Weapon Polish",
  "seed-arsenal": "Arsenal Seed",
  "analyze-verse-pt": "PT Verse Analysis",
  "pt-passage-analyzer": "PT Passage Analyzer",
  "generate-study-series": "Study Series Generator",
  "generate-bible-study": "Bible Study Generator",
  "mind-map-analyze": "Mind Map Analysis",
  "grade-floor-assessment": "Floor Assessment",
  "grade-challenge-response": "Challenge Grading",
  "generate-spark": "Spark Generator",
  "drill-drill": "Drill Engine",
};

function formatCost(cents: number): string {
  if (cents < 1) return `${(cents * 100).toFixed(1)}¢`;
  if (cents < 100) return `$${(cents / 100).toFixed(2)}`;
  return `$${(cents / 100).toFixed(0)}`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return String(tokens);
}

export function AdminAiUsageDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [topFunctions, setTopFunctions] = useState<FunctionStat[]>([]);
  const [topModels, setTopModels] = useState<ModelStat[]>([]);
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  const [dailyTrend, setDailyTrend] = useState<DailyTrend[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-ai-usage-stats", {
        body: { scope: "admin" },
      });
      if (error) throw error;
      setSummary(data.summary);
      setTopFunctions(data.topFunctions || []);
      setTopModels(data.topModels || []);
      setTopUsers(data.topUsers || []);
      setDailyTrend(data.dailyTrend || []);
    } catch (err: any) {
      toast.error("Failed to load AI usage stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No AI usage data yet. Data will appear once edge functions start logging.</p>
          <Button onClick={fetchData} variant="outline" className="mt-4 gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  const maxFnCost = topFunctions.length > 0 ? Math.max(...topFunctions.map(f => f.cost)) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            AI Usage Analytics
          </h3>
          <p className="text-xs text-muted-foreground">Last 30 days • Real cost tracking across all AI functions</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">{formatCost(summary.todayCostCents)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-muted-foreground">This Week</span>
            </div>
            <p className="text-xl font-bold text-amber-400">{formatCost(summary.weekCostCents)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">30-Day Total</span>
            </div>
            <p className="text-xl font-bold text-purple-400">{formatCost(summary.monthCostCents)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Active Users</span>
            </div>
            <p className="text-xl font-bold text-blue-400">{summary.uniqueUsers}</p>
            <p className="text-[10px] text-muted-foreground">{summary.totalCalls.toLocaleString()} total calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-user cost estimate */}
      {summary.uniqueUsers > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-amber-300">
              💰 Avg Cost Per Active User: {formatCost(summary.monthCostCents / summary.uniqueUsers)}/month
            </p>
            <p className="text-xs text-muted-foreground">
              Based on {summary.uniqueUsers} users × {formatTokens(summary.totalTokens)} tokens over 30 days
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Functions by Cost */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cost by Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {topFunctions.map((fn) => (
                  <div key={fn.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate max-w-[60%]">
                        {FUNCTION_LABELS[fn.name] || fn.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {fn.calls} calls
                        </Badge>
                        <span className="font-bold text-primary">{formatCost(fn.cost)}</span>
                      </div>
                    </div>
                    <Progress value={(fn.cost / maxFnCost) * 100} className="h-1.5" />
                  </div>
                ))}
                {topFunctions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No data yet</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Top Models */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cost by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topModels.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-xs">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatTokens(m.tokens)} tokens • {m.calls} calls</p>
                  </div>
                  <span className="font-bold text-primary">{formatCost(m.cost)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Top 20 Users by AI Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px]">
            <div className="space-y-2">
              {topUsers.map((u, i) => (
                <div key={u.userId} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-5">#{i + 1}</span>
                    <span className="font-mono text-[10px] truncate max-w-[200px]">{u.userId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{u.calls} calls</span>
                    <span className="text-muted-foreground">{formatTokens(u.tokens)}</span>
                    <span className="font-bold text-primary">{formatCost(u.cost)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Daily Trend (simple text-based) */}
      {dailyTrend.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Daily Cost Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {dailyTrend.map((d) => {
                  const maxDailyCost = Math.max(...dailyTrend.map(t => t.cost));
                  const pct = maxDailyCost > 0 ? (d.cost / maxDailyCost) * 100 : 0;
                  return (
                    <div key={d.date} className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground w-20 shrink-0">{d.date.slice(5)}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-medium w-16 text-right">{formatCost(d.cost)}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
