import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Trophy, Star, Sparkles, Check, X, Zap, Timer, Users, User, Wifi } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

interface Clue {
  id: string;
  points: number;
  clue: string;
  correctAnswer: string;
  multipleChoice?: string[];
  isDailyDouble?: boolean;
  used: boolean;
}

interface Category {
  name: string;
  icon: string;
  clues: Clue[];
}

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

const PLAYER_COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

// Jeopardy categories with clues
const JEOPARDY_CATEGORIES: Category[] = [
  {
    name: "Typology",
    icon: "🔮",
    clues: [
      { id: "t1", points: 100, clue: "This Old Testament figure was thrown into a pit by his brothers and later rose to power in Egypt, prefiguring Christ's death and resurrection.", correctAnswer: "Joseph", multipleChoice: ["Moses", "Joseph", "David", "Abraham"], used: false },
      { id: "t2", points: 200, clue: "This metal serpent lifted up in the wilderness typifies Christ being lifted up on the cross (John 3:14).", correctAnswer: "Bronze/Brazen Serpent", multipleChoice: ["Golden Calf", "Bronze Serpent", "Fiery Serpent", "Iron Snake"], used: false },
      { id: "t3", points: 300, clue: "The annual sacrifice on this Jewish holy day prefigured Christ's ultimate atonement for sin.", correctAnswer: "Day of Atonement (Yom Kippur)", multipleChoice: ["Passover", "Day of Atonement", "Feast of Tabernacles", "Pentecost"], used: false },
      { id: "t4", points: 400, clue: "This patriarch offered his son on Mount Moriah, typifying God the Father offering His Son.", correctAnswer: "Abraham", multipleChoice: ["Isaac", "Abraham", "Jacob", "Noah"], used: false, isDailyDouble: true },
      { id: "t5", points: 500, clue: "This furniture piece in the tabernacle's Most Holy Place, with its mercy seat and cherubim, typified God's throne of grace.", correctAnswer: "Ark of the Covenant", multipleChoice: ["Altar of Incense", "Table of Showbread", "Ark of the Covenant", "Bronze Altar"], used: false },
    ]
  },
  {
    name: "Thematic Threads",
    icon: "🧵",
    clues: [
      { id: "th1", points: 100, clue: "This theme connects Eden's Tree of Life to the New Jerusalem's healing trees (Genesis 2, Revelation 22).", correctAnswer: "Tree of Life", multipleChoice: ["Tree of Life", "Garden Theme", "Paradise", "Eternal Life"], used: false },
      { id: "th2", points: 200, clue: "From Abel's lamb to John 1:29, this thematic thread runs throughout Scripture pointing to Christ.", correctAnswer: "Lamb of God", multipleChoice: ["Sacrifice", "Blood Atonement", "Lamb of God", "Offering"], used: false },
      { id: "th3", points: 300, clue: "This theme appears in Noah's flood, Red Sea crossing, and Christian baptism.", correctAnswer: "Water/Baptism", multipleChoice: ["Cleansing", "Judgment", "Water/Baptism", "Deliverance"], used: false },
      { id: "th4", points: 400, clue: "The theme of God 'tabernacling' with His people connects the wilderness sanctuary to John 1:14's 'dwelt among us'.", correctAnswer: "Divine Presence/Immanuel", multipleChoice: ["Holy Spirit", "Divine Presence", "Shekinah Glory", "Temple"], used: false },
      { id: "th5", points: 500, clue: "This scarlet thread appears in Rahab's window, the tabernacle curtains, and Christ's robe at the cross.", correctAnswer: "Scarlet/Red Thread", multipleChoice: ["Blood Covenant", "Scarlet Thread", "Redemption Line", "Crimson Cord"], isDailyDouble: true, used: false },
    ]
  },
  {
    name: "Prophecy & Fulfillment",
    icon: "📜",
    clues: [
      { id: "p1", points: 100, clue: "Isaiah 7:14 prophesied that a virgin would conceive and bear a son called this name meaning 'God with us'.", correctAnswer: "Immanuel", multipleChoice: ["Jesus", "Immanuel", "Messiah", "Wonderful"], used: false },
      { id: "p2", points: 200, clue: "Micah 5:2 prophesied the Messiah would be born in this small town.", correctAnswer: "Bethlehem", multipleChoice: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], used: false },
      { id: "p3", points: 300, clue: "Psalm 22 prophetically describes this method of execution, written centuries before it was invented.", correctAnswer: "Crucifixion", multipleChoice: ["Stoning", "Crucifixion", "Hanging", "Burning"], used: false },
      { id: "p4", points: 400, clue: "Daniel 9's 70 weeks prophecy predicted the Messiah would appear after this many prophetic weeks.", correctAnswer: "69 weeks (483 years)", multipleChoice: ["70 weeks", "69 weeks", "7 weeks", "62 weeks"], used: false },
      { id: "p5", points: 500, clue: "Zechariah 11:12-13 prophesied the Messiah would be betrayed for this exact amount.", correctAnswer: "30 pieces of silver", multipleChoice: ["20 pieces of silver", "30 pieces of silver", "40 pieces of gold", "100 denarii"], isDailyDouble: true, used: false },
    ]
  },
  {
    name: "Parallel Lives",
    icon: "👥",
    clues: [
      { id: "pl1", points: 100, clue: "Both this first Adam and the 'last Adam' (1 Cor 15:45) faced temptation - one in a garden, one in a wilderness.", correctAnswer: "Adam and Jesus", multipleChoice: ["Adam and Moses", "Adam and Jesus", "Adam and David", "Adam and Abraham"], used: false },
      { id: "pl2", points: 200, clue: "Like Moses who delivered Israel from Egypt, Jesus delivers believers from this.", correctAnswer: "Sin/Bondage", multipleChoice: ["Death", "Sin/Bondage", "Rome", "Law"], used: false },
      { id: "pl3", points: 300, clue: "David was anointed king but waited years before reigning; Jesus was anointed Messiah but waits to reign until this event.", correctAnswer: "Second Coming", multipleChoice: ["Resurrection", "Ascension", "Second Coming", "Pentecost"], used: false },
      { id: "pl4", points: 400, clue: "Both Elijah and John the Baptist wore similar clothing, ate simply, and confronted wicked rulers named this.", correctAnswer: "Ahab and Herod", multipleChoice: ["Pharaoh", "Ahab/Herod", "Nebuchadnezzar", "Caesar"], used: false, isDailyDouble: true },
      { id: "pl5", points: 500, clue: "Both Melchizedek and Jesus hold this dual role that combines prophet, priest, and king.", correctAnswer: "Priest-King", multipleChoice: ["High Priest", "Priest-King", "Prophet-Priest", "King of Kings"], used: false },
    ]
  },
  {
    name: "Contrasts",
    icon: "⚖️",
    clues: [
      { id: "c1", points: 100, clue: "The first Adam brought death; the last Adam brought this (Romans 5:17).", correctAnswer: "Life", multipleChoice: ["Grace", "Life", "Salvation", "Righteousness"], used: false },
      { id: "c2", points: 200, clue: "Cain's offering was rejected while Abel's was accepted because Abel offered this.", correctAnswer: "By faith / Blood sacrifice", multipleChoice: ["More food", "By faith", "First fruits", "With joy"], used: false },
      { id: "c3", points: 300, clue: "Saul was tall and impressive but failed; David was small but succeeded because God looks at this.", correctAnswer: "The heart", multipleChoice: ["Obedience", "Faith", "The heart", "Humility"], used: false },
      { id: "c4", points: 400, clue: "The law came through Moses; this came through Jesus Christ (John 1:17).", correctAnswer: "Grace and Truth", multipleChoice: ["Love", "Salvation", "Grace and Truth", "The Spirit"], used: false },
      { id: "c5", points: 500, clue: "Earthly Jerusalem rejected Christ; this heavenly counterpart welcomes all believers (Galatians 4:26).", correctAnswer: "New/Heavenly Jerusalem", multipleChoice: ["Paradise", "New Jerusalem", "Heaven", "Zion"], isDailyDouble: true, used: false },
    ]
  },
  {
    name: "Divine Encounters",
    icon: "✨",
    clues: [
      { id: "d1", points: 100, clue: "Jacob wrestled with a divine being at this location and was renamed Israel.", correctAnswer: "Peniel/Jabbok", multipleChoice: ["Bethel", "Peniel", "Beersheba", "Hebron"], used: false },
      { id: "d2", points: 200, clue: "Moses encountered God in a bush that burned but was not consumed on this mountain.", correctAnswer: "Mount Horeb/Sinai", multipleChoice: ["Mount Carmel", "Mount Sinai", "Mount Nebo", "Mount Moriah"], used: false },
      { id: "d3", points: 300, clue: "Isaiah saw the Lord 'high and lifted up' and these beings cried 'Holy, holy, holy'.", correctAnswer: "Seraphim", multipleChoice: ["Cherubim", "Angels", "Seraphim", "Elders"], used: false },
      { id: "d4", points: 400, clue: "Elijah heard God not in wind, earthquake, or fire, but in this.", correctAnswer: "Still small voice", multipleChoice: ["Thunder", "Still small voice", "Whisper of angels", "Silence"], used: false, isDailyDouble: true },
      { id: "d5", points: 500, clue: "Paul encountered the risen Christ on the road to this city and was blinded for three days.", correctAnswer: "Damascus", multipleChoice: ["Jerusalem", "Damascus", "Antioch", "Tarsus"], used: false },
    ]
  }
];

