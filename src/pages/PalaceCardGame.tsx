import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { palaceFloors } from "@/data/palaceData";

interface GameCard {
  id: string;
  floorNumber: number;
  floorName: string;
  roomTag: string;
  roomName: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FLOOR_COLORS = [
  { floor: 1, color: "from-red-600 to-red-800", border: "border-red-500" },
  { floor: 2, color: "from-blue-600 to-blue-800", border: "border-blue-500" },
  { floor: 3, color: "from-green-600 to-green-800", border: "border-green-500" },
  { floor: 4, color: "from-yellow-600 to-yellow-800", border: "border-yellow-500" },
  { floor: 5, color: "from-purple-600 to-purple-800", border: "border-purple-500" },
  { floor: 6, color: "from-orange-600 to-orange-800", border: "border-orange-500" },
  { floor: 7, color: "from-pink-600 to-pink-800", border: "border-pink-500" },
  { floor: 8, color: "from-teal-600 to-teal-800", border: "border-teal-500" },
];

export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Select 8 random rooms from the palace
    const allRooms: GameCard[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const colorScheme = FLOOR_COLORS.find(c => c.floor === floor.number) || FLOOR_COLORS[0];
        allRooms.push({
          id: `${floor.number}-${room.tag}`,
          floorNumber: floor.number,
          floorName: floor.name,
          roomTag: room.tag,
          roomName: room.name,
          color: colorScheme.color,
          isFlipped: false,
          isMatched: false,
        });
      });
    });

    // Shuffle and take 8 rooms
    const shuffled = allRooms.sort(() => Math.random() - 0.5);
    const selectedRooms = shuffled.slice(0, 8);

    // Create pairs and shuffle
    const cardPairs = [...selectedRooms, ...selectedRooms].map((card, index) => ({
      ...card,
      id: `${card.id}-${index}`,
    }));

    setCards(cardPairs.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card?.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      // Check if they match (same room tag)
      if (firstCard?.roomTag === secondCard?.roomTag) {
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          toast.success(`Matched! ${firstCard.roomName}`);

          // Check if game is won
          if (matches + 1 === 8) {
            setGameWon(true);
            toast.success(`🎉 You won in ${moves + 1} moves!`);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/games")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Palace Card Match
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={initializeGame}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Matches</p>
            <p className="text-3xl font-bold text-primary">{matches}/8</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Moves</p>
            <p className="text-3xl font-bold">{moves}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-[2/3] cursor-pointer transition-transform duration-300 hover:scale-105 ${
                card.isFlipped || card.isMatched ? "" : "hover:brightness-110"
              }`}
              style={{ perspective: "1000px" }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 ${
                  card.isFlipped || card.isMatched ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Back */}
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br ${card.color} border-4 ${
                    FLOOR_COLORS.find(c => c.floor === card.floorNumber)?.border
                  } shadow-2xl flex flex-col items-center justify-center p-4`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2" style={{ 
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,215,0,0.3)",
                      fontFamily: "serif"
                    }}>
                      PHOTO
                    </h2>
                    <h3 className="text-xl font-bold text-white mb-4" style={{ 
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      fontFamily: "serif"
                    }}>
                      THEOLOGY
                    </h3>
                    <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-3">
                      <div className="text-3xl">🧩</div>
                    </div>
                    <p className="text-sm text-white/90 font-semibold" style={{
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                    }}>
                      Floor {card.floorNumber}
                    </p>
                  </div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-background to-muted border-4 ${
                    FLOOR_COLORS.find(c => c.floor === card.floorNumber)?.border
                  } shadow-2xl flex flex-col items-center justify-center p-4 ${
                    card.isMatched ? "opacity-50" : ""
                  }`}
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.roomTag}
                    </div>
                    <h4 className="text-sm font-semibold mb-2">{card.roomName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {card.floorName}
                    </p>
                    {card.isMatched && (
                      <div className="mt-3">
                        <Trophy className="w-6 h-6 mx-auto text-yellow-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Victory Message */}
        {gameWon && (
          <Card className="max-w-md mx-auto mt-8 p-6 text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
            <p className="text-muted-foreground mb-4">
              You completed the game in {moves} moves!
            </p>
            <Button onClick={initializeGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
