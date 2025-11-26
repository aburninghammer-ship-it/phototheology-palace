import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, Trophy, Clock, Sparkles } from "lucide-react";

interface Player {
  id: string;
  user_id: string;
  display_name: string;
  cards_remaining: number;
  score: number;
  team: string | null;
  skip_next_turn: boolean;
  consecutive_rejections: number;
}

interface Move {
  id: string;
  player_id: string;
  card_type: string;
  card_data: any;
  explanation: string;
  jeeves_verdict: string;
  jeeves_feedback: string;
  points_awarded: number;
  created_at: string;
}

interface Game {
  id: string;
  game_mode: string;
  study_topic: string;
  status: string;
  current_turn_player_id: string | null;
  host_id: string;
}

const CARD_TYPES = [
  { type: "room", label: "Room Card", color: "bg-blue-500" },
  { type: "principle", label: "Principle Card", color: "bg-purple-500" },
  { type: "theme", label: "Theme Card", color: "bg-green-500" },
  { type: "verse", label: "Verse Card", color: "bg-yellow-500" },
  { type: "sanctuary", label: "Sanctuary Code", color: "bg-red-500" },
  { type: "24fps", label: "24FPS Action", color: "bg-orange-500" },
  { type: "boost", label: "Boost Card", color: "bg-pink-500" },
  { type: "sabotage", label: "Sabotage Card", color: "bg-gray-700" },
];

const PTMultiplayerGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [cardValue, setCardValue] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    fetchGameData();
    subscribeToUpdates();
  }, [gameId]);

  const fetchGameData = async () => {
    if (!gameId) return;

    const [gameRes, playersRes, movesRes] = await Promise.all([
      supabase.from('pt_multiplayer_games').select('*').eq('id', gameId).single(),
      supabase.from('pt_multiplayer_players').select('*').eq('game_id', gameId).order('joined_at'),
      supabase.from('pt_multiplayer_moves').select('*').eq('game_id', gameId).order('created_at', { ascending: false }).limit(20)
    ]);

    if (gameRes.data) setGame(gameRes.data);
    if (playersRes.data) setPlayers(playersRes.data);
    if (movesRes.data) setMoves(movesRes.data);

    const { data: { user } } = await supabase.auth.getUser();
    if (user && playersRes.data) {
      const cp = playersRes.data.find(p => p.user_id === user.id);
      setCurrentPlayer(cp || null);
    }

    setLoading(false);
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`pt-game-${gameId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pt_multiplayer_games', filter: `id=eq.${gameId}` }, 
        () => fetchGameData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pt_multiplayer_players', filter: `game_id=eq.${gameId}` }, 
        () => fetchGameData())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pt_multiplayer_moves', filter: `game_id=eq.${gameId}` }, 
        () => fetchGameData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handlePlayCard = async () => {
    if (!selectedCardType || !cardValue || !explanation || !currentPlayer || !game) {
      toast({ title: "Missing information", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (game.current_turn_player_id && game.current_turn_player_id !== currentPlayer.id) {
      toast({ title: "Not your turn", variant: "destructive" });
      return;
    }

    if (currentPlayer.skip_next_turn) {
      toast({ title: "Turn skipped", description: "You must skip this turn due to 3 consecutive rejections", variant: "destructive" });
      await supabase.from('pt_multiplayer_players').update({ skip_next_turn: false }).eq('id', currentPlayer.id);
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('judge-pt-card-play', {
        body: {
          gameId: game.id,
          playerId: currentPlayer.id,
          cardType: selectedCardType,
          cardData: { value: cardValue },
          explanation: explanation,
          studyTopic: game.study_topic,
          isCombo: false,
          comboCards: null
        }
      });

      if (error) throw error;

      const verdict = data.verdict;
      toast({
        title: verdict === 'approved' ? '✔ Approved!' : verdict === 'partial' ? '△ Needs Clarification' : '✘ Rejected',
        description: data.feedback,
        variant: verdict === 'rejected' ? 'destructive' : 'default'
      });

      // Clear form
      setSelectedCardType("");
      setCardValue("");
      setExplanation("");

      // Move to next player if approved or rejected
      if (verdict === 'approved' || verdict === 'rejected') {
        const currentIndex = players.findIndex(p => p.id === currentPlayer.id);
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];
        
        await supabase
          .from('pt_multiplayer_games')
          .update({ current_turn_player_id: nextPlayer.id })
          .eq('id', game.id);
      }

    } catch (error: any) {
      console.error("Error submitting play:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit play",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startGame = async () => {
    if (!game || !currentPlayer) return;
    
    try {
      await supabase
        .from('pt_multiplayer_games')
        .update({ 
          status: 'active',
          current_turn_player_id: players[0]?.id 
        })
        .eq('id', game.id);
        
      toast({ title: "Game started!" });
    } catch (error: any) {
      toast({ title: "Error starting game", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6">
          <p>Game not found</p>
          <Button onClick={() => navigate('/card-deck')} className="mt-4">Back to Deck</Button>
        </Card>
      </div>
    );
  }

  const isMyTurn = currentPlayer && game.current_turn_player_id === currentPlayer.id;
  const isHost = currentPlayer && game.host_id === currentPlayer.user_id;

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">PT Multiplayer: Jeeves the Judge</h1>
          <Badge variant={game.status === 'active' ? 'default' : 'secondary'}>
            {game.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-muted-foreground">Study Topic: <span className="font-semibold">{game.study_topic}</span></p>
        <p className="text-sm text-muted-foreground">Mode: {game.game_mode}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players Sidebar */}
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" />
            <h2 className="font-bold text-lg">Players ({players.length})</h2>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    game.current_turn_player_id === player.id ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>{player.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{player.display_name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>🃏 {player.cards_remaining}</span>
                      <span>⭐ {player.score}pts</span>
                    </div>
                    {player.skip_next_turn && (
                      <Badge variant="destructive" className="text-xs mt-1">Skip Turn</Badge>
                    )}
                    {player.consecutive_rejections > 0 && (
                      <p className="text-xs text-red-500">❌ {player.consecutive_rejections}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Game Area */}
        <Card className="p-6 lg:col-span-2">
          {game.status === 'waiting' && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Waiting for Players...</h2>
              <p className="text-muted-foreground mb-6">
                {players.length} player{players.length !== 1 ? 's' : ''} joined
              </p>
              {isHost && (
                <Button onClick={startGame} size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              )}
            </div>
          )}

          {game.status === 'active' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">
                  {isMyTurn ? "🎯 Your Turn!" : `⏳ Waiting for ${players.find(p => p.id === game.current_turn_player_id)?.display_name}'s play...`}
                </h3>
              </div>

              {isMyTurn && !currentPlayer?.skip_next_turn && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Card Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {CARD_TYPES.slice(0, 6).map((card) => (
                        <Button
                          key={card.type}
                          variant={selectedCardType === card.type ? "default" : "outline"}
                          onClick={() => setSelectedCardType(card.type)}
                          className="h-auto py-3 text-xs"
                        >
                          {card.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedCardType && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Card Value (e.g., @Cy, Story Room, John 3:16)
                        </label>
                        <input
                          type="text"
                          value={cardValue}
                          onChange={(e) => setCardValue(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border bg-background"
                          placeholder="Enter the specific card (e.g., @Cy, Prophecy Room, Exodus 12:13)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Explain Your Play (How does this advance the study?)
                        </label>
                        <Textarea
                          value={explanation}
                          onChange={(e) => setExplanation(e.target.value)}
                          placeholder="Explain how this card connects to the study topic and advances our understanding..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <Button 
                        onClick={handlePlayCard} 
                        disabled={submitting || !cardValue || !explanation}
                        className="w-full"
                        size="lg"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Jeeves is judging...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit to Jeeves
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Move History */}
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Moves
                </h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {moves.map((move) => {
                      const player = players.find(p => p.id === move.player_id);
                      const verdictColor = 
                        move.jeeves_verdict === 'approved' ? 'text-green-600' :
                        move.jeeves_verdict === 'partial' ? 'text-yellow-600' :
                        'text-red-600';
                      const verdictIcon =
                        move.jeeves_verdict === 'approved' ? '✔' :
                        move.jeeves_verdict === 'partial' ? '△' :
                        '✘';

                      return (
                        <Card key={move.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {player?.display_name[0] || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm">{player?.display_name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {move.card_type}
                                </Badge>
                                {move.card_data?.value && (
                                  <Badge variant="secondary" className="text-xs">
                                    {move.card_data.value}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground/80 mb-2">{move.explanation}</p>
                              <div className={`text-sm font-semibold ${verdictColor} mb-1`}>
                                {verdictIcon} Jeeves: {move.jeeves_verdict.toUpperCase()}
                              </div>
                              <p className="text-xs text-muted-foreground italic">{move.jeeves_feedback}</p>
                              {move.points_awarded > 0 && (
                                <p className="text-xs text-green-600 font-semibold mt-1">
                                  +{move.points_awarded} points
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {game.status === 'completed' && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
              {players.sort((a, b) => a.cards_remaining - a.cards_remaining || b.score - a.score)[0] && (
                <div>
                  <p className="text-xl mb-2">Winner:</p>
                  <p className="text-2xl font-bold text-primary">
                    {players.sort((a, b) => a.cards_remaining - a.cards_remaining || b.score - a.score)[0].display_name}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Score: {players[0].score} points
                  </p>
                </div>
              )}
              <Button onClick={() => navigate('/card-deck')} className="mt-6">
                Back to Deck
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PTMultiplayerGame;
