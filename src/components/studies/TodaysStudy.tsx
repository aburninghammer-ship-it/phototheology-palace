import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Target,
  Sparkles,
  GraduationCap,
  Flame,
  Building2,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import {
  getTodaysStudy,
  getRandomStudy,
  studyCounts,
  type DailyStudy,
  type StudyLevel
} from "@/data/dailyStudiesLibrary";

const LEVEL_INFO: Record<StudyLevel, {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}> = {
  easy: {
    label: 'Foundation',
    icon: <Building2 className="h-4 w-4" />,
    color: 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400',
    description: 'Start here: Core concepts and simple patterns'
  },
  intermediate: {
    label: 'Growing',
    icon: <GraduationCap className="h-4 w-4" />,
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400',
    description: 'Build deeper: Connect patterns across Scripture'
  },
  deep: {
    label: 'Deep Dive',
    icon: <Flame className="h-4 w-4" />,
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400',
    description: 'Advanced: Multi-dimensional analysis'
  }
};

interface QuestionItemProps {
  question: string;
  hint?: string;
  scripture?: string;
  index: number;
  isRevealed: boolean;
  onToggle: () => void;
}

function QuestionItem({ question, hint, scripture, index, isRevealed, onToggle }: QuestionItemProps) {
  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start gap-3"
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{question}</p>
          {isRevealed && (hint || scripture) && (
            <div className="mt-2 space-y-1">
              {hint && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  <span className="italic">Hint: {hint}</span>
                </p>
              )}
              {scripture && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{scripture}</span>
                </p>
              )}
            </div>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isRevealed ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}

export function TodaysStudy() {
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel>('easy');
  const [currentStudy, setCurrentStudy] = useState<DailyStudy>(() => getTodaysStudy('easy'));
  const [revealedQuestions, setRevealedQuestions] = useState<Set<number>>(new Set());
  const [showInsight, setShowInsight] = useState(false);

  const handleLevelChange = (level: string) => {
    const newLevel = level as StudyLevel;
    setSelectedLevel(newLevel);
    setCurrentStudy(getTodaysStudy(newLevel));
    setRevealedQuestions(new Set());
    setShowInsight(false);
  };

  const handleNewStudy = () => {
    setCurrentStudy(getRandomStudy(selectedLevel));
    setRevealedQuestions(new Set());
    setShowInsight(false);
  };

  const toggleQuestion = (index: number) => {
    setRevealedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const levelInfo = LEVEL_INFO[selectedLevel];
  const allQuestionsRevealed = revealedQuestions.size === currentStudy.questions.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Today's Study
        </h2>
        <p className="text-sm text-muted-foreground">
          Learn the palace principles through guided Bible study
        </p>
      </div>

      {/* Level Selection */}
      <Tabs value={selectedLevel} onValueChange={handleLevelChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          {(Object.keys(LEVEL_INFO) as StudyLevel[]).map((level) => {
            const info = LEVEL_INFO[level];
            return (
              <TabsTrigger
                key={level}
                value={level}
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {info.icon}
                <span className="text-xs font-medium">{info.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedLevel} className="mt-4 space-y-4">
          {/* Level Description */}
          <div className="text-center">
            <Badge className={levelInfo.color}>
              {levelInfo.icon}
              <span className="ml-1">{levelInfo.label}</span>
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{levelInfo.description}</p>
            <p className="text-xs text-muted-foreground">
              {studyCounts[selectedLevel]} studies available
            </p>
          </div>

          {/* Study Card */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs mb-2">
                    {currentStudy.palacePrinciple}
                  </Badge>
                  <CardTitle className="text-lg">{currentStudy.title}</CardTitle>
                  <CardDescription>{currentStudy.principleDescription}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewStudy}
                  title="Get a different study"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Introduction */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">{currentStudy.introduction}</p>
              </div>

              {/* Focus Scripture */}
              <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{currentStudy.focusScripture}</span>
                {currentStudy.focusPassage && (
                  <span className="text-xs text-muted-foreground">— {currentStudy.focusPassage}</span>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Study Questions
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {revealedQuestions.size}/{currentStudy.questions.length} revealed
                  </span>
                </div>
                <ScrollArea className="h-[250px] pr-2">
                  <div className="space-y-2">
                    {currentStudy.questions.map((q, index) => (
                      <QuestionItem
                        key={index}
                        question={q.question}
                        hint={q.hint}
                        scripture={q.scripture}
                        index={index}
                        isRevealed={revealedQuestions.has(index)}
                        onToggle={() => toggleQuestion(index)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Key Insight (revealed after all questions) */}
              {allQuestionsRevealed && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowInsight(!showInsight)}
                  >
                    {showInsight ? (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2 rotate-180" />
                        Hide Key Insight
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Reveal Key Insight
                      </>
                    )}
                  </Button>

                  {showInsight && (
                    <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">💡</div>
                          <div>
                            <h5 className="font-bold text-sm mb-1">Key Insight</h5>
                            <p className="text-sm">{currentStudy.keyInsight}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Practice Activity */}
              {showInsight && currentStudy.practiceActivity && (
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-sm mb-1">Practice This Week</h5>
                        <p className="text-sm">{currentStudy.practiceActivity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Principles */}
              {showInsight && currentStudy.relatedPrinciples && currentStudy.relatedPrinciples.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Related Palace Principles:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentStudy.relatedPrinciples.map((principle, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {principle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>Complete all questions to unlock the Key Insight</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
