import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Trophy, Flame, Sparkles, Save } from "lucide-react";
import palaceImage from "@/assets/palace-card-back.jpg";

interface Props {
  battle: any;
  currentUserId: string;
  onBack: () => void;
}

interface Player {
  player_id: string;
  display_name: string;
  cards_in_hand: string[];
  cards_played: string[];
  score: number;
}

export function BattleArena({ battle, currentUserId, onBack }: Props) {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameStatus, setGameStatus] = useState(battle.status);
  const [winner, setWinner] = useState(battle.winner);
  const [moves, setMoves] = useState<any[]>([]);
  const [expandedMoves, setExpandedMoves] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPlayers();
    loadMoves();
    
    // Subscribe to battle updates
    const channel = supabase
      .channel(`battle:${battle.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_battle_players',
        filter: `battle_id=eq.${battle.id}`
      }, () => {
        loadPlayers();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_battle_moves',
        filter: `battle_id=eq.${battle.id}`
      }, () => {
        loadMoves();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pt_card_battles',
        filter: `id=eq.${battle.id}`
      }, (payload) => {
        setGameStatus(payload.new.status);
        setWinner(payload.new.winner);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battle.id]);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from('pt_battle_players')
      .select('*')
      .eq('battle_id', battle.id);
    
    if (data) {
      setPlayers(data.map(p => ({
        player_id: p.player_id,
        display_name: p.display_name,
        cards_in_hand: Array.isArray(p.cards_in_hand) ? p.cards_in_hand.filter((c): c is string => typeof c === 'string') : [],
        cards_played: Array.isArray(p.cards_played) ? p.cards_played.filter((c): c is string => typeof c === 'string') : [],
        score: p.score,
      })));
    }
  };

  const loadMoves = async () => {
    const { data } = await supabase
      .from('pt_battle_moves')
      .select('*')
      .eq('battle_id', battle.id)
      .order('move_number', { ascending: false })
      .limit(5);
    
    if (data) {
      setMoves(data);
    }
  };

  const handlePlayCard = async () => {
    if (!selectedCard || !response.trim()) {
      toast({
        title: "Incomplete Move",
        description: "Select a card and write your response",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('judge-card-battle', {
        body: {
          battleId: battle.id,
          playerId: `user_${currentUserId}`,
          cardCode: selectedCard,
          responseText: response,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      const judgment = data.judgment;
      
      toast({
        title: judgment.verdict === 'approved' ? '✅ Approved!' : '❌ Rejected',
        description: judgment.feedback,
        variant: judgment.verdict === 'approved' ? 'default' : 'destructive',
      });

      setSelectedCard(null);
      setResponse("");
      await loadPlayers();
      await loadMoves();

      // If playing against Jeeves and move was approved, Jeeves plays next
      if (battle.mode === 'vs_jeeves' && judgment.verdict === 'approved') {
        setTimeout(() => handleJeevesPlay(), 2000);
      }

    } catch (error: any) {
      console.error('Error playing card:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJeevesPlay = async () => {
    const jeevesPlayer = players.find(p => p.player_id === 'jeeves_1');
    if (!jeevesPlayer || jeevesPlayer.cards_in_hand.length === 0) return;

    setIsSubmitting(true);
    try {
      // Pick a random card from Jeeves' hand
      const randomCard = jeevesPlayer.cards_in_hand[
        Math.floor(Math.random() * jeevesPlayer.cards_in_hand.length)
      ];

      // Generate a response from Jeeves
      const jeevesResponses = [
        `Through ${randomCard}, we see this story illuminates the sanctuary pattern where...`,
        `Applying ${randomCard} reveals how this narrative parallels the covenant structure of...`,
        `Using ${randomCard}, we discover Christ as the central figure who fulfills...`,
        `The principle ${randomCard} helps us understand this text in the cycle of redemption where...`,
        `When viewed through ${randomCard}, this passage connects to the broader prophetic timeline...`
      ];
      
      const randomResponse = jeevesResponses[Math.floor(Math.random() * jeevesResponses.length)];

      const { data, error } = await supabase.functions.invoke('judge-card-battle', {
        body: {
          battleId: battle.id,
          playerId: 'jeeves_1',
          cardCode: randomCard,
          responseText: randomResponse,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      await loadPlayers();
      await loadMoves();

      if (data.judgment.verdict === 'approved') {
        toast({
          title: "Jeeves Played",
          description: `${randomCard}: ${data.judgment.feedback}`,
        });
      }
    } catch (error: any) {
      console.error('Error with Jeeves play:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlayer = players.find(p => p.player_id === `user_${currentUserId}`);
  const opponent = players.find(p => p.player_id !== `user_${currentUserId}`);

  if (gameStatus === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white p-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Trophy className="h-32 w-32 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">
            {winner === `user_${currentUserId}` ? '🎉 Victory!' : '😊 Good Fight!'}
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            {players.find(p => p.player_id === winner)?.display_name} wins the battle!
          </p>
          <Button onClick={onBack} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modes
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and Story */}
      <div className="flex justify-between items-start">
        <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="flex-1 mx-4 bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <h3 className="font-bold">The Story</h3>
              {battle.story_reference && (
                <Badge variant="outline" className="text-xs">{battle.story_reference}</Badge>
              )}
            </div>
            <p className="text-sm text-purple-100">{battle.story_text}</p>
          </CardContent>
        </Card>
      </div>

      {/* Players */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Opponent */}
        {opponent && (
          <Card className="bg-red-500/20 backdrop-blur-xl border-red-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{opponent.display_name}</h3>
                <Badge className="bg-red-500 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  {opponent.score}
                </Badge>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: opponent.cards_in_hand.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 rounded bg-gradient-to-br from-red-600 to-pink-600 border-2 border-red-400/50"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Player */}
        {currentPlayer && (
          <Card className="bg-blue-500/20 backdrop-blur-xl border-blue-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{currentPlayer.display_name}</h3>
                <Badge className="bg-blue-500 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  {currentPlayer.score}
                </Badge>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {currentPlayer.cards_in_hand.map((card) => (
                  <motion.div
                    key={card}
                    whileHover={{ scale: 1.1, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCard(card)}
                    className={`
                      relative cursor-pointer rounded-lg p-2 text-center text-xs font-bold
                      bg-gradient-to-br from-purple-600 to-pink-600 border-2
                      ${selectedCard === card ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : 'border-purple-400/50'}
                    `}
                  >
                    <img src={palaceImage} alt="card" className="w-full h-12 object-cover rounded mb-1 opacity-30" />
                    <span className="text-white drop-shadow-lg">{card}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Move History */}
      {moves.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Recent Moves
            </h3>
            <div className="space-y-3">
              {moves.map((move) => {
                const player = players.find(p => p.player_id === move.player_id);
                const isExpanded = expandedMoves.has(move.id);
                const isJeeves = move.player_id === 'jeeves_1';
                
                return (
                  <motion.div
                    key={move.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      move.judge_verdict === 'approved'
                        ? 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20'
                        : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/20'
                    } ${isJeeves ? 'border-l-4 border-l-amber-400' : ''}`}
                    onClick={() => {
                      const newExpanded = new Set(expandedMoves);
                      if (isExpanded) {
                        newExpanded.delete(move.id);
                      } else {
                        newExpanded.add(move.id);
                      }
                      setExpandedMoves(newExpanded);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white flex items-center gap-1">
                          {player?.display_name || 'Unknown'}
                          {isJeeves && <span className="text-amber-400">🤖</span>}
                        </span>
                        <Badge className="bg-purple-500 text-white font-bold">{move.card_used}</Badge>
                        <Badge className={move.judge_verdict === 'approved' ? 'bg-green-500' : 'bg-red-500'}>
                          {move.judge_verdict === 'approved' ? '✓' : '✗'} {move.points_awarded}pts
                        </Badge>
                      </div>
                      <span className="text-xs text-white/60">Move #{move.move_number}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className={`text-sm font-semibold text-white/90 mb-1 ${isJeeves ? 'text-amber-200' : ''}`}>
                        {isJeeves ? '🎯 Jeeves\' Response:' : '📝 Your Response:'}
                      </p>
                      <p className="text-sm text-white/80 whitespace-pre-wrap">
                        {isExpanded ? move.response_text : `${move.response_text.substring(0, 150)}...`}
                      </p>
                      {!isExpanded && move.response_text.length > 150 && (
                        <button className="text-xs text-amber-400 hover:text-amber-300 mt-1">
                          Click to see full response
                        </button>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs font-semibold text-purple-300 mb-1">⚖️ Jeeves' Judgment:</p>
                      <p className="text-sm text-purple-200 italic">"{move.judge_feedback}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Area */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Your Response {selectedCard && <Badge className="ml-2 bg-amber-500">{selectedCard}</Badge>}
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="How does your selected principle card amplify this story? Show depth, insight, and biblical grounding..."
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={!selectedCard}
            />
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePlayCard}
              disabled={!selectedCard || !response.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold py-6 text-lg shadow-lg"
            >
              {isSubmitting ? (
                'Jeeves is judging...'
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Play Card & Submit to Jeeves
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}