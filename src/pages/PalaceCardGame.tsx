import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Trophy, CheckCircle, Users, Gamepad2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { useAuth } from "@/hooks/useAuth";

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
  { id: "1", category: "Transition of Power", oldTestament: { event: "Moses to Joshua", reference: "Joshua 1:1-9", description: "Moses dies, Joshua appointed to lead Israel into Promised Land" }, newTestament: { event: "John Baptist to Jesus", reference: "John 3:30", description: "John: 'He must increase, I must decrease' - transition at Jordan" }},
  { id: "2", category: "Sacrificial Lamb", oldTestament: { event: "Isaac Bound", reference: "Genesis 22:8", description: "Abraham binds Isaac; God provides ram as substitute" }, newTestament: { event: "Jesus Crucified", reference: "John 1:29", description: "Behold the Lamb of God who takes away sin" }},
  { id: "3", category: "Exodus from Bondage", oldTestament: { event: "Red Sea Crossing", reference: "Exodus 14:21-22", description: "Israel passes through water, escaping Egyptian slavery" }, newTestament: { event: "Baptism", reference: "Romans 6:3-4", description: "Buried with Christ in baptism, raised to new life" }},
  { id: "4", category: "Wilderness Testing", oldTestament: { event: "Israel 40 Years", reference: "Deuteronomy 8:2", description: "Israel tested in wilderness 40 years, failed repeatedly" }, newTestament: { event: "Jesus 40 Days", reference: "Matthew 4:1-11", description: "Jesus tempted 40 days in wilderness, remained faithful" }},
  { id: "5", category: "Rejected Stone", oldTestament: { event: "David Rejected", reference: "1 Samuel 16:7", description: "David, youngest son, rejected by men but chosen by God" }, newTestament: { event: "Jesus Rejected", reference: "1 Peter 2:7", description: "Stone rejected by builders becomes chief cornerstone" }},
  { id: "6", category: "Provision in Desert", oldTestament: { event: "Manna from Heaven", reference: "Exodus 16:4", description: "God provides bread from heaven daily" }, newTestament: { event: "Bread of Life", reference: "John 6:35", description: "Jesus: 'I am the bread of life'" }},
  { id: "7", category: "Healing Serpent", oldTestament: { event: "Bronze Serpent", reference: "Numbers 21:9", description: "Look at lifted serpent and live" }, newTestament: { event: "Lifted Up", reference: "John 3:14-15", description: "Son of Man must be lifted up for eternal life" }},
  { id: "8", category: "Betrayed for Silver", oldTestament: { event: "Joseph Sold", reference: "Genesis 37:28", description: "Sold by brothers for silver, becomes savior of nations" }, newTestament: { event: "Christ Sold", reference: "Matthew 26:15", description: "Betrayed for 30 silver pieces, becomes Savior of world" }},
  { id: "9", category: "Between Two", oldTestament: { event: "Samson's Death", reference: "Judges 16:29-30", description: "Samson between two pillars, dies destroying enemies" }, newTestament: { event: "Christ's Cross", reference: "Luke 23:33", description: "Jesus between two criminals, dies defeating sin and death" }},
  { id: "10", category: "Three-Day Resurrection", oldTestament: { event: "Jonah in Fish", reference: "Jonah 1:17", description: "Jonah swallowed by great fish, emerges after three days" }, newTestament: { event: "Christ Rises", reference: "Matthew 12:40", description: "Jesus in tomb three days, rises victorious" }},
  { id: "11", category: "Rock Struck", oldTestament: { event: "Water from Rock", reference: "Exodus 17:6", description: "Moses strikes rock, water flows for thirsty people" }, newTestament: { event: "Spirit Flows", reference: "John 7:37-39", description: "Christ struck, living water (Spirit) flows to all who thirst" }},
  { id: "12", category: "Innocent Blood Cries", oldTestament: { event: "Abel's Blood", reference: "Genesis 4:10", description: "Abel's blood cries out from ground for justice" }, newTestament: { event: "Jesus' Blood", reference: "Hebrews 12:24", description: "Jesus' blood speaks better word - mercy and forgiveness" }},
  { id: "13", category: "Passover Deliverance", oldTestament: { event: "Egypt's Firstborn", reference: "Exodus 12:12-13", description: "Lamb's blood on doorposts spares Israel from death angel" }, newTestament: { event: "Christ Our Passover", reference: "1 Corinthians 5:7", description: "Christ sacrificed as Passover lamb, delivers from sin's death" }},
  { id: "14", category: "Suffering Righteousness", oldTestament: { event: "Job's Testing", reference: "Job 1:21-22", description: "Job loses everything, remains faithful, blessed double" }, newTestament: { event: "Christ's Humiliation", reference: "Philippians 2:8-11", description: "Christ empties self unto death, exalted above all names" }},
  { id: "15", category: "Shepherd King", oldTestament: { event: "David the Shepherd", reference: "1 Samuel 17:34-35", description: "David protects sheep from lion and bear, becomes king" }, newTestament: { event: "Good Shepherd", reference: "John 10:11", description: "Jesus lays down life for sheep, reigns as eternal King" }},
  { id: "16", category: "Bride Acquired", oldTestament: { event: "Isaac's Bride", reference: "Genesis 24:67", description: "Abraham sends servant to get bride for Isaac with gifts" }, newTestament: { event: "Church as Bride", reference: "Ephesians 5:25-27", description: "Father sends Spirit to gather bride for Christ through gospel" }},
  { id: "17", category: "Scapegoat Bearing Sin", oldTestament: { event: "Azazel Goat", reference: "Leviticus 16:21-22", description: "Sins confessed on scapegoat, sent into wilderness" }, newTestament: { event: "Sin Bearer", reference: "2 Corinthians 5:21", description: "Christ made sin for us, carries our iniquities away" }},
  { id: "18", category: "Firstborn Sacrifice", oldTestament: { event: "Isaac Offered", reference: "Genesis 22:2", description: "Abraham offers only son on mountain" }, newTestament: { event: "God's Only Son", reference: "John 3:16", description: "Father gives only begotten Son for the world" }},
  { id: "19", category: "Glory Cloud", oldTestament: { event: "Tabernacle Filled", reference: "Exodus 40:34-35", description: "Glory cloud fills tent, Moses cannot enter" }, newTestament: { event: "Incarnation", reference: "John 1:14", description: "Word becomes flesh, we behold His glory dwelling among us" }},
  { id: "20", category: "High Priest Intercedes", oldTestament: { event: "Aaron's Intercession", reference: "Numbers 16:48", description: "Aaron stands between living and dead, plague stops" }, newTestament: { event: "Christ's Mediation", reference: "1 Timothy 2:5", description: "One mediator between God and man stands in the gap" }},
];

