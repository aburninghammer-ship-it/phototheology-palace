import { useState, useEffect, lazy, Suspense } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Church, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const sanctuaryItems = [
  {
    name: "Altar of Burnt Offering",
    meaning: "The cross where Christ's blood was shed",
    reference: "Hebrews 13:10-12",
    gospel: "Entry point: We must come by way of the sacrifice"
  },
  {
    name: "Bronze Laver",
    meaning: "Baptism and cleansing by the Word",
    reference: "Ephesians 5:26",
    gospel: "Washing: Cleansed by water and Word"
  },
  {
    name: "Golden Lampstand",
    meaning: "Light of the Holy Spirit and witness",
    reference: "Revelation 1:20",
    gospel: "Light: The Spirit illuminates and empowers"
  },
  {
    name: "Table of Showbread",
    meaning: "Christ, the Bread of Life",
    reference: "John 6:35",
    gospel: "Sustenance: Fed by the Word made flesh"
  },
  {
    name: "Altar of Incense",
    meaning: "Christ's intercession and our prayers",
    reference: "Revelation 8:3-4",
    gospel: "Prayer: Our prayers rise with Christ's mediation"
  },
  {
    name: "Ark of the Covenant",
    meaning: "God's throne, law, and mercy seat",
    reference: "Hebrews 9:4-5",
    gospel: "Throne: Law met by mercy through Christ's blood"
  }
];

type QuizQuestion = {
  item: string;
  options: string[];
  correct: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 2D Quiz Game Component
function QuizGame({ onComplete }: { onComplete: (score: number, total: number) => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [quizQuestions] = useState<QuizQuestion[]>(() => {
    const questions = sanctuaryItems.map(item => ({
      item: item.name,
      options: shuffleArray([...sanctuaryItems.map(i => i.meaning)]),
      correct: item.meaning
    }));
    return shuffleArray(questions);
  });

  const question = quizQuestions[currentQuestion];
  const itemData = sanctuaryItems.find(i => i.name === question.item)!;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: t('games.blueRoom.selectAnswer'),
        description: t('games.blueRoom.chooseMeaning'),
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === question.correct;

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: t('games.blueRoom.correct'),
        description: t('games.blueRoom.knowBlueprint'),
      });
    } else {
      toast({
        title: t('games.blueRoom.notQuite'),
        description: t('games.blueRoom.studyMore'),
        variant: "destructive",
      });
    }

    setRevealed(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setRevealed(false);
    } else {
      onComplete(score + (selectedAnswer === question.correct ? 1 : 0), quizQuestions.length);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{t('games.blueRoom.floorBadge')}</Badge>
            <Badge variant="outline">
              {currentQuestion + 1} / {quizQuestions.length}
            </Badge>
          </div>
          <CardTitle className="text-3xl">{t('games.blueRoom.sanctuaryBlueprint')}</CardTitle>
          <CardDescription>
            {t('games.blueRoom.quizDescription')}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Church className="h-8 w-8 text-blue-500" />
            <CardTitle className="text-2xl">{question.item}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!revealed && (
            <>
              <p className="text-muted-foreground">
                {t('games.blueRoom.whatDoesRepresent')}
              </p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className="w-full h-auto py-4 text-left justify-start"
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full"
                size="lg"
              >
                {t('games.common.submitAnswer')}
              </Button>
            </>
          )}

          {revealed && (
            <>
              <div className={`p-4 rounded-lg ${
                selectedAnswer === question.correct
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                <h4 className="font-semibold mb-2">
                  {selectedAnswer === question.correct ? t('games.blueRoom.correct') : t('games.blueRoom.notQuiteResult')}
                </h4>
                {selectedAnswer !== question.correct && (
                  <p className="text-sm mb-2">{t('games.blueRoom.youSelected', { answer: selectedAnswer })}</p>
                )}
                <p className="text-sm">{t('games.blueRoom.correctAnswer', { answer: question.correct })}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">
                  {t('games.blueRoom.fullExplanation')}
                </h4>
                <p className="text-sm">
                  <strong>{t('games.blueRoom.meaning')}</strong> {itemData.meaning}
                </p>
                <p className="text-sm">
                  <strong>{t('games.blueRoom.reference')}</strong> {itemData.reference}
                </p>
                <p className="text-sm">
                  <strong>{t('games.blueRoom.gospelConnection')}</strong> {itemData.gospel}
                </p>
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                {currentQuestion < quizQuestions.length - 1 ? t('games.blueRoom.nextItem') : t('games.common.finish')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">{t('games.blueRoom.tipTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('games.blueRoom.tipDescription')}
          </p>
        </CardContent>
      </Card>
    </>
  );
}


// Completion Screen
function CompletionScreen({
  score,
  total,
  onPlayAgain,
  onBack
}: {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="text-center">
        <CardHeader>
          <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
          <CardTitle className="text-3xl">{t('games.blueRoom.mastered')}</CardTitle>
          <CardDescription>
            {t('games.blueRoom.masteredDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-primary">
            {score} / {total}
          </div>
          <p className="text-muted-foreground">
            {t('games.blueRoom.quoteHebrews85')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('games.common.backToGames')}
            </Button>
            <Button onClick={onPlayAgain} variant="outline">
              {t('games.common.playAgain')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <GameLeaderboard gameType="blue_room" currentScore={score} />
    </div>
  );
}

export default function BlueRoomGame() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [viewMode] = useState<'quiz'>('quiz');
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [scoreSaved, setScoreSaved] = useState(false);

  const handleComplete = async (score: number, total: number) => {
    setFinalScore({ score, total });
    setIsComplete(true);

    // Save score
    if (user && !scoreSaved) {
      try {
        await supabase.from("game_scores").insert({
          user_id: user.id,
          game_type: "blue_room",
          score: score,
          mode: "solo",
        });
        setScoreSaved(true);
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  };

  const handlePlayAgain = () => {
    setIsComplete(false);
    setFinalScore({ score: 0, total: 0 });
    setScoreSaved(false);
    // Force re-render of quiz by changing key
    window.location.reload();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <CompletionScreen 
            score={finalScore.score}
            total={finalScore.total}
            onPlayAgain={handlePlayAgain}
            onBack={() => navigate("/games")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('games.common.backToGames')}
        </Button>

        <QuizGame onComplete={handleComplete} />
      </main>
      <FloatingGameChat gameType="blue-room" />
    </div>
  );
}
