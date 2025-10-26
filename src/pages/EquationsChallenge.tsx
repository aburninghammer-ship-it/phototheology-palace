import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calculator, Trophy, Target, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Difficulty = "easy" | "intermediate" | "advanced" | "pro";

interface Equation {
  verse: string;
  equation: string;
  symbols: string[];
  difficulty: Difficulty;
  explanation: string;
}

export default function EquationsChallenge() {
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const difficultyInfo = {
    easy: { symbols: 3, color: "bg-green-500", description: "3 principles" },
    intermediate: { symbols: 6, color: "bg-yellow-500", description: "6 principles" },
    advanced: { symbols: 9, color: "bg-orange-500", description: "9 principles" },
    pro: { symbols: 12, color: "bg-red-500", description: "12 principles" }
  };

  const generateEquation = async () => {
    setLoading(true);
    setShowResult(false);
    setUserAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "equations-challenge",
          difficulty: difficulty,
          symbolCount: difficultyInfo[difficulty].symbols
        }
      });

      if (error) throw error;

      setCurrentEquation(data);
    } catch (error) {
      console.error("Error generating equation:", error);
      toast.error("Failed to generate equation");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!currentEquation) return;

    // In a real implementation, this would validate the answer
    // For now, we'll just show the explanation
    setShowResult(true);
    setScore(score + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">Equations Challenge</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Decode biblical equations using palace principles and symbols
          </p>
        </div>

        {/* Score Display */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Difficulty: <span className="capitalize">{difficulty}</span>
              </span>
            </div>
          </CardContent>
        </Card>

          <Card className="mb-6">
          <CardHeader>
            <CardTitle>Palace Room Codes</CardTitle>
            <CardDescription>Phototheology principle codes used in equations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-primary">Floor 1 — Furnishing (Memory)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-start">SR - Story Room</Badge>
                  <Badge variant="outline" className="justify-start">IR - Imagination Room</Badge>
                  <Badge variant="outline" className="justify-start">24 - 24FPS</Badge>
                  <Badge variant="outline" className="justify-start">BR - Bible Rendered</Badge>
                  <Badge variant="outline" className="justify-start">TR - Translation</Badge>
                  <Badge variant="outline" className="justify-start">GR - Gems Room</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-primary">Floor 2 — Investigation (Detective)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-start">OR - Observation</Badge>
                  <Badge variant="outline" className="justify-start">DC - Def-Com</Badge>
                  <Badge variant="outline" className="justify-start">ST - Symbols/Types</Badge>
                  <Badge variant="outline" className="justify-start">QR - Questions</Badge>
                  <Badge variant="outline" className="justify-start">QA - Q&A Chains</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-primary">Floor 3 — Freestyle (Connections)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-start">NF - Nature</Badge>
                  <Badge variant="outline" className="justify-start">PF - Personal</Badge>
                  <Badge variant="outline" className="justify-start">BF - Bible</Badge>
                  <Badge variant="outline" className="justify-start">HF - History</Badge>
                  <Badge variant="outline" className="justify-start">LR - Listening</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-primary">Floor 4 — Christ-Centered (Depth)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-start">CR - Concentration</Badge>
                  <Badge variant="outline" className="justify-start">DR - Dimensions</Badge>
                  <Badge variant="outline" className="justify-start">C6 - Connect-6</Badge>
                  <Badge variant="outline" className="justify-start">TRm - Theme</Badge>
                  <Badge variant="outline" className="justify-start">TZ - Time Zone</Badge>
                  <Badge variant="outline" className="justify-start">PRm - Patterns</Badge>
                  <Badge variant="outline" className="justify-start">P|| - Parallels</Badge>
                  <Badge variant="outline" className="justify-start">FRt - Fruit</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-primary">Floors 5-8 — Vision & Mastery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline" className="justify-start">BL - Blue (Sanctuary)</Badge>
                  <Badge variant="outline" className="justify-start">PR - Prophecy</Badge>
                  <Badge variant="outline" className="justify-start">3A - Three Angels</Badge>
                  <Badge variant="outline" className="justify-start">JR - Juice Room</Badge>
                  <Badge variant="outline" className="justify-start">FRm - Fire</Badge>
                  <Badge variant="outline" className="justify-start">MR - Meditation</Badge>
                  <Badge variant="outline" className="justify-start">SRm - Speed</Badge>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-1 text-sm">Operators:</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-mono font-bold">+</span> (and/with) • 
                  <span className="font-mono font-bold"> →</span> (leads to/results in) • 
                  <span className="font-mono font-bold"> =</span> (equals/completes)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Difficulty</CardTitle>
            <CardDescription>Choose your challenge level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(difficultyInfo) as Difficulty[]).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? "default" : "outline"}
                  onClick={() => setDifficulty(diff)}
                  className="flex flex-col h-auto py-4"
                >
                  <span className="capitalize font-bold">{diff}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {difficultyInfo[diff].description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equation Display */}
        {!currentEquation ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-6">
                Ready to solve an equation? Click below to start!
              </p>
              <Button onClick={generateEquation} disabled={loading} size="lg">
                {loading ? "Generating..." : "Generate New Equation"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Challenge</span>
                <Badge className={difficultyInfo[difficulty].color}>
                  {difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Verse Reference */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold text-lg mb-2">{currentEquation.verse}</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {currentEquation.equation}
                </p>
              </div>

              {/* Symbol Legend */}
              <div>
                <h3 className="font-semibold mb-3">Symbols in this equation:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentEquation.symbols.map((symbol, idx) => (
                    <Badge key={idx} variant="outline" className="justify-start">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              {!showResult && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Your interpretation:
                    </label>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full"
                    />
                  </div>
                  <Button onClick={checkAnswer} className="w-full" size="lg">
                    Submit Answer
                  </Button>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-bold text-lg">Jeeves' Explanation:</h3>
                    <p className="whitespace-pre-wrap">{currentEquation.explanation}</p>
                    <Button onClick={generateEquation} className="w-full">
                      Next Equation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}