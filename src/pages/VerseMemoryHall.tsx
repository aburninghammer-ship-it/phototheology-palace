import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { 
  Brain, 
  Trophy, 
  Clock, 
  Target, 
  Zap, 
  Award,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Flame,
  Star
} from "lucide-react";

interface VerseCard {
  id: string;
  reference: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

interface UserProgress {
  verses_memorized: number;
  current_streak: number;
  best_streak: number;
  total_points: number;
  rank: string;
}

export default function VerseMemoryHall() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("flashcards");
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  
  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verseCards] = useState<VerseCard[]>([
    {
      id: "1",
      reference: "John 3:16",
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      difficulty: "easy",
      category: "Salvation"
    },
    {
      id: "2",
      reference: "Romans 8:28",
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      difficulty: "medium",
      category: "Providence"
    },
    {
      id: "3",
      reference: "Philippians 4:13",
      text: "I can do all this through him who gives me strength.",
      difficulty: "easy",
      category: "Strength"
    },
    {
      id: "4",
      reference: "Psalm 23:1",
      text: "The LORD is my shepherd, I lack nothing.",
      difficulty: "easy",
      category: "Comfort"
    },
    {
      id: "5",
      reference: "Proverbs 3:5-6",
      text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      difficulty: "medium",
      category: "Guidance"
    }
  ]);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizTimeLeft, setQuizTimeLeft] = useState(60);

  // Challenge state
  const [dailyChallenge] = useState({
    verse: "Memorize 3 new verses today",
    progress: 1,
    target: 3,
    points: 100
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (quizActive && quizTimeLeft > 0) {
      const timer = setTimeout(() => setQuizTimeLeft(quizTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizTimeLeft === 0 && quizActive) {
      endQuiz();
    }
  }, [quizActive, quizTimeLeft]);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mock progress data - in production, fetch from database
      setProgress({
        verses_memorized: 12,
        current_streak: 5,
        best_streak: 14,
        total_points: 1250,
        rank: "Memory Master"
      });
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.min(prev + 1, verseCards.length - 1));
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };

  const markAsMemorized = () => {
    toast.success(t('verseMemory.markedAsMemorized'));
    nextCard();
  };

  const startQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    setQuizTimeLeft(60);
    setCurrentCardIndex(0);
  };

  const endQuiz = () => {
    setQuizActive(false);
    toast.success(t('verseMemory.quizComplete', { score: quizScore }));
  };

  const checkAnswer = () => {
    const currentCard = verseCards[currentCardIndex];
    const normalizedAnswer = quizAnswer.toLowerCase().trim();
    const normalizedCorrect = currentCard.text.toLowerCase().trim();
    
    if (normalizedAnswer.includes(normalizedCorrect.substring(0, 20))) {
      setQuizScore(quizScore + 10);
      toast.success(t('verseMemory.correctPoints'));
      setQuizAnswer("");
      nextCard();
    } else {
      toast.error(t('verseMemory.notQuiteRight'));
    }
  };

  const currentCard = verseCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Brain className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-bold text-white">{t('verseMemory.title')}</h1>
                <p className="text-purple-200 text-lg">{t('verseMemory.subtitle')}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/palace")}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('verseMemory.backToPalace')}
            </Button>
          </div>

          {/* Progress Stats */}
          {progress && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <p className="text-purple-200 text-sm">{t('verseMemory.versesMemorized')}</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{progress.verses_memorized}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <p className="text-purple-200 text-sm">{t('verseMemory.currentStreak')}</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{t('verseMemory.streakDays', { count: progress.current_streak })}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                    <p className="text-purple-200 text-sm">{t('verseMemory.totalPoints')}</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{progress.total_points}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-300" />
                    <p className="text-purple-200 text-sm">{t('verseMemory.rank')}</p>
                  </div>
                  <p className="text-xl font-bold text-white">{progress.rank}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="flashcards">{t('verseMemory.tabs.flashcards')}</TabsTrigger>
            <TabsTrigger value="mnemonics">{t('verseMemory.tabs.mnemonics')}</TabsTrigger>
            <TabsTrigger value="challenges">{t('verseMemory.tabs.challenges')}</TabsTrigger>
            <TabsTrigger value="quiz">{t('verseMemory.tabs.quiz')}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t('verseMemory.tabs.leaderboard')}</TabsTrigger>
          </TabsList>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('verseMemory.verseFlashcards')}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {t('verseMemory.cardOf', { current: currentCardIndex + 1, total: verseCards.length })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">{t('verseMemory.bibleVersion')}:</label>
                    <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        {BIBLE_TRANSLATIONS.map((trans) => (
                          <SelectItem key={trans.value} value={trans.value}>
                            {trans.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-bold text-primary mb-2">{currentCard.reference}</h3>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {currentCard.difficulty} • {currentCard.category}
                      </span>
                    </div>

                    {!showAnswer ? (
                      <div className="text-center">
                        <p className="text-muted-foreground mb-6">{t('verseMemory.tryToRecall')}</p>
                        <Button onClick={() => setShowAnswer(true)} size="lg">
                          {t('verseMemory.showVerse')}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center animate-in fade-in">
                        <p className="text-lg leading-relaxed mb-6">{currentCard.text}</p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={markAsMemorized} variant="default">
                            <Star className="w-4 h-4 mr-2" />
                            {t('verseMemory.iKnowThis')}
                          </Button>
                          <Button onClick={() => setShowAnswer(false)} variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {t('verseMemory.practiceAgain')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                      variant="outline"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      {t('common.previous')}
                    </Button>
                    <Progress value={((currentCardIndex + 1) / verseCards.length) * 100} className="mx-4 flex-1" />
                    <Button
                      onClick={nextCard}
                      disabled={currentCardIndex === verseCards.length - 1}
                    >
                      {t('common.next')}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mnemonics Tab */}
          <TabsContent value="mnemonics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('verseMemory.mnemonics.visualizationTitle')}</CardTitle>
                  <CardDescription>{t('verseMemory.mnemonics.visualizationSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('verseMemory.mnemonics.visualizationDesc')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('verseMemory.mnemonics.tryVisualization')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('verseMemory.mnemonics.acronymTitle')}</CardTitle>
                  <CardDescription>{t('verseMemory.mnemonics.acronymSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('verseMemory.mnemonics.acronymDesc')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('verseMemory.mnemonics.generateAcronym')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('verseMemory.mnemonics.rhythmTitle')}</CardTitle>
                  <CardDescription>{t('verseMemory.mnemonics.rhythmSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('verseMemory.mnemonics.rhythmDesc')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('verseMemory.mnemonics.createMelody')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('verseMemory.mnemonics.chunkingTitle')}</CardTitle>
                  <CardDescription>{t('verseMemory.mnemonics.chunkingSubtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('verseMemory.mnemonics.chunkingDesc')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('verseMemory.mnemonics.startChunking')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/95 backdrop-blur-sm border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        {t('verseMemory.challenges.dailyChallenge')}
                      </CardTitle>
                      <CardDescription>{t('verseMemory.challenges.completeTodaysGoal')}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">+{dailyChallenge.points}</p>
                      <p className="text-xs text-muted-foreground">{t('verseMemory.points')}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{dailyChallenge.verse}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('verseMemory.challenges.progress')}</span>
                      <span>{dailyChallenge.progress}/{dailyChallenge.target}</span>
                    </div>
                    <Progress value={(dailyChallenge.progress / dailyChallenge.target) * 100} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('verseMemory.challenges.sevenDayStreak')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('verseMemory.challenges.sevenDayStreakDesc')}
                    </p>
                    <Button variant="outline" className="w-full">
                      {t('verseMemory.challenges.joinChallenge')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('verseMemory.challenges.chapterMaster')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('verseMemory.challenges.chapterMasterDesc')}
                    </p>
                    <Button variant="outline" className="w-full">
                      {t('verseMemory.challenges.startChallenge')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('verseMemory.challenges.speedRound')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('verseMemory.challenges.speedRoundDesc')}
                    </p>
                    <Button variant="outline" className="w-full">
                      {t('verseMemory.challenges.beginChallenge')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('verseMemory.quickFireQuiz')}</CardTitle>
                    <CardDescription>{t('verseMemory.testUnderPressure')}</CardDescription>
                  </div>
                  {quizActive && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">{quizTimeLeft}s</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!quizActive ? (
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('verseMemory.readyToTest')}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t('verseMemory.sixtySecondsChallenge')}
                    </p>
                    <Button onClick={startQuiz} size="lg">
                      {t('verseMemory.startQuiz')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-primary mb-4">{currentCard.reference}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{t('verseMemory.typeFromMemory')}</p>
                      <Input
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder={t('verseMemory.startTyping')}
                        className="text-center text-lg"
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={checkAnswer} className="flex-1">
                        {t('verseMemory.submitAnswer')}
                      </Button>
                      <Button onClick={endQuiz} variant="outline">
                        {t('verseMemory.endQuiz')}
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{t('verseMemory.currentScore')}: <span className="font-bold">{quizScore}</span></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  {t('verseMemory.globalLeaderboard')}
                </CardTitle>
                <CardDescription>{t('verseMemory.topMemorizersThisMonth')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "David M.", verses: 156, points: 3420 },
                    { rank: 2, name: "Sarah K.", verses: 142, points: 3180 },
                    { rank: 3, name: "John P.", verses: 138, points: 3050 },
                    { rank: 4, name: "Mary W.", verses: 125, points: 2850 },
                    { rank: 5, name: "You", verses: 12, points: 1250 },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        user.name === "You" ? "bg-primary/10 border-2 border-primary" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                        {user.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{t('verseMemory.versesCount', { count: user.verses })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.points}</p>
                        <p className="text-xs text-muted-foreground">{t('verseMemory.points')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
