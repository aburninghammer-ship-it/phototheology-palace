import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Zap, SkipForward, Send, Trophy,
  BookOpen, Sparkles, FileText, ChevronRight, Loader2,
  Play, Flame, Target, Crown, Eye, Swords,
} from "lucide-react";
import {
  useFreestyleZone,
  CATEGORY_CONFIG,
  DIFFICULTY_CONFIG,
  type Difficulty,
  type DropCategory,
} from "@/hooks/useFreestyleZone";

// ── Setup Phase ────────────────────────────────────────────────────────

function SetupScreen({ onStart, hasExisting, onResume }: {
  onStart: (d: Difficulty) => void;
  hasExisting: boolean;
  onResume: () => void;
}) {
  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "master"];
  const icons = [Play, Target, Swords, Crown];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent rounded-full blur-2xl scale-150" />
          <Flame className="h-16 w-16 text-orange-500 relative animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          The Freestyler Training Zone
        </h1>
        <p className="text-muted-foreground text-lg">
          Train your theological reflexes. Connect random drops to Christ. Build chains under pressure.
        </p>
      </div>

      {hasExisting && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">You have an active session</p>
              <p className="text-sm text-muted-foreground">Pick up where you left off</p>
            </div>
            <Button onClick={onResume}>Resume Session</Button>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" /> How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
            <p>Jeeves presents a random <strong>"drop"</strong> — a verse, natural phenomenon, historical event, or everyday moment.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
            <p>You connect it to <strong>Christ</strong> — and ideally to previous drops, building a chain.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
            <p>Jeeves evaluates your connection on 4 dimensions: Christ connection, depth, creativity, and chain linking.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">4</span>
            <p>You can <strong>PASS</strong> any drop (momentum penalty), and sessions last up to <strong>60 minutes</strong>.</p>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Selection */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Choose Your Fire Level
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {difficulties.map((diff, i) => {
            const config = DIFFICULTY_CONFIG[diff];
            const Icon = icons[i];
            const fireColors = [
              "hover:border-green-500/50 hover:shadow-green-500/10",
              "hover:border-yellow-500/50 hover:shadow-yellow-500/10",
              "hover:border-orange-500/50 hover:shadow-orange-500/10",
              "hover:border-red-500/50 hover:shadow-red-500/10",
            ];
            const flameCount = i + 1;
            return (
              <motion.div
                key={diff}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all shadow-md hover:shadow-lg ${fireColors[i]}`}
                  onClick={() => onStart(diff)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <span className="text-sm" title={`${flameCount} fire${flameCount > 1 ? 's' : ''}`}>
                        {"🔥".repeat(flameCount)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Active Session ─────────────────────────────────────────────────────

function ActiveSession({
  gameState, currentDrop, currentDropIndex, currentFeedback, timeRemaining,
  momentum, isGeneratingDrop, isEvaluating,
  onSubmit, onPass, onNext, onEnd,
}: {
  gameState: ReturnType<typeof useFreestyleZone>["gameState"];
  currentDrop: ReturnType<typeof useFreestyleZone>["currentDrop"];
  currentDropIndex: number;
  currentFeedback: ReturnType<typeof useFreestyleZone>["currentFeedback"];
  timeRemaining: number;
  momentum: number;
  isGeneratingDrop: boolean;
  isEvaluating: boolean;
  onSubmit: (response: string) => void;
  onPass: () => void;
  onNext: () => void;
  onEnd: () => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSubmitted = currentFeedback !== null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (!input.trim() || isEvaluating) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleNext = () => {
    onNext();
  };

  // Focus textarea when new drop arrives
  useEffect(() => {
    if (currentDrop && !hasSubmitted) {
      textareaRef.current?.focus();
    }
  }, [currentDrop, hasSubmitted]);

  // Momentum glow color — fire-themed
  const getGlowColor = () => {
    if (momentum >= 80) return "shadow-lg shadow-orange-500/30 border-orange-400/40";
    if (momentum >= 60) return "shadow-lg shadow-yellow-500/20 border-yellow-400/30";
    if (momentum >= 40) return "shadow-md shadow-amber-500/20 border-amber-400/20";
    return "shadow-md shadow-red-500/20 border-red-400/20";
  };

  const catConfig = currentDrop ? CATEGORY_CONFIG[currentDrop.category] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Flame className={`h-4 w-4 ${momentum >= 70 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
            <Badge variant="outline" className={DIFFICULTY_CONFIG[gameState.difficulty].color}>
              {DIFFICULTY_CONFIG[gameState.difficulty].label}
            </Badge>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            Drop #{currentDropIndex + 1}
          </Badge>
          {/* Streak indicator */}
          {gameState.consecutivePasses === 0 && gameState.scores.length > 0 && (
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px]">
              {gameState.scores.length - gameState.passCount} streak
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 text-sm font-mono px-2 py-1 rounded-md ${
            timeRemaining < 300
              ? "text-red-500 bg-red-500/10 animate-pulse"
              : timeRemaining < 600
              ? "text-amber-500 bg-amber-500/10"
              : "text-muted-foreground bg-muted/50"
          }`}>
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeRemaining)}
          </div>

          <Button variant="outline" size="sm" onClick={onEnd}>
            End Session
          </Button>
        </div>
      </div>

      {/* Momentum Bar — fire gradient */}
      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: momentum >= 80
              ? "linear-gradient(90deg, #f97316, #ef4444, #f59e0b)"
              : momentum >= 60
              ? "linear-gradient(90deg, #f97316, #eab308)"
              : momentum >= 40
              ? "linear-gradient(90deg, #eab308, #d97706)"
              : "linear-gradient(90deg, #dc2626, #991b1b)",
          }}
          animate={{ width: `${momentum}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {momentum >= 70 && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full opacity-50"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
            animate={{ width: `${momentum}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Flame className={`h-3 w-3 ${momentum >= 70 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          {momentum >= 80 ? "On Fire!" : momentum >= 60 ? "Heating Up" : momentum >= 40 ? "Warming" : "Cold"}
        </span>
        <span>{Math.round(momentum)}%</span>
      </div>

      {/* Chain Breadcrumbs */}
      {gameState.drops.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {gameState.drops.slice(0, -1).map((d, i) => {
            const cat = CATEGORY_CONFIG[d.category];
            const wasPassed = gameState.userResponses[i] === "";
            return (
              <div
                key={i}
                className={`shrink-0 text-xs px-2 py-1 rounded-full ${wasPassed ? "bg-muted text-muted-foreground line-through" : "bg-primary/10 text-primary"}`}
                title={d.drop}
              >
                {cat.emoji} {i + 1}
              </div>
            );
          })}
        </div>
      )}

      {/* Drop Card */}
      <AnimatePresence mode="wait">
        {isGeneratingDrop ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-dashed border-orange-500/30">
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <div className="relative">
                  <Flame className="h-10 w-10 text-orange-500/50 animate-pulse" />
                  <Loader2 className="h-5 w-5 animate-spin text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-muted-foreground text-sm">Jeeves is preparing your next drop...</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : currentDrop ? (
          <motion.div
            key={`drop-${currentDropIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`shadow-lg ${getGlowColor()} transition-shadow duration-500`}>
              <CardContent className="p-6 space-y-3">
                {catConfig && (
                  <Badge className={`${catConfig.color} text-white`}>
                    {catConfig.emoji} {catConfig.label}
                  </Badge>
                )}
                <p className="text-xl font-medium leading-relaxed">
                  {currentDrop.drop}
                </p>
                {currentDrop.hint && gameState.difficulty === "beginner" && (
                  <p className="text-sm text-muted-foreground italic">
                    Hint: {currentDrop.hint}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Response Area */}
      {!hasSubmitted ? (
        <div className="space-y-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Connect this drop to Christ... How does it point to Him? Can you link it to previous drops?"
            className="min-h-[120px] resize-none"
            disabled={isEvaluating || isGeneratingDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
          <div className="flex gap-2 justify-between">
            <Button
              variant="outline"
              onClick={onPass}
              disabled={isEvaluating || isGeneratingDrop}
              className="gap-1"
            >
              <SkipForward className="h-4 w-4" /> PASS
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isEvaluating || isGeneratingDrop}
              className="gap-1"
            >
              {isEvaluating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</>
              ) : (
                <><Send className="h-4 w-4" /> Submit (Cmd+Enter)</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Feedback Display */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5">
            <CardContent className="p-4 space-y-3">
              {/* Score Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className={`h-5 w-5 ${currentFeedback.totalScore >= 30 ? 'text-orange-500' : currentFeedback.totalScore >= 20 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <span className="text-lg font-bold font-mono">{currentFeedback.totalScore}/40</span>
                </div>
                {currentFeedback.totalScore >= 35 && (
                  <Badge className="bg-orange-500 text-white animate-pulse">Blazing!</Badge>
                )}
                {currentFeedback.totalScore >= 28 && currentFeedback.totalScore < 35 && (
                  <Badge className="bg-yellow-500 text-white">Strong</Badge>
                )}
              </div>

              {/* Score Bars */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Christ Connection", value: currentFeedback.christConnection, emoji: "✝️" },
                  { label: "Depth", value: currentFeedback.depth, emoji: "🔍" },
                  { label: "Creativity", value: currentFeedback.creativity, emoji: "💡" },
                  { label: "Chain Link", value: currentFeedback.chainLink, emoji: "🔗" },
                ].map(({ label, value, emoji }, idx) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">{emoji} {label}</span>
                      <span className="font-mono font-bold text-xs">{value}/10</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: value >= 8
                            ? "linear-gradient(90deg, #f97316, #ef4444)"
                            : value >= 5
                            ? "linear-gradient(90deg, #eab308, #f97316)"
                            : "linear-gradient(90deg, #6b7280, #9ca3af)"
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${value * 10}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-orange-500/10">
                <p className="text-sm text-muted-foreground">
                  {currentFeedback.feedback}
                </p>
                {currentFeedback.suggestion && (
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">
                    {currentFeedback.suggestion}
                  </p>
                )}
              </div>

              <Button onClick={handleNext} className="w-full gap-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Next Drop <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Completion Screen ──────────────────────────────────────────────────

function CompletionScreen({
  gameState, sessionSummary, jeevesDemo, polishedContent,
  isGeneratingSummary, isGeneratingDemo, isPolishing,
  onGenerateSummary, onGenerateDemo, onPolish, onPlayAgain,
}: {
  gameState: ReturnType<typeof useFreestyleZone>["gameState"];
  sessionSummary: ReturnType<typeof useFreestyleZone>["sessionSummary"];
  jeevesDemo: ReturnType<typeof useFreestyleZone>["jeevesDemo"];
  polishedContent: ReturnType<typeof useFreestyleZone>["polishedContent"];
  isGeneratingSummary: boolean;
  isGeneratingDemo: boolean;
  isPolishing: boolean;
  onGenerateSummary: () => void;
  onGenerateDemo: () => void;
  onPolish: (format: string) => void;
  onPlayAgain: () => void;
}) {
  const answeredCount = gameState.userResponses.filter(r => r !== "").length;
  const avgScore = gameState.scores.length > 0
    ? Math.round(gameState.scores.reduce((s, sc) => s + sc.totalScore, 0) / gameState.scores.length)
    : 0;

  // Auto-generate summary on mount
  useEffect(() => {
    if (!sessionSummary && !isGeneratingSummary) {
      onGenerateSummary();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="relative inline-flex"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent rounded-full blur-xl scale-150" />
          <Flame className="h-16 w-16 text-orange-500 mx-auto relative" />
        </motion.div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Session Complete!
        </h1>
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Target className="h-3 w-3" /> {gameState.drops.length} drops
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 border-green-500/30 text-green-600 dark:text-green-400">
            <Send className="h-3 w-3" /> {answeredCount} answered
          </Badge>
          {gameState.passCount > 0 && (
            <Badge variant="outline" className="gap-1 px-3 py-1 border-muted-foreground/30">
              <SkipForward className="h-3 w-3" /> {gameState.passCount} passed
            </Badge>
          )}
          <Badge className="gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Flame className="h-3 w-3" /> Avg: {avgScore}/40
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="demo">Jeeves Demo</TabsTrigger>
          <TabsTrigger value="polish">Polish & Save</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {isGeneratingSummary ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Jeeves is reviewing your session...</p>
              </CardContent>
            </Card>
          ) : sessionSummary ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{sessionSummary.title}</h2>
                  <Badge className="text-lg px-3 py-1">{sessionSummary.overallGrade}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Strengths</h3>
                    <ul className="text-sm space-y-1">
                      {sessionSummary.strengths.map((s, i) => (
                        <li key={i} className="flex gap-1"><span className="text-green-500">+</span> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Growth Areas</h3>
                    <ul className="text-sm space-y-1">
                      {sessionSummary.growthAreas.map((g, i) => (
                        <li key={i} className="flex gap-1"><span className="text-amber-500">~</span> {g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {sessionSummary.bestMoment && (
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-primary mb-1">Best Moment</p>
                    <p className="text-sm">{sessionSummary.bestMoment}</p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground italic">{sessionSummary.patternNoticed}</p>
                <p className="text-sm">{sessionSummary.encouragement}</p>

                {sessionSummary.recommendedNextDifficulty && (
                  <p className="text-xs text-muted-foreground">
                    Recommended next: <strong>{DIFFICULTY_CONFIG[sessionSummary.recommendedNextDifficulty]?.label}</strong>
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Evaluation Tab — Chain Review */}
        <TabsContent value="evaluation" className="space-y-3">
          {gameState.drops.map((drop, i) => {
            const response = gameState.userResponses[i];
            const scores = gameState.scores[i];
            const wasPassed = response === "";
            const cat = CATEGORY_CONFIG[drop.category];
            return (
              <Card key={i} className={wasPassed ? "opacity-60" : ""}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${cat.color} text-white text-xs`}>{cat.emoji} {cat.label}</Badge>
                    <span className="text-xs text-muted-foreground">Drop #{i + 1}</span>
                    {wasPassed && <Badge variant="outline" className="text-xs">PASSED</Badge>}
                  </div>
                  <p className="text-sm font-medium">{drop.drop}</p>
                  {!wasPassed && response && (
                    <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3">{response}</p>
                  )}
                  {scores && (
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>Christ: {scores.christConnection}</span>
                      <span>Depth: {scores.depth}</span>
                      <span>Creative: {scores.creativity}</span>
                      <span>Chain: {scores.chainLink}</span>
                      <span className="font-bold text-foreground">{scores.totalScore}/40</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Jeeves Demo Tab */}
        <TabsContent value="demo" className="space-y-4">
          {!jeevesDemo && !isGeneratingDemo ? (
            <Card>
              <CardContent className="p-8 text-center space-y-3">
                <Sparkles className="h-10 w-10 text-primary mx-auto" />
                <p className="text-muted-foreground">
                  Watch Jeeves freestyle YOUR drops — building a master-level chain from every prompt in your session.
                </p>
                <Button onClick={onGenerateDemo} className="gap-1">
                  <Sparkles className="h-4 w-4" /> Show Me How It's Done
                </Button>
              </CardContent>
            </Card>
          ) : isGeneratingDemo ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Jeeves is building a freestyle masterpiece...</p>
              </CardContent>
            </Card>
          ) : jeevesDemo ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {jeevesDemo.title}
                </h2>

                <div className="space-y-4">
                  {jeevesDemo.chain.map((entry, i) => {
                    const cat = CATEGORY_CONFIG[entry.category as DropCategory] || CATEGORY_CONFIG.scripture;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={`${cat.color} text-white text-xs`}>{cat.emoji}</Badge>
                          <span className="text-xs text-muted-foreground font-medium">{entry.drop}</span>
                        </div>
                        <p className="text-sm pl-4 border-l-2 border-primary/30">{entry.connection}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{jeevesDemo.conclusion}</p>
                  <p className="text-sm text-primary font-medium">{jeevesDemo.closingVerse}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Polish & Save Tab */}
        <TabsContent value="polish" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" /> Transform Your Session
              </h3>
              <p className="text-sm text-muted-foreground">
                Turn your freestyle connections into polished content.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "devotional", label: "Devotional", icon: BookOpen },
                  { id: "sermon_outline", label: "Sermon Outline", icon: FileText },
                  { id: "bible_study", label: "Bible Study Guide", icon: Target },
                  { id: "script", label: "Video/Podcast Script", icon: Play },
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-1"
                    onClick={() => onPolish(id)}
                    disabled={isPolishing}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {isPolishing && (
            <Card>
              <CardContent className="p-8 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Polishing your content...</p>
              </CardContent>
            </Card>
          )}

          {polishedContent && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{polishedContent.title}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(polishedContent.content);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {polishedContent.content}
                </div>
                {polishedContent.keyVerses?.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Key verses: {polishedContent.keyVerses.join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={onPlayAgain} variant="outline" className="gap-1">
          <Flame className="h-4 w-4 text-orange-500" /> Light Another Fire
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function FreestyleZone() {
  const navigate = useNavigate();
  const game = useFreestyleZone();

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/games")}
          className="mb-4 gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Games
        </Button>

        {game.sessionLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : game.gameState.phase === "setup" ? (
          <SetupScreen
            onStart={game.startSession}
            hasExisting={game.hasExistingSession}
            onResume={game.resumeGame}
          />
        ) : game.gameState.phase === "active" ? (
          <ActiveSession
            gameState={game.gameState}
            currentDrop={game.currentDrop}
            currentDropIndex={game.currentDropIndex}
            currentFeedback={game.currentFeedback}
            timeRemaining={game.timeRemaining}
            momentum={game.gameState.momentum}
            isGeneratingDrop={game.isGeneratingDrop}
            isEvaluating={game.isEvaluating}
            onSubmit={game.submitResponse}
            onPass={game.passDrop}
            onNext={game.advanceToNextDrop}
            onEnd={game.endSession}
          />
        ) : (
          <CompletionScreen
            gameState={game.gameState}
            sessionSummary={game.sessionSummary}
            jeevesDemo={game.jeevesDemo}
            polishedContent={game.polishedContent}
            isGeneratingSummary={game.isGeneratingSummary}
            isGeneratingDemo={game.isGeneratingDemo}
            isPolishing={game.isPolishing}
            onGenerateSummary={game.generateSessionSummary}
            onGenerateDemo={game.generateJeevesDemo}
            onPolish={game.polishSession}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </main>
    </div>
  );
}
