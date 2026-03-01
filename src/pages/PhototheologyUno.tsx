import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useUnoMultiplayer } from "@/hooks/useUnoMultiplayer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shuffle, Check, X, RefreshCw, Zap, Users,
  HelpCircle, Trophy, Clock, Loader2, BookOpen, Sparkles,
  RotateCcw, Target, Shield, HandHelping, Copy, UserPlus,
  Monitor, Wifi, Share2, Eye, EyeOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Connection Card types
interface ConnectionCard {
  id: string;
  reference: string;
  title: string;
  category: "narrative" | "prophecy" | "wisdom" | "psalm" | "gospel" | "epistle" | "apocalyptic";
  isSpecial?: boolean;
  specialType?: "newAnchor" | "challenge" | "deepDive" | "assist";
}

// Anchor Card types
interface AnchorCard {
  id: string;
  reference: string;
  title: string;
  text: string;
  themes: string[];
}

// Connection type categories
type ConnectionType = "typological" | "thematic" | "contrast" | "parallel" | "interpretive" | "ethical";

interface ConnectionOption {
  label: string;
  description: string;
  type: ConnectionType;
}

interface LocalPlayer {
  id: string;
  name: string;
  hand: ConnectionCard[];
  score: number;
  isAI: boolean;
  color: string;
}

interface GameState {
  mode: "classic" | "easy";
  playMode: "solo" | "local" | "online";
  currentPlayer: number;
  players: LocalPlayer[];
  anchorCard: AnchorCard | null;
  anchorDeck: AnchorCard[];
  connectionDeck: ConnectionCard[];
  discardPile: ConnectionCard[];
  roundsWon: number[];
  gamePhase: "setup" | "playing" | "evaluating" | "roundEnd" | "gameEnd" | "playerTurn" | "waitingForPlayer";
  turnPhase: "selectCard" | "makeConnection" | "awaitRuling";
  selectedCard: ConnectionCard | null;
  connectionText: string;
  easyModeOptions: ConnectionOption[];
  selectedOption: string;
  jeevesRuling: { approved: boolean; reasoning: string } | null;
  roomCode?: string;
  showCurrentHand: boolean;
}

// Player colors for local multiplayer
const PLAYER_COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

// Sample Anchor Cards
const ANCHOR_CARDS: AnchorCard[] = [
  {
    id: "a1",
    reference: "Luke 15:11-32",
    title: "The Parable of the Prodigal Son",
    text: "A father welcomes back his wayward son with open arms, much to the dismay of the elder brother who never left.",
    themes: ["redemption", "forgiveness", "grace", "jealousy", "reconciliation"]
  },
  {
    id: "a2",
    reference: "Genesis 22:1-14",
    title: "The Binding of Isaac",
    text: "Abraham prepares to sacrifice his only son Isaac on Mount Moriah, but God provides a ram as substitute.",
    themes: ["faith", "sacrifice", "provision", "obedience", "typology"]
  },
  {
    id: "a3",
    reference: "Daniel 3:1-30",
    title: "The Fiery Furnace",
    text: "Shadrach, Meshach, and Abednego refuse to bow to Nebuchadnezzar's golden image and are thrown into the fire.",
    themes: ["faithfulness", "persecution", "deliverance", "worship", "courage"]
  },
  {
    id: "a4",
    reference: "John 4:1-42",
    title: "The Woman at the Well",
    text: "Jesus speaks with a Samaritan woman about living water and reveals Himself as the Messiah.",
    themes: ["salvation", "evangelism", "breaking barriers", "living water", "worship"]
  },
  {
    id: "a5",
    reference: "Exodus 14:1-31",
    title: "Crossing the Red Sea",
    text: "Moses stretches out his hand and God parts the Red Sea, allowing Israel to escape from Egypt.",
    themes: ["deliverance", "faith", "baptism", "judgment", "salvation"]
  },
  {
    id: "a6",
    reference: "Matthew 14:22-33",
    title: "Walking on Water",
    text: "Jesus walks on the Sea of Galilee and invites Peter to come to Him on the water.",
    themes: ["faith", "fear", "trust", "divine power", "doubt"]
  },
  {
    id: "a7",
    reference: "1 Kings 18:20-40",
    title: "Elijah on Mount Carmel",
    text: "Elijah challenges the prophets of Baal to a contest to prove who is the true God.",
    themes: ["true worship", "faith", "confrontation", "divine fire", "revival"]
  },
  {
    id: "a8",
    reference: "Ruth 1-4",
    title: "The Story of Ruth",
    text: "Ruth the Moabitess pledges loyalty to Naomi and her God, eventually becoming an ancestor of David and Jesus.",
    themes: ["loyalty", "redemption", "providence", "inclusion", "kinsman redeemer"]
  },
  {
    id: "a9",
    reference: "John 11:1-44",
    title: "The Raising of Lazarus",
    text: "Jesus raises His friend Lazarus from the dead after four days in the tomb.",
    themes: ["resurrection", "glory of God", "faith", "tears", "power over death"]
  },
  {
    id: "a10",
    reference: "Acts 9:1-19",
    title: "The Conversion of Saul",
    text: "Saul, persecutor of Christians, encounters the risen Christ on the road to Damascus and is transformed.",
    themes: ["conversion", "grace", "calling", "transformation", "forgiveness"]
  }
];

