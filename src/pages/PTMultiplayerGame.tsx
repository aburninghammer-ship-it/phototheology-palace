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
import { Loader2, Users, Trophy, Clock, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface Card {
  id: string;
  card_type: string;
  card_data: {
    value: string;
    name: string;
  };
  is_drawn: boolean;
  drawn_by: string | null;
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

// Principle explanations
const PRINCIPLE_EXPLANATIONS: Record<string, string> = {
  // Cycles
  "@Ad": "Adamic Cycle - Eden to Promise",
  "@No": "Noahic Cycle - Flood to Covenant",
  "@Ab": "Abrahamic Cycle - Call to Covenant People",
  "@Mo": "Mosaic Cycle - Exodus to Sanctuary Nation",
  "@Cy": "Cyrusic Cycle - Exile to Return & Rebuild",
  "@CyC": "Cyrus-Christ Cycle - Type to Antitype Deliverer",
  "@Sp": "Holy Spirit Cycle - Church Age to Pentecost",
  "@Re": "Remnant Cycle - End-Time Witness to Second Coming",
  
  // Floor 1 - Furnishing
  "SR": "Story Room - Recall narratives in sequence",
  "IR": "Imagination Room - Step inside the story",
  "24F": "24FPS - One image per chapter",
  "BR": "Bible Rendered - Master images per 24 chapters",
  "TR": "Translation Room - Words become pictures",
  "GR": "Gems Room - Store powerful insights",
  
  // Floor 2 - Investigation
  "OR": "Observation Room - Notice details like a detective",
  "DC": "Def-Com - Greek/Hebrew definitions & context",
  "ST": "Symbols/Types - God's universal language",
  "QR": "Questions Room - Interrogate until truth emerges",
  "QA": "Q&A Chains - Scripture answers Scripture",
  
  // Floor 3 - Freestyle
  "NF": "Nature Freestyle - Creation teaches Scripture",
  "PF": "Personal Freestyle - Your life as object lesson",
  "BF": "Bible Freestyle - Verse genetics & connections",
  "HF": "History Freestyle - World events through Bible lens",
  "LR": "Listening Room - Turn conversations into connections",
  
  // Floor 4 - Next Level
  "CR": "Concentration - Every text reveals Christ",
  "DR": "Dimensions - 5 layers of meaning",
  "C6": "Connect 6 - Genre rules of language",
  "TRm": "Theme Room - Great walls of biblical architecture",
  "TZ": "Time Zone - Past, present, future placement",
  "PRm": "Patterns Room - God's fingerprints across Scripture",
  "P‖": "Parallels Room - Mirrored actions across time",
  "FRt": "Fruit Room - Test for Christlike character",
  "CEC": "Christ in Every Chapter - Explicit Christ-thread",
  "R66": "Room 66 - One theme through all 66 books",
  
  // Floor 5 - Vision
  "BL": "Blue/Sanctuary - Blueprint of redemption",
  "PR": "Prophecy Room - Timelines aligned like stars",
  "3A": "Three Angels - Final gospel & mission",
  
  // Floor 6 - Three Heavens
  "JR": "Juice Room - Squeeze every drop of meaning",
  
  // Floor 7 - Spiritual
  "FRm": "Fire Room - Truth burns into heart",
  "MR": "Meditation Room - Marinate in truth",
  "SRm": "Speed Room - Rapid recall & application",
  
  // Dimensions
  "Asc-1": "Text Ascension - Word level study",
  "Asc-2": "Chapter Ascension - Storyline placement",
  "Asc-3": "Book Ascension - Overarching theme",
  "Asc-4": "Cycle Ascension - Covenant cycle",
  "Asc-5": "Heaven Ascension - Cosmic context",
  
  // Expansions
  "Exp-W": "Width Expansion - Content & memory",
  "Exp-T": "Time Expansion - Continuous practice",
  "Exp-D": "Depth Expansion - Christ-centered structure",
  "Exp-H": "Height Expansion - Transformation & mastery",
  
  // Heavens
  "1H": "First Heaven - Babylon & Restoration",
  "2H": "Second Heaven - New Covenant order",
  "3H": "Third Heaven - Final cosmic renewal",
};

const PTMultiplayerGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [cardValue, setCardValue] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const isVsJeevesMode = game?.game_mode === "1v1-jeeves" || game?.game_mode === "team-vs-jeeves";

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
      let cp = playersRes.data.find(p => p.user_id === user.id);
      
      // Auto-join: If user is not in players list yet, add them
      if (!cp && gameRes.data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        const displayName = profileData?.display_name || 'Player';
        
        const { data: newPlayer } = await supabase
          .from('pt_multiplayer_players')
          .insert({
            game_id: gameId,
            user_id: user.id,
            display_name: displayName,
          })
          .select()
          .single();

        if (newPlayer) {
          cp = newPlayer;
          // Refresh players list
          const { data: updatedPlayers } = await supabase
            .from('pt_multiplayer_players')
            .select('*')
            .eq('game_id', gameId)
            .order('joined_at');
          
          if (updatedPlayers) {
            setPlayers(updatedPlayers);
            playersRes.data = updatedPlayers;
          }
        }
      }
      
      setCurrentPlayer(cp || null);

      // Fetch my cards
      if (cp) {
        const { data: cardsData } = await supabase
          .from('pt_multiplayer_deck')
          .select('*')
          .eq('game_id', gameId)
          .eq('drawn_by', cp.id)
          .eq('is_drawn', true);
        
        if (cardsData) {
          setMyCards(cardsData.map(card => ({
            ...card,
            card_data: card.card_data as { value: string; name: string }
          })));
        }
      }

      // Auto-start game if it's still waiting
      if (gameRes.data?.status === 'waiting' && playersRes.data && playersRes.data.length > 0) {
        console.log('[PTMultiplayer] Attempting auto-start for game', gameRes.data.id);
        await autoStartGame(gameRes.data.id, playersRes.data);
        // Refresh game data after auto-start
        const { data: updatedGame } = await supabase
          .from('pt_multiplayer_games')
          .select('*')
          .eq('id', gameId)
          .single();
        if (updatedGame) {
          console.log('[PTMultiplayer] Game auto-started, updated status:', updatedGame.status);
          setGame(updatedGame);
        }
      }
    }

    setLoading(false);
  };

  const autoStartGame = async (gameId: string, playersList: Player[]) => {
    try {
      console.log('[PTMultiplayer] Auto-start: dealing cards for game', gameId);
      // Deal the cards
      const { error: dealError } = await supabase.functions.invoke('deal-pt-cards', {
        body: { gameId }
      });

      if (dealError) {
        console.error('[PTMultiplayer] Error dealing cards:', dealError);
        toast({
          title: 'Error starting game',
          description: dealError.message || 'Failed to deal cards for this game.',
          variant: 'destructive',
        });
        return;
      }

      console.log('[PTMultiplayer] Auto-start: activating game', gameId);
      // Activate the game
      const { error } = await supabase
        .from('pt_multiplayer_games')
        .update({ 
          status: 'active',
          current_turn_player_id: playersList[0]?.id ?? null,
        })
        .eq('id', gameId);

      if (error) {
        console.error('[PTMultiplayer] Error auto-starting game:', error);
        toast({
          title: 'Error starting game',
          description: error.message || 'Failed to activate this game.',
          variant: 'destructive',
        });
        return;
      }

      // Update local state
      setGame((prev) =>
        prev
          ? {
              ...prev,
              status: 'active',
              current_turn_player_id: playersList[0]?.id ?? null,
            }
          : prev
      );
    } catch (error: any) {
      console.error('[PTMultiplayer] Error in auto-start:', error);
      toast({
        title: 'Error starting game',
        description: error.message || 'Unexpected error while starting the game.',
        variant: 'destructive',
      });
    }
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
      // First, have Jeeves deal the cards
      const { error: dealError } = await supabase.functions.invoke('deal-pt-cards', {
        body: { gameId: game.id }
      });

      if (dealError) {
        console.error("Error dealing cards:", dealError);
        throw new Error("Failed to deal cards");
      }

      // Then activate the game
      const { error } = await supabase
        .from('pt_multiplayer_games')
        .update({ 
          status: 'active',
          current_turn_player_id: players[0]?.id ?? null,
        })
        .eq('id', game.id);

      if (error) throw error;

      // Optimistically update local state
      setGame((prev) =>
        prev
          ? {
              ...prev,
              status: 'active',
              current_turn_player_id: players[0]?.id ?? null,
            }
          : prev
      );
      
      toast({ title: "🎴 Jeeves has dealt the cards! Game started!" });
    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({ 
        title: "Error starting game", 
        description: error.message || "Something went wrong", 
        variant: "destructive" 
      });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-bold text-white">PT Multiplayer</h1>
            {isVsJeevesMode && <Bot className="w-8 h-8 text-purple-400" />}
          </div>
          <p className="text-purple-200">Study Topic: <span className="font-semibold">{game.study_topic}</span></p>
          <Badge variant={game.status === 'active' ? 'default' : 'secondary'} className="mt-2">
            {game.status.toUpperCase()}
          </Badge>
        </div>

        {/* Game Table Layout */}
        <div className="relative">
          {/* Opponent's Side (Top) */}
          <div className="mb-8">
            <AnimatePresence>
              {players.filter(p => p.id !== currentPlayer?.id).map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl mb-2 ${
                    game.current_turn_player_id === player.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' 
                      : 'bg-slate-800/80 backdrop-blur'
                  }`}
                >
                  <Avatar className="w-10 h-10 border-2 border-purple-400">
                    <AvatarFallback className="bg-purple-600 text-white">{player.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center gap-2">
                      {player.display_name}
                      {player.display_name.includes('Jeeves') && <Bot className="w-4 h-4 text-purple-400" />}
                    </p>
                    <div className="flex gap-3 text-sm text-purple-200">
                      <span>🃏 {player.cards_remaining}</span>
                      <span>⭐ {player.score}pts</span>
                    </div>
                  </div>
                  {player.skip_next_turn && (
                    <Badge variant="destructive" className="text-xs">Skip Turn</Badge>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Playing Field (Center) */}
          <Card className="bg-gradient-to-br from-green-900 to-emerald-950 border-4 border-yellow-600 shadow-2xl relative overflow-hidden">
            {/* Table texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            
            <div className="relative z-10 p-8">

              {game.status === 'waiting' && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Setting up the game...</h2>
                  <p className="text-purple-200 mt-2">Jeeves is dealing the cards</p>
                </div>
              )}

              {game.status === 'active' && (
                <div>
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {isMyTurn ? "🎯 Your Turn!" : `⏳ ${players.find(p => p.id === game.current_turn_player_id)?.display_name}'s turn...`}
                    </h3>
                  </div>

                  {/* Recent Moves Feed */}
                  <ScrollArea className="h-[300px] mb-6">
                    <div className="space-y-3">
                      {moves.map((move) => {
                        const player = players.find(p => p.id === move.player_id);
                        const verdictColor = 
                          move.jeeves_verdict === 'approved' ? 'border-green-500 bg-green-950/50' :
                          move.jeeves_verdict === 'partial' ? 'border-yellow-500 bg-yellow-950/50' :
                          'border-red-500 bg-red-950/50';
                        const verdictIcon =
                          move.jeeves_verdict === 'approved' ? '✔' :
                          move.jeeves_verdict === 'partial' ? '△' :
                          '✘';

                        return (
                          <motion.div
                            key={move.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`p-4 rounded-lg border-2 backdrop-blur ${verdictColor}`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-slate-700 text-white">
                                  {player?.display_name[0] || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-sm text-white">{player?.display_name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {move.card_type}
                                  </Badge>
                                  {move.card_data?.value && (
                                    <Badge variant="secondary" className="text-xs">
                                      {move.card_data.value}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-purple-100 mb-2">{move.explanation}</p>
                                <div className={`text-sm font-semibold mb-1 ${
                                  move.jeeves_verdict === 'approved' ? 'text-green-400' :
                                  move.jeeves_verdict === 'partial' ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {verdictIcon} Jeeves: {move.jeeves_verdict.toUpperCase()}
                                </div>
                                <p className="text-xs text-purple-200 italic">{move.jeeves_feedback}</p>
                                {move.points_awarded > 0 && (
                                  <p className="text-xs text-green-400 font-semibold mt-1">
                                    +{move.points_awarded} points
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {game.status === 'completed' && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-3xl font-bold mb-4 text-white">Game Complete!</h2>
                  {players.sort((a, b) => a.cards_remaining - a.cards_remaining || b.score - a.score)[0] && (
                    <div>
                      <p className="text-xl mb-2 text-purple-200">Winner:</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {players.sort((a, b) => a.cards_remaining - a.cards_remaining || b.score - a.score)[0].display_name}
                      </p>
                      <p className="text-purple-200 mt-2">
                        Score: {players[0].score} points
                      </p>
                    </div>
                  )}
                  <Button onClick={() => navigate('/card-deck')} className="mt-6">
                    Back to Deck
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Your Side (Bottom) */}
          {currentPlayer && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8"
            >
              <Card className={`p-6 ${isMyTurn ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50' : 'bg-slate-800/80 backdrop-blur'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-blue-400">
                    <AvatarFallback className="bg-blue-600 text-white">{currentPlayer.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">{currentPlayer.display_name} (You)</p>
                    <div className="flex gap-4 text-sm text-blue-200">
                      <span>🃏 {currentPlayer.cards_remaining} cards</span>
                      <span>⭐ {currentPlayer.score} points</span>
                    </div>
                  </div>
                </div>

                {/* Show player's cards */}
                {myCards.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-white">Your Cards (Principles)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {myCards.map((card) => (
                        <motion.div
                          key={card.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className="cursor-pointer transition-all hover:shadow-lg hover:border-purple-400 bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-600"
                            onClick={() => setCardValue(card.card_data.value)}
                          >
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="bg-purple-700/50 text-white border-purple-400">
                                  {card.card_data.value}
                                </Badge>
                                <Sparkles className="w-4 h-4 text-purple-300" />
                              </div>
                              <p className="text-xs text-purple-100 leading-tight">
                                {PRINCIPLE_EXPLANATIONS[card.card_data.value] || "Phototheology Principle"}
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {isMyTurn && !currentPlayer.skip_next_turn && game.status === 'active' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Card Value (Select from your cards above or type)
                      </label>
                      <input
                        type="text"
                        value={cardValue}
                        onChange={(e) => setCardValue(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border bg-background"
                        placeholder="Click a card above or type (e.g., @Cy, SR, John 3:16)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
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
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
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
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PTMultiplayerGame;
