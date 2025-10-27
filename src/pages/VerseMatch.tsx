import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VerseCard {
  id: number;
  text: string;
  reference: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const VerseMatch = () => {
  const { mode } = useParams<{ mode?: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cards, setCards] = useState<VerseCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isVsJeeves] = useState(mode === "jeeves");
  const [isCustomMode] = useState(mode === "custom");
  const [verses, setVerses] = useState<Array<{ text: string; reference: string }>>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(true);

  const defaultVerses = [
    { text: "For God so loved the world, that he gave his only begotten Son...", reference: "John 3:16" },
    { text: "The LORD is my shepherd; I shall not want.", reference: "Psalm 23:1" },
    { text: "I can do all things through Christ which strengtheneth me.", reference: "Philippians 4:13" },
    { text: "Trust in the LORD with all thine heart...", reference: "Proverbs 3:5-6" },
    { text: "For all have sinned, and come short of the glory of God", reference: "Romans 3:23" },
    { text: "For the wages of sin is death; but the gift of God is eternal life...", reference: "Romans 6:23" },
  ];

  useEffect(() => {
    loadVerses();
  }, []);

  useEffect(() => {
    if (verses.length > 0 && !isLoadingVerses) {
      initializeGame();
    }
  }, [verses, isLoadingVerses]);

  const loadVerses = async () => {
    if (isCustomMode && user) {
      try {
        const { data, error } = await supabase
          .from("memorization_verses")
          .select("verse_text, verse_reference")
          .eq("user_id", user.id)
          .limit(10);

        if (error) throw error;

        if (data && data.length >= 6) {
          setVerses(data.map(v => ({
            text: v.verse_text,
            reference: v.verse_reference
          })));
        } else {
          toast({
            title: "Not enough verses",
            description: "You need at least 6 verses saved. Using default verses instead.",
            variant: "destructive",
          });
          setVerses(defaultVerses);
        }
      } catch (error) {
        console.error("Error loading memorization verses:", error);
        toast({
          title: "Error loading verses",
          description: "Using default verses instead",
          variant: "destructive",
        });
        setVerses(defaultVerses);
      }
    } else {
      setVerses(defaultVerses);
    }
    setIsLoadingVerses(false);
  };

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const initializeGame = () => {
    const gameCards: VerseCard[] = [];
    verses.forEach((verse, index) => {
      gameCards.push({
        id: index * 2,
        text: verse.text,
        reference: "",
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        text: "",
        reference: verse.reference,
        isFlipped: false,
        isMatched: false,
      });
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
  };

  const handleCardClick = (clickedId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(clickedId)) return;
    if (cards[clickedId].isMatched) return;

    const newFlipped = [...flippedCards, clickedId];
    setFlippedCards(newFlipped);
    
    const newCards = [...cards];
    newCards[clickedId].isFlipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => checkMatch(newFlipped[0], newFlipped[1]), 800);
    }
  };

  const checkMatch = (id1: number, id2: number) => {
    const card1 = cards[id1];
    const card2 = cards[id2];
    
    const verse1 = verses.find(v => v.text === card1.text || v.reference === card1.reference);
    const verse2 = verses.find(v => v.text === card2.text || v.reference === card2.reference);
    
    if (verse1 && verse2 && verse1.reference === verse2.reference) {
      // Match found!
      const newCards = [...cards];
      newCards[id1].isMatched = true;
      newCards[id2].isMatched = true;
      setCards(newCards);
      setMatchedPairs(matchedPairs + 1);
      
      toast({
        title: "Match! 🎉",
        description: verse1.reference,
      });

      if (matchedPairs + 1 === verses.length) {
        setGameOver(true);
        saveScore();
      }
    } else {
      // No match
      const newCards = [...cards];
      newCards[id1].isFlipped = false;
      newCards[id2].isFlipped = false;
      setCards(newCards);
    }
    
    setFlippedCards([]);
  };

  const saveScore = async () => {
    if (!user) return;
    
    const score = Math.max(1000 - (moves * 10) - timeElapsed, 100);
    
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "verse_match",
        score: score,
        mode: isVsJeeves ? "vs_jeeves" : "vs_player",
        metadata: { moves, timeElapsed }
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (isLoadingVerses) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading verses...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const score = Math.max(1000 - (moves * 10) - timeElapsed, 100);
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4">🏆</div>
                <CardTitle className="text-3xl">Congratulations!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Moves</p>
                    <p className="text-2xl font-bold">{moves}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  You matched all the verses! Great memory work!
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate("/games")} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Game
            </Button>
            <div className="flex gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Moves: {moves}
              </Badge>
              <Badge variant="default" className="text-lg px-4 py-2">
                <Clock className="mr-2 h-4 w-4" />
                {formatTime(timeElapsed)}
              </Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Match Verses with References
                {isCustomMode && (
                  <Badge variant="secondary" className="ml-2">
                    Custom Verses
                  </Badge>
                )}
                <div className="text-sm text-muted-foreground font-normal mt-2">
                  Matched: {matchedPairs} / {verses.length}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`
                      aspect-square cursor-pointer rounded-lg border-2 
                      flex items-center justify-center p-3 text-center
                      transition-all duration-300 hover:scale-105
                      ${card.isFlipped || card.isMatched 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted border-muted-foreground/20 hover:border-primary'
                      }
                      ${card.isMatched ? 'opacity-50' : ''}
                    `}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-xs font-medium">
                        {card.text || card.reference}
                      </span>
                    ) : (
                      <span className="text-4xl">📖</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VerseMatch;
