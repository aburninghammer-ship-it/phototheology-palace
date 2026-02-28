import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROTATION_CATEGORIES = [
  "Sanctuary",
  "Typology",
  "Prophecy",
  "Character of God",
  "Law & Gospel",
  "Hidden Patterns",
  "Great Controversy",
] as const;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getTodayCategory(): string {
  const dayOfWeek = new Date().getDay();
  return ROTATION_CATEGORIES[dayOfWeek];
}

interface GemClip {
  id: string;
  category: string;
  title: string;
  gem_insight: string;
  transcript: string;
  scripture: string;
  cta: string;
  full_content: string;
  created_at: string;
}

export function DailyGemMiner() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGem, setCurrentGem] = useState<GemClip | null>(null);
  const [history, setHistory] = useState<GemClip[]>([]);
  const [categoryOverride, setCategoryOverride] = useState<string>("auto");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const todayCategory = getTodayCategory();
  const todayDayName = DAY_NAMES[new Date().getDay()];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('daily_gem_clips' as any)
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setHistory(data as unknown as GemClip[]);
      // Set the most recent as current if we don't have one
      if (!currentGem && data.length > 0) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayGem = (data as unknown as GemClip[]).find(
          (g) => new Date(g.created_at) >= todayStart
        );
        if (todayGem) setCurrentGem(todayGem);
      }
    }
  };

  const generateGem = async () => {
    setIsGenerating(true);
    try {
      const body: Record<string, string> = {};
      if (categoryOverride !== "auto") {
        body.category = categoryOverride;
      }

      const { data, error } = await supabase.functions.invoke('generate-daily-gem-clip', {
        body,
      });

      if (error) throw error;

      setCurrentGem(data as GemClip);
      toast({ title: "Gem mined!", description: `"${data.title}" is ready.` });
      loadHistory();
    } catch (err: any) {
      console.error('Gem generation error:', err);
      toast({
        title: "Generation failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast({ title: "Copied!", description: `${fieldName} copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs"
      onClick={() => copyToClipboard(text, label)}
    >
      {copiedField === label ? (
        <Check className="h-3 w-3 mr-1" />
      ) : (
        <Copy className="h-3 w-3 mr-1" />
      )}
      {copiedField === label ? "Copied" : "Copy"}
    </Button>
  );

  const GemPreview = ({ gem, compact = false }: { gem: GemClip; compact?: boolean }) => (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gem Title</div>
          <h3 className="text-lg font-bold">{gem.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{gem.category}</Badge>
          <CopyButton text={gem.title} label={`title-${gem.id}`} />
        </div>
      </div>

      {/* Core Insight */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">The Gem</div>
          <CopyButton text={gem.gem_insight} label={`insight-${gem.id}`} />
        </div>
        <p className="text-sm">{gem.gem_insight}</p>
      </div>

      {/* Transcript */}
      {!compact && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">60-Second Video Transcript</div>
            <CopyButton text={gem.transcript} label={`transcript-${gem.id}`} />
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{gem.transcript}</p>
          <div className="text-xs text-muted-foreground mt-2">
            ~{gem.transcript.split(/\s+/).length} words
          </div>
        </div>
      )}

      {/* Scripture */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">Key Scripture</div>
          <CopyButton text={gem.scripture} label={`scripture-${gem.id}`} />
        </div>
        <p className="text-sm italic">{gem.scripture}</p>
      </div>

      {/* CTA */}
      {!compact && (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div>
            <div className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider font-semibold mb-1">Call to Action</div>
            <p className="text-sm">{gem.cta}</p>
          </div>
          <CopyButton text={gem.cta} label={`cta-${gem.id}`} />
        </div>
      )}

      {/* Copy All */}
      {!compact && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => copyToClipboard(gem.full_content, `full-${gem.id}`)}
        >
          {copiedField === `full-${gem.id}` ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copy Full Script
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Gem Miner</span>
            <Badge variant="outline" className="text-sm font-normal">
              {todayDayName}: {todayCategory}
            </Badge>
          </CardTitle>
          <CardDescription>
            Mine high-impact theological micro-revelations for 60-second viral video clips.
            Today's rotation: <strong>{todayCategory}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Category Override</label>
              <Select value={categoryOverride} onValueChange={setCategoryOverride}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto (rotation)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto ({todayCategory})</SelectItem>
                  {ROTATION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateGem}
              disabled={isGenerating}
              className="min-w-[180px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mining Gem...
                </>
              ) : currentGem ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              ) : (
                "Generate Today's Gem"
              )}
            </Button>
          </div>

          {/* Rotation Preview */}
          <div className="flex gap-1 flex-wrap">
            {ROTATION_CATEGORIES.map((cat, i) => (
              <Badge
                key={cat}
                variant={i === new Date().getDay() ? "default" : "outline"}
                className="text-xs"
              >
                {DAY_NAMES[i].slice(0, 3)}: {cat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Gem Preview */}
      {currentGem && (
        <Card className="border-amber-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Gem Preview</CardTitle>
            <CardDescription>
              Generated {new Date(currentGem.created_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GemPreview gem={currentGem} />
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => setShowHistory(!showHistory)}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <span>Generation History ({history.length})</span>
            {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
          <CardDescription>Last 30 days of generated gem clips</CardDescription>
        </CardHeader>
        {showHistory && (
          <CardContent className="space-y-3">
            {history.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No gems generated yet.</p>
            )}
            {history.map((gem) => (
              <div
                key={gem.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  if (expandedHistoryId === gem.id) {
                    setExpandedHistoryId(null);
                  } else {
                    setExpandedHistoryId(gem.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{gem.category}</Badge>
                    <span className="font-medium text-sm">{gem.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(gem.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentGem(gem);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
                {expandedHistoryId === gem.id && (
                  <div className="mt-3 pt-3 border-t">
                    <GemPreview gem={gem} />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
