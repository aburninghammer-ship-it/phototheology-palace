import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shuffle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface MemoryVerse {
  id: string;
  verse_reference: string;
  verse_text: string;
}

export default function MemoryGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadVerses();
  }, [user]);

  const loadVerses = async () => {
    if (!user) return;

    try {
      // Load all verses from user's lists
      const { data: lists } = await supabase
        .from("memory_verse_lists")
        .select("id")
        .eq("user_id", user.id);

      if (!lists || lists.length === 0) {
        toast.error("No memory lists found. Create a list first!");
        navigate("/memory");
        return;
      }

      const listIds = lists.map(l => l.id);
      const { data: versesData, error } = await supabase
        .from("memory_verse_list_items")
        .select("*")
        .in("list_id", listIds)
        .limit(10);

      if (error) throw error;

      if (!versesData || versesData.length === 0) {
        toast.error("No verses found in your lists. Add some verses first!");
        navigate("/memory");
        return;
      }

      // Shuffle verses
      const shuffled = [...versesData].sort(() => Math.random() - 0.5);
      setVerses(shuffled);
      setupGame(shuffled[0]);
    } catch (error) {
      console.error("Error loading verses:", error);
      toast.error("Failed to load verses");
    } finally {
      setLoading(false);
    }
  };

  const setupGame = (verse: MemoryVerse) => {
    const words = verse.verse_text.split(/\s+/);
    
    if (gameId === "word-order") {
      // Scramble the words
      const scrambled = [...words].sort(() => Math.random() - 0.5);
      setScrambledWords(scrambled);
      setUserAnswer([]);
    } else if (gameId === "fill-blank") {
      // Remove random words
      const blanked = words.map((word, idx) => 
        idx % 3 === 0 && idx > 0 ? "____" : word
      );
      setScrambledWords(blanked);
      setUserAnswer([]);
    } else if (gameId === "first-letter") {
      // Show only first letters
      const hints = words.map(word => word[0] + "_".repeat(word.length - 1));
      setScrambledWords(hints);
      setUserAnswer([]);
    }
    
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleWordClick = (word: string, index: number) => {
    if (gameId === "word-order") {
      setUserAnswer([...userAnswer, word]);
      setScrambledWords(scrambledWords.filter((_, i) => i !== index));
    }
  };

  const handleRemoveWord = (index: number) => {
    const word = userAnswer[index];
    setScrambledWords([...scrambledWords, word]);
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const currentVerse = verses[currentVerseIndex];
    const correctWords = currentVerse.verse_text.split(/\s+/);
    
    let correct = false;
    if (gameId === "word-order") {
      correct = userAnswer.join(" ") === correctWords.join(" ");
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const nextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      const nextIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIndex);
      setupGame(verses[nextIndex]);
    } else {
      toast.success(`Game complete! Score: ${score}/${verses.length}`);
      navigate("/memory/games");
    }
  };

  if (loading) return null;

  if (verses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>No Verses Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add verses to your memory lists to play games!
            </p>
            <Button onClick={() => navigate("/memory")}>
              Go to Memory
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentVerse = verses[currentVerseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Navigation />
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/memory/games")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentVerse.verse_reference}</CardTitle>
              <span className="text-sm font-semibold">
                Score: {score}/{currentVerseIndex}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Verse {currentVerseIndex + 1} of {verses.length}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameId === "word-order" && (
              <>
                <div>
                  <p className="text-sm font-semibold mb-2">Scrambled words:</p>
                  <div className="flex flex-wrap gap-2">
                    {scrambledWords.map((word, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleWordClick(word, index)}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Your answer:</p>
                  <div className="min-h-[100px] p-4 border rounded-lg bg-muted/50">
                    {userAnswer.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Click words above to build the verse...
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {userAnswer.map((word, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRemoveWord(index)}
                          >
                            {word}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="font-semibold">
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Correct verse: {currentVerse.verse_text}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {!showResult ? (
                <>
                  <Button 
                    onClick={checkAnswer} 
                    disabled={userAnswer.length === 0}
                    className="flex-1"
                  >
                    Check Answer
                  </Button>
                  <Button 
                    onClick={() => setupGame(currentVerse)}
                    variant="outline"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={nextVerse} className="w-full">
                  {currentVerseIndex < verses.length - 1 ? "Next Verse" : "Finish Game"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}