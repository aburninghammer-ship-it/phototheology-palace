import { useState } from "react";
import { Sparkles, Loader2, X, BookOpen, RefreshCw, History, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FreeAudioButton } from "@/components/audio/FreeAudioButton";
import { VoiceRecorder } from "@/components/studies/VoiceRecorder";
import { useQuickDevotionHistory, QuickDevotionHistoryItem } from "@/hooks/useQuickDevotionHistory";
import { formatDistanceToNow } from "date-fns";

type DepthLevel = "light" | "standard" | "deep";
type WritingStyle = "mixed-audience" | "academic" | "pastoral" | "youth";

interface QuickDevotionProps {
  onClose: () => void;
}

interface DevotionContent {
  title: string;
  scripture_reference: string;
  scripture_text: string;
  christ_connection: string;
  application: string;
  prayer: string;
  memory_hook: string;
}

const REGEN_STORAGE_KEY = "devotion_regen_count";
const MAX_REGENERATIONS = 3;

function getRegenData(): { date: string; count: number } {
  try {
    const stored = localStorage.getItem(REGEN_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { date: "", count: 0 };
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

type ViewMode = "form" | "result" | "history" | "history-detail";

export function QuickDevotion({ onClose }: QuickDevotionProps) {
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [depth, setDepth] = useState<DepthLevel>("standard");
  const [writingStyle, setWritingStyle] = useState<WritingStyle>("mixed-audience");
  const [isGenerating, setIsGenerating] = useState(false);
  const [devotion, setDevotion] = useState<DevotionContent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<QuickDevotionHistoryItem | null>(null);
  const [regenCount, setRegenCount] = useState(() => {
    const data = getRegenData();
    return data.date === getTodayString() ? data.count : 0;
  });

  const { history, isLoading: historyLoading, saveToHistory, deleteFromHistory } = useQuickDevotionHistory();
  const remainingRegens = MAX_REGENERATIONS - regenCount;

  const generateDevotion = async (isRegeneration = false) => {
    if (!theme.trim()) {
      toast.error("Please enter a theme");
      return;
    }

    if (isRegeneration && regenCount >= MAX_REGENERATIONS) {
      toast.error(`You've used all ${MAX_REGENERATIONS} regenerations for today. Try again tomorrow!`);
      return;
    }

    setIsGenerating(true);
    try {
      const fullTheme = description.trim()
        ? `${theme.trim()} - ${description.trim()}`
        : theme.trim();

      const { data, error } = await supabase.functions.invoke("generate-quick-devotion", {
        body: { theme: fullTheme, depth, writingStyle },
      });

      if (error) throw error;
      setDevotion(data);
      setViewMode("result");

      // Save to history (only on first generation, not regeneration)
      if (!isRegeneration) {
        const devotionContent = JSON.stringify(data);
        saveToHistory.mutate({
          theme: theme.trim(),
          description: description.trim() || undefined,
          depth_level: depth,
          writing_style: writingStyle,
          devotion_content: devotionContent,
          scripture_reference: data.scripture_reference,
        });
      }

      // Track regeneration
      if (isRegeneration) {
        const newCount = regenCount + 1;
        setRegenCount(newCount);
        localStorage.setItem(REGEN_STORAGE_KEY, JSON.stringify({
          date: getTodayString(),
          count: newCount
        }));
      }
    } catch (error) {
      console.error("Error generating devotion:", error);
      toast.error("Failed to generate devotion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (regenCount >= MAX_REGENERATIONS) {
      toast.error(`You've used all ${MAX_REGENERATIONS} regenerations for today.`);
      return;
    }
    generateDevotion(true);
  };

  const handleViewHistoryItem = (item: QuickDevotionHistoryItem) => {
    setSelectedHistoryItem(item);
    try {
      const content = JSON.parse(item.devotion_content) as DevotionContent;
      setDevotion(content);
      setTheme(item.theme);
      setViewMode("history-detail");
    } catch {
      toast.error("Failed to load devotion");
    }
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory.mutate(id, {
      onSuccess: () => toast.success("Devotion removed from history"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleBackToHistory = () => {
    setSelectedHistoryItem(null);
    setDevotion(null);
    setViewMode("history");
  };

  const handleNewDevotion = () => {
    setDevotion(null);
    setTheme("");
    setDescription("");
    setSelectedHistoryItem(null);
    setViewMode("form");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {(viewMode === "history" || viewMode === "history-detail") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={viewMode === "history-detail" ? handleBackToHistory : handleNewDevotion}
                className="mr-1"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Sparkles className="h-5 w-5 text-primary" />
            {viewMode === "history" ? "Devotion History" : viewMode === "history-detail" ? "Past Devotion" : "Quick Daily Devotion"}
          </CardTitle>
          <div className="flex items-center gap-1">
            {viewMode === "form" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("history")}
                title="View history"
              >
                <History className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {viewMode === "history" ? (
            <div className="space-y-4">
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !history?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No devotion history yet</p>
                  <p className="text-sm mt-1">Your quick devotions will appear here</p>
                  <Button variant="outline" className="mt-4" onClick={handleNewDevotion}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Your First Devotion
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleViewHistoryItem(item)}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.theme}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.scripture_reference && `${item.scripture_reference} • `}
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : viewMode === "form" ? (
<div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">What theme would you like to explore today?</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Trust in God, Forgiveness, Patience..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Tell us more about what you'd like (optional)</Label>
                  <VoiceRecorder 
                    onTranscription={(text) => setDescription(prev => prev ? `${prev} ${text}` : text)} 
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="e.g., I'm struggling with anxiety at work and need encouragement... or I want to understand how God's faithfulness applies to my current situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Share your situation, questions, or what you hope to receive from this devotion. Use voice input to speak your thoughts.
                </p>
              </div>

              {/* Depth & Writing Style */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Depth</Label>
                  <Select value={depth} onValueChange={(v) => setDepth(v as DepthLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (2-3 min read)</SelectItem>
                      <SelectItem value="standard">Standard (4-5 min)</SelectItem>
                      <SelectItem value="deep">Deep (6-8 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Writing Style</Label>
                  <Select value={writingStyle} onValueChange={(v) => setWritingStyle(v as WritingStyle)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed-audience">Mixed (Teens & Adults)</SelectItem>
                      <SelectItem value="pastoral">Pastoral</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="youth">Youth-focused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => generateDevotion(false)}
                disabled={isGenerating || !theme.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Devotion...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Today's Devotion
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title with Audio */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold">{devotion.title}</h2>
                  <FreeAudioButton 
                    text={`${devotion.title}. ${devotion.scripture_reference}. ${devotion.scripture_text}. Christ Connection: ${devotion.christ_connection}. Application: ${devotion.application}. Memory Hook: ${devotion.memory_hook}. Prayer: ${devotion.prayer}`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
                <p className="text-muted-foreground">Theme: {theme}</p>
              </div>

              {/* Scripture */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{devotion.scripture_reference}</span>
                </div>
                <p className="italic text-foreground/90">{devotion.scripture_text}</p>
              </div>

              {/* Christ Connection */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">✝️ Christ Connection</h3>
                <p className="text-muted-foreground">{devotion.christ_connection}</p>
              </div>

              {/* Application */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">🎯 Application</h3>
                <p className="text-muted-foreground">{devotion.application}</p>
              </div>

              {/* Memory Hook */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🧠 Memory Hook</h3>
                <p className="text-foreground/90">{devotion.memory_hook}</p>
              </div>

              {/* Prayer */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">🙏 Prayer</h3>
                <p className="italic text-muted-foreground">{devotion.prayer}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {viewMode === "history-detail" ? (
                  <>
                    <Button variant="outline" onClick={handleNewDevotion} className="flex-1">
                      <Sparkles className="h-4 w-4 mr-2" />
                      New Devotion
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Done
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRegenerate}
                      disabled={remainingRegens <= 0 || isGenerating}
                      className="flex-1"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerate ({remainingRegens} left)
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Done
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
