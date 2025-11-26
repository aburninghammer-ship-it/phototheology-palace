import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Scroll } from "lucide-react";
import { GameMode } from "./PTCardBattle";
import { getVerses } from "biblesdk";

interface Props {
  mode: GameMode;
  onBattleStart: (battle: any) => void;
  onBack: () => void;
}

// All available PT principle cards
const ALL_PRINCIPLE_CARDS = [
  "@Ad", "@No", "@Ab", "@Mo", "@Cy", "@CyC", "@Sp", "@Re",
  "1H", "2H", "3H",
  "DR-1D", "DR-2D", "DR-3D", "DR-4D", "DR-5D",
  "C6-Pr", "C6-Pa", "C6-Ep", "C6-Hi", "C6-Go", "C6-Po",
  "TZ-HP", "TZ-HN", "TZ-HF", "TZ-EP", "TZ-EN", "TZ-EF",
  "BL-Gate", "BL-Altar", "BL-Laver", "BL-Lamp", "BL-Table", "BL-Incense", "BL-Veil", "BL-Ark",
  "FR-Pass", "FR-Unlv", "FR-First", "FR-Pent", "FR-Trum", "FR-Aton", "FR-Tab",
  "FRt-Love", "FRt-Joy", "FRt-Peace", "FRt-Patience", "FRt-Kindness", "FRt-Goodness",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function BattleLobby({ mode, onBattleStart, onBack }: Props) {
  const { toast } = useToast();
  const [storyText, setStoryText] = useState("");
  const [storyReference, setStoryReference] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [whoGoesFirst, setWhoGoesFirst] = useState<'dr_jeeves' | 'professor_jeeves'>('dr_jeeves');
  const [battleCode, setBattleCode] = useState<string | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const generateBattleCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateBattle = async () => {
    if (!storyText.trim()) {
      toast({
        title: "Story Required",
        description: "Please enter a Bible story or text",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if input is just a reference and fetch the full verse text
      let finalStoryText = storyText;
      let finalReference = storyReference;
      
      // Pattern to detect Bible references (verse or chapter)
      // Matches: "Rev 13:11", "John 3:16", "Genesis 22", "Rev. 13"
      const versePattern = /^(\d?\s?[A-Za-z]+)\.?\s?(\d+):(\d+)$/;
      const chapterPattern = /^(\d?\s?[A-Za-z]+)\.?\s?(\d+)$/;
      
      const verseMatch = storyText.trim().match(versePattern);
      const chapterMatch = !verseMatch && storyText.trim().match(chapterPattern);
      
      if (verseMatch || chapterMatch) {
        try {
          // Map common book names to BibleSDK codes
          const bookMap: Record<string, string> = {
            'Gen': 'GEN', 'Genesis': 'GEN', 'Ex': 'EXO', 'Exodus': 'EXO',
            'Lev': 'LEV', 'Leviticus': 'LEV', 'Num': 'NUM', 'Numbers': 'NUM',
            'Deut': 'DEU', 'Deuteronomy': 'DEU', 'Josh': 'JOS', 'Joshua': 'JOS',
            'Judg': 'JDG', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Sam': '1SA',
            '2 Sam': '2SA', '1 Kings': '1KI', '2 Kings': '2KI', '1 Chr': '1CH',
            '2 Chr': '2CH', 'Ezra': 'EZR', 'Neh': 'NEH', 'Esth': 'EST',
            'Job': 'JOB', 'Ps': 'PSA', 'Psalm': 'PSA', 'Psalms': 'PSA',
            'Prov': 'PRO', 'Proverbs': 'PRO', 'Eccl': 'ECC', 'Ecclesiastes': 'ECC',
            'Song': 'SNG', 'Is': 'ISA', 'Isaiah': 'ISA', 'Jer': 'JER',
            'Jeremiah': 'JER', 'Lam': 'LAM', 'Ezek': 'EZK', 'Ezekiel': 'EZK',
            'Dan': 'DAN', 'Daniel': 'DAN', 'Hos': 'HOS', 'Joel': 'JOL',
            'Amos': 'AMO', 'Obad': 'OBA', 'Jonah': 'JON', 'Mic': 'MIC',
            'Nah': 'NAM', 'Hab': 'HAB', 'Zeph': 'ZEP', 'Hag': 'HAG',
            'Zech': 'ZEC', 'Mal': 'MAL',
            'Matt': 'MAT', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
            'John': 'JHN', 'Acts': 'ACT', 'Rom': 'ROM', 'Romans': 'ROM',
            '1 Cor': '1CO', '2 Cor': '2CO', 'Gal': 'GAL', 'Galatians': 'GAL',
            'Eph': 'EPH', 'Ephesians': 'EPH', 'Phil': 'PHP', 'Philippians': 'PHP',
            'Col': 'COL', 'Colossians': 'COL', '1 Thess': '1TH', '2 Thess': '2TH',
            '1 Tim': '1TI', '2 Tim': '2TI', 'Titus': 'TIT', 'Philem': 'PHM',
            'Heb': 'HEB', 'Hebrews': 'HEB', 'James': 'JAS', '1 Pet': '1PE',
            '2 Pet': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN',
            'Jude': 'JUD', 'Rev': 'REV', 'Revelation': 'REV'
          };
          
          if (verseMatch) {
            // Single verse reference
            const bookName = verseMatch[1].trim();
            const chapter = parseInt(verseMatch[2]);
            const verse = parseInt(verseMatch[3]);
            
            const bookCode = bookMap[bookName] || bookMap[bookName.replace('.', '')];
            if (bookCode) {
              const response: any = await getVerses(bookCode, chapter, [verse, verse]);
              if (response && response.phrases && response.phrases.length > 0) {
                finalStoryText = response.phrases.map((p: any) => p.text).join(' ');
                finalReference = storyText.trim();
                
                toast({
                  title: "Verse Loaded",
                  description: `Fetched full text for ${storyText.trim()}`,
                });
              }
            }
          } else if (chapterMatch) {
            // Chapter reference - just display chapter number
            const bookName = chapterMatch[1].trim();
            const chapterNum = chapterMatch[2];
            finalStoryText = `${bookName} Chapter ${chapterNum}`;
            finalReference = storyText.trim();
            
            toast({
              title: "Chapter Reference",
              description: `Set to ${finalStoryText}`,
            });
          }
        } catch (error) {
          console.error('Error fetching verse:', error);
          // Continue with original text if fetch fails
        }
      }

      // Shuffle and deal cards
      const shuffled = shuffleArray(ALL_PRINCIPLE_CARDS);
      
      // Decide who starts based on mode
      const initialCurrentTurnPlayer = mode === 'jeeves_vs_jeeves'
        ? (whoGoesFirst === 'dr_jeeves' ? 'jeeves_1' : 'jeeves_2')
        : `user_${user.id}`;
      
      // Generate battle code for multiplayer
      const newBattleCode = mode === 'user_vs_user' ? generateBattleCode() : null;
      
      // Create battle
      const { data: battle, error: battleError } = await supabase
        .from('pt_card_battles')
        .insert({
          game_mode: mode,
          status: mode === 'user_vs_user' ? 'waiting' : 'waiting',
          story_text: finalStoryText,
          story_reference: finalReference || null,
          current_turn_player: initialCurrentTurnPlayer,
          host_user_id: user.id,
          battle_code: newBattleCode,
        })
        .select()
        .single();

      if (battleError) throw battleError;

      // Create players based on mode
      const players: any[] = [];
      
      if (mode === 'user_vs_jeeves') {
        players.push({
          battle_id: battle.id,
          player_id: `user_${user.id}`,
          player_type: 'human',
          user_id: user.id,
          display_name: 'You',
          cards_in_hand: shuffled.slice(0, 7),
        });
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_1',
          player_type: 'ai',
          user_id: null,
          display_name: 'Jeeves',
          cards_in_hand: shuffled.slice(7, 14),
        });
      } else if (mode === 'jeeves_vs_jeeves') {
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_1',
          player_type: 'ai',
          user_id: null,
          display_name: 'Dr. Jeeves',
          cards_in_hand: shuffled.slice(0, 7),
        });
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_2',
          player_type: 'ai',
          user_id: null,
          display_name: 'Professor Jeeves',
          cards_in_hand: shuffled.slice(7, 14),
        });
      }

      const { error: playersError } = await supabase
        .from('pt_battle_players')
        .insert(players);

      if (playersError) throw playersError;

      // For user_vs_user mode, wait for opponent
      if (mode === 'user_vs_user') {
        setBattleCode(newBattleCode!);
        setWaitingForOpponent(true);
        
        // Subscribe to battle updates
        const channel = supabase
          .channel(`battle_${battle.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'pt_card_battles',
            filter: `id=eq.${battle.id}`
          }, (payload) => {
            if (payload.new.status === 'active') {
              toast({
                title: "Opponent Joined!",
                description: "The battle begins!",
              });
              channel.unsubscribe();
              onBattleStart(payload.new);
            }
          })
          .subscribe();
        
        toast({
          title: "Battle Created!",
          description: "Share the code with your opponent!",
        });
      } else {
        // Start battle immediately for vs Jeeves and Jeeves vs Jeeves
        const { error: updateError } = await supabase
          .from('pt_card_battles')
          .update({ status: 'active' })
          .eq('id', battle.id);

        if (updateError) throw updateError;

        toast({
          title: "Battle Created!",
          description: "Let the duel begin!",
        });

        onBattleStart({ ...battle, shouldAutoStart: mode === 'jeeves_vs_jeeves', firstPlayer: whoGoesFirst });
      }

    } catch (error: any) {
      console.error('Error creating battle:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinBattle = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a battle code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find battle by code
      const { data: battle, error: battleError } = await supabase
        .from('pt_card_battles')
        .select('*')
        .eq('battle_code', joinCode.toUpperCase())
        .eq('status', 'waiting')
        .single();

      if (battleError || !battle) {
        throw new Error('Invalid or expired battle code');
      }

      // Check if already full
      const { data: existingPlayers } = await supabase
        .from('pt_battle_players')
        .select('*')
        .eq('battle_id', battle.id);

      if (existingPlayers && existingPlayers.length >= 2) {
        throw new Error('Battle is already full');
      }

      // Get remaining cards
      const usedCards = existingPlayers?.flatMap(p => p.cards_in_hand) || [];
      const availableCards = ALL_PRINCIPLE_CARDS.filter(c => !usedCards.includes(c));
      const shuffled = shuffleArray(availableCards);

      // Add player
      const { error: playerError } = await supabase
        .from('pt_battle_players')
        .insert({
          battle_id: battle.id,
          player_id: `user_${user.id}`,
          player_type: 'human',
          user_id: user.id,
          display_name: 'Opponent',
          cards_in_hand: shuffled.slice(0, 7),
        });

      if (playerError) throw playerError;

      // Activate battle
      const { error: updateError } = await supabase
        .from('pt_card_battles')
        .update({ status: 'active' })
        .eq('id', battle.id);

      if (updateError) throw updateError;

      toast({
        title: "Joined Battle!",
        description: "Let the duel begin!",
      });

      onBattleStart(battle);

    } catch (error: any) {
      console.error('Error joining battle:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Show waiting screen when waiting for opponent
  if (waitingForOpponent && battleCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="pt-6 text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Sparkles className="h-16 w-16 text-amber-400" />
            </motion.div>
            
            <h2 className="text-3xl font-bold">Waiting for Opponent...</h2>
            
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 rounded-lg border-2 border-amber-400/30">
              <p className="text-sm text-purple-200 mb-3">Share this code with your friend:</p>
              <div className="text-5xl font-bold text-amber-400 tracking-widest mb-3">{battleCode}</div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(battleCode);
                  toast({ title: "Copied!", description: "Battle code copied to clipboard" });
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Copy Code
              </Button>
            </div>

            <p className="text-purple-200">They can join by entering this code in the VS Player lobby</p>
            
            <Button
              onClick={onBack}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Scroll className="h-6 w-6 text-amber-400" />
              Setup Your Battle
            </CardTitle>
            <div className="w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Join Battle Option for user_vs_user */}
          {mode === 'user_vs_user' && (
            <div className="space-y-4 mb-6 p-4 bg-purple-500/20 rounded-lg border-2 border-purple-400/30">
              <h3 className="font-bold text-white text-lg">Join an Existing Battle</h3>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter battle code..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 uppercase"
                  maxLength={6}
                />
                <Button
                  onClick={handleJoinBattle}
                  disabled={isJoining || !joinCode.trim()}
                  className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
                >
                  {isJoining ? 'Joining...' : 'Join Battle'}
                </Button>
              </div>
              <p className="text-xs text-purple-200">Have a code? Enter it above to join your friend's battle!</p>
            </div>
          )}

          <div className="border-t border-white/20 pt-6" />

          <div className="space-y-2">
            <Label className="text-white">Bible Story or Text</Label>
            <Textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Enter a Bible reference (e.g., Rev. 13:11) or paste a full story/passage..."
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-purple-200">
              💡 Tip: Enter just a verse reference (like "John 3:16") and the full text will be automatically loaded!
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Reference (Optional)</Label>
            <Input
              value={storyReference}
              onChange={(e) => setStoryReference(e.target.value)}
              placeholder="e.g., Genesis 22:1-19 (auto-filled if you enter a reference above)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {mode === 'jeeves_vs_jeeves' && (
            <div className="space-y-2">
              <Label className="text-white">Who Goes First?</Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWhoGoesFirst('dr_jeeves')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    whoGoesFirst === 'dr_jeeves'
                      ? 'bg-amber-500/30 border-amber-400 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-white font-bold text-lg">Dr. Jeeves</div>
                  <div className="text-white/70 text-sm">First to play</div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWhoGoesFirst('professor_jeeves')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    whoGoesFirst === 'professor_jeeves'
                      ? 'bg-purple-500/30 border-purple-400 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-white font-bold text-lg">Professor Jeeves</div>
                  <div className="text-white/70 text-sm">First to play</div>
                </motion.button>
              </div>
            </div>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleCreateBattle}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-6 text-lg shadow-lg shadow-amber-500/50"
            >
              {isCreating ? (
                <>Creating Battle...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Battle
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}