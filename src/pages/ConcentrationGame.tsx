import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, RotateCcw, Trophy, Clock, Users, Gamepad2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { useAuth } from "@/hooks/useAuth";

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

interface ParallelPair {
  id: string;
  category: string;
  oldTestament: { event: string; reference: string; description: string };
  newTestament: { event: string; reference: string; description: string };
}

const PARALLEL_PAIRS: ParallelPair[] = [
  { id: "1", category: "Sacrificial Lamb", oldTestament: { event: "Isaac Bound", reference: "Genesis 22:8", description: "Abraham binds Isaac; God provides ram" }, newTestament: { event: "Jesus Crucified", reference: "John 1:29", description: "Behold the Lamb of God" }},
  { id: "2", category: "Passover Deliverance", oldTestament: { event: "Egypt's Firstborn", reference: "Exodus 12:13", description: "Lamb's blood on doorposts" }, newTestament: { event: "Christ Our Passover", reference: "1 Corinthians 5:7", description: "Christ sacrificed as Passover" }},
  { id: "3", category: "Three-Day Resurrection", oldTestament: { event: "Jonah in Fish", reference: "Jonah 1:17", description: "Three days in great fish" }, newTestament: { event: "Christ Rises", reference: "Matthew 12:40", description: "Three days in the earth" }},
  { id: "4", category: "Healing Serpent", oldTestament: { event: "Bronze Serpent", reference: "Numbers 21:9", description: "Look and live" }, newTestament: { event: "Lifted Up", reference: "John 3:14-15", description: "Son of Man lifted up" }},
  { id: "5", category: "Rock Struck", oldTestament: { event: "Water from Rock", reference: "Exodus 17:6", description: "Strike rock, water flows" }, newTestament: { event: "Spirit Flows", reference: "1 Corinthians 10:4", description: "That Rock was Christ" }},
  { id: "6", category: "Betrayed for Silver", oldTestament: { event: "Joseph Sold", reference: "Genesis 37:28", description: "Sold by brothers" }, newTestament: { event: "Christ Sold", reference: "Matthew 26:15", description: "Betrayed for silver" }},
  { id: "7", category: "Provision in Desert", oldTestament: { event: "Manna from Heaven", reference: "Exodus 16:4", description: "Bread from heaven daily" }, newTestament: { event: "Bread of Life", reference: "John 6:35", description: "I am the bread of life" }},
  { id: "8", category: "Shepherd King", oldTestament: { event: "David the Shepherd", reference: "1 Samuel 17:34-35", description: "Protects sheep, becomes king" }, newTestament: { event: "Good Shepherd", reference: "John 10:11", description: "Lays down life for sheep" }},
];

