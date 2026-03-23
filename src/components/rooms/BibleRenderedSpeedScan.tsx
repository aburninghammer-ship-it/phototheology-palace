import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Timer, Play, RotateCcw, Trophy, Check, X, Zap, Pause
} from "lucide-react";
import { bibleRenderedSets, BibleRenderedSet } from "@/data/bibleRenderedSets";
import { getBibleRenderedImage } from "@/assets/bible-rendered";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GameState = "idle" | "running" | "review" | "complete";

const BibleRenderedSpeedScan = () => {
  const [state, setState] = useState<GameState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [answers, setAnswers] = useState<{ set: BibleRenderedSet; correct: boolean; time: number }[]>([]);
  const [options, setOptions] = useState<BibleRenderedSet[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionStart, setQuestionStart] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sets = bibleRenderedSets;
  const current = sets[currentIndex];

  // Timer
  useEffect(() => {
    if (state === "running") {
      timerRef.current = setInterval(() => setElapsed(e => e + 100), 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state]);

  const generateOptions = useCallback((correctSet: BibleRenderedSet) => {
    const others = sets.filter(s => s.number !== correctSet.number)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...others, correctSet].sort(() => Math.random() - 0.5);
  }, [sets]);

  const startGame = useCallback(() => {
    setCurrentIndex(0);
    setElapsed(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setState("running");
    setQuestionStart(Date.now());
    setOptions(generateOptions(sets[0]));
  }, [sets, generateOptions]);

  const handleAnswer = useCallback((selected: BibleRenderedSet) => {
    if (selectedAnswer !== null) return;
    const correct = selected.number === current.number;
    const time = Date.now() - questionStart;
    setSelectedAnswer(selected.number);
    setAnswers(prev => [...prev, { set: current, correct, time }]);

    setTimeout(() => {
      if (currentIndex < sets.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setSelectedAnswer(null);
        setQuestionStart(Date.now());
        setOptions(generateOptions(sets[nextIdx]));
      } else {
        setState("complete");
      }
    }, 600);
  }, [selectedAnswer, current, currentIndex, sets, questionStart, generateOptions]);

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins}:${String(secs).padStart(2, "0")}.${tenths}`;
  };

  const correctCount = answers.filter(a => a.correct).length;

  // Idle screen
  if (state === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Speed Scan Challenge
          </CardTitle>
          <CardDescription>
            Race through all 51 Bible Rendered images. See the image → pick the correct range. 
            Your total time is tracked — how fast can you scan the entire Bible?
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6 py-8">
          <div className="text-6xl">⏱️</div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">51 Images · 4 Choices Each</p>
            <p className="text-sm text-muted-foreground">Identify each image's Scripture range as fast as you can</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-green-600">🥇</p>
              <p className="text-xs text-muted-foreground">Under 2 min</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-yellow-500">🥈</p>
              <p className="text-xs text-muted-foreground">Under 4 min</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-orange-500">🥉</p>
              <p className="text-xs text-muted-foreground">Under 6 min</p>
            </div>
          </div>
          <Button size="lg" onClick={startGame} className="gap-2">
            <Play className="h-5 w-5" />
            Start Speed Scan
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Complete screen
  if (state === "complete") {
    const accuracy = Math.round((correctCount / sets.length) * 100);
    const medal = elapsed < 120000 ? "🥇" : elapsed < 240000 ? "🥈" : elapsed < 360000 ? "🥉" : "💪";
    const avgTime = Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length);

    return (
      <Card className="border-2 border-primary/30">
        <CardContent className="py-12 text-center space-y-6">
          <div className="text-6xl">{medal}</div>
          <h2 className="text-3xl font-bold">Speed Scan Complete!</h2>
          <div className="text-4xl font-mono font-bold text-primary">{formatTime(elapsed)}</div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-destructive">{sets.length - correctCount}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Avg. {(avgTime / 1000).toFixed(1)}s per image</p>

          {/* Missed list */}
          {answers.some(a => !a.correct) && (
            <div className="text-left max-w-sm mx-auto">
              <p className="text-sm font-semibold mb-2">Review missed:</p>
              <div className="space-y-1">
                {answers.filter(a => !a.correct).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-destructive/10">
                    <X className="h-3.5 w-3.5 text-destructive" />
                    <span className="font-medium">#{a.set.number}</span>
                    <span className="text-muted-foreground">{a.set.range}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button onClick={startGame}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => setState("idle")}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Running — quiz mode
  const img = getBibleRenderedImage(current.number);

  return (
    <div className="space-y-4">
      {/* Timer Bar */}
      <div className="flex items-center justify-between">
        <Badge variant="outline">{currentIndex + 1} / {sets.length}</Badge>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold text-sm",
          "bg-muted text-foreground"
        )}>
          <Timer className="h-3.5 w-3.5" />
          {formatTime(elapsed)}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600 font-semibold">{correctCount}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-destructive font-semibold">{answers.length - correctCount}</span>
        </div>
      </div>

      <Progress value={((currentIndex + 1) / sets.length) * 100} className="h-1.5" />

      {/* Image prompt */}
      <Card className="min-h-[180px]">
        <CardContent className="flex items-center justify-center py-8">
          {img ? (
            <img src={img} alt={`Set ${current.number}`} className="w-36 h-36 rounded-xl object-cover shadow-lg" />
          ) : (
            <div className="text-7xl">{current.symbol}</div>
          )}
        </CardContent>
      </Card>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.number;
          const isCorrect = opt.number === current.number;
          const showResult = selectedAnswer !== null;

          return (
            <motion.div key={opt.number} whileTap={!showResult ? { scale: 0.97 } : {}}>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-auto py-3 px-3 text-left transition-all",
                  showResult && isCorrect && "bg-green-500/20 border-green-500",
                  showResult && isSelected && !isCorrect && "bg-destructive/20 border-destructive",
                )}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
              >
                <div className="w-full">
                  <p className="font-semibold text-sm">{opt.range}</p>
                  <p className="text-xs text-muted-foreground">{opt.name}</p>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BibleRenderedSpeedScan;
