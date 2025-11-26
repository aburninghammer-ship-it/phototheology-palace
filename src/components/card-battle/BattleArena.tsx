import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Trophy, Flame, Sparkles, Save, HelpCircle } from "lucide-react";
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

// Principle descriptions map
const PRINCIPLE_INFO: Record<string, { name: string; description: string }> = {
  "CR": { name: "Concentration Room", description: "Every text must reveal Christ. No matter how ordinary a verse looks, it must point to Jesus." },
  "DR": { name: "Dimensions Room", description: "View texts through 5 dimensions: Literal, Christ, Me (personal), Church (corporate), and Heaven (eternal)." },
  "SR": { name: "Story Room", description: "Store Bible stories as vivid mental movies - each story becomes a memorable scene." },
  "IR": { name: "Imagination Room", description: "Step inside stories with sanctified imagination - feel, see, and experience Scripture emotionally." },
  "OR": { name: "Observation Room", description: "Notice details without interpretation - log fingerprints and footprints like a detective." },
  "DC": { name: "Def-Com Room", description: "Test words under microscope - Greek/Hebrew definitions and historical/cultural commentary." },
  "ST": { name: "Symbols/Types Room", description: "Recognize God's universal language - Lamb=Christ, Rock=Christ, Light=truth." },
  "QR": { name: "Questions Room", description: "Ask relentless questions until truth emerges - interrogate the text thoroughly." },
  "PR": { name: "Prophecy Room", description: "Align prophetic timelines like stars in constellations - Daniel, Revelation, and more." },
  "BL": { name: "Blue Room (Sanctuary)", description: "The sanctuary is the blueprint of salvation - every piece points to Christ's work." },
  "3A": { name: "Three Angels' Room", description: "The final gospel message from Revelation 14 - everlasting gospel, Babylon fallen, mark warning." },
};

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
  const [lastJudgment, setLastJudgment] = useState<any>(null);
  const [showRejectionOptions, setShowRejectionOptions] = useState(false);
  const [isChallenging, setIsChallenging] = useState(false);

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
      setLastJudgment(judgment);
      
      if (judgment.verdict === 'rejected') {
        setShowRejectionOptions(true);
        toast({
          title: '❌ Rejected by Jeeves',
          description: "You can challenge Jeeves' judgment or pick another card.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: '✅ Approved!',
          description: judgment.feedback,
        });
        setSelectedCard(null);
        setResponse("");
        setShowRejectionOptions(false);
        await loadPlayers();
        await loadMoves();

        // If playing against Jeeves, he plays next after approval
        if (battle.mode === 'vs_jeeves') {
          setTimeout(() => handleJeevesPlay(), 2000);
        }
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

  const handleChallenge = async () => {
    if (!lastJudgment) return;

    setIsChallenging(true);
    try {
      const { data, error } = await supabase.functions.invoke('challenge-judgment', {
        body: {
          battleId: battle.id,
          playerId: `user_${currentUserId}`,
          originalJudgment: lastJudgment,
          cardCode: selectedCard,
          responseText: response,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      const finalVerdict = data.finalVerdict;
      
      if (finalVerdict === 'challenge_upheld') {
        toast({
          title: '✅ Challenge Successful!',
          description: 'Jeeves has reconsidered - your move is now approved!',
        });
        setSelectedCard(null);
        setResponse("");
        setShowRejectionOptions(false);
        await loadPlayers();
        await loadMoves();

        // Jeeves plays next after successful challenge
        if (battle.mode === 'vs_jeeves') {
          setTimeout(() => handleJeevesPlay(), 2000);
        }
      } else {
        toast({
          title: '❌ Challenge Denied',
          description: data.explanation || 'Jeeves stands by his original judgment.',
          variant: 'destructive',
        });
        // Keep rejection options visible
      }
    } catch (error: any) {
      console.error('Error challenging:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChallenging(false);
    }
  };

  const handlePickAnotherCard = () => {
    setSelectedCard(null);
    setResponse("");
    setShowRejectionOptions(false);
    setLastJudgment(null);
    toast({
      title: "Pick Another Card",
      description: "Select a different principle card to try again.",
    });
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
                  <div key={card} className="relative">
                    <motion.div
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <button 
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 border border-white/30 flex items-center justify-center text-white/80 hover:bg-purple-500 hover:text-white transition-colors z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400/30">
                        <div className="space-y-2">
                          <h4 className="font-bold text-amber-300">{PRINCIPLE_INFO[card]?.name || card}</h4>
                          <p className="text-sm text-white/90">{PRINCIPLE_INFO[card]?.description || "Phototheology principle"}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
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
                        <div className="flex items-center gap-1">
                          <Badge className="bg-purple-500 text-white font-bold">{move.card_used}</Badge>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button 
                                className="text-white/60 hover:text-purple-400 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400/30">
                              <div className="space-y-2">
                                <h4 className="font-bold text-amber-300">{PRINCIPLE_INFO[move.card_used]?.name || move.card_used}</h4>
                                <p className="text-sm text-white/90">{PRINCIPLE_INFO[move.card_used]?.description || "Phototheology principle"}</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
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
          {/* Show rejection options if card was rejected */}
          {showRejectionOptions && lastJudgment && (
            <div className="p-4 bg-red-500/20 border-2 border-red-400/50 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h4 className="font-bold text-red-200 mb-1">Jeeves Rejected Your Move</h4>
                  <p className="text-sm text-red-100 italic mb-3">"{lastJudgment.feedback}"</p>
                  <p className="text-sm text-white/80 mb-3">
                    You can challenge Jeeves' judgment or pick a different card to try again.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleChallenge}
                  disabled={isChallenging}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  {isChallenging ? 'Challenging...' : '⚔️ Challenge Jeeves'}
                </Button>
                <Button
                  onClick={handlePickAnotherCard}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  🔄 Pick Another Card
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Your Response {selectedCard && <Badge className="ml-2 bg-amber-500">{selectedCard}</Badge>}
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="How does your selected principle card amplify this story? Show depth, insight, and biblical grounding..."
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={!selectedCard || showRejectionOptions}
            />
          </div>
          
          {!showRejectionOptions && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}