// Sample Connection Cards
const CONNECTION_CARDS: ConnectionCard[] = [
  { id: "c1", reference: "Genesis 3:15", title: "The Protoevangelium", category: "prophecy" },
  { id: "c2", reference: "Isaiah 53:3-7", title: "The Suffering Servant", category: "prophecy" },
  { id: "c3", reference: "Psalm 23", title: "The Lord is My Shepherd", category: "psalm" },
  { id: "c4", reference: "Psalm 22", title: "My God, Why Have You Forsaken Me?", category: "psalm" },
  { id: "c5", reference: "Jonah 1:17", title: "Three Days in the Fish", category: "narrative" },
  { id: "c6", reference: "Ruth 1:16-17", title: "Ruth's Pledge to Naomi", category: "narrative" },
  { id: "c7", reference: "Daniel 3:16-18", title: "The Fiery Furnace Defiance", category: "narrative" },
  { id: "c8", reference: "John 11:35", title: "Jesus Wept", category: "gospel" },
  { id: "c9", reference: "Romans 8:28", title: "All Things Work Together", category: "epistle" },
  { id: "c10", reference: "Matthew 14:22-33", title: "Walking on Water", category: "gospel" },
  { id: "c11", reference: "Revelation 21:1-4", title: "New Heaven and New Earth", category: "apocalyptic" },
  { id: "c12", reference: "Proverbs 3:5-6", title: "Trust in the Lord", category: "wisdom" },
  { id: "c13", reference: "Hebrews 11:1", title: "Faith Defined", category: "epistle" },
  { id: "c14", reference: "John 3:16", title: "For God So Loved", category: "gospel" },
  { id: "c15", reference: "Genesis 45:1-15", title: "Joseph Reveals Himself", category: "narrative" },
  { id: "c16", reference: "Hosea 3:1-3", title: "Hosea Redeems Gomer", category: "prophecy" },
  { id: "c17", reference: "Jonah 4:1-4", title: "Jonah's Anger", category: "narrative" },
  { id: "c18", reference: "1 Samuel 17", title: "David and Goliath", category: "narrative" },
  { id: "c19", reference: "Matthew 26:36-46", title: "Gethsemane", category: "gospel" },
  { id: "c20", reference: "Acts 2:1-13", title: "Pentecost", category: "narrative" },
  { id: "c21", reference: "1 Corinthians 13:4-7", title: "Love Is...", category: "epistle" },
  { id: "c22", reference: "Philippians 4:13", title: "I Can Do All Things", category: "epistle" },
  { id: "c23", reference: "Isaiah 40:31", title: "Mount Up with Wings", category: "prophecy" },
  { id: "c24", reference: "Jeremiah 29:11", title: "Plans to Prosper", category: "prophecy" },
  { id: "c25", reference: "Micah 6:8", title: "What Does the Lord Require?", category: "prophecy" },
  { id: "c26", reference: "Ecclesiastes 3:1-8", title: "A Time for Everything", category: "wisdom" },
  { id: "c27", reference: "James 1:2-4", title: "Count It All Joy", category: "epistle" },
  { id: "c28", reference: "2 Timothy 1:7", title: "Spirit of Power", category: "epistle" },
  { id: "c29", reference: "Joshua 1:9", title: "Be Strong and Courageous", category: "narrative" },
  { id: "c30", reference: "Esther 4:14", title: "For Such a Time", category: "narrative" },
  // Special Cards
  { id: "s1", reference: "Special Card", title: "New Anchor", category: "narrative", isSpecial: true, specialType: "newAnchor" },
  { id: "s2", reference: "Special Card", title: "Challenge", category: "narrative", isSpecial: true, specialType: "challenge" },
  { id: "s3", reference: "Special Card", title: "Deep Dive", category: "narrative", isSpecial: true, specialType: "deepDive" },
  { id: "s4", reference: "Special Card", title: "Assist", category: "narrative", isSpecial: true, specialType: "assist" },
];

