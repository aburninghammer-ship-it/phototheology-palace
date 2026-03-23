import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw,
  Check,
  X,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { bibleRenderedSets, BibleRenderedSet, getTotalChapters, getTotalRenders } from "@/data/bibleRenderedSets";
import { getBibleRenderedImage } from "@/assets/bible-rendered";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SaveDrillButton } from "@/components/drills/SaveDrillButton";

type DrillMode = "learn" | "symbol-to-range" | "range-to-symbol" | "name-to-symbol" | "full-quiz";

interface DrillResult {
  setNumber: number;
  correct: boolean;
  timeSpent: number;
}

const BibleRenderedDrill = () => {
  const [mode, setMode] = useState<DrillMode>("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledSets, setShuffledSets] = useState<BibleRenderedSet[]>([...bibleRenderedSets]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [drillStartTime, setDrillStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [drillComplete, setDrillComplete] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(bibleRenderedSets.map(s => s.category)));

  // Filter sets by category if selected
  const filteredSets = filterCategory 
    ? shuffledSets.filter(s => s.category === filterCategory)
    : shuffledSets;

  const currentSet = filteredSets[currentIndex];
  const totalSets = filteredSets.length;

  const shuffleSets = () => {
    const sets = filterCategory 
      ? bibleRenderedSets.filter(s => s.category === filterCategory)
      : [...bibleRenderedSets];
    setShuffledSets(sets.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setResults([]);
    setDrillComplete(false);
    setDrillStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const resetDrill = () => {
    const sets = filterCategory 
      ? bibleRenderedSets.filter(s => s.category === filterCategory)
      : [...bibleRenderedSets];
    setShuffledSets(sets);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setResults([]);
    setDrillComplete(false);
    setDrillStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const nextCard = () => {
    if (currentIndex < totalSets - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else if (mode !== "learn") {
      setDrillComplete(true);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  // Generate wrong answers for multiple choice
  const generateOptions = (correctSet: BibleRenderedSet, type: "symbol" | "range" | "name"): BibleRenderedSet[] => {
    const otherSets = bibleRenderedSets.filter(s => s.number !== correctSet.number);
    const shuffled = otherSets.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled, correctSet].sort(() => Math.random() - 0.5);
    return options;
  };

  const [options, setOptions] = useState<BibleRenderedSet[]>([]);

  useEffect(() => {
    if (currentSet && mode !== "learn") {
      setOptions(generateOptions(currentSet, mode === "range-to-symbol" ? "symbol" : "range"));
    }
  }, [currentIndex, mode, currentSet]);

  const handleAnswer = (selectedSet: BibleRenderedSet) => {
    if (selectedAnswer !== null) return;
    
    const correct = selectedSet.number === currentSet.number;
    setSelectedAnswer(selectedSet.number);
    
    setResults(prev => [...prev, {
      setNumber: currentSet.number,
      correct,
      timeSpent: Date.now() - questionStartTime
    }]);

    setTimeout(() => {
      nextCard();
    }, 1200);
  };

  const correctCount = results.filter(r => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  // Learn Mode - Flashcard style
  const renderLearnMode = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          {currentIndex + 1} / {totalSets}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={shuffleSets}>
            <Shuffle className="h-4 w-4 mr-1" />
            Shuffle
          </Button>
          <Button variant="outline" size="sm" onClick={resetDrill}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <Progress value={((currentIndex + 1) / totalSets) * 100} className="h-2" />

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="relative"
      >
        <Card 
          className={cn(
            "min-h-[350px] cursor-pointer transition-all duration-300",
            showAnswer ? "bg-primary/5 border-primary/30" : "hover:border-primary/20"
          )}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[350px] p-8">
            <AnimatePresence mode="wait">
              {!showAnswer ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -90 }}
                  className="text-center space-y-6"
                >
                  {getBibleRenderedImage(currentSet.number) ? (
                    <img
                      src={getBibleRenderedImage(currentSet.number)}
                      alt={`Set ${currentSet.number}`}
                      className="w-48 h-48 mx-auto rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="text-8xl">{currentSet.symbol}</div>
                  )}
                  <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                    <Eye className="h-4 w-4" />
                    Tap to reveal
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -90 }}
                  className="text-center space-y-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="mb-1">Set {currentSet.number}</Badge>
                    <Badge variant="outline" className="mb-1">
                      {currentSet.chapters} ch / {currentSet.renders} renders
                    </Badge>
                    <Badge variant={currentSet.testament === 'new' ? 'default' : 'secondary'} className="mb-1">
                      {currentSet.testament === 'new' ? 'NT' : 'OT'}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold">{currentSet.name}</h2>
                  <p className="text-lg text-primary font-semibold">{currentSet.range}</p>
                  <p className="text-muted-foreground text-sm max-w-md">{currentSet.description}</p>
                  {currentSet.symbols && currentSet.symbols.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Symbol Pack:</p>
                      <div className="flex flex-wrap gap-1 justify-center max-w-md">
                        {currentSet.symbols.slice(0, 6).map((sym, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {sym}
                          </Badge>
                        ))}
                        {currentSet.symbols.length > 6 && (
                          <Badge variant="outline" className="text-xs">+{currentSet.symbols.length - 6}</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center mt-4">
                    <EyeOff className="h-4 w-4" />
                    Tap to hide
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevCard} 
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button 
          onClick={nextCard} 
          disabled={currentIndex === totalSets - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  // Quiz Mode - Multiple choice
  const renderQuizMode = () => {
    if (drillComplete) {
      return (
        <Card className="border-2 border-primary/30">
          <CardContent className="py-12 text-center space-y-6">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="text-3xl font-bold">Drill Complete!</h2>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{correctCount}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{results.length - correctCount}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={shuffleSets}>
                <Shuffle className="h-4 w-4 mr-2" />
                Try Again (Shuffled)
              </Button>
              <Button variant="outline" onClick={resetDrill}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Order
              </Button>
              <SaveDrillButton
                drillData={{
                  verse_reference: `Bible Rendered - ${mode}`,
                  mode: mode,
                  drill_type: "bible-rendered",
                  floor_number: 1,
                  room_id: "bible-rendered",
                  drill_data: {
                    correct: correctCount,
                    incorrect: results.length - correctCount,
                    accuracy,
                    totalSets: results.length,
                    filterCategory,
                    results,
                  },
                }}
                defaultName={`Bible Rendered ${mode} - ${accuracy}%`}
                isCompleted={true}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    const getQuestionText = () => {
      switch (mode) {
        case "symbol-to-range":
          return "Which Scripture range does this symbol represent?";
        case "range-to-symbol":
          return "Which symbol represents this Scripture range?";
        case "name-to-symbol":
          return "Which symbol represents this theme?";
        case "full-quiz":
          return "Match the symbol to its Scripture range:";
        default:
          return "";
      }
    };

    const getPrompt = () => {
      switch (mode) {
        case "symbol-to-range":
        case "full-quiz":
          return getBibleRenderedImage(currentSet.number) ? (
            <img
              src={getBibleRenderedImage(currentSet.number)}
              alt={`Set ${currentSet.number}`}
              className="w-40 h-40 mx-auto rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="text-8xl">{currentSet.symbol}</div>
          );
        case "range-to-symbol":
          return (
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{currentSet.range}</p>
            </div>
          );
        case "name-to-symbol":
          return (
            <div className="text-center">
              <p className="text-2xl font-bold">{currentSet.name}</p>
              <p className="text-muted-foreground text-sm mt-2">{currentSet.description}</p>
            </div>
          );
        default:
          return null;
      }
    };

    const getOptionDisplay = (set: BibleRenderedSet) => {
      switch (mode) {
        case "symbol-to-range":
        case "full-quiz":
          return (
            <div>
              <p className="font-semibold">{set.range}</p>
              <p className="text-xs text-muted-foreground">{set.name}</p>
            </div>
          );
        case "range-to-symbol":
        case "name-to-symbol":
          return getBibleRenderedImage(set.number) ? (
            <img
              src={getBibleRenderedImage(set.number)}
              alt={`Set ${set.number}`}
              className="w-12 h-12 mx-auto rounded-lg object-cover"
            />
          ) : (
            <div className="text-4xl">{set.symbol}</div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            {currentIndex + 1} / {totalSets}
          </Badge>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{correctCount}</span>
              <X className="h-4 w-4 text-destructive ml-2" />
              <span>{results.length - correctCount}</span>
            </div>
          </div>
        </div>

        <Progress value={((currentIndex + 1) / totalSets) * 100} className="h-2" />

        <Card className="min-h-[200px]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-6">{getQuestionText()}</p>
            {getPrompt()}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.number;
            const isCorrect = option.number === currentSet.number;
            const showResult = selectedAnswer !== null;

            return (
              <motion.div
                key={option.number}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 px-4 transition-all",
                    showResult && isCorrect && "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
                    showResult && isSelected && !isCorrect && "bg-destructive/20 border-destructive text-destructive",
                    !showResult && "hover:border-primary/50"
                  )}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3 w-full justify-center">
                    {showResult && isCorrect && <Check className="h-5 w-5 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-destructive" />}
                    {getOptionDisplay(option)}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Memorization Drill
          </CardTitle>
          <CardDescription>
            Master the 50 symbols that compress the entire Bible into memorable glyphs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Filter by Section:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilterCategory(null);
                  resetDrill();
                }}
              >
                All (50)
              </Button>
              {categories.map((cat) => {
                const count = bibleRenderedSets.filter(s => s.category === cat).length;
                return (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFilterCategory(cat);
                      setShuffledSets(bibleRenderedSets.filter(s => s.category === cat));
                      setCurrentIndex(0);
                      setShowAnswer(false);
                      setSelectedAnswer(null);
                      setResults([]);
                      setDrillComplete(false);
                    }}
                  >
                    {cat.split(' ')[0]}... ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Drill Mode:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button
                variant={mode === "learn" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("learn"); resetDrill(); }}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </Button>
              <Button
                variant={mode === "symbol-to-range" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("symbol-to-range"); shuffleSets(); }}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Symbol → Range
              </Button>
              <Button
                variant={mode === "range-to-symbol" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("range-to-symbol"); shuffleSets(); }}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Range → Symbol
              </Button>
              <Button
                variant={mode === "name-to-symbol" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("name-to-symbol"); shuffleSets(); }}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Name → Symbol
              </Button>
              <Button
                variant={mode === "full-quiz" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("full-quiz"); shuffleSets(); }}
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Full Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drill Area */}
      {currentSet && (mode === "learn" ? renderLearnMode() : renderQuizMode())}

      {/* Quick Reference - only show in learn mode */}
      {mode === "learn" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
            <CardDescription>
              All 51 sets at a glance • {getTotalChapters()} chapters • {getTotalRenders()} renders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {filteredSets.map((set, idx) => (
                <Button
                  key={set.number}
                  variant={idx === currentIndex ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-12 w-12 text-xl p-0",
                    set.testament === 'new' && idx !== currentIndex && "bg-blue-50 dark:bg-blue-950/30"
                  )}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowAnswer(false);
                  }}
                  title={`${set.name}: ${set.range} (${set.chapters} ch, ${set.renders} renders)`}
                >
                  {set.symbol}
                </Button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-muted border"></span> Old Testament
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-50 dark:bg-blue-950/30 border"></span> New Testament
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleRenderedDrill;
