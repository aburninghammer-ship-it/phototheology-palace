// Scrabble PT - Solo and Multiplayer Modes
// Play solo or real-time multiplayer with PT principles

import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Sparkles, Gamepad2, BookOpen, Cross, Book, Trophy, Layers, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useScrabbleGame } from "@/hooks/useScrabbleGame";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrabbleBoard,
  PlayerHandBar,
  VerseSelectionScreen,
  SeedVerseDisplay,
  SeedCardInsight,
  BibleStudyConnectionModal,
  GameLobby,
  ConnectionModal,
  VotingPanel,
  StudyLog,
  StudyTranscript,
  type SelectedVerse,
  type StudyLogEntry,
} from "@/components/scrabble";
import type { ScrabbleCard, PlacedCard, BoardPosition, Connection } from "@/types/scrabble";
import { positionKey, isValidPlacement } from "@/types/scrabble";
import { getAllScrabbleCards, shuffleCards } from "@/data/scrabbleCards";

type GamePhase = "menu" | "verse-selection" | "seed-insight" | "playing" | "completed" | "multiplayer-lobby" | "multiplayer-playing";

export default function PTScrabble() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [score, setScore] = useState(0);
  const [seedVerse, setSeedVerse] = useState<SelectedVerse | null>(null);
  const [seedCard, setSeedCard] = useState<ScrabbleCard | null>(null);

  // Study log entries - tracks all submissions for display and transcript
  const [studyLogEntries, setStudyLogEntries] = useState<StudyLogEntry[]>([]);

  // Multiplayer state
  const gameIdFromUrl = searchParams.get('game');
  const [multiplayerGameId, setMultiplayerGameId] = useState<string | undefined>(gameIdFromUrl || undefined);

  // Multiplayer hook
  const {
    game: mpGame,
    players: mpPlayers,
    myPlayer: mpMyPlayer,
    myHand: mpMyHand,
    pendingMoves,
    myVotes,
    isLoading: mpLoading,
    createGame,
    joinGame,
    startGame,
    placeCard: mpPlaceCard,
    vote,
    getValidPositions,
    getAdjacentCards: mpGetAdjacentCards,
  } = useScrabbleGame(multiplayerGameId);

  // Multiplayer UI state
  const [mpSelectedCard, setMpSelectedCard] = useState<ScrabbleCard | null>(null);
  const [mpSelectedPosition, setMpSelectedPosition] = useState<BoardPosition | null>(null);
  const [showMpConnectionModal, setShowMpConnectionModal] = useState(false);

  // Solo mode state
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
    const chosenSeedCard = seedCardPool[Math.floor(Math.random() * seedCardPool.length)];

    // Store seed card for insight screen
    setSeedCard(chosenSeedCard);

    // Remove seed from available cards
    const remainingCards = allCards.filter(c => c.id !== chosenSeedCard.id);

    // Set up board with seed card
    setBoardState({
      "0,0": {
        card: chosenSeedCard,
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

    // Go to seed insight screen first
    setGamePhase("seed-insight");
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
    const playerName = user.email?.split("@")[0] || "Player";

    // Calculate points
    let points = adjacentCount === 1 ? 1 : adjacentCount === 2 ? 3 : adjacentCount === 3 ? 6 : 10;
    if (isChristConnection) points *= 2;

    const moveId = crypto.randomUUID();

    // Add card to board
    setBoardState(prev => ({
      ...prev,
      [key]: {
        card: connectionModal.card!,
        position: connectionModal.position!,
        playerId: user.id,
        playerName,
        connections,
        timestamp: new Date().toISOString(),
        moveId,
      }
    }));

    // Add to study log
    setStudyLogEntries(prev => [...prev, {
      id: moveId,
      playerName,
      cardCode: connectionModal.card!.code,
      cardName: connectionModal.card!.name,
      explanation,
      isChristConnection,
      points,
      timestamp: new Date().toISOString(),
    }]);

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

    // Check for game completion (no cards in hand and deck is empty)
    if (playerHand.length <= 1 && deck.length === 0) {
      // Delay to show the last card placement animation
      setTimeout(() => setGamePhase("completed"), 1500);
    }
  }, [connectionModal, user, deck, playerHand.length]);

  const handleNewGame = useCallback(() => {
    setGamePhase("verse-selection");
    setSeedVerse(null);
    setSeedCard(null);
    setBoardState({});
    setPlayerHand([]);
    setDeck([]);
    setScore(0);
    setSelectedCard(null);
    setStudyLogEntries([]);
  }, []);

  // ========== MULTIPLAYER HANDLERS ==========

  const handleCreateMultiplayerGame = useCallback(async (mode: 'ffa' | 'team', maxPlayers: number) => {
    const newGameId = await createGame(mode, maxPlayers);
    if (newGameId) {
      setMultiplayerGameId(newGameId);
      navigate(`/pt-scrabble?game=${newGameId}`, { replace: true });
    }
    return newGameId;
  }, [createGame, navigate]);

  const handleJoinMultiplayerGame = useCallback(async (roomCode: string) => {
    const success = await joinGame(roomCode);
    if (success && mpGame) {
      setMultiplayerGameId(mpGame.id);
      navigate(`/pt-scrabble?game=${mpGame.id}`, { replace: true });
    }
    return success;
  }, [joinGame, mpGame, navigate]);

  const handleMpCardSelect = useCallback((card: ScrabbleCard) => {
    setMpSelectedCard(prev => prev?.id === card.id ? null : card);
  }, []);

  const handleMpPositionClick = useCallback((position: BoardPosition) => {
    if (!mpSelectedCard) return;
    setMpSelectedPosition(position);
    setShowMpConnectionModal(true);
  }, [mpSelectedCard]);

  const handleMpConnectionSubmit = useCallback(async (
    connections: Connection[],
    explanation: string,
    isChristConnection: boolean
  ) => {
    if (!mpSelectedCard || !mpSelectedPosition) return;

    const success = await mpPlaceCard(
      mpSelectedCard,
      mpSelectedPosition,
      connections,
      explanation,
      isChristConnection
    );

    if (success) {
      setMpSelectedCard(null);
      setMpSelectedPosition(null);
      setShowMpConnectionModal(false);
    }
  }, [mpSelectedCard, mpSelectedPosition, mpPlaceCard]);

  const handleMpVote = useCallback(async (moveId: string, approve: boolean) => {
    await vote(moveId, approve);
  }, [vote]);

  const mpAdjacentCards: PlacedCard[] = mpSelectedPosition && mpGame
    ? mpGetAdjacentCards(mpSelectedPosition)
    : [];

  const isHost = user?.id === mpGame?.hostUserId;
  const deckCount = mpGame?.deckRemaining?.length ?? 0;

  // Derive study log entries from multiplayer board state
  const mpStudyLogEntries = useMemo((): StudyLogEntry[] => {
    if (!mpGame?.boardState) return [];
    return Object.values(mpGame.boardState)
      .filter(placed => placed.moveId !== 'seed') // Exclude seed card
      .map(placed => ({
        id: placed.moveId,
        playerName: placed.playerName,
        cardCode: placed.card.code,
        cardName: placed.card.name,
        explanation: placed.connections.map(c => c.explanation).join(' | ') || '',
        isChristConnection: placed.connections.some(c => c.isChristConnection),
        points: placed.connections.length > 0
          ? (placed.connections.length === 1 ? 1 : placed.connections.length === 2 ? 3 : placed.connections.length === 3 ? 6 : 10)
            * (placed.connections.some(c => c.isChristConnection) ? 2 : 1)
          : 0,
        timestamp: placed.timestamp,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [mpGame?.boardState]);

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
              <div className="text-6xl mx-auto">🎮</div>
              <CardTitle className="text-4xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Scrabble PT
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Build connections using Phototheology principles on a growing board.
                Place cards, explain connections, and score points!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rules summary */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">1. Place Cards</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a PT principle card and place it on the board
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">2. Make Connections</h3>
                  <p className="text-sm text-muted-foreground">
                    Explain how your card connects to adjacent cards
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Cross className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">3. Score Points</h3>
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
                  Solo Game
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setGamePhase("multiplayer-lobby")}
                  className="border-green-500/50 hover:bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Multiplayer Game
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

  // Seed card insight view - explains how the starting card connects to the verse
  if (gamePhase === "seed-insight" && seedCard && seedVerse) {
    return (
      <SeedCardInsight
        seedCard={seedCard}
        verse={seedVerse}
        onContinue={() => setGamePhase("playing")}
      />
    );
  }

  // ========== MULTIPLAYER LOBBY VIEW ==========
  if (gamePhase === "multiplayer-lobby") {
    // If we have an active game in waiting status, show GameLobby
    if (mpGame && mpGame.status === 'waiting') {
      return (
        <GameLobby
          game={mpGame}
          players={mpPlayers}
          isHost={isHost}
          isLoading={mpLoading}
          onCreateGame={handleCreateMultiplayerGame}
          onJoinGame={handleJoinMultiplayerGame}
          onStartGame={startGame}
        />
      );
    }

    // If game started, switch to playing phase
    if (mpGame && mpGame.status === 'playing') {
      setGamePhase("multiplayer-playing");
      return null;
    }

    // Show create/join UI
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Button onClick={() => setGamePhase("menu")} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>

          <GameLobby
            game={null}
            players={[]}
            isHost={false}
            isLoading={mpLoading}
            onCreateGame={handleCreateMultiplayerGame}
            onJoinGame={handleJoinMultiplayerGame}
            onStartGame={startGame}
          />
        </main>
      </div>
    );
  }

  // ========== MULTIPLAYER PLAYING VIEW ==========
  if (gamePhase === "multiplayer-playing" || (mpGame && mpGame.status === 'playing')) {
    // Game completed
    if (mpGame?.status === 'completed') {
      const sortedPlayers = [...mpPlayers].sort((a, b) => b.score - a.score);
      const winner = sortedPlayers[0];
      const totalMpScore = sortedPlayers.reduce((sum, p) => sum + p.score, 0);

      return (
        <div className="min-h-screen bg-background overflow-y-auto p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <h1 className="text-3xl font-bold">Game Over!</h1>
              <div className="space-y-2">
                <p className="text-xl">
                  Winner: <span className="font-bold text-yellow-500">{winner?.displayName}</span>
                </p>
                <p className="text-2xl font-bold">{winner?.score} points</p>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                Final Standings
              </h3>
              <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 rounded bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      {player.displayName}
                    </span>
                    <span className="font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Transcript for multiplayer */}
            <StudyTranscript
              entries={mpStudyLogEntries}
              seedVerse={null}
              totalScore={totalMpScore}
              playerCount={mpPlayers.length}
              onSave={(transcript) => {
                console.log('Save multiplayer transcript:', transcript);
              }}
            />

            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate('/games')}>
                Back to Games
              </Button>
              <Button onClick={() => {
                setMultiplayerGameId(undefined);
                setGamePhase("menu");
                navigate('/pt-scrabble', { replace: true });
              }}>
                Play Again
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Active multiplayer game
    if (mpGame) {
      return (
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Study Log Sidebar - shows all player submissions */}
          <StudyLog entries={mpStudyLogEntries} />

          {/* Header */}
          <header className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur z-10">
            <Button variant="ghost" size="icon" onClick={() => {
              setMultiplayerGameId(undefined);
              setGamePhase("menu");
              navigate('/pt-scrabble', { replace: true });
            }}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Room: <span className="font-mono font-bold">{mpGame.roomCode}</span>
              </span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mpPlayers.length}</span>
              </div>
              <div className="flex items-center gap-1" title="Cards in deck">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{deckCount}</span>
              </div>
            </div>

            {/* Mini scoreboard */}
            <div className="flex gap-2">
              {mpPlayers.slice(0, 3).map((player) => (
                <div
                  key={player.id}
                  className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
                >
                  <span className={player.userId === user?.id ? 'font-bold text-primary' : ''}>
                    {player.displayName.slice(0, 8)}
                  </span>
                  <span className="text-yellow-500">{player.score}</span>
                </div>
              ))}
              {mpPlayers.length > 3 && (
                <span className="text-xs text-muted-foreground">+{mpPlayers.length - 3}</span>
              )}
            </div>
          </header>

          {/* Game board */}
          <div className="flex-1 min-h-0 pb-40">
            <ScrabbleBoard
              boardState={mpGame.boardState}
              selectedCard={mpSelectedCard}
              onPositionClick={handleMpPositionClick}
              validPositions={mpSelectedCard ? getValidPositions() : []}
            />
          </div>

          {/* Player hand - NEVER disabled, can always select cards */}
          <PlayerHandBar
            cards={mpMyHand}
            selectedCard={mpSelectedCard}
            onCardSelect={handleMpCardSelect}
            disabled={false}
            score={mpMyPlayer?.score || 0}
          />

          {/* Connection modal */}
          <AnimatePresence>
            {showMpConnectionModal && mpSelectedCard && mpSelectedPosition && (
              <ConnectionModal
                isOpen={showMpConnectionModal}
                onClose={() => {
                  setShowMpConnectionModal(false);
                  setMpSelectedPosition(null);
                }}
                onSubmit={handleMpConnectionSubmit}
                card={mpSelectedCard}
                position={mpSelectedPosition}
                adjacentCards={mpAdjacentCards}
              />
            )}
          </AnimatePresence>

          {/* Non-blocking voting panel */}
          <VotingPanel
            pendingMoves={pendingMoves}
            players={mpPlayers}
            currentPlayerId={mpMyPlayer?.id}
            myVotes={myVotes}
            onVote={handleMpVote}
          />
        </div>
      );
    }
  }

  // Solo game completed view with transcript
  if (gamePhase === "completed") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            {/* Victory header */}
            <div className="text-center space-y-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <h1 className="text-3xl font-bold">Study Complete!</h1>
              <p className="text-xl text-muted-foreground">
                Final Score: <span className="font-bold text-yellow-500">{score}</span> points
              </p>
              {seedVerse && (
                <p className="text-sm text-muted-foreground">
                  Studied: {seedVerse.reference}
                </p>
              )}
            </div>

            {/* Study stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{studyLogEntries.length}</p>
                <p className="text-sm text-muted-foreground">Connections Made</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-purple-500">
                  {studyLogEntries.filter(e => e.isChristConnection).length}
                </p>
                <p className="text-sm text-muted-foreground">Christ Connections</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-yellow-500">{score}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>

            {/* Study Transcript */}
            <StudyTranscript
              entries={studyLogEntries}
              seedVerse={seedVerse}
              totalScore={score}
              playerCount={1}
              onSave={(transcript) => {
                // TODO: Save to user's saved studies in Supabase
                console.log('Save transcript:', transcript);
              }}
            />

            {/* Action buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/games')}>
                Back to Games
              </Button>
              <Button onClick={handleNewGame}>
                Play Again
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Solo Playing view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Study Log Sidebar */}
      <StudyLog entries={studyLogEntries} />

      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button onClick={() => setGamePhase("menu")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Menu
          </Button>
          <h1 className="text-lg font-bold hidden sm:block">Scrabble PT</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Score: <span className="font-bold text-primary">{score}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setGamePhase("completed")} disabled={studyLogEntries.length === 0}>
              End Game
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewGame}>
              New Game
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
