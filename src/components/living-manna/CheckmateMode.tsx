import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, ChevronRight, Loader2, RotateCcw, BookOpen,
  Plus, Trash2, ArrowRight, Zap, Copy, Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { toast } from "sonner";

interface CheckmateModeProps {
  /** Pre-fill from a forged weapon */
  initialWeapon?: {
    argument: string;
    target?: string;
    topic?: string;
  };
  onBack?: () => void;
}

interface CheckmateMove {
  id: string;
  moveNumber: number;
  question: string;
  verses: string[];
  purpose: string; // e.g. "The Trap" / "The Tightener" / "The Checkmate"
}

interface CheckmateResult {
  thesis: string;
  moves: CheckmateMove[];
  explanation: string;
  strategyNote: string;
}

export function CheckmateMode({ initialWeapon, onBack }: CheckmateModeProps) {
  const [thesis, setThesis] = useState(initialWeapon?.argument || "");
  const [target, setTarget] = useState(initialWeapon?.target || "");
  const [topic, setTopic] = useState(initialWeapon?.topic || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CheckmateResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Manual edit mode
  const [editingMoveId, setEditingMoveId] = useState<string | null>(null);

  const generateCheckmate = async () => {
    if (thesis.trim().length < 30) {
      toast.error("Your thesis needs at least 30 characters.");
      return;
    }
    setIsGenerating(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-checkmate",
          thesis: thesis.trim(),
          target: target.trim() || undefined,
          doctrineTopic: topic.trim() || undefined,
        },
      });
      if (error) throw error;

      const content = data?.content || "";
      // Parse structured JSON from AI response
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*"moves"[\s\S]*\}/);
      let parsed: CheckmateResult | null = null;

      if (jsonMatch) {
        try {
          const raw = jsonMatch[1] || jsonMatch[0];
          parsed = JSON.parse(raw.trim());
        } catch {
          // fallback: use raw content
        }
      }

      if (parsed && parsed.moves?.length) {
        setResult(parsed);
      } else {
        // Fallback: display as raw markdown
        setResult({
          thesis: thesis.trim(),
          moves: [],
          explanation: content,
          strategyNote: "",
        });
      }
    } catch (err) {
      console.error("Checkmate generation error:", err);
      toast.error("Failed to generate checkmate sequence.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = result.moves.length
      ? result.moves.map((m, i) => {
          const label = i === 0 ? "🪤 THE TRAP (Most Unthreatening)" : i === result.moves.length - 1 ? "♚ CHECKMATE" : `🔧 MOVE ${i + 1}`;
          return `${label}\nQ: ${m.question}\nVerses: ${m.verses.join(", ")}\nPurpose: ${m.purpose}`;
        }).join("\n\n") + `\n\n---\n🧠 STRATEGY: ${result.strategyNote}\n\n📖 EXPLANATION:\n${result.explanation}`
      : result.explanation;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Checkmate copied to clipboard!");
  };

  const getMoveIcon = (index: number, total: number) => {
    if (index === 0) return "🪤";
    if (index === total - 1) return "♚";
    return "🔧";
  };

  const getMoveLabel = (index: number, total: number) => {
    if (index === 0) return "THE TRAP";
    if (index === total - 1) return "CHECKMATE";
    return `MOVE ${index + 1}`;
  };

  const getMoveColor = (index: number, total: number) => {
    if (index === 0) return { bg: "from-sky-950/40 to-blue-950/30", border: "border-sky-500/40", text: "text-sky-300", accent: "text-sky-400" };
    if (index === total - 1) return { bg: "from-red-950/40 to-orange-950/30", border: "border-red-500/40", text: "text-red-300", accent: "text-red-400" };
    return { bg: "from-amber-950/40 to-yellow-950/30", border: "border-amber-500/40", text: "text-amber-300", accent: "text-amber-400" };
  };

  const reset = () => {
    setResult(null);
    if (!initialWeapon) {
      setThesis("");
      setTarget("");
      setTopic("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-amber-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
            Checkmate Setup
          </h3>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Build a 3–4 move question sequence that logically forces your opponent to face the obvious conclusion. 
          The first question is the most unthreatening — but once they answer it, the trap is set and there's no turning back.
        </p>
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
            ← Back to Forge
          </Button>
        )}
      </div>

      {/* How It Works */}
      <Card variant="glass" className="border-amber-500/20 bg-amber-950/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-amber-300">How the Checkmate Works</p>
              <div className="grid gap-2 text-foreground/80">
                <div className="flex gap-2">
                  <span className="text-lg leading-none">🪤</span>
                  <div>
                    <span className="font-semibold text-sky-300">Move 1 — The Trap:</span>{" "}
                    The most unthreatening question. It sounds harmless, but it's actually the most important. 
                    Once the critic answers it honestly, they've committed to a premise they can't escape.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-lg leading-none">🔧</span>
                  <div>
                    <span className="font-semibold text-amber-300">Move 2–3 — The Tighteners:</span>{" "}
                    Follow-up questions that build on their concession. Each one narrows the logical space until only one conclusion remains.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-lg leading-none">♚</span>
                  <div>
                    <span className="font-semibold text-red-300">Final Move — Checkmate:</span>{" "}
                    The question that forces the obvious answer. The critic must either accept the conclusion or contradict what they already agreed to.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!result ? (
        /* ─── INPUT PHASE ─── */
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Your Thesis / Doctrinal Position <span className="text-red-400">*</span>
            </label>
            <Textarea
              placeholder="What truth are you defending? E.g.: 'The seventh-day Sabbath remains binding on all Christians because it was established at creation before any Jewish nation existed...'"
              className="min-h-[120px] max-h-[250px] bg-background/50"
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
            />
            <span className={`text-xs ${thesis.trim().length >= 30 ? "text-green-500" : "text-muted-foreground"}`}>
              {thesis.trim().length}/30 min characters
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Opposing Position (optional)
            </label>
            <Textarea
              placeholder="What is the critic arguing? E.g.: 'The Sabbath was abolished at the cross and is no longer required...'"
              className="min-h-[80px] max-h-[150px] bg-background/50 border-red-500/20"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Topic Label (optional)
            </label>
            <Input
              placeholder="E.g.: Sabbath, State of the Dead, Sanctuary..."
              className="bg-background/50"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-semibold"
            disabled={thesis.trim().length < 30 || isGenerating}
            onClick={generateCheckmate}
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Jeeves is Setting Up the Board...</>
            ) : (
              <><Crown className="h-4 w-4 mr-2" /> Generate Checkmate Sequence</>
            )}
          </Button>
        </div>
      ) : (
        /* ─── RESULT PHASE ─── */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Strategy note */}
          {result.strategyNote && (
            <Card variant="glass" className="border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-orange-950/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-300 mb-1">🧠 Strategy</p>
                    <p className="text-sm text-foreground/80">{result.strategyNote}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moves */}
          {result.moves.length > 0 ? (
            <div className="space-y-3">
              {result.moves.map((move, idx) => {
                const colors = getMoveColor(idx, result.moves.length);
                return (
                  <motion.div
                    key={move.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <Card variant="glass" className={`${colors.border} bg-gradient-to-r ${colors.bg}`}>
                      <CardContent className="p-4 space-y-3">
                        {/* Move header */}
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getMoveIcon(idx, result.moves.length)}</span>
                          <div>
                            <p className={`text-sm font-bold ${colors.text}`}>
                              {getMoveLabel(idx, result.moves.length)}
                              {idx === 0 && <span className="ml-2 text-xs font-normal opacity-70">(Most Unthreatening — Most Important)</span>}
                            </p>
                            <p className={`text-xs ${colors.accent} opacity-70`}>{move.purpose}</p>
                          </div>
                          {idx < result.moves.length - 1 && (
                            <ChevronRight className={`h-4 w-4 ml-auto ${colors.accent} opacity-40`} />
                          )}
                        </div>

                        {/* Question */}
                        <div className="p-3 rounded-lg bg-black/20 border border-border/30">
                          <p className="text-sm font-medium text-foreground/90 italic">"{move.question}"</p>
                        </div>

                        {/* Verses */}
                        {move.verses.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {move.verses.map((v, vi) => (
                              <Badge key={vi} variant="outline" className={`text-xs ${colors.border} ${colors.accent}`}>
                                📖 {v}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Connector arrows between moves */}
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span>🪤</span>
                  <ArrowRight className="h-3 w-3" />
                  {result.moves.length > 3 && <><span>🔧</span><ArrowRight className="h-3 w-3" /></>}
                  <span>🔧</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>♚</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Explanation */}
          {result.explanation && (
            <Card variant="glass" className="border-border/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-foreground/60" />
                  <span className="text-sm font-bold text-foreground/80">Full Breakdown</span>
                  <QuickAudioButton
                    text={result.explanation}
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-auto text-foreground/40 hover:text-foreground/60"
                  />
                </div>
                <div className="prose prose-sm prose-invert max-w-none leading-relaxed text-foreground/80 [&_strong]:text-amber-300 [&_h2]:text-amber-300 [&_h3]:text-amber-300">
                  <ReactMarkdown>{result.explanation}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied!</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy Checkmate</>}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              New Checkmate
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
