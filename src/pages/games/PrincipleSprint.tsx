import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Zap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  verse: string;
  reference: string;
  correctPrinciples: string[];
  options: string[];
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    verse: "In the beginning God created the heaven and the earth.",
    reference: "Genesis 1:1",
    correctPrinciples: ["1D", "@Ad", "1H"],
    options: ["1D", "2D", "3D", "@Ad", "@Mo", "1H", "2H", "3H"]
  },
  {
    verse: "For God so loved the world, that he gave his only begotten Son...",
    reference: "John 3:16",
    correctPrinciples: ["2D", "Gospel Floor", "@CyC"],
    options: ["1D", "2D", "3D", "Gospel Floor", "@Ad", "@CyC", "1H", "2H"]
  },
  {
    verse: "And the LORD God formed man of the dust of the ground...",
    reference: "Genesis 2:7",
    correctPrinciples: ["1D", "@Ad", "Life of Christ Wall"],
    options: ["1D", "2D", "@Ad", "@No", "Life of Christ Wall", "1H", "2H", "Great Controversy Wall"]
  }
];

export default function PrincipleSprint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, currentQuestion]);

  const handleTimeout = () => {
    toast.error("Time's up!");
    setCombo(0);
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedPrinciples([]);
      setTimeLeft(10);
    } else {
      endGame();
    }
  };

  const togglePrinciple = (principle: string) => {
    setSelectedPrinciples((prev) =>
      prev.includes(principle)
        ? prev.filter((p) => p !== principle)
        : [...prev, principle]
    );
  };

  const handleSubmit = () => {
    const correct = SAMPLE_QUESTIONS[currentQuestion].correctPrinciples;
    const isCorrect =
      selectedPrinciples.length === correct.length &&
      selectedPrinciples.every((p) => correct.includes(p));

    if (isCorrect) {
      const timeBonus = timeLeft * 10;
      const comboBonus = combo * 50;
      const points = 100 + timeBonus + comboBonus;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      toast.success(`+${points} points! ${combo > 0 ? `${combo + 1}x combo!` : ""}`);
    } else {
      setCombo(0);
      toast.error("Incorrect! Keep practicing!");
    }

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedPrinciples([]);
      setTimeLeft(10);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameOver(true);
    if (user) {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "principle_sprint",
        score,
        metadata: { questions: SAMPLE_QUESTIONS.length }
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCombo(0);
    setCurrentQuestion(0);
    setSelectedPrinciples([]);
    setTimeLeft(10);
    setGameOver(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Zap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Principle Sprint</h1>
            <p className="text-muted-foreground text-lg">
              Identify Phototheology principles from Bible verses as quickly as possible!
            </p>
            <div className="space-y-2 text-left">
              <h3 className="font-semibold">How to Play:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Select ALL correct PT principles for each verse</li>
                <li>You have 10 seconds per verse</li>
                <li>Build combos for consecutive correct answers</li>
                <li>Time bonus: +10 points per second remaining</li>
              </ul>
            </div>
            <Button size="lg" onClick={startGame} className="w-full">
              Start Game
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
            <h1 className="text-4xl font-bold">Game Complete!</h1>
            <div className="text-6xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">Final Score</p>
            <div className="flex gap-4">
              <Button onClick={startGame} className="flex-1">
                Play Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/games")} className="flex-1">
                Back to Games
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
            Exit
          </Button>
          <div className="flex items-center gap-4">
            {combo > 0 && (
              <Badge variant="default" className="text-lg">
                {combo}x Combo! 🔥
              </Badge>
            )}
            <div className="text-2xl font-bold">Score: {score}</div>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}
            </div>
            <div className={`text-2xl font-bold ${timeLeft <= 3 ? "text-destructive" : ""}`}>
              {timeLeft}s
            </div>
          </div>
          <Progress value={progress} />
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="outline">{question.reference}</Badge>
            <p className="text-2xl">{question.verse}</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">Select ALL correct PT principles:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {question.options.map((option) => (
                <Button
                  key={option}
                  variant={selectedPrinciples.includes(option) ? "default" : "outline"}
                  onClick={() => togglePrinciple(option)}
                  className="h-16"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={selectedPrinciples.length === 0}
            className="w-full"
          >
            Submit Answer
          </Button>
        </Card>
      </div>
    </div>
  );
}
