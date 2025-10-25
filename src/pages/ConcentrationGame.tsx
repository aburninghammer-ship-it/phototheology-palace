import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, RotateCcw, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ParallelPair {
  id: string;
  oldTestament: {
    event: string;
    reference: string;
    description: string;
  };
  newTestament: {
    event: string;
    reference: string;
    description: string;
  };
  category: string;
}

const PARALLEL_PAIRS: ParallelPair[] = [
  {
    id: "1",
    category: "Transition of Power",
    oldTestament: {
      event: "Moses to Joshua",
      reference: "Joshua 1:1-9",
      description: "Moses dies, Joshua appointed to lead Israel into Promised Land"
    },
    newTestament: {
      event: "John Baptist to Jesus",
      reference: "John 3:30",
      description: "John: 'He must increase, I must decrease' - transition at Jordan"
    }
  },
  {
    id: "2",
    category: "Sacrificial Lamb",
    oldTestament: {
      event: "Isaac Bound",
      reference: "Genesis 22:8",
      description: "Abraham binds Isaac; God provides ram as substitute"
    },
    newTestament: {
      event: "Jesus Crucified",
      reference: "John 1:29",
      description: "Behold the Lamb of God who takes away sin"
    }
  },
  {
    id: "3",
    category: "Exodus from Bondage",
    oldTestament: {
      event: "Red Sea Crossing",
      reference: "Exodus 14:21-22",
      description: "Israel passes through water, escaping Egyptian slavery"
    },
    newTestament: {
      event: "Baptism",
      reference: "Romans 6:3-4",
      description: "Buried with Christ in baptism, raised to new life"
    }
  },
  {
    id: "4",
    category: "Wilderness Testing",
    oldTestament: {
      event: "Israel 40 Years",
      reference: "Deuteronomy 8:2",
      description: "Israel tested in wilderness 40 years, failed repeatedly"
    },
    newTestament: {
      event: "Jesus 40 Days",
      reference: "Matthew 4:1-11",
      description: "Jesus tempted 40 days in wilderness, remained faithful"
    }
  },
  {
    id: "5",
    category: "Rejected Stone",
    oldTestament: {
      event: "David Rejected",
      reference: "1 Samuel 16:7",
      description: "David, youngest son, rejected by men but chosen by God"
    },
    newTestament: {
      event: "Jesus Rejected",
      reference: "1 Peter 2:7",
      description: "Stone rejected by builders becomes chief cornerstone"
    }
  },
  {
    id: "6",
    category: "Provision in Desert",
    oldTestament: {
      event: "Manna from Heaven",
      reference: "Exodus 16:4",
      description: "God provides bread from heaven daily"
    },
    newTestament: {
      event: "Bread of Life",
      reference: "John 6:35",
      description: "Jesus: 'I am the bread of life'"
    }
  },
  {
    id: "7",
    category: "Healing Serpent",
    oldTestament: {
      event: "Bronze Serpent",
      reference: "Numbers 21:9",
      description: "Look at lifted serpent and live"
    },
    newTestament: {
      event: "Lifted Up",
      reference: "John 3:14-15",
      description: "Son of Man must be lifted up for eternal life"
    }
  },
  {
    id: "8",
    category: "Suffering Servant",
    oldTestament: {
      event: "Joseph Betrayed",
      reference: "Genesis 37:28",
      description: "Sold by brothers for silver, becomes savior"
    },
    newTestament: {
      event: "Judas Betrays",
      reference: "Matthew 26:15",
      description: "Betrayed for 30 silver pieces, becomes Savior"
    }
  }
];

interface GameCard {
  id: string;
  pairId: string;
  testament: "old" | "new";
  event: string;
  reference: string;
  description: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function ConcentrationGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !gameComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    
    PARALLEL_PAIRS.forEach(pair => {
      gameCards.push({
        id: `${pair.id}-old`,
        pairId: pair.id,
        testament: "old",
        event: pair.oldTestament.event,
        reference: pair.oldTestament.reference,
        description: pair.oldTestament.description,
        isFlipped: false,
        isMatched: false
      });
      
      gameCards.push({
        id: `${pair.id}-new`,
        pairId: pair.id,
        testament: "new",
        event: pair.newTestament.event,
        reference: pair.newTestament.reference,
        description: pair.newTestament.description,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setStartTime(null);
    setElapsedTime(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId) || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card flip state
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          setFlippedCards([]);
          
          toast.success("Parallel matched!", {
            description: `${firstCard.event} ↔ ${secondCard.event}`
          });

          // Check if game is complete
          if (matchedPairs.length + 1 === PARALLEL_PAIRS.length) {
            setGameComplete(true);
            toast.success("Congratulations!", {
              description: `You found all ${PARALLEL_PAIRS.length} parallels!`
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Biblical Parallels Concentration
              </h1>
              <p className="text-muted-foreground mt-1">
                Match Old Testament events with their New Testament fulfillments
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{matchedPairs.length}/{PARALLEL_PAIRS.length}</div>
                    <div className="text-xs text-muted-foreground">Pairs Found</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{moves}</div>
                    <div className="text-xs text-muted-foreground">Moves</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={initializeGame}
                  className="w-full"
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(card => (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  card.isFlipped || card.isMatched 
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5' 
                    : 'bg-secondary/50'
                } ${card.isMatched ? 'opacity-50' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <CardHeader className="pb-3">
                  {card.isFlipped || card.isMatched ? (
                    <>
                      <Badge 
                        variant="outline" 
                        className={card.testament === "old" ? "bg-amber-500/10" : "bg-blue-500/10"}
                      >
                        {card.testament === "old" ? "OT" : "NT"}
                      </Badge>
                      <CardTitle className="text-base mt-2">{card.event}</CardTitle>
                      <CardDescription className="text-xs">{card.reference}</CardDescription>
                    </>
                  ) : (
                    <div className="h-24 flex items-center justify-center">
                      <div className="text-4xl opacity-20">?</div>
                    </div>
                  )}
                </CardHeader>
                {(card.isFlipped || card.isMatched) && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {card.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {gameComplete && (
            <Card className="mt-6 bg-gradient-palace">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  🎉 Excellent Work!
                </CardTitle>
                <CardDescription className="text-white/90 text-center">
                  You matched all {PARALLEL_PAIRS.length} biblical parallels in {moves} moves and {formatTime(elapsedTime)}!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
                <Button onClick={initializeGame} variant="secondary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  More Games
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Click cards to flip them and reveal biblical events</li>
                <li>Find matching parallels between Old Testament and New Testament events</li>
                <li>Match events that share the same typological pattern (e.g., Moses→Joshua parallels John Baptist→Jesus)</li>
                <li>All {PARALLEL_PAIRS.length} pairs demonstrate how Christ fulfills OT patterns</li>
                <li>Complete the game in as few moves as possible!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
