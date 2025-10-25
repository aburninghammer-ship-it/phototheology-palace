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

  const questions: Question[] = [
    {
      principle: "Time Zones (Past, Present, Future)",
      correctRoom: "Time Zone Room",
      options: ["Time Zone Room", "Observation Room", "Blue Room", "Three Heavens Floor"],
      explanation: "Time Zone Room (TZ) on Floor 4 locates passages across past, present, and future to understand how texts relate to different eras in God's plan."
    },
    {
      principle: "Following Connected Verses (Q&A Chains)",
      correctRoom: "Q&A Room",
      options: ["Q&A Room", "Story Room", "Dimensions Room", "Bible Freestyle"],
      explanation: "The Q&A Room (QA) on Floor 2 is where Scripture answers Scripture—verses cross-examine and corroborate each other like witnesses in court."
    },
    {
      principle: "Christ in All Scripture",
      correctRoom: "Concentration Room",
      options: ["Concentration Room", "Story Room", "Blue Room", "Fire Room"],
      explanation: "The Concentration Room (CR) on Floor 4 insists every text must reveal Christ—using the lens that bends all light until Jesus comes into focus."
    },
    {
      principle: "Story Beats (3-7 punchy scenes)",
      correctRoom: "Story Room",
      options: ["Story Room", "Imagination Room", "24FPS Room", "Translation Room"],
      explanation: "Story Room (SR) on Floor 1 crystallizes narratives into 3-7 memorable beats that capture action and sequence, like movie clips."
    },
    {
      principle: "Sanctuary Pattern (Altar, Laver, Lampstand)",
      correctRoom: "Blue Room",
      options: ["Blue Room", "Prophecy Room", "Three Angels Room", "Theme Room"],
      explanation: "The Blue Room (BL) on Floor 5 maps the sanctuary as the architectural blueprint of salvation—every piece of furniture traces to Christ."
    },
    {
      principle: "Types and Symbols (OT pointing to Christ)",
      correctRoom: "Symbols/Types Room",
      options: ["Symbols/Types Room", "Prophecy Room", "Story Room", "Patterns Room"],
      explanation: "Symbols/Types Room (ST) on Floor 2 builds the profile of God's universal imagery—lamb=Christ, rock=Christ, light=truth."
    },
    {
      principle: "Experiencing with All Five Senses",
      correctRoom: "Imagination Room",
      options: ["Imagination Room", "Fire Room", "Meditation Room", "Story Room"],
      explanation: "Imagination Room (IR) on Floor 1 trains you to step inside Scripture with all senses engaged—feel the spray, smell the myrrh, taste the salt."
    },
    {
      principle: "Five Dimensions (Literal, Christ, Me, Church, Heaven)",
      correctRoom: "Dimensions Room",
      options: ["Dimensions Room", "Concentration Room", "Time Zone Room", "Theme Room"],
      explanation: "Dimensions Room (DR) on Floor 4 stretches every passage across 5 dimensions like examining a diamond under different lights."
    },
    {
      principle: "Observing Without Interpreting (Detective Work)",
      correctRoom: "Observation Room",
      options: ["Observation Room", "Questions Room", "Story Room", "Def-Com Room"],
      explanation: "Observation Room (OR) on Floor 2 is the detective's notebook—logging details without rushing to meaning, gathering fingerprints before theories."
    },
    {
      principle: "Verse Genetics (Finding Verse Relatives)",
      correctRoom: "Bible Freestyle",
      options: ["Bible Freestyle", "Q&A Room", "Patterns Room", "Parallels Room"],
      explanation: "Bible Freestyle (BF) on Floor 3 trains spontaneous verse connections—every verse has siblings, cousins, and distant relatives across Scripture."
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
