import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Zap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePathActivityTracking } from "@/hooks/usePathActivityTracking";

interface Question {
  mainVerse: string;
  mainReference: string;
  connectionOptions: {
    verse: string;
    reference: string;
    isCorrect: boolean;
    reason: string;
  }[];
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    mainVerse: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God",
    mainReference: "Ephesians 2:8",
    connectionOptions: [
      {
        verse: "For all have sinned, and come short of the glory of God",
        reference: "Romans 3:23",
        isCorrect: true,
        reason: "Shows why grace is needed - all have sinned"
      },
      {
        verse: "Not by works of righteousness which we have done, but according to his mercy he saved us",
        reference: "Titus 3:5",
        isCorrect: true,
        reason: "Parallels the grace/not works theme"
      },
      {
        verse: "The LORD is my shepherd; I shall not want",
        reference: "Psalm 23:1",
        isCorrect: false,
        reason: "Different theme - God's provision"
      },
      {
        verse: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart",
        reference: "Romans 10:9",
        isCorrect: true,
        reason: "Shows the faith element mentioned in Ephesians"
      }
    ]
  },
  {
    mainVerse: "In the beginning was the Word, and the Word was with God, and the Word was God",
    mainReference: "John 1:1",
    connectionOptions: [
      {
        verse: "In the beginning God created the heaven and the earth",
        reference: "Genesis 1:1",
        isCorrect: true,
        reason: "Both open with 'In the beginning' - typological connection"
      },
      {
        verse: "And the Word was made flesh, and dwelt among us",
        reference: "John 1:14",
        isCorrect: true,
        reason: "Same chapter - reveals who the Word is"
      },
      {
        verse: "Ask, and it shall be given you; seek, and ye shall find",
        reference: "Matthew 7:7",
        isCorrect: false,
        reason: "Different context - prayer instruction"
      },
      {
        verse: "All things were made by him; and without him was not any thing made",
        reference: "John 1:3",
        isCorrect: true,
        reason: "Same passage - explains the Word's creative power"
      }
    ]
  }
];

export default function ConnectionDash() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pathActivityId = searchParams.get('pathActivityId') || undefined;
  const { user } = useAuth();
  const { markPathActivityComplete } = usePathActivityTracking();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver || showExplanations) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, currentQuestion, showExplanations]);

  const handleTimeout = () => {
    toast.error(t('games.common.timesUp'));
    setStreak(0);
    showResults();
  };

  const toggleVerse = (index: number) => {
    setSelectedVerses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    const question = SAMPLE_QUESTIONS[currentQuestion];
    const correctIndices = question.connectionOptions
      .map((opt, idx) => (opt.isCorrect ? idx : -1))
      .filter((idx) => idx !== -1);

    const isCorrect =
      selectedVerses.length === correctIndices.length &&
      selectedVerses.every((idx) => correctIndices.includes(idx));

    if (isCorrect) {
      const timeBonus = timeLeft * 10;
      const streakBonus = streak * 100;
      const points = 200 + timeBonus + streakBonus;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      toast.success(t('games.connectionDash.perfect', { points, streak: streak > 0 ? `${streak + 1}x` : '' }));
    } else {
      setStreak(0);
      const partial = selectedVerses.filter((idx) => correctIndices.includes(idx)).length;
      if (partial > 0) {
        const points = partial * 50;
        setScore((prev) => prev + points);
        toast.warning(t('games.connectionDash.partialCredit', { points }));
      } else {
        toast.error(t('games.connectionDash.noCorrect'));
      }
    }

    showResults();
  };

  const showResults = () => {
    setShowExplanations(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedVerses([]);
      setTimeLeft(15);
      setShowExplanations(false);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameOver(true);
    if (user) {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "connection_dash",
        score,
        metadata: { questions: SAMPLE_QUESTIONS.length }
      });
      if (pathActivityId) {
        await markPathActivityComplete(pathActivityId);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setCurrentQuestion(0);
    setSelectedVerses([]);
    setTimeLeft(15);
    setGameOver(false);
    setShowExplanations(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('games.common.backToGames')}
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Zap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">{t('games.connectionDash.title')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('games.connectionDash.description')}
            </p>
            <div className="space-y-2 text-left">
              <h3 className="font-semibold">{t('games.common.howToPlay')}</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('games.connectionDash.rule1')}</li>
                <li>{t('games.connectionDash.rule2')}</li>
                <li>{t('games.connectionDash.rule3')}</li>
                <li>{t('games.connectionDash.rule4')}</li>
              </ul>
            </div>
            <Button size="lg" onClick={startGame} className="w-full">
              {t('games.common.startGame')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <Trophy className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">{t('games.common.gameComplete')}</h1>
            <div className="text-6xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">{t('games.common.finalScore')}</p>
            <div className="flex gap-4">
              <Button onClick={startGame} className="flex-1">
                {t('games.common.playAgain')}
              </Button>
              <Button variant="outline" onClick={() => navigate("/games")} className="flex-1">
                {t('games.common.backToGames')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = SAMPLE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('games.common.exit')}
          </Button>
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <Badge variant="default" className="text-lg">
                {t('games.common.streak', { count: streak })}
              </Badge>
            )}
            <div className="text-2xl font-bold">{t('games.common.scoreValue', { score })}</div>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('games.common.questionOf', { current: currentQuestion + 1, total: SAMPLE_QUESTIONS.length })}
            </div>
            {!showExplanations && (
              <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-destructive" : ""}`}>
                {timeLeft}s
              </div>
            )}
          </div>
          <Progress value={progress} />
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-2 border-l-4 border-primary pl-4">
            <Badge variant="outline">{question.mainReference}</Badge>
            <p className="text-xl font-semibold">{question.mainVerse}</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t('games.connectionDash.selectAllVerses')}</p>
            <div className="space-y-3">
              {question.connectionOptions.map((option, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedVerses.includes(index)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  } ${
                    showExplanations
                      ? option.isCorrect
                        ? "border-green-500 bg-green-500/10"
                        : "border-destructive bg-destructive/10"
                      : ""
                  }`}
                  onClick={() => !showExplanations && toggleVerse(index)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {option.reference}
                        </Badge>
                        <p>{option.verse}</p>
                      </div>
                      {showExplanations && (
                        <Badge variant={option.isCorrect ? "default" : "destructive"}>
                          {option.isCorrect ? "✓" : "✗"}
                        </Badge>
                      )}
                    </div>
                    {showExplanations && (
                      <p className="text-sm text-muted-foreground italic">{option.reason}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {!showExplanations ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={selectedVerses.length === 0}
              className="w-full"
            >
              {t('games.common.submitAnswer')}
            </Button>
          ) : (
            <Button size="lg" onClick={nextQuestion} className="w-full">
              {currentQuestion < SAMPLE_QUESTIONS.length - 1 ? t('games.common.nextQuestion') : t('games.common.finishGame')}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
