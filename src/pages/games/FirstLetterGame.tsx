import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, X, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function FirstLetterGame() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    loadVerses();
  }, [listId]);

  const loadVerses = async () => {
    const { data, error } = await supabase
      .from("memory_verse_list_items")
      .select("*")
      .eq("list_id", listId)
      .order("order_index");

    if (error) {
      toast.error("Failed to load verses");
      navigate("/memory");
      return;
    }

    setVerses(data || []);
  };

  const getFirstLetters = (text: string) => {
    return text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join(" ");
  };

  const normalizeText = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
  };

  const checkAnswer = () => {
    const currentVerse = verses[currentIndex];
    const normalized = normalizeText(userInput);
    const expected = normalizeText(currentVerse.verse_text);
    
    const correct = normalized === expected;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex < verses.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserInput("");
        setShowResult(false);
        setHint("");
      } else {
        setCompleted(true);
      }
    }, 2000);
  };

  const getHint = () => {
    const currentVerse = verses[currentIndex];
    const words = currentVerse.verse_text.split(" ");
    const hintWords = words.slice(0, Math.ceil(words.length / 3)).join(" ");
    setHint(hintWords + "...");
  };

  if (verses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Loading verses...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / verses.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🎉 Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {percentage}%
                </div>
                <p className="text-lg text-muted-foreground">
                  {score} out of {verses.length} correct
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate("/memory")} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Lists
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentVerse = verses[currentIndex];
  const firstLetters = getFirstLetters(currentVerse.verse_text);
  const progress = ((currentIndex + 1) / verses.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Navigation />
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/memory")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm font-medium">
            {currentIndex + 1} / {verses.length}
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="text-center">First Letter Challenge</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {currentVerse.verse_reference}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <p className="text-2xl font-mono tracking-wider">
                {firstLetters}
              </p>
            </div>

            {hint && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Hint: {hint}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !showResult && checkAnswer()}
                placeholder="Type the full verse..."
                disabled={showResult}
                className="text-lg"
              />

              {showResult && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  isCorrect 
                    ? "bg-green-500/10 border border-green-500/20" 
                    : "bg-red-500/10 border border-red-500/20"
                }`}>
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium mb-1 ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}>
                      {isCorrect ? "Correct!" : "Not quite"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-muted-foreground">
                        {currentVerse.verse_text}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={getHint}
                  variant="outline"
                  disabled={showResult || hint !== ""}
                  className="flex-1"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Hint
                </Button>
                <Button
                  onClick={checkAnswer}
                  disabled={!userInput.trim() || showResult}
                  className="flex-1"
                >
                  Check Answer
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Score: {score} / {currentIndex + (showResult ? 1 : 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