export default function ConcentrationGame() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const multiplayer = useGameMultiplayer("biblical_parallels");

  const [gameMode, setGameMode] = useState<"solo" | "online" | null>(null);
  const autoJoinCode = searchParams.get("room");

  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Timer
  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Auto-join
  useEffect(() => {
    if (autoJoinCode && !multiplayer.room) {
      setGameMode("online");
      multiplayer.joinRoom(autoJoinCode);
    }
  }, [autoJoinCode]);

  // Sync multiplayer state
  useEffect(() => {
    if (gameMode !== "online" || !multiplayer.room) return;
    const gs = multiplayer.room.game_state;
    if (gs?.cards) setCards(gs.cards);
    if (gs?.matchedPairs) setMatchedPairs(gs.matchedPairs);
    if (gs?.flippedCards !== undefined) setFlippedCards(gs.flippedCards);
    if (gs?.moves !== undefined) setMoves(gs.moves);
    if (gs?.gameComplete !== undefined) setGameComplete(gs.gameComplete);
  }, [multiplayer.room?.game_state, gameMode]);

  useEffect(() => {
    if (gameMode === "solo") initializeGame();
  }, [gameMode]);

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    PARALLEL_PAIRS.forEach(pair => {
      gameCards.push({
        id: `${pair.id}-old`, pairId: pair.id, testament: "old",
        event: pair.oldTestament.event, reference: pair.oldTestament.reference,
        description: pair.oldTestament.description, isFlipped: false, isMatched: false
      });
      gameCards.push({
        id: `${pair.id}-new`, pairId: pair.id, testament: "new",
        event: pair.newTestament.event, reference: pair.newTestament.reference,
        description: pair.newTestament.description, isFlipped: false, isMatched: false
      });
    });
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setStartTime(null);
    setElapsedTime(0);
    setGameComplete(false);
  };

  const syncState = (newCards: GameCard[], newFlipped: string[], newMatched: string[], newMoves: number, complete: boolean) => {
    if (gameMode === "online" && multiplayer.room) {
      const nextTurn = multiplayer.players.find(p => p.user_id !== user?.id)?.user_id || user?.id;
      multiplayer.updateGameState(
        { cards: newCards, flippedCards: newFlipped, matchedPairs: newMatched, moves: newMoves, gameComplete: complete },
        nextTurn
      );
    }
  };

  const handleCardClick = (cardId: string) => {
    if (!startTime) setStartTime(Date.now());
    if (gameMode === "online" && !multiplayer.isMyTurn) {
      toast.info("Wait for your turn!");
      return;
    }

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId) || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          const matchedCards = newCards.map(c => c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c);
          const newMatched = [...matchedPairs, firstCard.pairId];
          setCards(matchedCards);
          setMatchedPairs(newMatched);
          setFlippedCards([]);
          toast.success(t('concentration.parallelMatched'), { description: `${firstCard.event} ↔ ${secondCard.event}` });

          if (gameMode === "online" && multiplayer.myPlayer) {
            multiplayer.updatePlayerData(multiplayer.myPlayer.id, {}, (multiplayer.myPlayer.score || 0) + 1);
          }

          const isComplete = newMatched.length === PARALLEL_PAIRS.length;
          if (isComplete) {
            setGameComplete(true);
            if (gameMode === "online") {
              const winner = multiplayer.players.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b);
              multiplayer.updateGameState({ gameComplete: true }, null, "completed", winner.user_id);
            }
          }
          syncState(matchedCards, [], newMatched, newMoves, isComplete);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = newCards.map(c => newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c);
          setCards(resetCards);
          setFlippedCards([]);
          syncState(resetCards, [], matchedPairs, newMoves, false);
        }, 1000);
      }
    }
  };

  const handleStartMultiplayer = () => {
    if (!multiplayer.isHost || multiplayer.players.length < 2) return;
    initializeGame();
    setTimeout(() => {
      multiplayer.startGame(
        { cards, matchedPairs: [], flippedCards: [], moves: 0, gameComplete: false },
        multiplayer.players[0].user_id
      );
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode selection
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4">🎴</div>
            <CardTitle className="text-3xl bg-gradient-palace bg-clip-text text-transparent">
              Biblical Parallels Match
            </CardTitle>
            <CardDescription>Match OT events with NT fulfillments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setGameMode("solo")} className="w-full h-16 text-lg">
              <Gamepad2 className="w-6 h-6 mr-3" />
              Solo Mode
            </Button>
            <Button onClick={() => setGameMode("online")} variant="outline" className="w-full h-16 text-lg">
              <Users className="w-6 h-6 mr-3" />
              Online Multiplayer
            </Button>
            <Button onClick={() => navigate("/games")} variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Multiplayer lobby
  if (gameMode === "online" && (!multiplayer.room || multiplayer.room.status === "waiting")) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
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
          gameName="PT Biblical Parallels"
        />
      </div>
    );
  }

  const renderMultiplayerScores = () => {
    if (gameMode !== "online") return null;
    return (
      <div className="flex justify-center gap-6 mb-4">
        {multiplayer.players.map(p => (
          <div key={p.id} className={`text-center px-4 py-2 rounded-lg border ${
            p.user_id === multiplayer.room?.current_turn_user_id ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'
          }`}>
            <p className="text-sm text-muted-foreground">{p.display_name}</p>
            <p className="text-xl font-bold text-primary">{p.score || 0}</p>
            {p.user_id === multiplayer.room?.current_turn_user_id && (
              <Badge className="mt-1 text-xs">Their turn</Badge>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => { if (gameMode === "online") multiplayer.leaveRoom(); setGameMode(null); }}>
              <ArrowLeft className="h-4 w-4 mr-2" /> {t('concentration.backToGames')}
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                {t('concentration.title')}
                {gameMode === "online" && <Badge className="ml-3 align-middle">ONLINE</Badge>}
              </h1>
              <p className="text-muted-foreground mt-1">{t('concentration.subtitle')}</p>
            </div>
          </div>

          {renderMultiplayerScores()}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{matchedPairs.length}/{PARALLEL_PAIRS.length}</div>
                    <div className="text-xs text-muted-foreground">{t('concentration.pairsFound')}</div>
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
                    <div className="text-xs text-muted-foreground">{t('concentration.moves')}</div>
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
                    <div className="text-xs text-muted-foreground">{t('concentration.time')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Button onClick={initializeGame} className="w-full" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" /> {t('concentration.newGame')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {gameMode === "online" && !multiplayer.isMyTurn && (
            <div className="text-center mb-4 p-3 bg-muted/50 rounded-lg border">
              <p className="text-muted-foreground">Waiting for opponent's turn…</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(card => (
              <Card
                key={card.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  card.isFlipped || card.isMatched ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'bg-secondary/50'
                } ${card.isMatched ? 'opacity-50' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <CardHeader className="pb-3">
                  {card.isFlipped || card.isMatched ? (
                    <>
                      <Badge variant="outline" className={card.testament === "old" ? "bg-amber-500/10" : "bg-blue-500/10"}>
                        {card.testament === "old" ? t('concentration.ot') : t('concentration.nt')}
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
                    <p className="text-xs text-muted-foreground line-clamp-3">{card.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {gameComplete && (
            <Card className="mt-6 bg-gradient-palace">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {gameMode === "online"
                    ? `${multiplayer.players.find(p => p.user_id === multiplayer.room?.winner_user_id)?.display_name || "Winner"} wins!`
                    : t('concentration.excellentWork')}
                </CardTitle>
                <CardDescription className="text-white/90 text-center">
                  {gameMode === "online" ? (
                    <span className="flex justify-center gap-6 mt-2">
                      {multiplayer.players.map(p => (
                        <span key={p.id}>{p.display_name}: {p.score || 0} pts</span>
                      ))}
                    </span>
                  ) : (
                    t('concentration.completionMessage', { count: PARALLEL_PAIRS.length, moves, time: formatTime(elapsedTime) })
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
                <Button onClick={() => { initializeGame(); if (gameMode === "online") multiplayer.leaveRoom(); setGameMode(null); }} variant="secondary">
                  <RotateCcw className="h-4 w-4 mr-2" /> {t('concentration.playAgain')}
                </Button>
                <Button onClick={() => navigate("/games")} variant="outline">
                  {t('concentration.moreGames')}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('concentration.howToPlay')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>{t('concentration.instruction1')}</li>
                <li>{t('concentration.instruction2')}</li>
                <li>{t('concentration.instruction3')}</li>
                <li>{t('concentration.instruction4', { count: PARALLEL_PAIRS.length })}</li>
                <li>{t('concentration.instruction5')}</li>
                {gameMode === "online" && <li>In multiplayer, players take turns flipping cards. The player who finds the most pairs wins!</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
