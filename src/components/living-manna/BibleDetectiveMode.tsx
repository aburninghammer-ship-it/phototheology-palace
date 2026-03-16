import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronLeft, Lock, Unlock, FileText, Send,
  Loader2, Sparkles, CheckCircle2, BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import {
  DETECTIVE_CASES,
  type DetectiveCaseFile,
  type Difficulty,
} from "@/data/bibleDetectiveCases";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  rookie: "bg-green-600",
  detective: "bg-amber-600",
  "master-sleuth": "bg-red-600",
};

const CLUE_TYPE_COLORS: Record<string, string> = {
  scripture: "bg-blue-600",
  historical: "bg-amber-600",
  linguistic: "bg-purple-600",
  typological: "bg-teal-600",
  prophetic: "bg-red-600",
};

export function BibleDetectiveMode() {
  const [selectedCase, setSelectedCase] = useState<DetectiveCaseFile | null>(null);
  const [revealedClues, setRevealedClues] = useState(0);
  const [phase, setPhase] = useState<"case-select" | "investigating" | "deduction" | "verdict">("case-select");
  const [deductionIdentity, setDeductionIdentity] = useState("");
  const [deductionTimeline, setDeductionTimeline] = useState("");
  const [deductionMeaning, setDeductionMeaning] = useState("");
  const [verdictScore, setVerdictScore] = useState<number | null>(null);
  const [verdictFeedback, setVerdictFeedback] = useState<string | null>(null);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateTopic, setGenerateTopic] = useState("");

  const resetState = () => {
    setSelectedCase(null);
    setRevealedClues(0);
    setDeductionIdentity("");
    setDeductionTimeline("");
    setDeductionMeaning("");
    setVerdictScore(null);
    setVerdictFeedback(null);
    setPhase("case-select");
  };

  const selectCase = (c: DetectiveCaseFile) => {
    setSelectedCase(c);
    setRevealedClues(0);
    setDeductionIdentity("");
    setDeductionTimeline("");
    setDeductionMeaning("");
    setVerdictScore(null);
    setVerdictFeedback(null);
    setPhase("investigating");
  };

  const submitDeduction = async () => {
    if (!selectedCase) return;
    setVerdictLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-detective-evaluate",
          caseTitle: selectedCase.title,
          caseVerdict: selectedCase.verdict,
          userIdentity: deductionIdentity.trim(),
          userTimeline: deductionTimeline.trim(),
          userMeaning: deductionMeaning.trim(),
          cluesRevealed: revealedClues,
          totalClues: selectedCase.clues.length,
        },
      });
      if (error) throw error;
      const content = data?.content || "";
      const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
      setVerdictScore(scoreMatch ? parseInt(scoreMatch[1], 10) : 50);
      setVerdictFeedback(content);
      setPhase("verdict");
    } catch {
      setVerdictFeedback("Failed to evaluate. Please try again.");
      setVerdictScore(0);
      setPhase("verdict");
    } finally {
      setVerdictLoading(false);
    }
  };

  const generateCase = async () => {
    if (!generateTopic.trim()) return;
    setGenerateLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-detective-generate",
          topic: generateTopic.trim(),
        },
      });
      if (error) throw error;
      const content = data?.content || "";
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        const generated: DetectiveCaseFile = {
          id: "generated-" + Date.now(),
          caseNumber: DETECTIVE_CASES.length + 1,
          title: parsed.title || "Generated Case",
          difficulty: parsed.difficulty || "detective",
          category: parsed.category || "identity",
          description: parsed.description || "",
          clues: (parsed.clues || []).map((c: any, i: number) => ({
            id: `gen-${i}`,
            clueNumber: i + 1,
            text: c.text,
            scriptureRef: c.scriptureRef,
            clueType: c.clueType || "scripture",
          })),
          verdict: parsed.verdict || { identity: "", timeline: "", meaning: "", explanation: "" },
        };
        setSelectedCase(generated);
        setRevealedClues(0);
        setPhase("investigating");
      }
    } catch {
      // silently fail
    } finally {
      setGenerateLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 71) return "text-green-400";
    if (score >= 41) return "text-amber-400";
    return "text-red-400";
  };

  const canSubmitDeduction =
    deductionIdentity.trim().length >= 10 &&
    deductionTimeline.trim().length >= 10 &&
    deductionMeaning.trim().length >= 10;

  // ── Case Select Phase ──
  if (phase === "case-select") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-700 to-yellow-700">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bible Detective</h2>
            <p className="text-xs text-white/60">Investigate prophetic mysteries using Scripture alone</p>
          </div>
        </div>

        {/* Case Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DETECTIVE_CASES.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => selectCase(c)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-mono">Case #{c.caseNumber}</span>
                    <div className="flex gap-1.5">
                      <Badge className={`${DIFFICULTY_COLORS[c.difficulty]} text-white text-[10px] px-1.5 py-0`}>
                        {c.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-white/70 border-white/20 text-[10px] px-1.5 py-0">
                        {c.category}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-tight">{c.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-1 text-[10px] text-white/30">
                    <FileText className="w-3 h-3" />
                    {c.clues.length} clues
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generate Mystery */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Generate a Mystery</span>
            </div>
            <p className="text-xs text-white/50">
              Enter a Bible topic and Jeeves will create a brand-new detective case for you.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={generateTopic}
                onChange={(e) => setGenerateTopic(e.target.value)}
                placeholder="e.g. The Remnant Church, Daniel's Image..."
                className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") generateCase();
                }}
              />
              <Button
                size="sm"
                onClick={generateCase}
                disabled={generateLoading || !generateTopic.trim()}
                className="bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600"
              >
                {generateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Investigating Phase ──
  if (phase === "investigating" && selectedCase) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetState} className="text-white/60 hover:text-white px-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <span className="text-[10px] text-white/40 font-mono">Case #{selectedCase.caseNumber}</span>
            <h2 className="text-sm font-bold text-white leading-tight">{selectedCase.title}</h2>
          </div>
          <Badge className={`${DIFFICULTY_COLORS[selectedCase.difficulty]} text-white text-[10px]`}>
            {selectedCase.difficulty}
          </Badge>
        </div>

        {/* Clues */}
        <div className="space-y-2">
          {selectedCase.clues.map((clue, idx) => {
            const isRevealed = idx < revealedClues;
            return (
              <AnimatePresence key={clue.id}>
                {isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Unlock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-mono text-white/50">Clue #{clue.clueNumber}</span>
                          <Badge
                            className={`${CLUE_TYPE_COLORS[clue.clueType] || "bg-gray-600"} text-white text-[10px] px-1.5 py-0`}
                          >
                            {clue.clueType}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{clue.text}</p>
                        <p className="text-xs text-amber-400/70 italic">{clue.scriptureRef}</p>
                        <QuickAudioButton text={clue.text} size="sm" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="bg-white/[0.02] border-white/5">
                    <CardContent className="p-3 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-xs text-white/20 font-mono">Clue #{clue.clueNumber}</span>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {revealedClues < selectedCase.clues.length && (
            <>
              <Button
                size="sm"
                onClick={() => setRevealedClues((p) => p + 1)}
                className="bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600"
              >
                <Search className="w-4 h-4 mr-1" />
                Reveal Next Clue
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRevealedClues(selectedCase.clues.length)}
                className="border-white/20 text-white/60 hover:text-white"
              >
                Reveal All
              </Button>
            </>
          )}
          {revealedClues >= 3 && (
            <Button
              size="sm"
              onClick={() => setPhase("deduction")}
              className="bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600"
            >
              <FileText className="w-4 h-4 mr-1" />
              Submit Deduction
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Deduction Phase ──
  if (phase === "deduction" && selectedCase) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase("investigating")}
            className="text-white/60 hover:text-white px-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <span className="text-[10px] text-white/40 font-mono">Case #{selectedCase.caseNumber}</span>
            <h2 className="text-sm font-bold text-white leading-tight">Submit Your Deduction</h2>
          </div>
        </div>

        <p className="text-xs text-white/50">
          Based on the {revealedClues} clue{revealedClues !== 1 ? "s" : ""} you revealed, present your theory.
          All three fields must be at least 10 characters.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1 block">
              Identity &mdash; Who or what is this?
            </label>
            <Textarea
              value={deductionIdentity}
              onChange={(e) => setDeductionIdentity(e.target.value)}
              placeholder="Identify the subject of this case..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1 block">
              Timeline &mdash; When?
            </label>
            <Textarea
              value={deductionTimeline}
              onChange={(e) => setDeductionTimeline(e.target.value)}
              placeholder="Lay out the chronological evidence..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1 block">
              Meaning &mdash; Why does it matter?
            </label>
            <Textarea
              value={deductionMeaning}
              onChange={(e) => setDeductionMeaning(e.target.value)}
              placeholder="Explain the significance..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
            />
          </div>
        </div>

        <Button
          size="sm"
          onClick={submitDeduction}
          disabled={!canSubmitDeduction || verdictLoading}
          className="w-full bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600"
        >
          {verdictLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Jeeves is evaluating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit to Jeeves
            </>
          )}
        </Button>
      </div>
    );
  }

  // ── Verdict Phase ──
  if (phase === "verdict" && selectedCase) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-700 to-yellow-700">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-white/40 font-mono">Case #{selectedCase.caseNumber}</span>
            <h2 className="text-sm font-bold text-white leading-tight">Verdict</h2>
          </div>
        </div>

        {/* Score */}
        {verdictScore !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-4"
          >
            <span className={`text-5xl font-black ${scoreColor(verdictScore)}`}>
              {verdictScore}
            </span>
            <span className="text-lg text-white/40 ml-1">/100</span>
            <p className="text-xs text-white/40 mt-1">Detective Score</p>
          </motion.div>
        )}

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* User deduction */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">Your Deduction</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Identity</span>
                <p className="text-xs text-white/80">{deductionIdentity}</p>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Timeline</span>
                <p className="text-xs text-white/80">{deductionTimeline}</p>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Meaning</span>
                <p className="text-xs text-white/80">{deductionMeaning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actual verdict */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-semibold text-green-400">Case Verdict</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Identity</span>
                <p className="text-xs text-white/80">{selectedCase.verdict.identity}</p>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Timeline</span>
                <p className="text-xs text-white/80">{selectedCase.verdict.timeline}</p>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase">Meaning</span>
                <p className="text-xs text-white/80">{selectedCase.verdict.meaning}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jeeves Feedback */}
        {verdictFeedback && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">Jeeves Evaluation</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-xs text-white/80 [&_p]:mb-2 [&_li]:mb-1">
                <ReactMarkdown>{verdictFeedback}</ReactMarkdown>
              </div>
              <div className="mt-2">
                <QuickAudioButton text={verdictFeedback} size="sm" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              resetState();
            }}
            variant="outline"
            className="border-white/20 text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cases
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetState();
            }}
            className="bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600"
          >
            <Search className="w-4 h-4 mr-1" />
            Try Another Case
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
