import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Clock, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  principle: string;
  correctRoom: string;
  options: string[];
  explanation: string;
}

const PalaceQuiz = () => {
  const { mode } = useParams<{ mode?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [jeevesScore, setJeevesScore] = useState(0);
  
  const isVsJeeves = mode === "jeeves";

  const rooms = [
    "Foundation",
    "Investigation", 
    "Freestyle",
    "Next Level",
    "Vision",
    "Horizons",
    "Spiritual Training",
    "Master Level"
  ];

  const questions: Question[] = [
    {
      principle: "Time Zones (Past, Present, Future)",
      correctRoom: "Foundation",
      options: ["Foundation", "Investigation", "Vision", "Horizons"],
      explanation: "Time Zones is a foundational principle that helps us understand prophecy across past, present, and future contexts."
    },
    {
      principle: "Chain References",
      correctRoom: "Investigation",
      options: ["Investigation", "Foundation", "Next Level", "Freestyle"],
      explanation: "Chain References is an investigation tool where we follow connected verses throughout Scripture to build comprehensive understanding."
    },
    {
      principle: "Christ in All Scripture",
      correctRoom: "Next Level",
      options: ["Next Level", "Foundation", "Vision", "Spiritual Training"],
      explanation: "Seeing Christ in All Scripture takes Bible study to the next level by revealing how every text points to Jesus."
    },
    {
      principle: "Repeat and Enlarge",
      correctRoom: "Foundation",
      options: ["Foundation", "Investigation", "Horizons", "Vision"],
      explanation: "Repeat and Enlarge is a foundational pattern showing how God reveals truth progressively throughout Scripture."
    },
    {
      principle: "Sanctuary Pattern",
      correctRoom: "Vision",
      options: ["Vision", "Horizons", "Foundation", "Next Level"],
      explanation: "The Sanctuary Pattern opens prophetic vision by showing Christ's ministry and the plan of salvation."
    },
    {
      principle: "Seven Feasts",
      correctRoom: "Horizons",
      options: ["Horizons", "Vision", "Foundation", "Investigation"],
      explanation: "The Seven Feasts expand our horizons by revealing God's prophetic timeline through Israel's appointed times."
    },
    {
      principle: "Prayer and Scripture",
      correctRoom: "Spiritual Training",
      options: ["Spiritual Training", "Foundation", "Next Level", "Master Level"],
      explanation: "Prayer and Scripture are essential spiritual disciplines that train us in righteousness and communion with God."
    },
    {
      principle: "Five Dimensions",
      correctRoom: "Next Level",
      options: ["Next Level", "Foundation", "Vision", "Freestyle"],
      explanation: "Five Dimensions (Literal, Christ, Personal, Church, Heaven) takes interpretation to the next level by examining every angle."
    },
    {
      principle: "Types and Symbols",
      correctRoom: "Investigation",
      options: ["Investigation", "Vision", "Foundation", "Horizons"],
      explanation: "Types and Symbols require investigation to discover how Old Testament figures and objects point to Christ."
    },
    {
      principle: "Prophetic Headlines",
      correctRoom: "Vision",
      options: ["Vision", "Horizons", "Investigation", "Foundation"],
      explanation: "Prophetic Headlines open our vision to see the big picture themes running through Scripture."
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(null);
    }
  }, [timeLeft, gameOver, showExplanation]);

  const handleAnswer = async (answer: string | null) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    const correct = answer === questions[currentQuestion].correctRoom;
    if (correct) {
      const points = Math.max(1, Math.floor(timeLeft / 3));
      setScore(score + points);
      
      toast({
        title: "Correct! 🎉",
        description: `+${points} points`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${questions[currentQuestion].correctRoom}`,
        variant: "destructive",
      });
    }

    // Jeeves response (random for demo)
    if (isVsJeeves && currentQuestion < questions.length - 1) {
      const jeevesCorrect = Math.random() > 0.3;
      if (jeevesCorrect) {
        setJeevesScore(jeevesScore + Math.floor(Math.random() * 10) + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setGameOver(true);
      saveScore();
    }
  };

  const saveScore = async () => {
    if (!user) return;
    
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "palace_quiz",
        score: score,
        mode: isVsJeeves ? "vs_jeeves" : "vs_player"
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (!user) return null;

  if (gameOver) {
    const won = !isVsJeeves || score > jeevesScore;
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4">{won ? "🏆" : "🎯"}</div>
                <CardTitle className="text-3xl">
                  {won ? "Congratulations!" : "Good Try!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Your Score</p>
                    <p className="text-3xl font-bold">{score}</p>
                  </div>
                  {isVsJeeves && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Jeeves' Score</p>
                      <p className="text-3xl font-bold">{jeevesScore}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground">
                  {won 
                    ? "Excellent knowledge of the Palace principles!" 
                    : "Keep studying the Palace to improve your mastery!"}
                </p>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} size="lg">
                    Play Again
                  </Button>
                  <Button onClick={() => navigate("/games")} variant="outline" size="lg">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate("/games")} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Game
            </Button>
            <div className="flex gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Trophy className="mr-2 h-4 w-4" />
                {score}
              </Badge>
              {isVsJeeves && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  🤖 {jeevesScore}
                </Badge>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                <Badge variant={timeLeft < 10 ? "destructive" : "default"} className="text-lg px-3 py-1">
                  <Clock className="mr-2 h-4 w-4" />
                  {timeLeft}s
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Which room does this principle belong to?</p>
                <h3 className="text-2xl font-bold">{question.principle}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option) => (
                  <Button
                    key={option}
                    onClick={() => !showExplanation && handleAnswer(option)}
                    disabled={showExplanation}
                    variant={
                      showExplanation
                        ? option === question.correctRoom
                          ? "default"
                          : selectedAnswer === option
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    className="h-20 text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {showExplanation && (
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <p className="text-sm font-medium">Explanation:</p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  <Button onClick={nextQuestion} className="w-full" size="lg">
                    {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PalaceQuiz;
