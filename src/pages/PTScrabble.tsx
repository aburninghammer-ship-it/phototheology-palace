// PT Scrabble Page - Practice Mode
// Solo practice mode for PT Scrabble (multiplayer requires database tables)

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Users, Sparkles, Gamepad2, BookOpen, Cross } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ScrabbleBoard, PlayerHandBar } from "@/components/scrabble";
import type { ScrabbleCard, PlacedCard, BoardPosition } from "@/types/scrabble";
import { positionKey } from "@/types/scrabble";
import { getAllScrabbleCards, shuffleCards } from "@/data/scrabbleCards";

type GamePhase = "menu" | "playing";

export default function PTScrabble() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [score, setScore] = useState(0);
  
  // Demo board state with seed card
  const [boardState, setBoardState] = useState<Record<string, PlacedCard>>(() => {
    const allCards = getAllScrabbleCards();
    const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
    const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];
    
    if (!seedCard) return {};
    
    return {
      "0,0": {
        card: seedCard,
        position: { x: 0, y: 0 },
        playerId: "system",
        playerName: "Game Start",
        connections: [],
        timestamp: new Date().toISOString(),
        moveId: "seed",
      }
    };
  });

  // Demo hand
  const [playerHand, setPlayerHand] = useState<ScrabbleCard[]>(() => {
    const allCards = shuffleCards(getAllScrabbleCards());
    return allCards.slice(0, 7);
  });

  // Deck for drawing
  const [deck, setDeck] = useState<ScrabbleCard[]>(() => {
    const allCards = shuffleCards(getAllScrabbleCards());
    return allCards.slice(7);
  });

  const handleCardSelect = useCallback((card: ScrabbleCard) => {
    setSelectedCard(prev => prev?.id === card.id ? null : card);
  }, []);

  const handlePositionClick = useCallback((position: BoardPosition) => {
    if (!selectedCard || !user) return;
    
    const key = positionKey(position);
    
    // Count adjacent cards for scoring
    const adjacentKeys = [
      positionKey({ x: position.x, y: position.y - 1 }),
      positionKey({ x: position.x, y: position.y + 1 }),
      positionKey({ x: position.x - 1, y: position.y }),
      positionKey({ x: position.x + 1, y: position.y }),
    ];
    const adjacentCount = adjacentKeys.filter(k => boardState[k]).length;
    const points = adjacentCount === 1 ? 1 : adjacentCount === 2 ? 3 : adjacentCount === 3 ? 6 : 10;
    
    // Add card to board
    setBoardState(prev => ({
      ...prev,
      [key]: {
        card: selectedCard,
        position,
        playerId: user.id,
        playerName: user.email?.split("@")[0] || "Player",
        connections: [],
        timestamp: new Date().toISOString(),
        moveId: crypto.randomUUID(),
      }
    }));

    // Update score
    setScore(prev => prev + points);

    // Remove from hand
    setPlayerHand(prev => prev.filter(c => c.id !== selectedCard.id));
    
    // Draw a new card if deck has cards
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setPlayerHand(prev => [...prev, newCard]);
      setDeck(remainingDeck);
    }
    
    setSelectedCard(null);
  }, [selectedCard, user, boardState, deck]);

  const handleNewGame = useCallback(() => {
    const allCards = shuffleCards(getAllScrabbleCards());
    const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
    const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];
    
    setBoardState({
      "0,0": {
        card: seedCard,
        position: { x: 0, y: 0 },
        playerId: "system",
        playerName: "Game Start",
        connections: [],
        timestamp: new Date().toISOString(),
        moveId: "seed",
      }
    });
    setPlayerHand(allCards.slice(0, 7));
    setDeck(allCards.slice(7));
    setScore(0);
    setSelectedCard(null);
  }, []);

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

  // Main menu view
  if (gamePhase === "menu") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Button onClick={() => navigate("/games")} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="text-6xl mx-auto">🎯</div>
              <CardTitle className="text-4xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                PT Scrabble
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Build theological connections on a shared board! Place Palace room cards adjacent to existing ones, 
                and watch your understanding of Phototheology principles grow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rules summary */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Connect Cards</h3>
                  <p className="text-sm text-muted-foreground">
                    Place Palace room cards adjacent to existing cards
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Cross className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Christ-Centered</h3>
                  <p className="text-sm text-muted-foreground">
                    Think about how each connection reveals Christ
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Build Together</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiplayer mode coming soon!
                  </p>
                </div>
              </div>

              {/* Game mode buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setGamePhase("playing")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Practice Mode (Solo)
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  disabled
                  title="Coming soon!"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Multiplayer (Coming Soon)
                </Button>
              </div>

              {/* Scoring info */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Scoring System
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1 connection = 1 point</li>
                  <li>• 2 connections = 3 points</li>
                  <li>• 3 connections = 6 points</li>
                  <li>• 4+ connections = 10+ points</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Playing view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => setGamePhase("menu")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <h1 className="text-xl font-bold">PT Scrabble - Practice Mode</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Score: <span className="font-bold text-primary">{score}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleNewGame}>
              New Game
            </Button>
          </div>
        </div>

        {/* How to Play Instructions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            How to Play
          </h3>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li><strong>Select a card</strong> from your hand at the bottom (click on it)</li>
            <li><strong>Click an empty spot</strong> next to an existing card on the board (marked with +)</li>
            <li><strong>Score points</strong> based on connections: 1→1pt, 2→3pts, 3→6pts, 4+→10pts</li>
            <li><strong>Think theologically:</strong> How does your card connect to the adjacent card(s)?</li>
          </ol>
          <p className="text-xs text-blue-400 mt-2">
            <Sparkles className="inline h-3 w-3 mr-1" />
            The <strong>"{Object.values(boardState)[0]?.card.name}"</strong> ({Object.values(boardState)[0]?.card.code}) is your starting card. Build from there!
          </p>
        </div>

        {/* Main game area */}
        <div className="flex-1 min-h-[400px] border rounded-lg overflow-hidden">
          <ScrabbleBoard
            boardState={boardState}
            selectedCard={selectedCard}
            onPositionClick={handlePositionClick}
            className="h-full"
          />
        </div>

        {/* Player hand */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground mb-2 text-center">
            {selectedCard 
              ? `✅ Selected: "${selectedCard.name}" (${selectedCard.code}) — Now click a + spot on the board`
              : "👆 Click a card below to select it, then place it on the board"}
          </p>
          <PlayerHandBar
            cards={playerHand}
            selectedCard={selectedCard}
            onCardSelect={handleCardSelect}
            score={score}
          />
        </div>
      </main>
    </div>
  );
}
