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
  roomPurpose: string;
  color: string;
  tagline: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FLOOR_COLORS = [
  { floor: 1, color: "from-red-600 to-red-800", border: "border-red-500", tagline: "TRAIN KEY TACTICS" },
  { floor: 2, color: "from-blue-600 to-blue-800", border: "border-blue-500", tagline: "BECOME A DETECTIVE" },
  { floor: 3, color: "from-green-600 to-green-800", border: "border-green-500", tagline: "FURNISH YOUR PALACE" },
  { floor: 4, color: "from-yellow-600 to-yellow-800", border: "border-yellow-500", tagline: "EXPAND YOUR MIND" },
  { floor: 5, color: "from-purple-600 to-purple-800", border: "border-purple-500", tagline: "TRAIN YOUR VISION" },
  { floor: 6, color: "from-orange-600 to-orange-800", border: "border-orange-500", tagline: "REFINE EVERYTHING" },
  { floor: 7, color: "from-pink-600 to-pink-800", border: "border-pink-500", tagline: "IGNITE YOUR HEART" },
  { floor: 8, color: "from-teal-600 to-teal-800", border: "border-teal-500", tagline: "MASTER THE PALACE" },
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
          roomPurpose: room.purpose.substring(0, 150) + "...",
          color: colorScheme.color,
          tagline: colorScheme.tagline,
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
                {/* Card Back - Phototheology Branding */}
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br ${card.color} border-4 ${
                    FLOOR_COLORS.find(c => c.floor === card.floorNumber)?.border
                  } shadow-2xl flex flex-col`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Top Section with Title */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                    {/* Decorative pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)"
                    }}></div>
                    
                    <div className="relative z-10 text-center">
                      <h2 className="text-3xl font-bold text-yellow-300 mb-1" style={{ 
                        textShadow: "3px 3px 6px rgba(0,0,0,0.8), 0 0 15px rgba(255,215,0,0.5)",
                        fontFamily: "serif",
                        letterSpacing: "0.05em"
                      }}>
                        PHOTO
                      </h2>
                      <h3 className="text-2xl font-bold text-yellow-300" style={{ 
                        textShadow: "3px 3px 6px rgba(0,0,0,0.8), 0 0 15px rgba(255,215,0,0.5)",
                        fontFamily: "serif",
                        letterSpacing: "0.05em"
                      }}>
                        THEOLOGY
                      </h3>
                      
                      {/* Puzzle and Bible Image Representation */}
                      <div className="mt-6 mb-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                          <div className="text-4xl">🧩</div>
                        </div>
                        <div className="mt-2 text-xs text-white/80 font-mono">
                          📖
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Section with Tagline */}
                  <div className="h-16 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center px-4">
                    <p className="text-xs text-yellow-200 font-bold tracking-wider text-center" style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                    }}>
                      {card.tagline}
                    </p>
                  </div>
                  
                  {/* Bottom cityscape silhouette */}
                  <div className="h-8 bg-gradient-to-t from-black/60 to-transparent relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-yellow-400/40"
                          style={{
                            width: `${Math.random() * 8 + 4}px`,
                            height: `${Math.random() * 20 + 10}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Front - Room Details */}
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 border-4 ${
                    FLOOR_COLORS.find(c => c.floor === card.floorNumber)?.border
                  } shadow-2xl flex flex-col ${
                    card.isMatched ? "opacity-50" : ""
                  }`}
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {/* Top Banner with Room Name */}
                  <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 px-3 py-2 rounded-t-lg border-b-2 border-yellow-600">
                    <h3 className="text-center font-bold text-gray-800 text-sm uppercase tracking-wide" style={{
                      textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                    }}>
                      {card.roomName}
                    </h3>
                  </div>
                  
                  {/* Main Content Area */}
                  <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-amber-100/50 to-amber-50/30 dark:from-gray-800/50 dark:to-gray-900/30">
                    {/* Room Tag */}
                    <div className="text-center">
                      <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                        {card.roomTag}
                      </div>
                    </div>
                    
                    {/* Room Purpose/Description */}
                    <div className="flex-1 flex items-center justify-center px-2">
                      <p className="text-xs text-center leading-relaxed text-gray-700 dark:text-gray-300">
                        {card.roomPurpose}
                      </p>
                    </div>
                    
                    {/* Match Trophy */}
                    {card.isMatched && (
                      <div className="text-center mb-2">
                        <Trophy className="w-8 h-8 mx-auto text-yellow-500 drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom Section - Floor Info */}
                  <div className={`bg-gradient-to-r ${card.color} px-3 py-2 rounded-b-lg`}>
                    <div className="text-center">
                      <p className="text-xs text-white font-semibold" style={{
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                      }}>
                        {card.floorNumber}ST FLOOR: {card.floorName.toUpperCase()}
                      </p>
                    </div>
                    
                    {/* Cityscape silhouette */}
                    <div className="mt-1 flex items-end justify-center gap-px">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-yellow-300/60"
                          style={{
                            width: "6px",
                            height: `${Math.random() * 8 + 4}px`,
                          }}
                        />
                      ))}
                    </div>
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
