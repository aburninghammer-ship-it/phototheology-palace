import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Cpu, Zap } from "lucide-react";

// Friendly names
const FUNCTION_LABELS: Record<string, string> = {
  "forty-day-debate": "Defense Mode",
  "generate-gem": "Gem Mining",
  "generate-verse-commentary": "Commentary",
  "generate-chapter-commentary": "Chapter Commentary",
  "generate-epic-commentary": "Epic Commentary",
  "bible-freestyle": "Freestyle",
  "study-buddy": "Study Buddy",
  "jeeves": "Jeeves",
  "sermon-writer-jeeves": "Sermon Writer",
  "palace-ai-engine": "Palace AI",
  "generate-spark": "Sparks",
  "drill-drill": "Drills",
  "web-research-assistant": "Research",
};

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return String(tokens);
}

export function UserAiUsageWidget() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("get-ai-usage-stats", {
          body: { scope: "user" },
        });
        if (!error && result) setData(result);
      } catch (err) {
        console.warn("Failed to load AI usage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalCalls === 0) {
    return (
      <Card className="border-muted">
        <CardContent className="p-4 text-center">
          <Cpu className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No AI usage recorded yet. Start using Jeeves, Gem Mining, or Defense Mode!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Your AI Usage</span>
          </div>
          <Badge variant="outline" className="text-[10px]">Last 30 days</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-muted-foreground">Total Calls</p>
            <p className="text-lg font-bold text-primary">{data.totalCalls}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-muted-foreground">Tokens Used</p>
            <p className="text-lg font-bold text-primary">{formatTokens(data.totalTokens)}</p>
          </div>
        </div>

        {data.topFeatures && data.topFeatures.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-medium">Most Used Features</p>
            {data.topFeatures.slice(0, 5).map((f: any) => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-amber-400" />
                  {FUNCTION_LABELS[f.name] || f.name}
                </span>
                <span className="text-muted-foreground">{f.calls} calls</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
