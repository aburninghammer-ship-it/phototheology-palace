// Scrabble PT - Solo and Multiplayer Modes
// Play solo or real-time multiplayer with PT principles

import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Sparkles, Gamepad2, BookOpen, Cross, Book, Trophy, Layers, Globe, Megaphone, Calendar, Zap, Send, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useAuth } from "@/hooks/useAuth";
import { useScrabbleGame } from "@/hooks/useScrabbleGame";
import { useGamePresence, type GameInvitation } from "@/hooks/useGamePresence";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrabbleBoard,
  PlayerHandBar,
  SpatialHandDisplay,
  VerseSelectionScreen,
  SeedVerseDisplay,
  BibleStudyConnectionModal,
  PlacedCardDetailModal,
  GameLobby,
  ConnectionModal,
  VotingPanel,
  StudyLog,
  StudyTranscript,
  JeevesFeedbackPanel,
  InGameChat,
  StudyProgressPanel,
  GameTimer,
  type SelectedVerse,
  type StudyLogEntry,
  type CardWithPosition,
} from "@/components/scrabble";
import { AutoSavePolishForPlayers } from "@/components/scrabble/AutoSavePolishForPlayers";
import { GameInvitationNotification } from "@/components/scrabble/GameInvitationNotification";
import { CallToPlayButton } from "@/components/scrabble/CallToPlayButton";
import { ScheduledGamesPanel } from "@/components/scrabble/ScheduledGamesPanel";
import type { ScrabbleCard, PlacedCard, BoardPosition, Connection } from "@/types/scrabble";
import { positionKey, isValidPlacement, assignCardsToPositions, getValidPlacements } from "@/types/scrabble";
import { getAllScrabbleCards, shuffleCards } from "@/data/scrabbleCards";

type GamePhase = "menu" | "verse-selection" | "playing" | "completed" | "multiplayer-lobby" | "multiplayer-verse-selection" | "multiplayer-playing" | "quick-play" | "quick-play-won";

const QUICK_PLAY_SYMBOLS = [
  { code: "1D", name: "Literal Dimension" },
  { code: "2D", name: "Christ Dimension" },
  { code: "3D", name: "Me Dimension" },
  { code: "4D", name: "Church Dimension" },
  { code: "5D", name: "Heaven Dimension" },
  { code: "|S", name: "Sanctuary Wall" },
  { code: "|LC", name: "Life of Christ Wall" },
  { code: "|GC", name: "Great Controversy Wall" },
  { code: "|TP", name: "Time Prophecy Wall" },
  { code: "+", name: "Add Link" },
  { code: "∥", name: "Parallel" },
  { code: "≅", name: "Type/Antitype" },
  { code: "⊙", name: "Center in Christ" },
  { code: "⚖", name: "Integrity Sweep" },
];