const PhototheologyUno = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const multiplayer = useUnoMultiplayer();

  const [gameState, setGameState] = useState<GameState>({
    mode: "easy",
    playMode: "solo",
    currentPlayer: 0,
    players: [],
    anchorCard: null,
    anchorDeck: [],
    connectionDeck: [],
    discardPile: [],
    roundsWon: [0, 0],
    gamePhase: "setup",
    turnPhase: "selectCard",
    selectedCard: null,
    connectionText: "",
    easyModeOptions: [],
    selectedOption: "",
    jeevesRuling: null,
    showCurrentHand: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [localPlayerNames, setLocalPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showPassDeviceAlert, setShowPassDeviceAlert] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [onlineTab, setOnlineTab] = useState<"create" | "join">("create");

  // Auto-join from URL params (e.g. ?room=ABCDEF)
  useEffect(() => {
    const roomParam = searchParams.get("room");
    if (roomParam && user) {
      setGameState(prev => ({ ...prev, playMode: "online" }));
      setJoinCode(roomParam);
      setOnlineTab("join");
    }
  }, [searchParams, user]);

  // Generate room code for online play
  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  const startGame = (mode: "classic" | "easy", playMode: "solo" | "local" | "online", numPlayers: number) => {
    const shuffledAnchors = shuffleArray(ANCHOR_CARDS);
    const shuffledConnections = shuffleArray(CONNECTION_CARDS);

    // Deal 7 cards to each player
    const players: LocalPlayer[] = [];
    let deckIndex = 0;

    for (let i = 0; i < numPlayers; i++) {
      const hand = shuffledConnections.slice(deckIndex, deckIndex + 7);
      deckIndex += 7;

      if (playMode === "solo") {
        // Solo mode: Player 1 is human, rest are AI
        players.push({
          id: i === 0 ? (user?.id || `player-${i}`) : `ai-${i}`,
          name: i === 0 ? (user?.email?.split("@")[0] || "You") : `AI ${i}`,
          hand,
          score: 0,
          isAI: i !== 0,
          color: PLAYER_COLORS[i],
        });
      } else if (playMode === "local") {
        // Local mode: All players are human, taking turns on same device
        const playerName = localPlayerNames[i] || `Player ${i + 1}`;
        players.push({
          id: `local-${i}`,
          name: playerName,
          hand,
          score: 0,
          isAI: false,
          color: PLAYER_COLORS[i],
        });
      } else {
        // Online mode (future implementation)
        players.push({
          id: i === 0 ? (user?.id || `player-${i}`) : `online-${i}`,
          name: i === 0 ? (user?.email?.split("@")[0] || "You") : `Waiting...`,
          hand,
          score: 0,
          isAI: false,
          color: PLAYER_COLORS[i],
        });
      }
    }

    const roomCode = playMode === "online" ? generateRoomCode() : undefined;

    setGameState({
      mode,
      playMode,
      currentPlayer: 0,
      players,
      anchorCard: shuffledAnchors[0],
      anchorDeck: shuffledAnchors.slice(1),
      connectionDeck: shuffledConnections.slice(deckIndex),
      discardPile: [],
      roundsWon: Array(numPlayers).fill(0),
      gamePhase: playMode === "local" ? "playerTurn" : "playing",
      turnPhase: "selectCard",
      selectedCard: null,
      connectionText: "",
      easyModeOptions: [],
      selectedOption: "",
      jeevesRuling: null,
      roomCode,
      showCurrentHand: playMode !== "local", // Hide hand initially for local multiplayer
    });

    if (playMode === "local") {
      // Show whose turn it is
      setNextPlayerName(players[0].name);
      setShowPassDeviceAlert(true);
    }

    toast({
      title: t('games.uno.modeStarted', { mode: mode === "classic" ? t('games.uno.classicMode') : t('games.uno.easyMode') }),
      description: playMode === "local"
        ? t('games.uno.localPlayersDesc', { count: numPlayers })
        : playMode === "online"
        ? t('games.uno.onlinePlayersDesc', { code: roomCode })
        : t('games.uno.soloPlayersDesc', { count: numPlayers }),
    });
  };

  // Handle local player turn start
  const startPlayerTurn = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: "playing",
      showCurrentHand: true,
    }));
    setShowPassDeviceAlert(false);
  };

  // Select a card from hand
  const selectCard = async (card: ConnectionCard) => {
    if (gameState.turnPhase !== "selectCard") return;

    setGameState(prev => ({
      ...prev,
      selectedCard: card,
      turnPhase: "makeConnection",
    }));

    // If Easy Mode, generate options from Jeeves
    if (gameState.mode === "easy" && !card.isSpecial) {
      await generateEasyModeOptions(card);
    }
  };

  // Generate Easy Mode connection options
  const generateEasyModeOptions = async (card: ConnectionCard) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          question: `Generate 3 connection options for Phototheology Uno. The Anchor Card is "${gameState.anchorCard?.title}" (${gameState.anchorCard?.reference}): "${gameState.anchorCard?.text}". The player's card is "${card.title}" (${card.reference}).

Generate 3 valid theological connections (typological, thematic, contrast, parallel, interpretive, or ethical). Each should be substantive and biblically sound.

Return ONLY valid JSON in this exact format:
{"options": [
  {"label": "A", "description": "connection description here", "type": "typological"},
  {"label": "B", "description": "connection description here", "type": "thematic"},
  {"label": "C", "description": "connection description here", "type": "parallel"}
]}

Keep descriptions under 100 characters each. Focus on meaningful theological connections, not surface-level matches.`,
          mode: "connection_options",
          context: "phototheology_uno"
        }
      });

      if (error) throw error;

      // Parse the response
      let options: ConnectionOption[] = [];
      try {
        const parsed = JSON.parse(data.response);
        options = parsed.options || [];
      } catch {
        // Fallback options if parsing fails
        options = [
          { label: "A", description: "Both reveal God's redemptive love through sacrifice", type: "thematic" },
          { label: "B", description: "Parallel narrative structures showing divine intervention", type: "parallel" },
          { label: "C", description: "Typological connection pointing to Christ's work", type: "typological" }
        ];
      }

      setGameState(prev => ({
        ...prev,
        easyModeOptions: options,
      }));
    } catch (err) {
      console.error("Error generating options:", err);
      // Use fallback options
      setGameState(prev => ({
        ...prev,
        easyModeOptions: [
          { label: "A", description: "Both reveal God's redemptive love", type: "thematic" },
          { label: "B", description: "Similar narrative of faith tested", type: "parallel" },
          { label: "C", description: "Foreshadowing of Christ's sacrifice", type: "typological" }
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Submit connection for evaluation
  const submitConnection = async () => {
    if (!gameState.selectedCard || !gameState.anchorCard) return;

    setIsLoading(true);
    setGameState(prev => ({ ...prev, turnPhase: "awaitRuling" }));

    const connectionExplanation = gameState.mode === "classic"
      ? gameState.connectionText
      : gameState.selectedOption === "D"
        ? gameState.connectionText
        : gameState.easyModeOptions.find(o => o.label === gameState.selectedOption)?.description || "";

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          question: `You are the referee for Phototheology Uno. Evaluate this biblical connection.

ANCHOR CARD: "${gameState.anchorCard.title}" (${gameState.anchorCard.reference})
Description: ${gameState.anchorCard.text}
Themes: ${gameState.anchorCard.themes.join(", ")}

PLAYER'S CARD: "${gameState.selectedCard.title}" (${gameState.selectedCard.reference})

PLAYER'S CONNECTION: "${connectionExplanation}"

CONNECTION STANDARDS (What makes a valid connection):
- Typological: OT foreshadowing NT fulfillment
- Thematic: Shared theological themes
- Contrast: Meaningful opposition that illuminates truth
- Parallel: Similar narrative structures
- Interpretive: One passage explains another
- Ethical: Shared moral teaching

WEAK CONNECTIONS TO DENY:
- Surface-level word matches ("Both mention 'water'")
- Forced or contrived links
- Historically/theologically inaccurate
- Vague spiritual platitudes

Return ONLY valid JSON:
{"approved": true/false, "reasoning": "Brief explanation (under 150 chars)", "connectionType": "typological/thematic/contrast/parallel/interpretive/ethical", "strength": "weak/moderate/strong/exceptional"}`,
          mode: "evaluate_connection",
          context: "phototheology_uno"
        }
      });

      if (error) throw error;

      let ruling = { approved: false, reasoning: "Could not evaluate connection." };
      try {
        const parsed = JSON.parse(data.response);
        ruling = {
          approved: parsed.approved === true,
          reasoning: parsed.reasoning || "Connection evaluated."
        };
      } catch {
        // If parsing fails, give benefit of doubt for reasonable attempts
        ruling = {
          approved: connectionExplanation.length > 20,
          reasoning: connectionExplanation.length > 20
            ? "Connection accepted based on theological effort."
            : "Connection too brief to evaluate."
        };
      }

      setGameState(prev => ({
        ...prev,
        jeevesRuling: ruling,
        gamePhase: "evaluating",
      }));

    } catch (err) {
      console.error("Error evaluating connection:", err);
      // Default to approved if Jeeves fails
      setGameState(prev => ({
        ...prev,
        jeevesRuling: {
          approved: true,
          reasoning: "Connection accepted. (AI unavailable)"
        },
        gamePhase: "evaluating",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Process ruling and continue game
  const processRuling = () => {
    if (!gameState.jeevesRuling || !gameState.selectedCard) return;

    setGameState(prev => {
      const newState = { ...prev };
      const currentPlayer = newState.players[newState.currentPlayer];

      if (prev.jeevesRuling?.approved) {
        // Remove card from hand and add to discard
        currentPlayer.hand = currentPlayer.hand.filter(c => c.id !== prev.selectedCard?.id);
        if (prev.selectedCard) {
          newState.discardPile = [...newState.discardPile, prev.selectedCard];
        }
        currentPlayer.score += 10;

        // Check for win
        if (currentPlayer.hand.length === 0) {
          toast({
            title: "Sola Scriptura!",
            description: `${currentPlayer.name} wins the round!`,
          });
          newState.roundsWon[newState.currentPlayer]++;

          if (newState.roundsWon[newState.currentPlayer] >= 3) {
            newState.gamePhase = "gameEnd";
          } else {
            newState.gamePhase = "roundEnd";
          }
          return newState;
        }
      } else {
        // Draw a card
        if (newState.connectionDeck.length > 0) {
          currentPlayer.hand.push(newState.connectionDeck[0]);
          newState.connectionDeck = newState.connectionDeck.slice(1);
        }
      }

      // Move to next player
      newState.currentPlayer = (newState.currentPlayer + 1) % newState.players.length;
      newState.selectedCard = null;
      newState.connectionText = "";
      newState.easyModeOptions = [];
      newState.selectedOption = "";
      newState.jeevesRuling = null;
      newState.turnPhase = "selectCard";

      // Handle different play modes
      if (newState.playMode === "local") {
        // Local multiplayer: Show pass device alert
        newState.gamePhase = "playerTurn";
        newState.showCurrentHand = false;
        setNextPlayerName(newState.players[newState.currentPlayer].name);
        setTimeout(() => setShowPassDeviceAlert(true), 300);
      } else if (newState.playMode === "solo") {
        newState.gamePhase = "playing";
        // AI turn
        if (newState.players[newState.currentPlayer].isAI && newState.gamePhase === "playing") {
          setTimeout(() => simulateAITurn(), 1500);
        }
      } else {
        newState.gamePhase = "playing";
      }

      return newState;
    });
  };

  // Simulate AI player turn
  const simulateAITurn = () => {
    setGameState(prev => {
      const newState = { ...prev };
      const aiPlayer = newState.players[newState.currentPlayer];

      if (aiPlayer.hand.length === 0) {
        // AI wins
        toast({ title: t('games.uno.aiWins'), description: t('games.uno.emptiedHand', { name: aiPlayer.name }) });
        newState.gamePhase = "roundEnd";
        return newState;
      }

      // AI randomly plays a card (70% chance of success)
      const randomCard = aiPlayer.hand[Math.floor(Math.random() * aiPlayer.hand.length)];
      const aiSuccess = Math.random() > 0.3;

      if (aiSuccess) {
        aiPlayer.hand = aiPlayer.hand.filter(c => c.id !== randomCard.id);
        newState.discardPile.push(randomCard);
        aiPlayer.score += 10;
        toast({
          title: `${aiPlayer.name} played!`,
          description: `Connected ${randomCard.title} - Approved!`,
        });

        if (aiPlayer.hand.length === 0) {
          newState.roundsWon[newState.currentPlayer]++;
          if (newState.roundsWon[newState.currentPlayer] >= 3) {
            newState.gamePhase = "gameEnd";
          } else {
            newState.gamePhase = "roundEnd";
          }
          return newState;
        }
      } else {
        if (newState.connectionDeck.length > 0) {
          aiPlayer.hand.push(newState.connectionDeck[0]);
          newState.connectionDeck = newState.connectionDeck.slice(1);
        }
        toast({
          title: `${aiPlayer.name}'s connection denied`,
          description: "Drew a card!",
          variant: "destructive",
        });
      }

      // Move to next player
      newState.currentPlayer = (newState.currentPlayer + 1) % newState.players.length;

      // If next player is also AI, continue
      if (newState.players[newState.currentPlayer].isAI && newState.gamePhase === "playing") {
        setTimeout(() => simulateAITurn(), 1500);
      }

      return newState;
    });
  };

  // Handle special cards
  const playSpecialCard = (card: ConnectionCard) => {
    if (!card.isSpecial) return;

    switch (card.specialType) {
      case "newAnchor":
        if (gameState.anchorDeck.length > 0) {
          setGameState(prev => ({
            ...prev,
            anchorCard: prev.anchorDeck[0],
            anchorDeck: prev.anchorDeck.slice(1),
            players: prev.players.map((p, i) =>
              i === prev.currentPlayer
                ? { ...p, hand: p.hand.filter(c => c.id !== card.id) }
                : p
            ),
            discardPile: [...prev.discardPile, card],
          }));
          toast({ title: t('games.uno.newAnchor'), description: t('games.uno.newAnchorDesc') });
        }
        break;
    }
  };

  // Start new round
  const startNewRound = () => {
    const shuffledConnections = shuffleArray(CONNECTION_CARDS);
    const shuffledAnchors = shuffleArray(gameState.anchorDeck.length > 0 ? gameState.anchorDeck : ANCHOR_CARDS);

    let deckIndex = 0;
    const updatedPlayers = gameState.players.map(p => ({
      ...p,
      hand: shuffledConnections.slice(deckIndex, deckIndex += 7)
    }));

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      anchorCard: shuffledAnchors[0],
      anchorDeck: shuffledAnchors.slice(1),
      connectionDeck: shuffledConnections.slice(deckIndex),
      discardPile: [],
      gamePhase: prev.playMode === "local" ? "playerTurn" : "playing",
      turnPhase: "selectCard",
      selectedCard: null,
      connectionText: "",
      easyModeOptions: [],
      selectedOption: "",
      jeevesRuling: null,
      currentPlayer: 0,
      showCurrentHand: prev.playMode !== "local",
    }));

    if (gameState.playMode === "local") {
      setNextPlayerName(gameState.players[0].name);
      setShowPassDeviceAlert(true);
    }
  };

  // Send invite
  const sendInvite = async () => {
    if (!inviteEmail || !gameState.roomCode) return;

    try {
      const { data, error } = await supabase.functions.invoke('send-game-invite', {
        body: {
          recipientEmail: inviteEmail,
          gameType: 'uno',
          gameName: 'Phototheology UNO',
          inviteLink: `${window.location.origin}/games/phototheology-uno?room=${gameState.roomCode || multiplayer.game?.room_code}`,
          roomCode: gameState.roomCode || multiplayer.game?.room_code,
        }
      });
      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to send invite');
      }
      toast({
        title: t('games.uno.inviteSent'),
        description: t('games.uno.inviteSentDesc', { email: inviteEmail, code: gameState.roomCode }),
      });
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('games.uno.failedToSendInvite'),
        variant: "destructive",
      });
    }
  };

  // Copy room code
  const copyRoomCode = () => {
    if (gameState.roomCode) {
      navigator.clipboard.writeText(gameState.roomCode);
      toast({
        title: t('common.copied'),
        description: t('games.uno.roomCodeCopied'),
      });
    }
  };

  // Get card category color
  const getCategoryColor = (category: ConnectionCard["category"]) => {
    switch (category) {
      case "narrative": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "prophecy": return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      case "wisdom": return "bg-amber-500/20 text-amber-600 border-amber-500/30";
      case "psalm": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "gospel": return "bg-red-500/20 text-red-600 border-red-500/30";
      case "epistle": return "bg-cyan-500/20 text-cyan-600 border-cyan-500/30";
      case "apocalyptic": return "bg-pink-500/20 text-pink-600 border-pink-500/30";
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  const getSpecialCardIcon = (type?: string) => {
    switch (type) {
      case "newAnchor": return <RotateCcw className="h-4 w-4" />;
      case "challenge": return <Target className="h-4 w-4" />;
      case "deepDive": return <Zap className="h-4 w-4" />;
      case "assist": return <HandHelping className="h-4 w-4" />;
      default: return null;
    }
  };

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const isCurrentPlayersTurn = gameState.playMode === "solo"
    ? gameState.currentPlayer === 0
    : true;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>{t('games.pleaseSignIn')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('games.backToGames')}
          </Button>
          <div className="flex gap-2">
            {gameState.roomCode && (
              <Button variant="outline" onClick={copyRoomCode}>
                <Copy className="mr-2 h-4 w-4" />
                {gameState.roomCode}
              </Button>
            )}
            <Dialog open={showRules} onOpenChange={setShowRules}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {t('games.rules')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('games.uno.rulesTitle')}</DialogTitle>
                  <DialogDescription>{t('games.uno.rulesSubtitle')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">{t('games.uno.objective')}</h4>
                    <p>{t('games.uno.objectiveDesc')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('games.uno.playModes')}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>{t('games.uno.solo')}:</strong> {t('games.uno.soloDesc')}</li>
                      <li><strong>{t('games.uno.local')}:</strong> {t('games.uno.localDesc')}</li>
                      <li><strong>{t('games.uno.online')}:</strong> {t('games.uno.onlineDesc')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('games.uno.validConnectionTypes')}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>{t('games.uno.typological')}:</strong> {t('games.uno.typologicalDesc')}</li>
                      <li><strong>{t('games.uno.thematic')}:</strong> {t('games.uno.thematicDesc')}</li>
                      <li><strong>{t('games.uno.contrast')}:</strong> {t('games.uno.contrastDesc')}</li>
                      <li><strong>{t('games.uno.parallel')}:</strong> {t('games.uno.parallelDesc')}</li>
                      <li><strong>{t('games.uno.interpretive')}:</strong> {t('games.uno.interpretiveDesc')}</li>
                      <li><strong>{t('games.uno.ethical')}:</strong> {t('games.uno.ethicalDesc')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('games.uno.winning')}</h4>
                    <p>{t('games.uno.winningDesc')}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            {t('games.uno.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('games.uno.rulesSubtitle')}</p>
        </div>

        {/* Pass Device Alert for Local Multiplayer */}
        <AlertDialog open={showPassDeviceAlert} onOpenChange={setShowPassDeviceAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">
                {t('games.uno.passTheDevice')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg py-4">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: PLAYER_COLORS[gameState.currentPlayer] }}
                >
                  {nextPlayerName.charAt(0)}
                </div>
                <span className="font-bold text-xl">{nextPlayerName}</span>{t('games.uno.itsYourTurn')}
                <br />
                <span className="text-sm">{t('games.uno.onlyYouCanSee')}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="justify-center">
              <AlertDialogAction onClick={startPlayerTurn} className="min-w-[150px]">
                <Eye className="mr-2 h-4 w-4" />
                {t('games.uno.showMyCards')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Setup Phase */}
        {gameState.gamePhase === "setup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle>{t('games.uno.startNewGame')}</CardTitle>
                <CardDescription>{t('games.uno.chooseSettings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Play Mode Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">{t('games.uno.playMode')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={gameState.playMode === "solo" ? "default" : "outline"}
                      className="flex flex-col h-auto py-4"
                      onClick={() => setGameState(prev => ({ ...prev, playMode: "solo" }))}
                    >
                      <Monitor className="h-6 w-6 mb-1" />
                      <span className="text-xs">{t('games.uno.solo')}</span>
                      <span className="text-[10px] text-muted-foreground">{t('games.uno.vsAi')}</span>
                    </Button>
                    <Button
                      variant={gameState.playMode === "local" ? "default" : "outline"}
                      className="flex flex-col h-auto py-4"
                      onClick={() => setGameState(prev => ({ ...prev, playMode: "local" }))}
                    >
                      <Users className="h-6 w-6 mb-1" />
                      <span className="text-xs">{t('games.uno.local')}</span>
                      <span className="text-[10px] text-muted-foreground">{t('games.uno.sameDevice')}</span>
                    </Button>
                    <Button
                      variant={gameState.playMode === "online" ? "default" : "outline"}
                      className="flex flex-col h-auto py-4"
                      onClick={() => setGameState(prev => ({ ...prev, playMode: "online" }))}
                    >
                      <Wifi className="h-6 w-6 mb-1" />
                      <span className="text-xs">{t('games.uno.online')}</span>
                      <span className="text-[10px] text-muted-foreground">{t('games.uno.inviteFriends')}</span>
                    </Button>
                  </div>
                </div>

                {/* Game Mode Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">{t('games.uno.gameMode')}</Label>
                  <Tabs defaultValue="easy" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="easy">{t('games.uno.easyMode')}</TabsTrigger>
                      <TabsTrigger value="classic">{t('games.uno.classicMode')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="easy" className="mt-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-700 dark:text-green-400">{t('games.uno.easyMode')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('games.uno.easyModeDesc')}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="classic" className="mt-4">
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-700 dark:text-purple-400">{t('games.uno.classicMode')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('games.uno.classicModeDesc')}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Player Count */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">{t('games.uno.numberOfPlayers')}</Label>
                  <div className="flex gap-2">
                    {[2, 3, 4].map(num => (
                      <Button
                        key={num}
                        variant={playerCount === num ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setPlayerCount(num)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Player Names for Local Mode */}
                {gameState.playMode === "local" && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold block">{t('games.uno.playerNames')}</Label>
                    {Array.from({ length: playerCount }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: PLAYER_COLORS[i] }}
                        >
                          {i + 1}
                        </div>
                        <Input
                          placeholder={`Player ${i + 1}`}
                          value={localPlayerNames[i]}
                          onChange={(e) => {
                            const newNames = [...localPlayerNames];
                            newNames[i] = e.target.value;
                            setLocalPlayerNames(newNames);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Online Mode: Create or Join */}
                {gameState.playMode === "online" && (
                  <div className="space-y-4">
                    <Tabs value={onlineTab} onValueChange={(v) => setOnlineTab(v as "create" | "join")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="create">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Game
                        </TabsTrigger>
                        <TabsTrigger value="join">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Join Game
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="create" className="mt-4 space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Choose a mode to create a room. Share the code with friends, then start when everyone's in!
                          </p>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 h-14"
                              variant="outline"
                              disabled={multiplayer.loading}
                              onClick={async () => {
                                const game = await multiplayer.createGame("easy", playerCount);
                                if (game) {
                                  setGameState(prev => ({
                                    ...prev,
                                    roomCode: game.room_code,
                                    gamePhase: "waitingForPlayer",
                                  }));
                                }
                              }}
                            >
                              {multiplayer.loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                              <div className="text-left">
                                <div className="font-semibold">Create Easy Game</div>
                                <div className="text-xs text-muted-foreground">Multiple choice connections</div>
                              </div>
                            </Button>
                            <Button
                              className="flex-1 h-14"
                              disabled={multiplayer.loading}
                              onClick={async () => {
                                const game = await multiplayer.createGame("classic", playerCount);
                                if (game) {
                                  setGameState(prev => ({
                                    ...prev,
                                    roomCode: game.room_code,
                                    gamePhase: "waitingForPlayer",
                                  }));
                                }
                              }}
                            >
                              {multiplayer.loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
                              <div className="text-left">
                                <div className="font-semibold">Create Classic Game</div>
                                <div className="text-xs text-muted-foreground">Write your own connections</div>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="join" className="mt-4 space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                          <p className="text-sm text-muted-foreground mb-3">
                            Enter the 6-character room code from your friend to join their game.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter room code (e.g. ABC123)"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                              maxLength={6}
                              className="text-lg font-mono tracking-widest text-center uppercase"
                            />
                            <Button
                              disabled={joinCode.length < 4 || multiplayer.loading}
                              onClick={async () => {
                                const game = await multiplayer.joinGame(joinCode);
                                if (game) {
                                  setGameState(prev => ({
                                    ...prev,
                                    roomCode: game.room_code,
                                    gamePhase: "waitingForPlayer",
                                  }));
                                }
                              }}
                            >
                              {multiplayer.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Start Buttons (Solo & Local only) */}
                {gameState.playMode !== "online" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 h-12"
                      variant="outline"
                      onClick={() => startGame("easy", gameState.playMode, playerCount)}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t('games.uno.easyMode')}
                    </Button>
                    <Button
                      className="flex-1 h-12"
                      onClick={() => startGame("classic", gameState.playMode, playerCount)}
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      {t('games.uno.classicMode')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Waiting for Players (Online Lobby) */}
        {gameState.gamePhase === "waitingForPlayer" && multiplayer.game && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  Waiting for Players
                </CardTitle>
                <CardDescription>Share the room code with friends to join</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Code Display */}
                <div className="p-6 bg-muted rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-2">Room Code</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">
                      {multiplayer.game.room_code}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(multiplayer.game!.room_code);
                        toast({ title: "Copied!", description: "Room code copied to clipboard" });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Share Link */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const link = `${window.location.origin}/games/phototheology-uno?room=${multiplayer.game!.room_code}`;
                      navigator.clipboard.writeText(link);
                      toast({ title: "Link Copied!", description: "Share this link with friends" });
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy Invite Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteDialog(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Email Invite
                  </Button>
                </div>

                {/* Players List */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Players ({multiplayer.players.length}/{multiplayer.game.max_players})
                  </Label>
                  <div className="space-y-2">
                    {multiplayer.players.map((player, i) => (
                      <div key={player.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
                        >
                          {player.display_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium flex-1">{player.display_name}</span>
                        {player.is_host && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                        <Badge variant="outline" className="text-xs text-green-600">Connected</Badge>
                      </div>
                    ))}
                    {Array.from({ length: multiplayer.game.max_players - multiplayer.players.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-muted-foreground/30">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-muted-foreground text-sm">Waiting...</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Game Button (Host Only) */}
                {multiplayer.isHost && (
                  <>
                    <Button
                      className="w-full h-14 text-lg"
                      disabled={multiplayer.players.length < 2}
                      onClick={() => {
                        const onlinePlayers: LocalPlayer[] = multiplayer.players.map((p, i) => ({
                          id: p.user_id,
                          name: p.display_name,
                          hand: [],
                          score: 0,
                          isAI: false,
                          color: PLAYER_COLORS[i % PLAYER_COLORS.length],
                        }));
                        startGame(
                          (multiplayer.game?.game_mode as "easy" | "classic") || "easy",
                          "online",
                          onlinePlayers.length
                        );
                        multiplayer.updateGameState(multiplayer.game!.id, {}, "active");
                      }}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Game ({multiplayer.players.length} player{multiplayer.players.length !== 1 ? 's' : ''})
                    </Button>
                    {multiplayer.players.length < 2 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Need at least 2 players to start. Share the code above!
                      </p>
                    )}
                  </>
                )}

                {!multiplayer.isHost && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Waiting for host to start the game...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Playing Phase */}
        {(gameState.gamePhase === "playing" || gameState.gamePhase === "evaluating" || gameState.gamePhase === "playerTurn") && (
          <div className="space-y-6">
            {/* Online Game Controls */}
            {gameState.playMode === "online" && gameState.roomCode && (
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={copyRoomCode}>
                  <Copy className="mr-2 h-4 w-4" />
                  {t('games.uno.copyCode')}: {gameState.roomCode}
                </Button>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t('games.uno.invitePlayer')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('games.uno.inviteAPlayer')}</DialogTitle>
                      <DialogDescription>
                        {t('games.uno.sendInvitation')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>{t('games.uno.roomCode')}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input value={gameState.roomCode} readOnly />
                          <Button variant="outline" onClick={copyRoomCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>{t('games.uno.inviteByEmail')}</Label>
                        <Input
                          type="email"
                          placeholder="friend@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button className="w-full" onClick={sendInvite}>
                        <Share2 className="mr-2 h-4 w-4" />
                        {t('games.uno.sendInvite')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Scoreboard */}
            <div className="flex gap-4 justify-center flex-wrap">
              {gameState.players.map((player, idx) => (
                <Card
                  key={player.id}
                  className={`px-4 py-2 ${idx === gameState.currentPlayer ? "border-2 ring-2 ring-offset-2" : ""}`}
                  style={{
                    borderColor: idx === gameState.currentPlayer ? player.color : undefined,
                    '--tw-ring-color': player.color,
                  } as React.CSSProperties}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <p className="font-semibold">{player.name}</p>
                      {player.isAI && <Badge variant="outline" className="text-[10px]">AI</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Badge variant="secondary">{t('games.uno.cardsCount', { count: player.hand.length })}</Badge>
                      <Badge variant="outline">{t('games.uno.winsCount', { count: gameState.roundsWon[idx] })}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Anchor Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-lg mx-auto"
            >
              <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <CardHeader className="text-center pb-2">
                  <Badge className="w-fit mx-auto mb-2 bg-amber-500">{t('games.uno.anchorCard')}</Badge>
                  <CardTitle className="text-xl">{gameState.anchorCard?.title}</CardTitle>
                  <CardDescription className="font-mono">{gameState.anchorCard?.reference}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center italic text-muted-foreground">{gameState.anchorCard?.text}</p>
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {gameState.anchorCard?.themes.map(theme => (
                      <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Turn Info */}
            {gameState.showCurrentHand && isCurrentPlayersTurn && (
              <div className="text-center">
                <Badge
                  className="text-base px-4 py-1"
                  style={{ backgroundColor: currentPlayer?.color }}
                >
                  {gameState.playMode === "local" ? t('games.uno.playersTurn', { name: currentPlayer?.name }) : t('games.uno.yourTurn')} - {
                    gameState.turnPhase === "selectCard" ? t('games.uno.selectACard') :
                    gameState.turnPhase === "makeConnection" ? t('games.uno.makeYourConnection') :
                    t('games.uno.awaitingRuling')
                  }
                </Badge>
              </div>
            )}

            {/* Player's Hand */}
            {gameState.showCurrentHand && isCurrentPlayersTurn && currentPlayer && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {gameState.playMode === "local" ? t('games.uno.playersHand', { name: currentPlayer.name }) : t('games.uno.yourHand')}
                  </h3>
                  {gameState.playMode === "local" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGameState(prev => ({ ...prev, showCurrentHand: false }))}
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      {t('games.uno.hide')}
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {currentPlayer.hand.map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`w-36 cursor-pointer transition-all ${
                          gameState.selectedCard?.id === card.id
                            ? "border-primary border-2 ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        } ${card.isSpecial ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" : ""}`}
                        onClick={() => {
                          if (card.isSpecial) {
                            playSpecialCard(card);
                          } else {
                            selectCard(card);
                          }
                        }}
                      >
                        <CardContent className="p-3 text-center">
                          {card.isSpecial ? (
                            <div className="space-y-2">
                              <div className="flex justify-center text-yellow-600">
                                {getSpecialCardIcon(card.specialType)}
                              </div>
                              <p className="font-semibold text-sm text-yellow-700 dark:text-yellow-400">{card.title}</p>
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-sm mb-1 line-clamp-2">{card.title}</p>
                              <p className="text-xs text-muted-foreground font-mono">{card.reference}</p>
                              <Badge className={`mt-2 text-[10px] ${getCategoryColor(card.category)}`}>
                                {card.category}
                              </Badge>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Input */}
            {gameState.turnPhase === "makeConnection" && gameState.selectedCard && gameState.showCurrentHand && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto"
              >
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('games.uno.connect')}: {gameState.selectedCard.title}
                    </CardTitle>
                    <CardDescription>
                      {t('games.uno.howDoesThisConnect')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gameState.mode === "classic" ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder={t('games.uno.explainConnectionPlaceholder')}
                          value={gameState.connectionText}
                          onChange={(e) => setGameState(prev => ({ ...prev, connectionText: e.target.value }))}
                          className="min-h-[100px]"
                        />
                        <Button
                          className="w-full"
                          onClick={submitConnection}
                          disabled={gameState.connectionText.length < 20 || isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {t('games.uno.submitConnection')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p className="text-sm text-muted-foreground mt-2">{t('games.uno.jeevesGenerating')}</p>
                          </div>
                        ) : (
                          <>
                            <RadioGroup
                              value={gameState.selectedOption}
                              onValueChange={(value) => setGameState(prev => ({ ...prev, selectedOption: value }))}
                            >
                              {gameState.easyModeOptions.map((option) => (
                                <div key={option.label} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                  <RadioGroupItem value={option.label} id={option.label} className="mt-1" />
                                  <Label htmlFor={option.label} className="flex-1 cursor-pointer">
                                    <span className="font-semibold">{option.label}.</span>{" "}
                                    <span className="text-muted-foreground">{option.description}</span>
                                    <Badge className="ml-2 text-[10px]" variant="outline">{option.type}</Badge>
                                  </Label>
                                </div>
                              ))}
                              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                <RadioGroupItem value="D" id="D" className="mt-1" />
                                <Label htmlFor="D" className="flex-1 cursor-pointer">
                                  <span className="font-semibold">D.</span>{" "}
                                  <span className="text-muted-foreground">{t('games.uno.noneOfThese')}</span>
                                </Label>
                              </div>
                            </RadioGroup>

                            {gameState.selectedOption === "D" && (
                              <Textarea
                                placeholder={t('games.uno.explainOwnConnection')}
                                value={gameState.connectionText}
                                onChange={(e) => setGameState(prev => ({ ...prev, connectionText: e.target.value }))}
                                className="min-h-[80px]"
                              />
                            )}

                            <Button
                              className="w-full"
                              onClick={submitConnection}
                              disabled={!gameState.selectedOption || (gameState.selectedOption === "D" && gameState.connectionText.length < 20)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              {t('games.uno.submitAnswer')}
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setGameState(prev => ({
                        ...prev,
                        selectedCard: null,
                        turnPhase: "selectCard",
                        connectionText: "",
                        selectedOption: "",
                        easyModeOptions: [],
                      }))}
                    >
                      {t('games.uno.chooseDifferentCard')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Jeeves Ruling */}
            {gameState.gamePhase === "evaluating" && gameState.jeevesRuling && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md mx-auto"
              >
                <Card className={`border-2 ${gameState.jeevesRuling.approved ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${gameState.jeevesRuling.approved ? "bg-green-500" : "bg-red-500"}`}>
                      {gameState.jeevesRuling.approved ? (
                        <Check className="h-8 w-8 text-white" />
                      ) : (
                        <X className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${gameState.jeevesRuling.approved ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      {gameState.jeevesRuling.approved ? t('games.uno.approved') : t('games.uno.denied')}
                    </h3>
                    <p className="text-muted-foreground mb-4">{gameState.jeevesRuling.reasoning}</p>
                    <p className="text-sm">
                      {gameState.jeevesRuling.approved
                        ? t('games.uno.cardDiscarded')
                        : t('games.uno.drawACard')}
                    </p>
                    <Button className="mt-4" onClick={processRuling}>
                      {t('common.continue')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Turn Indicator */}
            {gameState.playMode === "solo" && currentPlayer?.isAI && gameState.gamePhase === "playing" && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-muted-foreground">
                  {t('games.uno.isThinking', { name: currentPlayer.name })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Round End */}
        {gameState.gamePhase === "roundEnd" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t('games.uno.roundComplete')}</h2>
                <div className="space-y-2 mb-6">
                  {gameState.players.map((player, idx) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span>{player.name}</span>
                      </div>
                      <Badge variant={gameState.roundsWon[idx] > 0 ? "default" : "outline"}>
                        {t('games.uno.winsCount', { count: gameState.roundsWon[idx] })}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={startNewRound}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('games.uno.startNextRound')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Game End */}
        {gameState.gamePhase === "gameEnd" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">{t('games.uno.solaScriptura')}</h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {t('games.uno.winsTheMatch', { name: gameState.players[gameState.roundsWon.indexOf(Math.max(...gameState.roundsWon))]?.name })}
                </p>
                <div className="space-y-2 mb-6">
                  {gameState.players.map((player, idx) => (
                    <div key={player.id} className="flex justify-between items-center p-2 bg-background/50 rounded">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="font-semibold">{player.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{t('games.uno.pts', { score: player.score })}</Badge>
                        <Badge variant="outline">{t('games.uno.winsCount', { count: gameState.roundsWon[idx] })}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/games")}>
                    {t('games.backToGames')}
                  </Button>
                  <Button className="flex-1" onClick={() => setGameState(prev => ({ ...prev, gamePhase: "setup" }))}>
                    {t('games.playAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PhototheologyUno;