const DISTRACTOR_VERSES = [
  { reference: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength." },
  { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace." },
  { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
  { reference: "James 1:2-3", text: "My brethren, count it all joy when ye fall into divers temptations." },
  { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love." },
  { reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path." },
  { reference: "Matthew 6:33", text: "But seek ye first the kingdom of God, and his righteousness." },
  { reference: "2 Timothy 3:16", text: "All scripture is given by inspiration of God." },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { reference: "Isaiah 26:3", text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee." },
  { reference: "Romans 12:2", text: "Be not conformed to this world: but be ye transformed by the renewing of your mind." }
];

interface VerseCard {
  id: string;
  reference: string;
  text: string;
  isParallel: boolean;
  parallelId: string;
  isFlipped: boolean;
  isSelected: boolean;
}

export default function PalaceCardGame() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const multiplayer = useGameMultiplayer("parallels_match");

  const [gameMode, setGameMode] = useState<"solo" | "online" | null>(null);
  const autoJoinCode = searchParams.get("room");

  const [cards, setCards] = useState<VerseCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentParallelPair, setCurrentParallelPair] = useState<ParallelPair | null>(null);
  const [gameWon, setGameWon] = useState(false);

  // Auto-join room from URL
  useEffect(() => {
    if (autoJoinCode && !multiplayer.room) {
      setGameMode("online");
      multiplayer.joinRoom(autoJoinCode);
    }
  }, [autoJoinCode]);

  // Sync multiplayer game state
  useEffect(() => {
    if (gameMode !== "online" || !multiplayer.room) return;
    const gs = multiplayer.room.game_state;
    if (gs?.cards) setCards(gs.cards);
    if (gs?.roundsCompleted !== undefined) setRoundsCompleted(gs.roundsCompleted);
    if (gs?.showExplanation !== undefined) setShowExplanation(gs.showExplanation);
    if (gs?.currentParallelPair) setCurrentParallelPair(gs.currentParallelPair);
    if (gs?.gameWon !== undefined) setGameWon(gs.gameWon);
    if (gs?.selectedCards) setSelectedCards(gs.selectedCards);
  }, [multiplayer.room?.game_state, gameMode]);

  useEffect(() => {
    if (gameMode === "solo") initializeRound();
  }, [gameMode]);

  const initializeRound = () => {
    const parallelPair = PARALLEL_PAIRS[Math.floor(Math.random() * PARALLEL_PAIRS.length)];
    setCurrentParallelPair(parallelPair);

    const shuffledDistractors = [...DISTRACTOR_VERSES].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, 6);

    const parallelId = `parallel-${Date.now()}`;
    const gameCards: VerseCard[] = [
      {
        id: `card-1-${Date.now()}`,
        reference: parallelPair.oldTestament.reference,
        text: parallelPair.oldTestament.description,
        isParallel: true,
        parallelId,
        isFlipped: false,
        isSelected: false
      },
      {
        id: `card-2-${Date.now()}`,
        reference: parallelPair.newTestament.reference,
        text: parallelPair.newTestament.description,
        isParallel: true,
        parallelId,
        isFlipped: false,
        isSelected: false
      },
      ...selectedDistractors.map((verse, idx) => ({
        id: `card-distractor-${idx}-${Date.now()}`,
        reference: verse.reference,
        text: verse.text,
        isParallel: false,
        parallelId: '',
        isFlipped: false,
        isSelected: false
      }))
    ];

    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setSelectedCards([]);
    setShowExplanation(false);
  };

  const syncState = (newCards: VerseCard[], newSelected: string[], explanation: boolean, pair: ParallelPair | null, rounds: number, won: boolean) => {
    if (gameMode === "online" && multiplayer.room) {
      const nextTurn = multiplayer.players.find(p => p.user_id !== user?.id)?.user_id || user?.id;
      multiplayer.updateGameState(
        { cards: newCards, selectedCards: newSelected, showExplanation: explanation, currentParallelPair: pair, roundsCompleted: rounds, gameWon: won },
        explanation ? null : nextTurn
      );
    }
  };

  const handleCardClick = (cardId: string) => {
    if (showExplanation) return;
    if (gameMode === "online" && !multiplayer.isMyTurn) {
      toast.info("Wait for your turn!");
      return;
    }

    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
    ));
  };

  const handleCardSelect = (cardId: string) => {
    if (showExplanation) return;
    if (gameMode === "online" && !multiplayer.isMyTurn) {
      toast.info("Wait for your turn!");
      return;
    }

    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (selectedCards.includes(cardId)) {
      const newSelected = selectedCards.filter(id => id !== cardId);
      const newCards = cards.map(c => c.id === cardId ? { ...c, isSelected: false } : c);
      setSelectedCards(newSelected);
      setCards(newCards);
    } else if (selectedCards.length < 2) {
      const newSelected = [...selectedCards, cardId];
      const newCards = cards.map(c => c.id === cardId ? { ...c, isSelected: true } : c);
      setSelectedCards(newSelected);
      setCards(newCards);

      if (newSelected.length === 2) {
        checkMatch(newSelected, newCards);
      }
    }
  };

  const checkMatch = (selected: string[], currentCards: VerseCard[]) => {
    const card1 = currentCards.find(c => c.id === selected[0]);
    const card2 = currentCards.find(c => c.id === selected[1]);

    if (!card1 || !card2) return;

    if (card1.isParallel && card2.isParallel && card1.parallelId === card2.parallelId) {
      toast.success(t('cardGame.matchCorrect'));
      setShowExplanation(true);
      
      if (gameMode === "online" && multiplayer.myPlayer) {
        multiplayer.updatePlayerData(multiplayer.myPlayer.id, {}, (multiplayer.myPlayer.score || 0) + 1);
      }
      syncState(currentCards, selected, true, currentParallelPair, roundsCompleted, false);
    } else {
      toast.error(t('cardGame.matchIncorrect'));
      setTimeout(() => {
        const resetCards = currentCards.map(c => ({ ...c, isSelected: false }));
        setSelectedCards([]);
        setCards(resetCards);
        syncState(resetCards, [], false, currentParallelPair, roundsCompleted, false);
      }, 1500);
    }
  };

  const handleNextRound = () => {
    const newRoundsCompleted = roundsCompleted + 1;
    setRoundsCompleted(newRoundsCompleted);

    if (newRoundsCompleted >= 5) {
      setGameWon(true);
      if (gameMode === "online") {
        const winner = multiplayer.players.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b);
        multiplayer.updateGameState({ gameWon: true }, null, "completed", winner.user_id);
      }
    } else {
      initializeRound();
    }
  };

  const handleStartMultiplayer = () => {
    if (!multiplayer.isHost || multiplayer.players.length < 2) return;
    initializeRound();
    setTimeout(() => {
      multiplayer.startGame(
        { cards, selectedCards: [], showExplanation: false, currentParallelPair, roundsCompleted: 0, gameWon: false },
        multiplayer.players[0].user_id
      );
    }, 100);
  };

  const resetGame = () => {
    setRoundsCompleted(0);
    setGameWon(false);
    initializeRound();
  };

  // Mode selection screen
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/30">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4">🔗</div>
            <CardTitle className="text-3xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Parallels Match
            </CardTitle>
            <CardDescription className="text-slate-300">
              Match biblical parallels across Scripture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setGameMode("solo")}
              className="w-full h-16 text-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500"
            >
              <Gamepad2 className="w-6 h-6 mr-3" />
              Solo Mode
            </Button>
            <Button
              onClick={() => setGameMode("online")}
              variant="outline"
              className="w-full h-16 text-lg border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <Users className="w-6 h-6 mr-3" />
              Online Multiplayer
            </Button>
            <Button
              onClick={() => navigate("/games")}
              variant="ghost"
              className="w-full text-slate-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Multiplayer lobby
  if (gameMode === "online" && (!multiplayer.room || multiplayer.room.status === "waiting")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <MultiplayerLobby
          room={multiplayer.room}
          players={multiplayer.players}
          isHost={multiplayer.isHost}
          loading={multiplayer.loading}
          onCreateRoom={() => multiplayer.createRoom(2)}
          onJoinRoom={(code) => multiplayer.joinRoom(code)}
          onStartGame={handleStartMultiplayer}
          onLeaveRoom={() => { multiplayer.leaveRoom(); setGameMode(null); }}
          onBack={() => setGameMode(null)}
          minPlayers={2}
          gameName="PT Parallels Match"
        />
      </div>
    );
  }

  // Multiplayer scores header
  const renderMultiplayerScores = () => {
    if (gameMode !== "online") return null;
    return (
      <div className="flex justify-center gap-6 mb-4">
        {multiplayer.players.map(p => (
          <div key={p.id} className={`text-center px-4 py-2 rounded-lg border ${
            p.user_id === multiplayer.room?.current_turn_user_id
              ? 'border-amber-400 bg-amber-500/20'
              : 'border-slate-600 bg-slate-800/50'
          }`}>
            <p className="text-sm text-slate-400">{p.display_name}</p>
            <p className="text-xl font-bold text-amber-400">{p.score || 0}</p>
            {p.user_id === multiplayer.room?.current_turn_user_id && (
              <Badge className="mt-1 bg-amber-500/30 text-amber-200 text-xs">Their turn</Badge>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (gameWon) {
    const winner = gameMode === "online"
      ? multiplayer.players.find(p => p.user_id === multiplayer.room?.winner_user_id)
      : null;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/50">
          <Trophy className="w-24 h-24 mx-auto mb-6 text-amber-400" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            {winner ? `${winner.display_name} Wins!` : t('cardGame.victory')}
          </h1>
          {gameMode === "online" && (
            <div className="flex justify-center gap-6 mb-6">
              {multiplayer.players.map(p => (
                <div key={p.id} className="text-center">
                  <p className="text-slate-400">{p.display_name}</p>
                  <p className="text-3xl font-bold text-amber-400">{p.score || 0} pts</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xl text-slate-300 mb-4">
            {t('cardGame.completedRounds', { count: roundsCompleted })}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { resetGame(); if (gameMode === "online") multiplayer.leaveRoom(); setGameMode(null); }} className="gradient-palace text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('cardGame.playAgain')}
            </Button>
            <Button onClick={() => navigate("/games")} variant="outline">
              {t('cardGame.backToGames')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (gameMode === "online") multiplayer.leaveRoom(); setGameMode(null); }}
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                {t('cardGame.title')}
              </h1>
              <p className="text-sm text-amber-200/80">
                {t('cardGame.subtitle')}
                {gameMode === "online" && <Badge className="ml-2 bg-green-500/20 text-green-300">ONLINE</Badge>}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              {t('cardGame.newGame')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {renderMultiplayerScores()}

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">{t('cardGame.round')}</p>
            <p className="text-3xl font-bold text-amber-400">{roundsCompleted + 1} / 5</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">{t('cardGame.selected')}</p>
            <p className="text-3xl font-bold text-blue-400">{selectedCards.length} / 2</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-center text-slate-300">
            {gameMode === "online" && !multiplayer.isMyTurn
              ? "Waiting for opponent's turn…"
              : t('cardGame.instructions')}
          </p>
        </div>

        {showExplanation && currentParallelPair && (
          <Card className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/50">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">{t('cardGame.parallelDiscovered')}</h3>
                <p className="text-slate-300 leading-relaxed">{currentParallelPair.category}: {currentParallelPair.oldTestament.event} ↔ {currentParallelPair.newTestament.event}</p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={handleNextRound} className="gradient-palace text-white">
                {t('cardGame.continueNextRound')}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-[3/4] cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div
                className={`relative w-full h-full transition-all duration-500 ${
                  card.isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  onClick={() => handleCardClick(card.id)}
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-4 ${
                    card.isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : 'border-slate-600'
                  } shadow-xl flex flex-col items-center justify-center p-4 hover:border-amber-500/50 transition-colors`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xl font-bold text-white text-center mb-2">{card.reference}</p>
                  <p className="text-xs text-white/60">{t('cardGame.clickToRead')}</p>
                </div>

                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-4 ${
                    card.isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : 'border-slate-600'
                  } shadow-xl p-4 overflow-y-auto [transform:rotateY(180deg)]`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xs font-bold text-amber-400 mb-3">{card.reference}</p>
                  <p className="text-sm text-slate-200 leading-relaxed mb-4">{card.text}</p>
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleCardSelect(card.id); }}
                    size="sm"
                    variant={card.isSelected ? "default" : "outline"}
                    className={`w-full ${card.isSelected ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-500/50 text-amber-300 hover:bg-amber-500/20'}`}
                  >
                    {card.isSelected ? (
                      <><CheckCircle className="w-4 h-4 mr-2" />{t('cardGame.selectedLabel')}</>
                    ) : (
                      t('cardGame.selectThisVerse')
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
