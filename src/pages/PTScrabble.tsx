// PT Scrabble Page - Bible Study Practice Mode
// Solo practice mode where users study a verse using PT principles

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Users, Sparkles, Gamepad2, BookOpen, Cross, Book } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  ScrabbleBoard, 
  PlayerHandBar, 
  VerseSelectionScreen, 
  SeedVerseDisplay,
  BibleStudyConnectionModal,
  type SelectedVerse 
} from "@/components/scrabble";
import type { ScrabbleCard, PlacedCard, BoardPosition, Connection } from "@/types/scrabble";
import { positionKey, isValidPlacement } from "@/types/scrabble";
import { getAllScrabbleCards, shuffleCards } from "@/data/scrabbleCards";

type GamePhase = "menu" | "verse-selection" | "playing";

export default function PTScrabble() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [score, setScore] = useState(0);
  const [seedVerse, setSeedVerse] = useState<SelectedVerse | null>(null);
  
  // Modal state for placing cards
  const [connectionModal, setConnectionModal] = useState<{
    isOpen: boolean;
    card: ScrabbleCard | null;
    position: BoardPosition | null;
    adjacentCards: PlacedCard[];
  }>({ isOpen: false, card: null, position: null, adjacentCards: [] });
  
  // Board state - seed card placed at center
  const [boardState, setBoardState] = useState<Record<string, PlacedCard>>({});

  // Player hand
  const [playerHand, setPlayerHand] = useState<ScrabbleCard[]>([]);

  // Deck for drawing
  const [deck, setDeck] = useState<ScrabbleCard[]>([]);

  // Start game with selected verse
  const handleVerseSelected = useCallback((verse: SelectedVerse) => {
    setSeedVerse(verse);
    
    // Initialize game state
    const allCards = shuffleCards(getAllScrabbleCards());
    
    // Pick a seed card - prefer Concentration Room or Story Room for Bible study
    const preferredSeeds = allCards.filter(c => 
      ['SR', 'OR', 'CR', 'GR', 'IR'].includes(c.code) || 
      c.tags.includes('christology') ||
      c.tags.includes('narrative')
    );
    const seedCardPool = preferredSeeds.length > 0 ? preferredSeeds : allCards.filter(c => c.floor >= 1 && c.floor <= 4);
    const seedCard = seedCardPool[Math.floor(Math.random() * seedCardPool.length)];
    
    // Remove seed from available cards
    const remainingCards = allCards.filter(c => c.id !== seedCard.id);
    
    // Set up board with seed card
    setBoardState({
      "0,0": {
        card: seedCard,
        position: { x: 0, y: 0 },
        playerId: "system",
        playerName: "Starting Principle",
        connections: [],
        timestamp: new Date().toISOString(),
        moveId: "seed",
      }
    });
    
    // Deal hand
    setPlayerHand(remainingCards.slice(0, 7));
    setDeck(remainingCards.slice(7));
    setScore(0);
    setSelectedCard(null);
    setGamePhase("playing");
  }, []);

  const handleCardSelect = useCallback((card: ScrabbleCard) => {
    setSelectedCard(prev => prev?.id === card.id ? null : card);
  }, []);

  const handlePositionClick = useCallback((position: BoardPosition) => {
    if (!selectedCard || !user) return;
    
    // Check if valid placement and get adjacent cards
    const { valid, adjacentCards } = isValidPlacement(position, boardState);
    if (!valid) return;
    
    // Open the connection modal
    setConnectionModal({
      isOpen: true,
      card: selectedCard,
      position,
      adjacentCards,
    });
  }, [selectedCard, user, boardState]);

  const handleConnectionSubmit = useCallback((
    connections: Connection[], 
    explanation: string, 
    isChristConnection: boolean
  ) => {
    if (!connectionModal.card || !connectionModal.position || !user) return;
    
    const key = positionKey(connectionModal.position);
    const adjacentCount = connectionModal.adjacentCards.length;
    
    // Calculate points
    let points = adjacentCount === 1 ? 1 : adjacentCount === 2 ? 3 : adjacentCount === 3 ? 6 : 10;
    if (isChristConnection) points *= 2;
    
    // Add card to board
    setBoardState(prev => ({
      ...prev,
      [key]: {
        card: connectionModal.card!,
        position: connectionModal.position!,
        playerId: user.id,
        playerName: user.email?.split("@")[0] || "Player",
        connections,
        timestamp: new Date().toISOString(),
        moveId: crypto.randomUUID(),
      }
    }));

    // Update score
    setScore(prev => prev + points);

    // Remove from hand
    setPlayerHand(prev => prev.filter(c => c.id !== connectionModal.card!.id));
    
    // Draw a new card if deck has cards
    if (deck.length > 0) {
      const [newCard, ...remainingDeck] = deck;
      setPlayerHand(prev => [...prev, newCard]);
      setDeck(remainingDeck);
    }
    
    setSelectedCard(null);
    setConnectionModal({ isOpen: false, card: null, position: null, adjacentCards: [] });
  }, [connectionModal, user, deck]);

  const handleNewGame = useCallback(() => {
    setGamePhase("verse-selection");
    setSeedVerse(null);
    setBoardState({});
    setPlayerHand([]);
    setDeck([]);
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
              <div className="text-6xl mx-auto">📖</div>
              <CardTitle className="text-4xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                PT Bible Study Scrabble
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Choose a Bible verse, then build connections using Phototheology principles! 
                Apply the PT Palace framework to understand Scripture more deeply.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rules summary */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Book className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">1. Choose a Verse</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a Bible passage to study deeply
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">2. Apply Principles</h3>
                  <p className="text-sm text-muted-foreground">
                    Place PT room cards and explain how each applies
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Cross className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">3. Find Christ</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn bonus points for Christ-centered connections
                  </p>
                </div>
              </div>

              {/* Game mode buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setGamePhase("verse-selection")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Start Bible Study
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  disabled
                  title="Coming soon!"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Group Study (Coming Soon)
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
                  <li>• <strong>Christ Connection = 2x multiplier!</strong></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Verse selection view
  if (gamePhase === "verse-selection") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Button onClick={() => setGamePhase("menu")} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          
          <VerseSelectionScreen 
            onVerseSelected={handleVerseSelected}
            onBack={() => setGamePhase("menu")}
          />
        </main>
      </div>
    );
  }

  // Playing view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button onClick={() => setGamePhase("menu")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Menu
          </Button>
          <h1 className="text-lg font-bold hidden sm:block">PT Bible Study</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Score: <span className="font-bold text-primary">{score}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleNewGame}>
              New Study
            </Button>
          </div>
        </div>

        {/* Seed Verse Display */}
        {seedVerse && (
          <SeedVerseDisplay verse={seedVerse} />
        )}

        {/* How to Play Instructions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-3">
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li><strong>Select a card</strong> from your hand below</li>
            <li><strong>Click a + spot</strong> on the board next to an existing card</li>
            <li><strong>Explain</strong> how that PT principle applies to the verse</li>
            <li><strong>Score bonus</strong> for Christ-centered connections!</li>
          </ol>
        </div>

        {/* Main game area */}
        <div className="flex-1 min-h-[350px] border rounded-lg overflow-hidden">
          <ScrabbleBoard
            boardState={boardState}
            selectedCard={selectedCard}
            onPositionClick={handlePositionClick}
            className="h-full"
          />
        </div>

        {/* Player hand */}
        <div className="border-t pt-4 pb-32">
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

      {/* Connection Modal */}
      {connectionModal.isOpen && connectionModal.card && connectionModal.position && seedVerse && (
        <BibleStudyConnectionModal
          isOpen={connectionModal.isOpen}
          onClose={() => setConnectionModal({ isOpen: false, card: null, position: null, adjacentCards: [] })}
          onSubmit={handleConnectionSubmit}
          card={connectionModal.card}
          position={connectionModal.position}
          adjacentCards={connectionModal.adjacentCards}
          seedVerse={seedVerse}
        />
      )}
    </div>
  );
}