export default function PTScrabble() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gamePhase, setGamePhaseInternal] = useState<GamePhase>("menu");
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [score, setScore] = useState(0);
  const [seedVerse, setSeedVerse] = useState<SelectedVerse | null>(null);

  const setGamePhase = useCallback((newPhase: GamePhase) => {
    setGamePhaseInternal(newPhase);
  }, [gamePhase]);

  // Study log entries - tracks all submissions for display and transcript
  const [studyLogEntries, setStudyLogEntries] = useState<StudyLogEntry[]>([]);

  // Jeeves assist tracking - max 3 per player
  const [jeevesAssistsUsed, setJeevesAssistsUsed] = useState(0);
  const MAX_JEEVES_ASSISTS = 3;

  // Quick Play state (merged from Chain War)
  const [qpHand, setQpHand] = useState<typeof QUICK_PLAY_SYMBOLS>([]);
  const [qpSelectedCards, setQpSelectedCards] = useState<string[]>([]);
  const [qpVerse, setQpVerse] = useState("");
  const [qpExplanation, setQpExplanation] = useState("");
  const [qpScore, setQpScore] = useState(0);
  const [qpIsSubmitting, setQpIsSubmitting] = useState(false);
  const qpTargetScore = 15;

  const dealQpHand = useCallback(() => {
    const shuffled = [...QUICK_PLAY_SYMBOLS].sort(() => Math.random() - 0.5);
    setQpHand(shuffled.slice(0, 5));
    setQpSelectedCards([]);
    setQpVerse("");
    setQpExplanation("");
  }, []);

  const startQuickPlay = useCallback(() => {
    setQpScore(0);
    dealQpHand();
    setGamePhase("quick-play");
  }, [dealQpHand, setGamePhase]);

  // Save quick play score
  useEffect(() => {
    const saveScore = async () => {
      if (gamePhase === 'quick-play-won' && user) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "chain_war",
            score: qpScore,
            mode: "solo",
          });
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };
    saveScore();
  }, [gamePhase, user, qpScore]);

  const toggleQpCard = useCallback((code: string) => {
    setQpSelectedCards(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : prev.length < 3 ? [...prev, code] : prev
    );
  }, []);

  const handleQpSubmit = useCallback(async () => {
    if (qpSelectedCards.length < 2) {
      toast.error("Select at least 2 cards");
      return;
    }
    if (!qpVerse.trim() || !qpExplanation.trim()) {
      toast.error("Please provide a verse and explanation");
      return;
    }
    setQpIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: "validate_chain", cards: qpSelectedCards, verse: qpVerse, explanation: qpExplanation },
      });
      if (error) throw error;
      const { isValid, feedback, points } = data;
      if (isValid) {
        const newScore = qpScore + points;
        setQpScore(newScore);
        toast.success(`+${points} points! ${feedback}`);
        if (newScore >= qpTargetScore) {
          setGamePhase("quick-play-won");
          toast.success("🏆 You reached the target score!");
        }
        const remaining = qpHand.filter(s => !qpSelectedCards.includes(s.code));
        const newCards = QUICK_PLAY_SYMBOLS
          .filter(s => !remaining.find(r => r.code === s.code))
          .sort(() => Math.random() - 0.5)
          .slice(0, qpSelectedCards.length);
        setQpHand([...remaining, ...newCards]);
        setQpSelectedCards([]);
        setQpVerse("");
        setQpExplanation("");
      } else {
        toast.error(`Not quite: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error validating chain");
    } finally {
      setQpIsSubmitting(false);
    }
  }, [qpSelectedCards, qpVerse, qpExplanation, qpScore, qpHand, setGamePhase]);

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
    refreshHand: mpRefreshHand,
    vote,
    getValidPositions,
    getAdjacentCards: mpGetAdjacentCards,
  } = useScrabbleGame(multiplayerGameId);

  // Multiplayer UI state
  const [mpSelectedCard, setMpSelectedCard] = useState<ScrabbleCard | null>(null);
  const [mpSelectedPosition, setMpSelectedPosition] = useState<BoardPosition | null>(null);
  const [showMpConnectionModal, setShowMpConnectionModal] = useState(false);

  // Game presence for "Call to Play" feature
  const {
    onlineUsers,
    activeInvitation,
    isOnline,
    broadcastInvitation,
    dismissInvitation,
    onlineCount,
  } = useGamePresence();

  // Handle initial navigation when game is loaded from URL
  useEffect(() => {
    if (!mpGame || !multiplayerGameId) return;

    const normalizedSeedVerse: SelectedVerse | null =
      mpGame.seedVerse && typeof mpGame.seedVerse === 'object'
        ? {
            reference: typeof (mpGame.seedVerse as any).reference === 'string' ? (mpGame.seedVerse as any).reference : '',
            text: typeof (mpGame.seedVerse as any).text === 'string' ? (mpGame.seedVerse as any).text : '',
            book: '',
            chapter: 0,
            verseStart: 0,
          }
        : null;

    // Sync seed verse from DB for non-host players
    if (normalizedSeedVerse?.text && !seedVerse) {
      setSeedVerse(normalizedSeedVerse);
    }

    // Only auto-navigate if we're on the menu
    if (gamePhase === 'menu') {
      if (mpGame.status === 'waiting') {
        setGamePhaseInternal('multiplayer-lobby');
      } else if (mpGame.status === 'playing') {
        setGamePhaseInternal('multiplayer-playing');
      }
    }

    // Non-host: auto-transition from lobby to playing when host starts game
    if (gamePhase === 'multiplayer-lobby' && mpGame.status === 'playing') {
      if (normalizedSeedVerse?.text) {
        setSeedVerse(normalizedSeedVerse);
      }
      setGamePhaseInternal('multiplayer-playing');
    }
  }, [mpGame, multiplayerGameId, gamePhase, seedVerse]);

  // Auto-start quick play from URL param ?mode=quick
  useEffect(() => {
    if (searchParams.get('mode') === 'quick' && gamePhase === 'menu') {
      startQuickPlay();
    }
  }, [searchParams, gamePhase, startQuickPlay]);

  useEffect(() => {
    if (gamePhase === 'multiplayer-playing' && mpMyPlayer && mpMyHand.length === 0 && mpGame?.status === 'playing') {
      mpRefreshHand();
    }
  }, [gamePhase, mpMyPlayer, mpMyHand.length, mpGame?.status]);

  // Solo mode state
  const [connectionModal, setConnectionModal] = useState<{
    isOpen: boolean;
    card: ScrabbleCard | null;
    position: BoardPosition | null;
    adjacentCards: PlacedCard[];
  }>({ isOpen: false, card: null, position: null, adjacentCards: [] });

  // Placed card detail modal state (for viewing any card on board)
  const [viewingCard, setViewingCard] = useState<PlacedCard | null>(null);

  // Jeeves feedback panel state - shows after card placement
  const [lastPlacedEntry, setLastPlacedEntry] = useState<StudyLogEntry | null>(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  // Board state - seed card placed at center
  const [boardState, setBoardState] = useState<Record<string, PlacedCard>>({});

  // Player hand (10 visible cards from the full deck)
  const [playerHand, setPlayerHand] = useState<ScrabbleCard[]>([]);

  // Start game with selected verse - go directly to playing with empty board
  const handleVerseSelected = useCallback((verse: SelectedVerse) => {
    setSeedVerse(verse);

    // Initialize game state - deal 10 random cards from full deck
    const allCards = shuffleCards(getAllScrabbleCards());

    // Empty board - first player places first card
    setBoardState({});

    // Deal hand of 10 from full deck
    setPlayerHand(allCards.slice(0, 10));
    setScore(0);
    setSelectedCard(null);

    // Go directly to playing
    setGamePhase("playing");
  }, []);

  // Refresh hand - return current hand to pool, reshuffle, draw 10 new cards
  const handleRefreshHand = useCallback(() => {
    const playedCardIds = new Set(Object.values(boardState).map(p => p.card.id));
    const availableCards = getAllScrabbleCards().filter(c => !playedCardIds.has(c.id));
    const shuffled = shuffleCards(availableCards);
    setPlayerHand(shuffled.slice(0, 10));
  }, [boardState]);

  // Compute cards with their pre-assigned positions
  const cardsWithPositions = useMemo((): CardWithPosition[] => {
    const assigned = assignCardsToPositions(playerHand, boardState);
    return assigned.map(a => ({
      card: a.card,
      position: a.position,
      direction: a.direction,
    }));
  }, [playerHand, boardState]);

  // Direct placement - card is selected AND position is determined
  const handleDirectPlacement = useCallback((card: ScrabbleCard, position: BoardPosition) => {
    // Solo play doesn't require login

    // First card case - board is empty, any card can go at center
    if (Object.keys(boardState).length === 0) {
      setConnectionModal({
        isOpen: true,
        card,
        position: { x: 0, y: 0 }, // First card always at center
        adjacentCards: [], // No adjacent cards for first placement
      });
      return;
    }

    // Try the pre-assigned position first
    let { valid, adjacentCards } = isValidPlacement(position, boardState);
    let finalPosition = position;

    // If pre-assigned position is no longer valid (e.g. occupied or stale),
    // find the first available valid position on the board
    if (!valid) {
      const validPositions = getValidPlacements(boardState);
      if (validPositions.length > 0) {
        finalPosition = validPositions[0];
        const recheck = isValidPlacement(finalPosition, boardState);
        valid = recheck.valid;
        adjacentCards = recheck.adjacentCards;
      }
    }

    if (!valid) return;

    // Open the connection modal directly
    setConnectionModal({
      isOpen: true,
      card,
      position: finalPosition,
      adjacentCards,
    });
  }, [user, boardState]);

  // Legacy handlers for multiplayer (keep for now)
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
    isChristConnection: boolean,
    jeevesJudgment?: string,
    jeevesScore?: number
  ) => {
    if (!connectionModal.card || !connectionModal.position) return;

    const key = positionKey(connectionModal.position);
    const adjacentCount = connectionModal.adjacentCards.length;
    const playerName = user?.email?.split("@")[0] || "Player";

    const score = jeevesScore ?? 6;
    const rejected = score < 5;

    // Calculate points — 0 if rejected
    let points = 0;
    if (!rejected) {
      points = adjacentCount === 1 ? 1 : adjacentCount === 2 ? 3 : adjacentCount === 3 ? 6 : 10;
      if (isChristConnection) points *= 2;
      // Scale points by Jeeves score: multiply by score/10
      points = Math.max(1, Math.round(points * (score / 10)));
    }

    const moveId = crypto.randomUUID();

    // Only place card on board if NOT rejected
    if (!rejected) {
      setBoardState(prev => ({
        ...prev,
        [key]: {
          card: connectionModal.card!,
          position: connectionModal.position!,
          playerId: user?.id || 'solo-player',
          playerName,
          connections,
          timestamp: new Date().toISOString(),
          moveId,
        }
      }));
    }

    // Determine if this was connecting to verse (first play) or previous insight
    const isFirstPlay = studyLogEntries.length === 0;
    const previousEntry = studyLogEntries.length > 0 ? studyLogEntries[studyLogEntries.length - 1] : undefined;

    // Create the new entry for the study log
    const newEntry: StudyLogEntry = {
      id: moveId,
      playerName,
      cardCode: connectionModal.card!.code,
      cardName: connectionModal.card!.name,
      explanation,
      isChristConnection,
      points,
      timestamp: new Date().toISOString(),
      jeevesJudgment,
      jeevesScore: score,
      rejected,
      connectingTo: isFirstPlay ? 'verse' : 'previous',
      previousPlayerName: previousEntry?.playerName,
      previousCardName: previousEntry?.cardName,
      previousExplanation: previousEntry?.explanation,
    };

    // Add to study log (even rejected ones, so players can learn)
    setStudyLogEntries(prev => [...prev, newEntry]);

    // Update score (0 if rejected)
    setScore(prev => prev + points);

    // Remove played card from hand
    setPlayerHand(prev => {
      const remaining = prev.filter(c => c.id !== connectionModal.card!.id);
      
      if (rejected) {
        // Rejected: card is lost AND player must draw a penalty card
        const playedCardIds = new Set([
          ...Object.values(boardState).map(p => p.card.id),
          ...remaining.map(c => c.id),
          connectionModal.card!.id,
        ]);
        const available = getAllScrabbleCards().filter(c => !playedCardIds.has(c.id));
        if (available.length > 0) {
          const penaltyCard = shuffleCards(available)[0];
          return [...remaining, penaltyCard];
        }
      }
      
      return remaining;
    });

    setSelectedCard(null);
    setConnectionModal({ isOpen: false, card: null, position: null, adjacentCards: [] });

    // Track Jeeves assist usage (Jeeves judged this play)
    if (!rejected) {
      setJeevesAssistsUsed(prev => prev + 1);
    }

    // Show Jeeves feedback panel with the new entry
    setLastPlacedEntry(newEntry);
    setShowFeedbackPanel(true);

    // Check win condition: hand is empty after removing this card
    const remainingHand = playerHand.filter(c => c.id !== connectionModal.card!.id);
    if (remainingHand.length === 0) {
      // Player emptied their hand - game complete!
      setTimeout(() => setGamePhase("completed"), 1500);
    }
  }, [connectionModal, user, studyLogEntries.length]);

  const handleNewGame = useCallback(() => {
    setGamePhase("verse-selection");
    setSeedVerse(null);
    setBoardState({});
    setPlayerHand([]);
    setScore(0);
    setSelectedCard(null);
    setStudyLogEntries([]);
    setShowFeedbackPanel(false);
    setLastPlacedEntry(null);
    setJeevesAssistsUsed(0);
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

  // Handle accepting a game invitation
  const handleAcceptInvitation = useCallback(async (invitation: GameInvitation) => {
    dismissInvitation();
    const success = await joinGame(invitation.roomCode);
    if (success) {
      setMultiplayerGameId(invitation.gameId);
      navigate(`/pt-scrabble?game=${invitation.gameId}`, { replace: true });
      setGamePhase("multiplayer-lobby");
    }
  }, [joinGame, dismissInvitation, navigate]);

  // Broadcast game invitation to all online users
  const handleBroadcastInvitation = useCallback(() => {
    if (!mpGame || !seedVerse) {
      // If no seed verse yet, use a default placeholder
      const defaultVerse = {
        reference: "John 3:16",
        text: "For God so loved the world...",
      };
      if (mpGame) {
        broadcastInvitation(mpGame.id, mpGame.roomCode, defaultVerse);
      }
    } else {
      broadcastInvitation(mpGame.id, mpGame.roomCode, {
        reference: seedVerse.reference,
        text: seedVerse.text.slice(0, 100) + (seedVerse.text.length > 100 ? '...' : ''),
      });
    }
  }, [mpGame, seedVerse, broadcastInvitation]);

  const mpAdjacentCards: PlacedCard[] = mpSelectedPosition && mpGame
    ? mpGetAdjacentCards(mpSelectedPosition)
    : [];

  const isHost = user?.id === mpGame?.hostUserId;
  const deckCount = mpGame?.deckRemaining?.length ?? 0;

  // Derive study log entries from multiplayer board state
  const mpStudyLogEntries = useMemo((): StudyLogEntry[] => {
    if (!mpGame?.boardState) return [];
    const sorted = Object.values(mpGame.boardState)
      .filter(placed => placed.moveId !== 'seed')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return sorted.map((placed, index) => {
      const prev = index > 0 ? sorted[index - 1] : undefined;
      // Use corrected explanation if available (spelling/grammar cleaned by Jeeves)
      const displayExplanation = (placed as any).correctedExplanation
        || placed.connections.map(c => c.explanation).join(' | ')
        || '';
      const prevExplanation = prev
        ? ((prev as any).correctedExplanation || prev.connections.map(c => c.explanation).join(' | ') || undefined)
        : undefined;
      return {
        id: placed.moveId,
        playerName: placed.playerName,
        cardCode: placed.card.code,
        cardName: placed.card.name,
        explanation: displayExplanation,
        isChristConnection: placed.connections.some(c => c.isChristConnection),
        points: placed.connections.length > 0
          ? (placed.connections.length === 1 ? 1 : placed.connections.length === 2 ? 3 : placed.connections.length === 3 ? 6 : 10)
            * (placed.connections.some(c => c.isChristConnection) ? 2 : 1)
          : 0,
        timestamp: placed.timestamp,
        jeevesJudgment: placed.jeevesAmplification,
        connectingTo: index === 0 ? 'verse' as const : 'previous' as const,
        previousPlayerName: prev?.playerName,
        previousCardName: prev?.card.name,
        previousExplanation: prevExplanation,
      };
    });
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

        {/* Game Invitation Notification */}
        <GameInvitationNotification
          invitation={activeInvitation}
          onAccept={handleAcceptInvitation}
          onDismiss={dismissInvitation}
        />

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
              <div className="flex w-full mb-6 rounded-lg bg-muted p-1">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-md bg-background text-foreground shadow-sm py-2 text-sm font-medium">
                  <Gamepad2 className="h-4 w-4" />
                  Play
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigate('/schedule')}
                >
                  <Calendar className="h-4 w-4" />
                  Schedule
                </button>
              </div>
              <div className="space-y-6">
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

                  {/* Online users indicator */}
                  {onlineCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm text-green-600 dark:text-green-400">
                        <strong>{onlineCount}</strong> {onlineCount === 1 ? 'player' : 'players'} online right now
                      </span>
                      <Users className="h-4 w-4 text-green-500" />
                    </motion.div>
                  )}

                  {/* Game mode buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                      size="lg"
                      onClick={startQuickPlay}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Quick Play
                    </Button>
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
                      {onlineCount > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500/20 rounded-full">
                          {onlineCount} online
                        </span>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-2">
                    <strong>Quick Play:</strong> Pick cards, cite a verse, explain the connection — fast rounds to {qpTargetScore} points
                  </p>

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


  // ========== QUICK PLAY WON VIEW ==========
  if (gamePhase === "quick-play-won") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-amber-500/50 text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl text-amber-300">Victory!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-amber-400">{qpScore} points</div>
                <p className="text-amber-200/80">You mastered the PT symbol chains!</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setGamePhase("menu")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Menu
                  </Button>
                  <Button onClick={startQuickPlay} variant="outline">
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
            <GameLeaderboard gameType="chain_war" currentScore={qpScore} />
          </div>
        </div>
      </div>
    );
  }

  // ========== QUICK PLAY VIEW ==========
  if (gamePhase === "quick-play") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" onClick={() => setGamePhase("menu")} className="text-white">
              <ArrowLeft className="mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-amber-400 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Quick Play
              </h1>
              <p className="text-amber-200/80">Build chains with PT symbols</p>
            </div>
            <div className="text-right">
              <div className="text-amber-400 text-3xl font-bold">{qpScore} / {qpTargetScore}</div>
              <div className="text-amber-200/60 text-sm">Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-300">
                  <LinkIcon className="w-5 h-5" />
                  Your Hand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {qpHand.map(symbol => (
                    <Button
                      key={symbol.code}
                      variant={qpSelectedCards.includes(symbol.code) ? "default" : "outline"}
                      onClick={() => toggleQpCard(symbol.code)}
                      className="h-20 flex-col gap-1"
                    >
                      <div className="text-2xl font-bold">{symbol.code}</div>
                      <div className="text-xs">{symbol.name}</div>
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select 2–3 cards to build your chain
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-amber-500/50">
              <CardHeader>
                <CardTitle className="text-amber-300">Build Your Chain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-amber-200 mb-2 block">Verse Reference</label>
                  <input
                    type="text"
                    value={qpVerse}
                    onChange={(e) => setQpVerse(e.target.value)}
                    placeholder="e.g., John 3:16"
                    className="w-full px-4 py-2 bg-black/60 border border-amber-500/30 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-amber-200 mb-2 block">
                    Explain how your {qpSelectedCards.length} card(s) connect
                  </label>
                  <Textarea
                    value={qpExplanation}
                    onChange={(e) => setQpExplanation(e.target.value)}
                    placeholder="Explain how these PT principles connect to your verse..."
                    className="bg-black/60 border-amber-500/30 text-white min-h-32"
                  />
                </div>
                <Button
                  onClick={handleQpSubmit}
                  disabled={qpIsSubmitting || qpSelectedCards.length < 2}
                  className="w-full gap-2"
                >
                  <Send className="w-4 h-4" />
                  {qpIsSubmitting ? "Validating..." : "Submit Chain"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="text-amber-300">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-100/80 space-y-2">
              <p>1. You get 5 PT symbol cards each round</p>
              <p>2. Select 2–3 cards that form a theological chain</p>
              <p>3. Provide a Bible verse that supports your chain</p>
              <p>4. Explain how the symbols connect to the verse</p>
              <p>5. Jeeves validates — reach {qpTargetScore} points to win!</p>
            </CardContent>
          </Card>
        </div>
        <FloatingGameChat gameType="quick-play" />
      </div>
    );
  }


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
          onStartGame={async () => { setGamePhase("multiplayer-verse-selection"); return true; }}
          onlineCount={onlineCount}
          isOnline={isOnline}
          onBroadcastInvitation={handleBroadcastInvitation}
        />
      );
    }

    // If game already started (non-host player joining late), show playing view
    // NOTE: This is for players who join AFTER the host started the game
    if (mpGame && mpGame.status === 'playing') {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Game in progress, joining...</p>
            <Button onClick={() => setGamePhase("multiplayer-playing")}>
              Join Game
            </Button>
          </div>
        </div>
      );
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
            onStartGame={async () => { setGamePhase("multiplayer-verse-selection"); return true; }}
            onlineCount={onlineCount}
            isOnline={isOnline}
          />
        </main>
      </div>
    );
  }

  // ========== MULTIPLAYER VERSE SELECTION VIEW ==========
  if (gamePhase === "multiplayer-verse-selection") {
    const handleMultiplayerVerseSelected = async (verse: SelectedVerse) => {
      setSeedVerse(verse);
      // Start the actual game — pass verse so it's saved to DB for all players
      const started = await startGame({ reference: verse.reference, text: verse.text });
      if (started) {
        setGamePhase("multiplayer-playing");
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Button onClick={() => setGamePhase("multiplayer-lobby")} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>

          {mpGame && (
            <div className="text-center mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Room Code: <span className="font-mono font-bold text-lg">{mpGame.roomCode}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {mpPlayers.length} {mpPlayers.length === 1 ? 'player' : 'players'} ready
              </p>
            </div>
          )}

          <VerseSelectionScreen
            onVerseSelected={handleMultiplayerVerseSelected}
            onBack={() => setGamePhase("multiplayer-lobby")}
          />
        </main>
      </div>
    );
  }

  // ========== MULTIPLAYER PLAYING VIEW ==========
  if (gamePhase === "multiplayer-playing") {
    // Check if any player reached 40 points → they win!
    const scoreWinner = mpPlayers.find(p => p.score >= 40);
    const emptyHandWinner = mpPlayers.find(p => p.hand.length === 0 && p.cardsPlayed > 0);
    
    // Game completed (by status, 40 points, or empty hand)
    if (mpGame?.status === 'completed' || scoreWinner || emptyHandWinner) {
      // Sort by score descending
      const sortedPlayers = [...mpPlayers].sort((a, b) => b.score - a.score);
      const winner = scoreWinner || emptyHandWinner || sortedPlayers[0];
      const totalMpScore = sortedPlayers.reduce((sum, p) => sum + p.score, 0);

      const mpSeedRef = mpGame?.seedVerse && typeof mpGame.seedVerse === 'object'
        ? (mpGame.seedVerse as any).reference || undefined
        : undefined;
      const mpSeedText = mpGame?.seedVerse && typeof mpGame.seedVerse === 'object'
        ? (mpGame.seedVerse as any).text || undefined
        : undefined;

      return (
        <div className="min-h-screen bg-background overflow-y-auto p-4">
          {/* Keep chat available so players can linger and talk */}
          {mpGame?.id && mpMyPlayer && (
            <InGameChat
              gameId={mpGame.id}
              playerName={mpMyPlayer.displayName}
            />
          )}
          {/* Auto-save personalized polish for every player */}
          <AutoSavePolishForPlayers
            players={sortedPlayers.map(p => ({
              userId: p.userId,
              displayName: p.displayName,
              score: p.score,
              cardsPlayed: p.cardsPlayed,
            }))}
            entries={mpStudyLogEntries}
            seedVerseRef={mpSeedRef}
            seedVerseText={mpSeedText}
            winnerName={winner?.displayName || ''}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <h1 className="text-3xl font-bold">
                {scoreWinner ? `${winner?.displayName} reached 40 points!` : emptyHandWinner ? `${winner?.displayName} emptied their hand!` : 'Game Over!'}
              </h1>
              <div className="space-y-2">
                <p className="text-xl">
                  🏆 Winner: <span className="font-bold text-yellow-500">{winner?.displayName}</span>
                </p>
                <p className="text-2xl font-bold">{winner?.score} points</p>
                <p className="text-sm text-muted-foreground">
                  {scoreWinner ? 'First to 40 points!' : emptyHandWinner ? 'Played all their cards!' : 'Final standings'}
                </p>
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
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{player.hand.length} cards left</span>
                      <span className="font-bold">{player.score} pts</span>
                    </span>
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
              onSave={async (transcript) => {
                if (!user) {
                  toast.error("Please sign in to save studies");
                  return;
                }
                try {
                  const { error } = await supabase
                    .from("user_studies")
                    .insert({
                      user_id: user.id,
                      title: `Scrabble PT Multiplayer: ${mpPlayers.length} Players`,
                      content: transcript,
                      tags: ["scrabble-pt", "multiplayer"],
                    });
                  if (error) throw error;
                  toast.success("Saved to My Studies!", {
                    action: {
                      label: "View",
                      onClick: () => navigate("/my-studies"),
                    },
                  });
                } catch (err) {
                  console.error("Error saving study:", err);
                  toast.error("Failed to save. Please try again.");
                }
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
      // Use seedVerse from state OR fallback to normalized mpGame.seedVerse
      const activeSeedVerse: SelectedVerse | null = seedVerse || (
        mpGame.seedVerse && typeof mpGame.seedVerse === 'object'
          ? {
              reference: typeof (mpGame.seedVerse as any).reference === 'string' ? (mpGame.seedVerse as any).reference : '',
              text: typeof (mpGame.seedVerse as any).text === 'string' ? (mpGame.seedVerse as any).text : '',
              book: '',
              chapter: 0,
              verseStart: 0,
            }
          : null
      );

      return (
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Study Log Sidebar - shows all player submissions */}
          <StudyLog entries={mpStudyLogEntries} />

          {/* In-Game Chat - right sidebar */}
          {mpGame.id && mpMyPlayer && (
            <InGameChat
              gameId={mpGame.id}
              playerName={mpMyPlayer.displayName}
            />
          )}

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

            {/* 20-minute game timer */}
            <GameTimer
              durationMinutes={20}
              onTimeUp={async () => {
                if (mpGame?.id) {
                  toast.info('⏰ Time is up! Ending the game...');
                  await supabase.from('pt_scrabble_games').update({ status: 'completed' }).eq('id', mpGame.id);
                }
              }}
            />

            {/* End Game button */}
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (mpGame?.id) {
                  await supabase.from('pt_scrabble_games').update({ status: 'completed' }).eq('id', mpGame.id);
                }
              }}
              disabled={mpStudyLogEntries.length === 0}
            >
              End Game
            </Button>

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
                  <span className="text-muted-foreground">🃏{player.hand.length}</span>
                  <span className="text-yellow-500">{player.score}</span>
                </div>
              ))}
              {mpPlayers.length > 3 && (
                <span className="text-xs text-muted-foreground">+{mpPlayers.length - 3}</span>
              )}
            </div>
          </header>


          {/* Study progress - collapsed by default, expandable */}
          {mpStudyLogEntries.length > 0 && (
            <div className="px-3">
              <StudyProgressPanel entries={mpStudyLogEntries} seedVerse={activeSeedVerse} />
            </div>
          )}

          {/* Game board */}
          <div className="flex-1 min-h-0 pb-40">
            <ScrabbleBoard
              boardState={mpGame.boardState}
              selectedCard={mpSelectedCard}
              onPositionClick={handleMpPositionClick}
              validPositions={mpSelectedCard ? getValidPositions() : []}
              verseReference={activeSeedVerse?.reference}
              verseText={activeSeedVerse?.text}
            />
          </div>

          {/* Player hand - NEVER disabled, can always select cards */}
          <PlayerHandBar
            cards={mpMyHand}
            selectedCard={mpSelectedCard}
            onCardSelect={handleMpCardSelect}
            onRefresh={mpRefreshHand}
            disabled={false}
            score={mpMyPlayer?.score || 0}
            verseReference={activeSeedVerse?.reference}
          />

          {/* Bible Study Connection modal — with Jeeves scoring */}
          {showMpConnectionModal && mpSelectedCard && mpSelectedPosition && activeSeedVerse && (
            <BibleStudyConnectionModal
              isOpen={showMpConnectionModal}
              onClose={() => {
                setShowMpConnectionModal(false);
                setMpSelectedPosition(null);
              }}
              onSubmit={(connections, explanation, isChristConnection, jeevesJudgment, jeevesScore) => {
                handleMpConnectionSubmit(connections, explanation, isChristConnection);
                // Track Jeeves assist usage
                if (jeevesJudgment) {
                  setJeevesAssistsUsed(prev => prev + 1);
                }
                // Show Jeeves feedback in multiplayer too
                if (jeevesJudgment) {
                  const entry: StudyLogEntry = {
                    id: crypto.randomUUID(),
                    playerName: mpMyPlayer?.displayName || 'Player',
                    cardCode: mpSelectedCard.code,
                    cardName: mpSelectedCard.name,
                    explanation,
                    isChristConnection,
                    points: 0,
                    timestamp: new Date().toISOString(),
                    jeevesJudgment,
                    jeevesScore: jeevesScore ?? 6,
                    rejected: (jeevesScore ?? 6) < 5,
                    connectingTo: mpStudyLogEntries.length === 0 ? 'verse' : 'previous',
                  };
                  setLastPlacedEntry(entry);
                  setShowFeedbackPanel(true);
                }
              }}
              card={mpSelectedCard}
              position={mpSelectedPosition}
              adjacentCards={mpAdjacentCards}
              seedVerse={activeSeedVerse}
              previousEntry={mpStudyLogEntries.length > 0 ? mpStudyLogEntries[mpStudyLogEntries.length - 1] : undefined}
              jeevesAssistsUsed={jeevesAssistsUsed}
              maxJeevesAssists={MAX_JEEVES_ASSISTS}
            />
          )}

          {/* Non-blocking voting panel */}
          <VotingPanel
            pendingMoves={pendingMoves}
            players={mpPlayers}
            currentPlayerId={mpMyPlayer?.id}
            myVotes={myVotes}
            onVote={handleMpVote}
          />

          {/* Jeeves Feedback Panel for multiplayer */}
          <JeevesFeedbackPanel
            entry={lastPlacedEntry}
            seedVerse={activeSeedVerse}
            onDismiss={() => {
              setShowFeedbackPanel(false);
              setLastPlacedEntry(null);
            }}
            isVisible={showFeedbackPanel}
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
              <h1 className="text-3xl font-bold">
                {playerHand.length === 0 ? '🎉 You emptied your hand!' : 'Study Complete!'}
              </h1>
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
              onSave={async (transcript) => {
                if (!user) {
                  toast.error("Please sign in to save studies");
                  return;
                }
                try {
                  const { error } = await supabase
                    .from("user_studies")
                    .insert({
                      user_id: user.id,
                      title: `Scrabble PT: ${seedVerse?.reference || "Study Session"}`,
                      content: transcript,
                      tags: ["scrabble-pt", seedVerse?.reference?.split(" ")[0]?.toLowerCase()].filter(Boolean),
                    });
                  if (error) throw error;
                  toast.success("Saved to My Studies!", {
                    action: {
                      label: "View",
                      onClick: () => navigate("/my-studies"),
                    },
                  });
                } catch (err) {
                  console.error("Error saving study:", err);
                  toast.error("Failed to save. Please try again.");
                }
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
          <SeedVerseDisplay verse={seedVerse} compact />
        )}

        {/* Study Progress - collapsed by default */}
        {studyLogEntries.length > 0 && (
          <StudyProgressPanel entries={studyLogEntries} seedVerse={seedVerse} />
        )}

        {/* Main game area - click cards to view details */}
        <div className="flex-1 min-h-[350px] border rounded-lg overflow-hidden">
          <ScrabbleBoard
            boardState={boardState}
            onCardClick={(placedCard) => setViewingCard(placedCard)}
            verseReference={seedVerse?.reference}
            verseText={seedVerse?.text}
            className="h-full"
          />
        </div>
      </main>

      {/* Spatial Hand Display - cards show their destination positions */}
      <SpatialHandDisplay
        cards={cardsWithPositions}
        onCardSelect={handleDirectPlacement}
        onRefresh={handleRefreshHand}
        score={score}
        verseReference={seedVerse?.reference}
      />

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
          previousEntry={studyLogEntries.length > 0 ? studyLogEntries[studyLogEntries.length - 1] : undefined}
          jeevesAssistsUsed={jeevesAssistsUsed}
          maxJeevesAssists={MAX_JEEVES_ASSISTS}
        />
      )}

      {/* Placed Card Detail Modal */}
      <PlacedCardDetailModal
        isOpen={viewingCard !== null}
        onClose={() => setViewingCard(null)}
        placedCard={viewingCard}
        isSeedCard={viewingCard?.moveId === 'seed'}
        seedVerseText={seedVerse?.text}
      />

      {/* Jeeves Feedback Panel - shows after card placement */}
      <JeevesFeedbackPanel
        entry={lastPlacedEntry}
        seedVerse={seedVerse}
        onDismiss={() => {
          setShowFeedbackPanel(false);
          setLastPlacedEntry(null);
        }}
        isVisible={showFeedbackPanel}
      />
    </div>
  );
}
