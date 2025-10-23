import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Target, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Puzzle {
  verse: string;
  reference: string;
  correctPrinciples: string[];
  allOptions: string[];
  explanation: string;
}

const PrinciplePuzzle = () => {
  const { mode } = useParams<{ mode?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isVsJeeves] = useState(mode === "jeeves");

  const puzzles: Puzzle[] = [
    {
      verse: "And God said, Let there be light: and there was light.",
      reference: "Genesis 1:3",
      correctPrinciples: ["Repeat and Enlarge", "Christ in All Scripture", "Five Dimensions"],
      allOptions: ["Repeat and Enlarge", "Chain References", "Christ in All Scripture", "Five Dimensions", "Time Zones", "Sanctuary Pattern"],
      explanation: "This verse demonstrates 'Repeat and Enlarge' (creation theme repeated in John 1), 'Christ in All Scripture' (Jesus is the Light), and 'Five Dimensions' (literal light, Christ as light, spiritual enlightenment)."
    },
    {
      verse: "The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.",
      reference: "John 1:29",
      correctPrinciples: ["Sanctuary Pattern", "Types and Symbols", "Seven Feasts"],
      allOptions: ["Sanctuary Pattern", "Types and Symbols", "Seven Feasts", "Repeat and Enlarge", "Time Zones", "Chain References"],
      explanation: "'Sanctuary Pattern' (lamb sacrifice at altar), 'Types and Symbols' (lamb represents Christ), and 'Seven Feasts' (Passover lamb fulfillment)."
    },
    {
      verse: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season.",
      reference: "Psalm 1:3",
      correctPrinciples: ["Types and Symbols", "Sanctuary Pattern", "Repeat and Enlarge"],
      allOptions: ["Types and Symbols", "Sanctuary Pattern", "Repeat and Enlarge", "Seven Feasts", "Five Dimensions", "Time Zones"],
      explanation: "'Types and Symbols' (tree represents the righteous), 'Sanctuary Pattern' (water and fruit imagery), 'Repeat and Enlarge' (echoed in Revelation 22:2)."
    },
    {
      verse: "And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away.",
      reference: "Revelation 21:1",
      correctPrinciples: ["Repeat and Enlarge", "Time Zones", "Five Dimensions"],
      allOptions: ["Repeat and Enlarge", "Time Zones", "Five Dimensions", "Chain References", "Types and Symbols", "Sanctuary Pattern"],
      explanation: "'Repeat and Enlarge' (echoes Genesis 1), 'Time Zones' (future fulfillment), 'Five Dimensions' (literal, Christ-centered, personal, church, heaven meanings)."
    },
    {
      verse: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      reference: "John 1:1",
      correctPrinciples: ["Christ in All Scripture", "Repeat and Enlarge", "Five Dimensions"],
      allOptions: ["Christ in All Scripture", "Repeat and Enlarge", "Five Dimensions", "Time Zones", "Chain References", "Types and Symbols"],
      explanation: "'Christ in All Scripture' (directly about Jesus), 'Repeat and Enlarge' (mirrors Genesis 1:1), 'Five Dimensions' (multiple layers of meaning about Christ)."
    }
  ];

  const togglePrinciple = (principle: string) => {
    if (showAnswer) return;
    
    setSelectedPrinciples(prev =>
      prev.includes(principle)
        ? prev.filter(p => p !== principle)
        : [...prev, principle]
    );
  };

  const checkAnswer = () => {
    const puzzle = puzzles[currentPuzzle];
    const correct = puzzle.correctPrinciples.every(p => selectedPrinciples.includes(p)) &&
                   selectedPrinciples.every(p => puzzle.correctPrinciples.includes(p));
    
    if (correct) {
      const points = 10;
      setScore(score + points);
      toast({
        title: "Perfect! 🎉",
        description: `+${points} points`,
      });
    } else {
      const correctCount = selectedPrinciples.filter(p => puzzle.correctPrinciples.includes(p)).length;
      const points = correctCount * 3;
      setScore(score + points);
      toast({
        title: "Partial Credit",
        description: `You got ${correctCount} correct. +${points} points`,
        variant: "default",
      });
    }
    
    setShowAnswer(true);
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedPrinciples([]);
      setShowAnswer(false);
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
        game_type: "principle_puzzle",
        score: score,
        mode: isVsJeeves ? "vs_jeeves" : "vs_player"
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (!user) return null;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4">🏆</div>
                <CardTitle className="text-3xl">Well Done!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Final Score</p>
                  <p className="text-4xl font-bold">{score}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    out of {puzzles.length * 10} possible
                  </p>
                </div>
                
                <p className="text-muted-foreground">
                  You've demonstrated great understanding of Palace principles and how they connect to Scripture!
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

  const puzzle = puzzles[currentPuzzle];

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
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="mr-2 h-4 w-4" />
              {score}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">
                    Puzzle {currentPuzzle + 1} of {puzzles.length}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-primary/5 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Identify the Palace principles in this verse:</p>
                <p className="text-lg font-medium leading-relaxed">&ldquo;{puzzle.verse}&rdquo;</p>
                <p className="text-sm text-muted-foreground text-right">— {puzzle.reference}</p>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Select all principles that apply:</p>
                {puzzle.allOptions.map((option) => {
                  const isSelected = selectedPrinciples.includes(option);
                  const isCorrect = puzzle.correctPrinciples.includes(option);
                  const showStatus = showAnswer;
                  
                  return (
                    <div
                      key={option}
                      onClick={() => togglePrinciple(option)}
                      className={`
                        flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer
                        transition-all
                        ${showStatus && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                        ${showStatus && isSelected && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
                        ${!showStatus && isSelected ? 'border-primary bg-primary/5' : ''}
                        ${!showStatus && !isSelected ? 'border-muted hover:border-primary' : ''}
                      `}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={showAnswer}
                        className="pointer-events-none"
                      />
                      <span className="flex-1">{option}</span>
                      {showStatus && isCorrect && <Check className="h-5 w-5 text-green-600" />}
                      {showStatus && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600" />}
                    </div>
                  );
                })}
              </div>

              {!showAnswer ? (
                <Button
                  onClick={checkAnswer}
                  disabled={selectedPrinciples.length === 0}
                  className="w-full"
                  size="lg"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{puzzle.explanation}</p>
                  </div>
                  <Button onClick={nextPuzzle} className="w-full" size="lg">
                    {currentPuzzle < puzzles.length - 1 ? "Next Puzzle" : "See Results"}
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

export default PrinciplePuzzle;