// Final Jeopardy clues
const FINAL_JEOPARDY_CLUES = [
  { category: "Ultimate Typology", clue: "This Old Testament event where the high priest entered the Most Holy Place once a year prefigured Christ's ministry in the heavenly sanctuary described in Hebrews.", answer: "Day of Atonement / Yom Kippur" },
  { category: "Prophetic Fulfillment", clue: "Daniel 2's metallic image prophecy culminates with this kingdom that 'shall never be destroyed'.", answer: "God's Kingdom / Kingdom of God / Stone Kingdom" },
  { category: "Thematic Culmination", clue: "The theme of rest begins in Genesis 2's Sabbath and culminates in Hebrews 4 with entering God's this.", answer: "Rest / Sabbath Rest" },
  { category: "Ultimate Contrast", clue: "While the first sanctuary was made with hands, Hebrews reveals Christ ministers in a sanctuary described this way.", answer: "Not made with hands / True tabernacle / Heavenly" },
];

export default function PhototheologyJeopardy() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Game state
  const [gameMode, setGameMode] = useState<"classic" | "easy" | null>(null);
  const [onlineMode, setOnlineMode] = useState(false);
  const multiplayer = useGameMultiplayer("jeopardy");
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showClue, setShowClue] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dailyDoubleWager, setDailyDoubleWager] = useState<number>(0);
  const [showDailyDouble, setShowDailyDouble] = useState(false);
  const [gamePhase, setGamePhase] = useState<"setup" | "jeopardy" | "final" | "complete">("setup");
  const [finalJeopardy, setFinalJeopardy] = useState(FINAL_JEOPARDY_CLUES[Math.floor(Math.random() * FINAL_JEOPARDY_CLUES.length)]);
  const [finalWagers, setFinalWagers] = useState<Record<string, number>>({});
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    // Deep clone categories and randomize daily doubles
    const shuffledCategories = JEOPARDY_CATEGORIES.map(cat => ({
      ...cat,
      clues: cat.clues.map(clue => ({ ...clue, used: false }))
    }));

    // Ensure some clues are daily doubles (already set in data, but randomize which ones)
    shuffledCategories.forEach(cat => {
      cat.clues.forEach(clue => {
        // 10% chance for any 300+ point clue to be daily double
        if (clue.points >= 300 && Math.random() < 0.15) {
          clue.isDailyDouble = true;
        }
      });
    });

    setCategories(shuffledCategories);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (gameMode === "classic" && selectedClue) {
        handleAnswerSubmit(false);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // Start game with players
  const startGame = () => {
    if (players.length === 0) {
      toast.error(t('games.jeopardy.addAtLeastOnePlayer'));
      return;
    }
    initializeGame();
    setGamePhase("jeopardy");
  };

  // Add player
  const addPlayer = (name: string) => {
    if (players.length >= 6) {
      toast.error(t('games.jeopardy.maxPlayers'));
      return;
    }
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: name || `Player ${players.length + 1}`,
      score: 0,
      color: PLAYER_COLORS[players.length % PLAYER_COLORS.length]
    };
    setPlayers([...players, newPlayer]);
  };

  // Remove player
  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  // Select a clue
  const selectClue = (category: Category, clue: Clue) => {
    if (clue.used) return;

    setSelectedClue(clue);
    setSelectedCategory(category.name);
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);

    if (clue.isDailyDouble) {
      setShowDailyDouble(true);
      setDailyDoubleWager(Math.min(1000, Math.max(100, players[currentPlayerIndex]?.score || 100)));
    } else {
      setShowClue(true);
      setTimer(gameMode === "classic" ? 30 : 20);
      setIsTimerRunning(true);
    }
  };

  // Handle daily double wager
  const handleDailyDoubleWager = () => {
    if (dailyDoubleWager < 5 || dailyDoubleWager > Math.max(players[currentPlayerIndex]?.score || 100, 1000)) {
      toast.error(t('games.jeopardy.invalidWager'));
      return;
    }
    setShowDailyDouble(false);
    setShowClue(true);
    setTimer(gameMode === "classic" ? 30 : 20);
    setIsTimerRunning(true);
  };

  // Handle answer submission
  const handleAnswerSubmit = (correct: boolean | null = null) => {
    setIsTimerRunning(false);

    let isAnswerCorrect = correct;

    // In easy mode, check multiple choice
    if (gameMode === "easy" && selectedClue?.multipleChoice) {
      isAnswerCorrect = userAnswer.toLowerCase().trim() === selectedClue.correctAnswer.toLowerCase().trim() ||
                       selectedClue.correctAnswer.toLowerCase().includes(userAnswer.toLowerCase().trim());
    }

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    // Update score
    if (isAnswerCorrect !== null) {
      const points = selectedClue?.isDailyDouble ? dailyDoubleWager : (selectedClue?.points || 0);
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += isAnswerCorrect ? points : -points;
      setPlayers(updatedPlayers);
    }
  };

  // Close clue dialog and mark as used
  const closeClueDialog = () => {
    if (selectedClue) {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        clues: cat.clues.map(clue =>
          clue.id === selectedClue.id ? { ...clue, used: true } : clue
        )
      }));
      setCategories(updatedCategories);
    }

    // Check if all clues are used
    const allUsed = categories.every(cat => cat.clues.every(clue => clue.id === selectedClue?.id || clue.used));

    setShowClue(false);
    setSelectedClue(null);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);

    if (allUsed) {
      setGamePhase("final");
    }
  };

  // Handle final jeopardy wager
  const handleFinalWager = (playerId: string, wager: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const maxWager = Math.max(0, player.score);
    const validWager = Math.min(Math.max(0, wager), maxWager);
    setFinalWagers({ ...finalWagers, [playerId]: validWager });
  };

  // Handle final jeopardy answer
  const handleFinalAnswer = (playerId: string, answer: string) => {
    setFinalAnswers({ ...finalAnswers, [playerId]: answer });
  };

  // Reveal final jeopardy results
  const revealFinalResults = () => {
    setShowFinalResults(true);
  };

  // Judge final answers and complete game
  const judgeFinalAnswers = (results: Record<string, boolean>) => {
    const updatedPlayers = players.map(player => {
      const wager = finalWagers[player.id] || 0;
      const isCorrect = results[player.id];
      return {
        ...player,
        score: player.score + (isCorrect ? wager : -wager)
      };
    });
    setPlayers(updatedPlayers);
    setGamePhase("complete");

    // Save high score
    saveGameScore(Math.max(...updatedPlayers.map(p => p.score)));
  };

  // Save game score
  const saveGameScore = async (score: number) => {
    if (!user) return;

    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "phototheology_jeopardy",
        score: score,
        metadata: {
          mode: gameMode,
          players: players.map(p => ({ name: p.name, score: p.score }))
        }
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Current player
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-4xl font-bold text-yellow-400" style={{ fontFamily: "'Cinzel', serif" }}>
            {t('games.jeopardy.title')}
          </h1>
          {gamePhase !== "setup" && (
            <div className="flex items-center gap-4">
              {players.map((player, idx) => (
                <Badge
                  key={player.id}
                  className={`px-3 py-1 text-white ${idx === currentPlayerIndex ? 'ring-2 ring-yellow-400' : ''}`}
                  style={{ backgroundColor: player.color }}
                >
                  {player.name}: {player.score}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Online Multiplayer Lobby */}
        {onlineMode && multiplayer.room?.status !== "active" && (
          <MultiplayerLobby
            room={multiplayer.room}
            players={multiplayer.players}
            loading={multiplayer.loading}
            isHost={multiplayer.isHost}
            minPlayers={2}
            maxPlayers={6}
            gameName="PT Jeopardy"
            onCreateRoom={() => multiplayer.createRoom(6)}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              if (multiplayer.players.length >= 2) {
                multiplayer.startGame({ phase: "jeopardy" }, multiplayer.players[0].user_id);
              }
            }}
            onLeaveRoom={() => { multiplayer.leaveRoom(); setOnlineMode(false); }}
            onBack={() => setOnlineMode(false)}
          />
        )}

        {/* Setup Phase */}
        {gamePhase === "setup" && !onlineMode && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-black/40 border-yellow-500/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  {t('games.jeopardy.gameSetup')}
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {t('games.jeopardy.chooseMode')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Mode Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-yellow-200">{t('games.jeopardy.gameMode')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={gameMode === "classic" ? "default" : "outline"}
                      onClick={() => setGameMode("classic")}
                      className={`h-auto py-4 ${gameMode === "classic" ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-500/50'}`}
                    >
                      <div className="text-center">
                        <Sparkles className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-bold">{t('games.jeopardy.classicMode')}</div>
                        <div className="text-xs opacity-80">{t('games.jeopardy.classicModeDesc')}</div>
                      </div>
                    </Button>
                    <Button
                      variant={gameMode === "easy" ? "default" : "outline"}
                      onClick={() => setGameMode("easy")}
                      className={`h-auto py-4 ${gameMode === "easy" ? 'bg-green-600 hover:bg-green-700' : 'border-green-500/50'}`}
                    >
                      <div className="text-center">
                        <Check className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-bold">{t('games.jeopardy.easyMode')}</div>
                        <div className="text-xs opacity-80">{t('games.jeopardy.easyModeDesc')}</div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Online Multiplayer Option */}
                  <div className="mt-4">
                    <Button
                      onClick={() => setOnlineMode(true)}
                      className="w-full h-auto py-4 bg-green-600 hover:bg-green-700"
                    >
                      <Wifi className="h-6 w-6 mr-3" />
                      <div className="text-left">
                        <div className="font-bold">Online Multiplayer</div>
                        <div className="text-xs opacity-80">Play with friends online</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Player Setup */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-yellow-200 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('games.jeopardy.players')} ({players.length}/6)
                  </label>

                  {players.map((player, idx) => (
                    <div key={player.id} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: player.color }}
                      >
                        {idx + 1}
                      </div>
                      <span className="flex-1 text-white">{player.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(player.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {players.length < 6 && (
                    <div className="flex gap-2">
                      <Input
                        id="newPlayerName"
                        placeholder={t('games.jeopardy.enterPlayerName')}
                        className="bg-black/40 border-yellow-500/30"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addPlayer((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("newPlayerName") as HTMLInputElement;
                          addPlayer(input.value);
                          input.value = "";
                        }}
                        className="border-yellow-500/50"
                      >
                        {t('games.jeopardy.add')}
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={startGame}
                  disabled={!gameMode || players.length === 0}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                  size="lg"
                >
                  {t('games.jeopardy.startGame')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jeopardy Board */}
        {gamePhase === "jeopardy" && (
          <div className="space-y-4">
            {/* Current Player Indicator */}
            <div className="text-center mb-4">
              <Badge
                className="px-4 py-2 text-lg text-white"
                style={{ backgroundColor: currentPlayer?.color }}
              >
                <User className="h-4 w-4 mr-2 inline" />
                {t('games.jeopardy.playerTurn', { name: currentPlayer?.name })}
              </Badge>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-6 gap-2">
              {/* Category Headers */}
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-blue-800 p-3 text-center rounded-t-lg border border-blue-600"
                >
                  <span className="text-2xl mb-1 block">{category.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    {category.name}
                  </span>
                </div>
              ))}

              {/* Clue Grid */}
              {[100, 200, 300, 400, 500].map((points) => (
                categories.map((category) => {
                  const clue = category.clues.find(c => c.points === points);
                  return (
                    <motion.button
                      key={`${category.name}-${points}`}
                      whileHover={{ scale: clue?.used ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => clue && selectClue(category, clue)}
                      disabled={clue?.used}
                      className={`
                        p-4 text-center text-2xl font-bold rounded
                        transition-all duration-200
                        ${clue?.used
                          ? 'bg-blue-950/50 text-blue-800/30 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-600 text-yellow-400 cursor-pointer border border-blue-500 shadow-lg hover:shadow-yellow-500/20'
                        }
                      `}
                    >
                      {clue?.used ? '' : points}
                    </motion.button>
                  );
                })
              ))}
            </div>

            {/* Skip to Final Jeopardy */}
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setGamePhase("final")}
                className="border-yellow-500/50"
              >
                {t('games.jeopardy.skipToFinal')}
              </Button>
            </div>
          </div>
        )}

        {/* Daily Double Dialog */}
        <Dialog open={showDailyDouble} onOpenChange={() => {}}>
          <DialogContent className="bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center text-white flex items-center justify-center gap-2">
                <Zap className="h-8 w-8" />
                {t('games.jeopardy.dailyDouble')}
                <Zap className="h-8 w-8" />
              </DialogTitle>
              <DialogDescription className="text-center text-yellow-100">
                {t('games.jeopardy.howMuchWager', { name: currentPlayer?.name })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center text-white">
                <span className="text-sm">{t('games.jeopardy.yourScore')}: </span>
                <span className="text-2xl font-bold">{currentPlayer?.score || 0}</span>
              </div>
              <Input
                type="number"
                value={dailyDoubleWager}
                onChange={(e) => setDailyDoubleWager(parseInt(e.target.value) || 0)}
                min={5}
                max={Math.max(currentPlayer?.score || 100, 1000)}
                className="bg-white/20 border-white text-white text-2xl text-center font-bold"
              />
              <div className="flex gap-2">
                {[100, 250, 500, currentPlayer?.score || 100].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setDailyDoubleWager(amount)}
                    className="flex-1 bg-white/10 border-white text-white"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleDailyDoubleWager}
                className="w-full bg-white text-yellow-700 font-bold hover:bg-yellow-100"
              >
                {t('games.jeopardy.lockInWager')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clue Dialog */}
        <Dialog open={showClue} onOpenChange={() => {}}>
          <DialogContent className="bg-blue-900 border-blue-400 max-w-2xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  {selectedCategory}
                </Badge>
                <Badge className="bg-yellow-600 text-black">
                  {selectedClue?.isDailyDouble ? `${t('games.jeopardy.wager')}: ${dailyDoubleWager}` : `${selectedClue?.points} ${t('games.common.pts')}`}
                </Badge>
              </div>
              {!showAnswer && (
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Timer className="h-5 w-5" />
                  <span className="text-2xl font-bold">{timer}s</span>
                </div>
              )}
            </DialogHeader>

            <div className="py-6">
              <p className="text-xl text-white text-center leading-relaxed">
                {selectedClue?.clue}
              </p>
            </div>

            {!showAnswer ? (
              <div className="space-y-4">
                {gameMode === "easy" && selectedClue?.multipleChoice ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedClue.multipleChoice.map((choice, idx) => (
                      <Button
                        key={idx}
                        variant={userAnswer === choice ? "default" : "outline"}
                        onClick={() => setUserAnswer(choice)}
                        className={`py-6 text-lg ${userAnswer === choice ? 'bg-yellow-600' : 'border-blue-400'}`}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t('games.jeopardy.whatIs')}
                    className="bg-blue-950 border-blue-400 text-white text-lg"
                  />
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAnswerSubmit(null)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                  >
                    {t('games.jeopardy.submitAnswer')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                    <span className="text-xl font-bold">
                      {isCorrect ? t('games.common.correct') + '!' : t('games.common.incorrect') + '!'}
                    </span>
                  </div>
                  <p className="text-lg">
                    {t('games.jeopardy.theAnswer')}: <span className="font-bold">{selectedClue?.correctAnswer}</span>
                  </p>
                </div>

                {gameMode === "classic" && isCorrect === null && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAnswerSubmit(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t('games.common.correct')}
                    </Button>
                    <Button
                      onClick={() => handleAnswerSubmit(false)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t('games.common.incorrect')}
                    </Button>
                  </div>
                )}

                <Button onClick={closeClueDialog} className="w-full" variant="outline">
                  {t('games.common.continue')}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Final Jeopardy */}
        {gamePhase === "final" && !showFinalResults && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-black/40 border-yellow-500/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-yellow-400">
                  {t('games.jeopardy.finalJeopardy')}
                </CardTitle>
                <CardDescription className="text-xl text-blue-200">
                  {t('games.jeopardy.category')}: {finalJeopardy.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wager Phase */}
                {Object.keys(finalWagers).length < players.length && (
                  <div className="space-y-4">
                    <p className="text-center text-white">{t('games.jeopardy.eachPlayerEnterWager')}</p>
                    {players.map(player => (
                      <div key={player.id} className="flex items-center gap-4">
                        <Badge style={{ backgroundColor: player.color }} className="text-white px-3 py-1">
                          {player.name}: {player.score}
                        </Badge>
                        <Input
                          type="number"
                          placeholder={t('games.jeopardy.wager')}
                          min={0}
                          max={Math.max(0, player.score)}
                          className="bg-black/40 border-yellow-500/30"
                          onChange={(e) => handleFinalWager(player.id, parseInt(e.target.value) || 0)}
                          disabled={finalWagers[player.id] !== undefined}
                        />
                        <Button
                          onClick={() => handleFinalWager(player.id, finalWagers[player.id] || 0)}
                          disabled={finalWagers[player.id] !== undefined}
                          className="bg-yellow-600"
                        >
                          {t('games.jeopardy.lock')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer Phase */}
                {Object.keys(finalWagers).length === players.length && (
                  <>
                    <div className="p-6 bg-blue-900 rounded-lg text-center">
                      <p className="text-2xl text-white leading-relaxed">
                        {finalJeopardy.clue}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {players.map(player => (
                        <div key={player.id} className="space-y-2">
                          <Badge style={{ backgroundColor: player.color }} className="text-white">
                            {player.name} ({t('games.jeopardy.wager')}: {finalWagers[player.id]})
                          </Badge>
                          <Textarea
                            placeholder={t('games.jeopardy.whatIs')}
                            className="bg-black/40 border-yellow-500/30"
                            onChange={(e) => handleFinalAnswer(player.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={revealFinalResults}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                      disabled={Object.keys(finalAnswers).length < players.length}
                    >
                      {t('games.jeopardy.revealResults')}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Final Results Judging */}
        {gamePhase === "final" && showFinalResults && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-black/40 border-yellow-500/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-yellow-400">{t('games.jeopardy.finalJeopardyResults')}</CardTitle>
                <CardDescription className="text-blue-200">
                  {t('games.jeopardy.correctAnswer')}: <span className="text-yellow-400 font-bold">{finalJeopardy.answer}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {players.map(player => (
                  <div key={player.id} className="p-4 bg-blue-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge style={{ backgroundColor: player.color }} className="text-white">
                        {player.name}
                      </Badge>
                      <span className="text-yellow-400">{t('games.jeopardy.wager')}: {finalWagers[player.id]}</span>
                    </div>
                    <p className="text-white mb-3">{t('games.jeopardy.answer')}: "{finalAnswers[player.id]}"</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          judgeFinalAnswers({ [player.id]: true });
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" /> {t('games.common.correct')}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          judgeFinalAnswers({ [player.id]: false });
                        }}
                      >
                        <X className="h-4 w-4 mr-1" /> {t('games.common.incorrect')}
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => {
                    const results: Record<string, boolean> = {};
                    players.forEach(p => results[p.id] = false);
                    judgeFinalAnswers(results);
                  }}
                  variant="outline"
                  className="w-full border-yellow-500/50"
                >
                  {t('games.jeopardy.skipJudgingEndGame')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Complete */}
        {gamePhase === "complete" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 border-yellow-500/50">
              <CardHeader className="text-center">
                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-3xl text-yellow-400">{t('games.common.gameOver')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[...players].sort((a, b) => b.score - a.score).map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        idx === 0 ? 'bg-yellow-600/30 border border-yellow-500' : 'bg-blue-900/30'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: player.color }}
                      >
                        {idx + 1}
                      </div>
                      <span className="flex-1 text-xl text-white font-medium">{player.name}</span>
                      <span className="text-2xl font-bold text-yellow-400">{player.score}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setGamePhase("setup");
                      setPlayers([]);
                      setGameMode(null);
                    }}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black"
                  >
                    {t('games.common.playAgain')}
                  </Button>
                  <Button
                    onClick={() => navigate("/games")}
                    variant="outline"
                    className="flex-1 border-yellow-500/50"
                  >
                    {t('games.common.backToGames')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="jeopardy" />
    </div>
  );
}
